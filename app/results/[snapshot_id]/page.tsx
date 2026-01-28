'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ResultsPage() {
  const { snapshot_id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div style={styles.center}>🔄 Loading verified offers...</div>
  }

  if (!data || !data.results || data.results.length === 0) {
    return <div style={styles.center}>❌ No offers found.</div>
  }

  const bestPrice = Math.min(...data.results.map((r: any) => r.price || 999999))

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Search Results</h1>
      <p style={styles.sub}>Snapshot ID: {snapshot_id}</p>

      <div style={styles.list}>
        {data.results.map((item: any, i: number) => {
          const isBest = item.price === bestPrice

          return (
            <div
              key={i}
              style={{
                ...styles.card,
                ...(isBest ? styles.bestCard : {})
              }}
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
                  <span>🚚 {item.delivery || '—'}</span>
                  <span style={styles.trust}>🛡 {item.trust || 90}% Trust</span>
                </div>

                <div style={styles.badges}>
                  <span style={styles.verified}>Verified</span>
                  {isBest && <span style={styles.best}>Best Deal</span>}
                </div>

                <a
                  href={item.buy_url || '#'}
                  target="_blank"
                  style={styles.buy}
                  rel="noreferrer"
                >
                  Buy Now
                </a>
              </div>
            </div>
          )
        })}
      </div>

      <div style={styles.trustBox}>
        <strong>Trust Score:</strong> Calculated using price history, discount authenticity,
        merchant reliability, and platform risk — ensuring transparent and
        manipulation-resistant shopping.
      </div>
    </div>
  )
}

const styles: any = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
    padding: 16,
    fontFamily: 'system-ui, sans-serif'
  },
  center: {
    padding: 40,
    textAlign: 'center',
    fontSize: 18
  },
  heading: {
    fontSize: 28,
    marginBottom: 4
  },
  sub: {
    color: '#666',
    marginBottom: 20
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  card: {
    display: 'flex',
    gap: 14,
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 14,
    background: '#ffffff',
    boxShadow: '0 6px 18px rgba(0,0,0,0.04)'
  },
  bestCard: {
    border: '2px solid #22c55e',
    background: '#f0fdf4',
    boxShadow: '0 6px 22px rgba(34,197,94,0.15)'
  },
  imageBox: {
    width: 90,
    height: 90,
    borderRadius: 12,
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: '#6b7280',
    fontWeight: 600
  },
  info: {
    flex: 1
  },
  title: {
    fontSize: 17,
    fontWeight: 700
  },
  merchant: {
    fontSize: 13,
    color: '#6b7280'
  },
  priceRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginTop: 8
  },
  price: {
    fontSize: 22,
    fontWeight: 800
  },
  mrp: {
    textDecoration: 'line-through',
    color: '#9ca3af'
  },
  discount: {
    color: '#dc2626',
    fontWeight: 700
  },
  meta: {
    display: 'flex',
    gap: 14,
    marginTop: 6,
    fontSize: 13
  },
  trust: {
    color: '#2563eb',
    fontWeight: 600
  },
  badges: {
    display: 'flex',
    gap: 8,
    marginTop: 8
  },
  verified: {
    fontSize: 11,
    background: '#e0f2fe',
    padding: '3px 8px',
    borderRadius: 999,
    color: '#0369a1',
    fontWeight: 600
  },
  best: {
    fontSize: 11,
    background: '#dcfce7',
    padding: '3px 8px',
    borderRadius: 999,
    color: '#166534',
    fontWeight: 700
  },
  buy: {
    display: 'inline-block',
    marginTop: 10,
    background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: 999,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600
  },
  trustBox: {
    marginTop: 30,
    padding: 16,
    borderRadius: 16,
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    fontSize: 14,
    lineHeight: 1.6
  }
    }
