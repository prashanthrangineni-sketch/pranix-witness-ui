'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ResultsPage() {
  const params = useParams()
  const snapshot_id = params?.snapshot_id as string

  const [data, setData] = useState<any>(null)
  const [trust, setTrust] = useState<any>(null)

  useEffect(() => {
    if (!snapshot_id) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/results/${snapshot_id}`)
        const json = await res.json()
        setData(json)
        setTrust(json?.trust_score ?? null)
      } catch (err) {
        console.error('Fetch error', err)
      }
    }

    fetchData()
  }, [snapshot_id])

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">Snapshot Results</h2>

        <p className="text-sm text-gray-500 mb-4">
          Snapshot ID: <span className="font-mono">{snapshot_id}</span>
        </p>

        {data ? (
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}
