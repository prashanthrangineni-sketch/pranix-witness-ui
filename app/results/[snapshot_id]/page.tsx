'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ResultsPage() {
  const { snapshot_id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    const { data } = await supabase
      .from('snapshots')
      .select('*')
      .eq('snapshot_id', snapshot_id)
      .single()

    setData(data)
  }

  const placeOrder = async (product_id: string) => {
    const { data } =
      await supabase.functions.invoke('place-order', {
        body: {
          snapshot_id,
          product_id,
          user_id: null,
          payment_method: 'COD',
          delivery_location: { lat: 12.97, lng: 77.59 }
        }
      })

    if (data?.order_id) {
      router.push(`/order/${data.order_id}`)
    }
  }

  if (!data) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Available Offers</h2>

      {data.results.map((p: any) => (
        <div key={p.product_id} className="border p-4 rounded-xl mb-3 flex justify-between">
          <div>
            <h3>{p.product_name}</h3>
            <p className="text-sm">{p.merchant_name}</p>
            <p className="font-bold">₹{p.price}</p>
          </div>
          <button
            onClick={() => placeOrder(p.product_id)}
            className="bg-indigo-600 text-white px-4 rounded-xl"
          >
            Order
          </button>
        </div>
      ))}
    </div>
  )
}
