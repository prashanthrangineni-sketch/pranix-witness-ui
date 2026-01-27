import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { query, sector } = req.body

    if (!query || !sector) {
      return res.status(400).json({ error: 'Missing query or sector' })
    }

    const snapshotId = `SNP-${Date.now()}`
    const intentId = `INT-${Date.now()}`

    const { data, error } = await supabase
      .from('snapshots')
      .insert({
        snapshot_id: snapshotId,
        intent_id: intentId,
        user_id: null,
        sector,
        total_offers: 0,
        status: 'ACTIVE',
        results: [],
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ snapshot: data })

  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
