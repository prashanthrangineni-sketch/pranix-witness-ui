import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { txId: string } }
) {
  const { txId } = params;

  // TEMP: deterministic mock response
  return NextResponse.json({
    tx_id: txId,
    status: "VERIFIED",
    decision: "CLEARED",
    reason_codes: ["CODE_002"],
    audit_stamp: "PX-2026-V2-AUDIT",
    witness: "Pranix Sovereign Witness",
    timestamp: new Date().toISOString()
  });
}
