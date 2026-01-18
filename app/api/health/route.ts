import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "alive",
    service: "Cart2Save Witness",
    timestamp: new Date().toISOString()
  });
}
