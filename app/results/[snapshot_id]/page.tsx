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
    return <div style={styles.center}>Loading results...</div>
  }

  if (!data || !data.results || data.results.length === 0) {
    return <div style={styles.center}>No offers found.</div>
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
            <div key={i} style={{ ...styles.card, ...(isBest ? styles.bestCard : {}) }}>
              <div style={styles.imageBox}>Product Image</div>

              <div style={styles.info}>
                <h2 style={styles.title}>{item.title}</h2>
                <p style={styles.merchant}>Sold by {item.merchant}</p>

                <div style={styles.priceRow}>
                  <span style={styles.price}>₹{item.price}</span>
                  {item.original_price && (
                    <span style={styles.mrp}>₹{item.original_price}</span>
                  )}
                  {item.discount && (
                    <span style={styles.discount}>{item.discount}% off</span>
                  )}
                </div>

                <div style={styles.meta}>
                  <span>🚚 {item.delivery || '—'}</span>
                  <span>🛡 Trust {item.trust || 90}%</span>
                </div>

                <div style={styles.badges}>
                  <span style={styles.verified}>Verified Price</span>
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
    fontSize: 26,
    marginBottom: 4
  },
  sub: {
    color: '#666',
    marginBottom: 20
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  card: {
    display: 'flex',
    gap: 14,
    border: '1px solid #ddd',
    borderRadius: 12,
    padding: 12,
    background: '#fff'
  },
  bestCard: {
    border: '2px solid #16a34a',
    background: '#f0fdf4'
  },
  imageBox: {
    width: 90,
    height: 90,
    borderRadius: 8,
    background: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: '#666'
  },
  info: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 2
  },
  merchant: {
    fontSize: 13,
    color: '#666'
  },
  priceRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginTop: 6
  },
  price: {
    fontSize: 20,
    fontWeight: 700
  },
  mrp: {
    textDecoration: 'line-through',
    color: '#888'
  },
  discount: {
    color: '#dc2626',
    fontWeight: 600
  },
  meta: {
    display: 'flex',
    gap: 14,
    marginTop: 6,
    fontSize: 13
  },
  badges: {
    display: 'flex',
    gap: 8,
    marginTop: 6
  },
  verified: {
    fontSize: 11,
    background: '#e0f2fe',
    padding: '2px 6px',
    borderRadius: 6,
    color: '#0369a1'
  },
  best: {
    fontSize: 11,
    background: '#dcfce7',
    padding: '2px 6px',
    borderRadius: 6,
    color: '#166534'
  },
  buy: {
    display: 'inline-block',
    marginTop: 8,
    background: '#4f46e5',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 14
  },
  trustBox: {
    marginTop: 30,
    padding: 14,
    borderRadius: 12,
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    fontSize: 14
  }
}
