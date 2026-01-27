'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function ResultsPage() {
  const { snapshot_id } = useParams()
  const [data, setData] = useState<any>(null)
  const [trust, setTrust] = useState<any>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data: snap } = await supabase
      .from('snapshots')
      .select('*')
      .eq('id', snapshot_id)
      .single()

    const { data: trustScore } = await supabase
      .from('trust_scores')
      .select('*')
      .eq('snapshot_id', snapshot_id)
      .single()

    setData(snap)
    setTrust(trustScore)
  }

  if (!data) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Offers</h2>

      {trust && (
        <div className="bg-green-100 border border-green-300 p-4 rounded-xl mb-4">
          <p className="font-semibold">
            Trust Score: {trust.composite_trust_score}
          </p>
        </div>
      )}

      {data.results?.map((p: any) => (
        <div key={p.product_id} className="border p-4 rounded-xl mb-3">
          <h3 className="font-semibold">{p.product_name}</h3>
          <p className="text-sm text-gray-500">{p.merchant_name}</p>
          <p className="text-lg font-bold">₹{p.price}</p>

          <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-xl">
            Buy Now
          </button>
        </div>
      ))}
    </div>
  )
}
