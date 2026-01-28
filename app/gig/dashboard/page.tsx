'use client'

export default function GigDashboard() {
  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Gig Worker Control Center</h1>

      <div style={styles.grid}>
        <Card title="🟢 Go Online" desc="Toggle availability" />
        <Card title="📦 Assigned Deliveries" desc="View delivery tasks" />
        <Card title="🗺 Navigation" desc="Route & map assistance" />
        <Card title="📊 Earnings" desc="Daily & weekly income" />
        <Card title="⭐ Trust Score" desc="Performance rating" />
        <Card title="🛡 Compliance" desc="Safety & policies" />
      </div>
    </div>
  )
}

function Card({ title, desc }: any) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

const styles: any = {
  page: { minHeight: '100vh', background: '#ecfeff', padding: 20 },
  heading: { fontSize: 26, marginBottom: 16 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16
  },
  card: {
    background: '#fff',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
    cursor: 'pointer'
  }
}
