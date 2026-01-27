'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Offer = {
  product_name: string
  merchant_name: string
  price: number
  original_price: number
  image_url?: string | null
  delivery_estimate?: string
  trust_score?: number
}

export default function ResultsPage() {
  const params = useParams()
  const snapshot_id = params?.snapshot_id as string

  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!snapshot_id) return

    // MOCK OFFERS — until affiliate + ONDC integration
    setTimeout(() => {
      setOffers([
        {
          product_name: 'Basmati Rice 5kg',
          merchant_name: 'Amazon Fresh',
          price: 749,
          original_price: 999,
          trust_score: 0.92,
          delivery_estimate: 'Tomorrow'
        },
        {
          product_name: 'Basmati Rice 5kg',
          merchant_name: 'Flipkart Grocery',
          price: 779,
          original_price: 999,
          trust_score: 0.88,
          delivery_estimate: '2 days'
        },
        {
          product_name: 'Basmati Rice 5kg',
          merchant_name: 'Local Kirana Store',
          price: 699,
          original_price: 899,
          trust_score: 0.96,
          delivery_estimate: '30 mins'
        }
      ])
      setLoading(false)
    }, 600)
  }, [snapshot_id])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow">
          <h2 className="text-xl font-bold">Search Results</h2>
          <p className="text-sm text-gray-500">
            Snapshot ID: <span className="font-mono">{snapshot_id}</span>
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-gray-600">
            Finding best prices...
          </div>
        )}

        {/* Results Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {offers.map((offer, idx) => {
            const discount = Math.round(
              ((offer.original_price - offer.price) /
                offer.original_price) *
                100
            )

            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
              >
                {/* Image Placeholder */}
                <div className="h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                  Product Image
                </div>

                {/* Product */}
                <h3 className="font-semibold text-lg">
                  {offer.product_name}
                </h3>

                <p className="text-sm text-gray-500">
                  Sold by {offer.merchant_name}
                </p>

                {/* Price */}
                <div className="mt-2">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{offer.price}
                  </span>
                  <span className="line-through ml-2 text-gray-400">
                    ₹{offer.original_price}
                  </span>
                  <span className="ml-2 text-sm text-green-700 font-semibold">
                    {discount}% off
                  </span>
                </div>

                {/* Delivery */}
                <p className="text-sm text-gray-600 mt-1">
                  Delivery: {offer.delivery_estimate}
                </p>

                {/* Trust Badge */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        offer.trust_score! >= 0.9
                          ? 'bg-green-100 text-green-700'
                          : offer.trust_score! >= 0.8
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      Trust {(offer.trust_score! * 100).toFixed(0)}%
                    </div>

                    <span className="text-xs text-gray-500">
                      Verified Price
                    </span>
                  </div>

                  <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700">
                    Buy
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust Explanation */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow text-sm text-gray-600">
          <strong>Trust Score:</strong> Calculated using price history,
          discount authenticity, merchant reliability, and platform risk.
          This ensures transparent and manipulation-resistant shopping.
        </div>
      </div>
    </div>
  )
}
