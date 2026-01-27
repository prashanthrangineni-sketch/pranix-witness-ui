'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SnapshotResultsPage() {
  const params = useParams()
  const snapshot_id = params.snapshot_id as string

  const [loading, setLoading] = useState(true)
  const [snapshot, setSnapshot] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSnapshot() {
      try {
        const { data, error } = await supabase
          .from('snapshots')
          .select('*')
          .eq('snapshot_id', snapshot_id)
          .single()

        if (error) throw error

        setSnapshot(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSnapshot()
  }, [snapshot_id])

  if (loading) return <div className="p-4">Loading...</div>

  if (error)
    return (
      <div className="p-4 text-red-600">
        Error loading snapshot: {error}
      </div>
    )

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Snapshot Results</h1>
      <p className="text-sm text-gray-600 mb-4">
        Snapshot ID: {snapshot.snapshot_id}
      </p>

      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
        {JSON.stringify(snapshot, null, 2)}
      </pre>
    </div>
  )
}
