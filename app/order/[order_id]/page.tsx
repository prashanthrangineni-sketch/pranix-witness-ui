'use client'

import { useParams } from 'next/navigation'

export default function OrderSuccess() {
  const { order_id } = useParams()

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600">
          Order Confirmed 🎉
        </h2>
        <p className="mt-3 font-mono">{order_id}</p>
      </div>
    </div>
  )
}
