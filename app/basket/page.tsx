'use client'

import { useEffect, useState } from 'react'

type BasketItem = {
  product_id: string
  quantity: number
  price_at_add: number
}

type MerchantGroup = {
  merchant_id: string
  items: BasketItem[]
  subtotal: number
}

export default function BasketPage() {
  const [merchants, setMerchants] = useState<MerchantGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBasket() {
      const sessionId = localStorage.getItem('cart2save_session')

      if (!sessionId) {
        setLoading(false)
        return
      }

      const res = await fetch('/api/basket/view', {
        headers: {
          'X-Session-ID': sessionId
        }
      })

      const data = await res.json()
      setMerchants(data.merchants || [])
      setLoading(false)
    }

    loadBasket()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your basket…
      </div>
    )
  }

  if (merchants.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-semibold mb-2">Your basket is empty</h1>
        <p className="text-gray-500">
          Add items from search to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-4 z-10">
        <h1 className="text-xl font-semibold">My Cart</h1>
      </div>

      {/* Basket Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {merchants.map((merchant) => (
          <div
            key={merchant.merchant_id}
            className="bg-white rounded-xl shadow-sm border"
          >
            {/* Merchant Header */}
            <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
              <p className="text-sm font-medium text-gray-700">
                Merchant
              </p>
              <p className="text-xs text-gray-400 break-all">
                {merchant.merchant_id}
              </p>
            </div>

            {/* Items */}
            <div className="divide-y">
              {merchant.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-4"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Product ID
                    </p>
                    <p className="text-xs text-gray-400 break-all">
                      {item.product_id}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ₹{item.price_at_add}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-lg font-semibold">
                ₹{merchant.subtotal}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Total payable</p>
            <p className="text-lg font-semibold">
              ₹
              {merchants.reduce(
                (sum, m) => sum + m.subtotal,
                0
              )}
            </p>
          </div>

          <button className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium">
            Proceed
          </button>
        </div>
      </div>
    </div>
  )
}
