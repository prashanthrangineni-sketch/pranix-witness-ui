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
    return <div style={styles.loader}>Fetching best prices…</div>
  }

  if (!data || !data.results || data.results.length === 0) {
    return <div style={styles.center}>No offers found.</div>
  }

  const bestPrice = Math.min(...data.results.map((r: any) => r.price || 999999))

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Search Results</h1>
      <p style={styles.sub}>Snapshot ID: {snapshot_id}</p>

      <div style={styles.grid}>
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
                  <span style={styles.trustBadge}>🛡 {item.trust || 90}% Trust</span>
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
        <strong>Trust Engine:</strong> Scores derived from price history, discount
        authenticity, merchant reliability & platform risk — ensuring manipulation-resistant shopping.
      </div>
    </div>
  )
}

const styles: any = {
  page: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: 16,
    fontFamily: 'system-ui, sans-serif',
    background: '#fafafa'
  },
  loader: {
    padding: 60,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 600
  },
  center: {
    padding: 50,
    textAlign: 'center',
    fontSize: 18
  },
  heading: {
    fontSize: 28,
    fontWeight: 700
  },
  sub: {
    color: '#666',
    marginBottom: 24
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
    gap: 16
  },
  card: {
    display: 'flex',
    gap: 14,
    borderRadius: 14,
    padding: 14,
    background: '#fff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
    transition: '0.2s ease'
  },
  bestCard: {
    border: '2px solid #22c55e',
    background: '#f0fdf4'
  },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b'
  },
  info: {
    flex: 1
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 4
  },
  merchant: {
    fontSize: 13,
    color: '#64748b'
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
    color: '#94a3b8'
  },
  discount: {
    color: '#dc2626',
    fontWeight: 700,
    fontSize: 13
  },
  meta: {
    display: 'flex',
    gap: 12,
    marginTop: 6,
    fontSize: 13
  },
  trustBadge: {
    background: '#ecfeff',
    padding: '2px 6px',
    borderRadius: 6,
    color: '#0369a1',
    fontWeight: 600
  },
  badges: {
    display: 'flex',
    gap: 8,
    marginTop: 8
  },
  verified: {
    background: '#dbeafe',
    padding: '3px 8px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    color: '#1e40af'
  },
  best: {
    background: '#dcfce7',
    padding: '3px 8px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    color: '#166534'
  },
  buy: {
    display: 'inline-block',
    marginTop: 10,
    background: '#4f46e5',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: 10,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600
  },
  trustBox: {
    marginTop: 30,
    padding: 18,
    borderRadius: 14,
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    fontSize: 14
  }
  }
