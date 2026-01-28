'use client'

import { useParams } from 'next/navigation'

export default function OrderSuccess() {
  const { order_id } = useParams()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h2 className="text-3xl font-bold text-green-600">
          Order Confirmed 🎉
        </h2>

        <p className="mt-3 text-gray-600">
          Your demo order has been successfully placed.
        </p>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl border font-mono text-sm">
          {order_id}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href="/"
            className="bg-indigo-600 text-white py-2 rounded-xl"
          >
            New Search
          </a>

          <a
            href="/merchant/dashboard"
            className="border border-indigo-600 text-indigo-600 py-2 rounded-xl"
          >
            View Merchant Panel
          </a>

          <a
            href="/gig/dashboard"
            className="border border-green-600 text-green-600 py-2 rounded-xl"
          >
            View Gig Panel
          </a>
        </div>
      </div>
    </div>
  )
}
