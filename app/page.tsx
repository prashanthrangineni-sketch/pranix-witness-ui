'use client'

import { useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')

  const handleSearch = async () => {
    if (!query) return

    await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    setQuery('')
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Arial' }}>
      <h1>Cart2Save</h1>
      <p>India's First Trust-Based Price Discovery Platform</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search product..."
        style={{ padding: 10, width: 250 }}
      />

      <button onClick={handleSearch} style={{ marginLeft: 10, padding: 10 }}>
        Go
      </button>
    </main>
  )
}
