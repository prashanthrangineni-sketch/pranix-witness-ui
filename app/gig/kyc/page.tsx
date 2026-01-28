'use client'

import { useRouter } from 'next/navigation'

export default function GigKYC() {
  const router = useRouter()

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Gig Worker KYC</h1>

      <div style={styles.card}>
        <label>Upload Driving License / Aadhaar</label>
        <input type="file" style={styles.input} />

        <label>Upload Vehicle RC</label>
        <input type="file" style={styles.input} />

        <label>Selfie Verification</label>
        <input type="file" style={styles.input} />

        <button onClick={() => router.push('/gig/dashboard')} style={styles.button}>
          Submit KYC →
        </button>
      </div>
    </div>
  )
}

const styles: any = {
  page: { minHeight: '100vh', background: '#f8fafc', padding: 20 },
  heading: { fontSize: 26, marginBottom: 16 },
  card: {
    maxWidth: 480,
    margin: '0 auto',
    background: '#fff',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    border: '1px solid #ddd'
  },
  button: {
    width: '100%',
    background: '#16a34a',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    border: 'none',
    fontSize: 16
  }
}
