'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MerchantSignup() {
  const router = useRouter()
  const [form, setForm] = useState({
    business: '',
    owner: '',
    phone: '',
    email: '',
    city: 'Hyderabad'
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (!form.business || !form.owner || !form.phone) {
      alert('Fill all mandatory fields')
      return
    }

    router.push('/merchant/kyc')
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Merchant Onboarding</h1>

      <div style={styles.card}>
        <input name="business" placeholder="Business Name *" onChange={handleChange} style={styles.input} />
        <input name="owner" placeholder="Owner Name *" onChange={handleChange} style={styles.input} />
        <input name="phone" placeholder="Mobile Number *" onChange={handleChange} style={styles.input} />
        <input name="email" placeholder="Email" onChange={handleChange} style={styles.input} />
        <input name="city" value="Hyderabad" disabled style={styles.input} />

        <button onClick={handleSubmit} style={styles.button}>
          Continue to KYC →
        </button>
      </div>
    </div>
  )
}

const styles: any = {
  page: { minHeight: '100vh', background: '#f8fafc', padding: 20 },
  heading: { fontSize: 26, marginBottom: 16 },
  card: {
    maxWidth: 420,
    margin: '0 auto',
    background: '#fff',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    border: '1px solid #ddd'
  },
  button: {
    width: '100%',
    background: '#4f46e5',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    border: 'none',
    fontSize: 16
  }
}
