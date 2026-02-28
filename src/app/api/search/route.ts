import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  // Dummy neutral results (replace later with DB logic)
  const mockResults = [
    {
      title: `${query} - Amazon`,
      price: 1999,
      link: `/api/out?url=https://amazon.in/s?k=${encodeURIComponent(query)}`
    },
    {
      title: `${query} - Flipkart`,
      price: 1899,
      link: `/api/out?url=https://flipkart.com/search?q=${encodeURIComponent(query)}`
    }
  ];

  return NextResponse.json(mockResults);
}
