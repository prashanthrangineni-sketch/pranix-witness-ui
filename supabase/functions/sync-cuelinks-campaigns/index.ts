import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CATEGORY_MAP: Record<number, string> = {
  7: 'grocery',
  4: 'electronics',
  8: 'pharmacy',
  1: 'fashion',
  9: 'home',
};

interface CuelinksCampaign {
  id: number;
  name: string;
  status: string;
  category_id: number;
  website?: string;
  url?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const cuelinksApiKey = Deno.env.get('CUELINKS_API_KEY')!;

  if (!cuelinksApiKey) {
    return new Response(JSON.stringify({ error: 'CUELINKS_API_KEY not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // ── Step 1: Fetch all campaigns from Cuelinks (paginated) ──────────────────
  const allCampaigns: CuelinksCampaign[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `https://api.cuelinks.com/v1/campaigns?per_page=${perPage}&page=${page}`;
    const res = await fetch(url, {
      headers: { token: cuelinksApiKey },
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(
        JSON.stringify({ error: `Cuelinks API error on page ${page}`, detail: errText }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();

    // Handle both array response and {data: [...]} envelope
    const campaigns: CuelinksCampaign[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : [];

    if (campaigns.length === 0) break;
    allCampaigns.push(...campaigns);
    if (campaigns.length < perPage) break;
    page++;
  }

  // ── Step 2: Map campaigns → affiliate_partners rows ──────────────────────
  const now = new Date().toISOString();
  const upsertRows = allCampaigns.map((c) => {
    const campaignWebsite = c.website || c.url || '';
    const sector = CATEGORY_MAP[c.category_id] ?? 'general';
    const isActive = c.status?.toLowerCase() === 'active';
    const affiliateBaseUrl = campaignWebsite
      ? `https://linksredirect.com/?pub_id=263419&source=linkkit&url=${encodeURIComponent(campaignWebsite)}`
      : '';

    return {
      slug: `cuelinks-${c.id}`,
      display_name: c.name,
      sector,
      affiliate_base_url: affiliateBaseUrl,
      affiliate_wrap_type: 'cuelinks',
      affiliate_network: 'cuelinks',
      is_active: isActive,
      search_param_key: 'q',
      updated_at: now,
    };
  });

  // ── Step 3: UPSERT all fetched campaigns ──────────────────────────────────
  let added = 0;
  let updated = 0;

  if (upsertRows.length > 0) {
    const slugs = upsertRows.map((r) => r.slug);
    const { data: existing } = await supabase
      .from('affiliate_partners')
      .select('slug')
      .in('slug', slugs);

    const existingSlugs = new Set((existing ?? []).map((e: { slug: string }) => e.slug));
    added = slugs.filter((s) => !existingSlugs.has(s)).length;
    updated = slugs.filter((s) => existingSlugs.has(s)).length;

    const { error: upsertError } = await supabase
      .from('affiliate_partners')
      .upsert(upsertRows, { onConflict: 'slug' });

    if (upsertError) {
      return new Response(
        JSON.stringify({ error: 'Upsert failed', detail: upsertError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // ── Step 4: Deactivate Cuelinks partners NOT in this API response ─────────
  const activeSlugs = allCampaigns.map((c) => `cuelinks-${c.id}`);
  let deactivated = 0;

  if (activeSlugs.length > 0) {
    const { data: activeInDb } = await supabase
      .from('affiliate_partners')
      .select('slug')
      .eq('affiliate_network', 'cuelinks')
      .eq('is_active', true);

    const toDeactivate = (activeInDb ?? [])
      .map((r: { slug: string }) => r.slug)
      .filter((s: string) => !activeSlugs.includes(s));

    if (toDeactivate.length > 0) {
      const { error: deactivateError } = await supabase
        .from('affiliate_partners')
        .update({ is_active: false, updated_at: now })
        .in('slug', toDeactivate)
        .eq('affiliate_network', 'cuelinks');

      if (!deactivateError) deactivated = toDeactivate.length;
    }
  }

  // ── Step 5: Return summary ────────────────────────────────────────────────
  const summary = {
    success: true,
    synced_at: now,
    total_from_api: allCampaigns.length,
    pages_fetched: page,
    added,
    updated,
    deactivated,
  };

  return new Response(JSON.stringify(summary), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
