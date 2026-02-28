import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.formData();

  return NextResponse.json({
    status: "product_received",
    data: Object.fromEntries(body)
  });
}
