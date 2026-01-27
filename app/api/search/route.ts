import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      query,
      sector = "general",
      user_id = "00000000-0000-0000-0000-000000000000"
    } = body;

    const snapshot_id = "snap_" + crypto.randomUUID();

    const { error: snapErr } = await supabase
      .from("snapshots")
      .insert({
        snapshot_id,
        user_id,
        sector,
        status: "ACTIVE",
        expires_at: new Date(Date.now() + 10 * 60 * 1000)
      });

    if (snapErr) throw snapErr;

    return NextResponse.json({
      ok: true,
      snapshot_id,
      message: "Snapshot created, trust engine triggered",
    });

  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
