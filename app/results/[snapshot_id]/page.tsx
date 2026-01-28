'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ResultsPage() {
  const { snapshot_id } = useParams()
  const router = useRouter()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState<string | null>(null)

  useEffect(() => {
    if (!snapshot_id) return

    fetch(`/api/results/${snapshot_id}`)
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [snapshot_id])

  const placeOrder = async (item: any) => {
    if (placing) return
    setPlacing(item.title)

    try {
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snapshot_id,
          product_title: item.title,
          merchant: item.merchant,
          price: item.price
        })
      })

      const json = await res.json()

      if (!json?.order_id) {
        alert('Order creation failed. Please retry.')
        return
      }

      router.push(`/order/${json.order_id}`)
    } catch (err) {
      alert('Order service unavailable.')
    } finally {
      setPlacing(null)
    }
  }

  if (loading) {
    return <div style={styles.center}>🔄 Loading verified offers...</div>
  }

  if (!data || !data.results || data.results.length === 0) {
    return <div style={styles.center}>❌ No offers found.</div>
  }

  const bestPrice = Math.min(...data.results.map((r: any) => r.price || 999999))

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Verified Results</h1>
      <p style={styles.sub}>Snapshot ID: {snapshot_id}</p>

      <div style={styles.list}>
        {data.results.map((item: any, i: number) => {
          const isBest = item.price === bestPrice

          return (
            <div
              key={i}
              style={{ ...styles.card, ...(isBest ? styles.bestCard : {}) }}
            >
              <div style={styles.imageBox}>IMG</div>

              <div style={styles.info}>
                <h2 style={styles.title}>{item.title}</h2>
                <p style={styles.merchant}>{item.merchant}</p>

                <div style={styles.priceRow}>
                  <span style={styles.price}>₹{item.price}</span>
                  {item.original_price && (
                    <span style={styles.mrp}>₹{item.original_price}</span>
                  )}
                  {item.discount && (
                    <span style={styles.discount}>{item.discount}% OFF</span>
                  )}
                </div>

                <div style={styles.meta}>
                  <span>🚚 {item.delivery || 'Fast delivery'}</span>
                  <span style={styles.trust}>🛡 {item.trust || 92}% Trust</span>
                </div>

                <div style={styles.badges}>
                  <span style={styles.verified}>Verified</span>
                  {isBest && <span style={styles.best}>Best Deal</span>}
                </div>

                <button
                  onClick={() => placeOrder(item)}
                  disabled={placing === item.title}
                  style={{
                    ...styles.buy,
                    opacity: placing === item.title ? 0.6 : 1
                  }}
                >
                  {placing === item.title ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div style={styles.trustBox}>
        <strong>Trust Engine:</strong> Price integrity + discount authenticity + merchant
        reliability + platform risk → regulator-grade confidence.
      </div>
    </div>
  )
}
