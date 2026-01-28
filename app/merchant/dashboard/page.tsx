'use client'

export default function MerchantDashboard() {
  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Merchant Control Center</h1>

      <div style={styles.grid}>
        <Card title="📦 Products" desc="Upload and manage products" />
        <Card title="💰 Inventory & Pricing" desc="Live price & stock control" />
        <Card title="🛒 Orders" desc="View and process orders" />
        <Card title="🚚 Deliveries" desc="Track deliveries & gig workers" />
        <Card title="📊 Analytics" desc="Sales & performance insights" />
        <Card title="🛡 Trust & Compliance" desc="Trust score & regulatory view" />
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
  page: { minHeight: '100vh', background: '#f1f5f9', padding: 20 },
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
