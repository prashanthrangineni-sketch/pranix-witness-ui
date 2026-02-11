import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    products: [
      {
        id: 'c391076b-ba29-465b-9d77-0ba04bd90653',
        name: 'Aashirvaad Atta 5kg',
        price: 450,
        sector: 'grocery',
        merchant_id: '660e8400-e29b-41d4-a716-446655440001'
      },
      {
        id: 'e1122334-aa11-bb22-cc33-445566778899',
        name: 'Samsung 55” Smart TV',
        price: 42000,
        sector: 'electronics',
        merchant_id: '770e8400-e29b-41d4-a716-446655440002'
      }
    ]
  })
}
