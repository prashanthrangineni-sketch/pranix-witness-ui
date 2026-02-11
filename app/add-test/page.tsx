'use client'

export default function AddTestPage() {
  async function addItem() {
    const sessionId = localStorage.getItem('cart2save_session')

    if (!sessionId) {
      alert('Session missing')
      return
    }

    const res = await fetch('/api/basket/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId
      },
      body: JSON.stringify({
        product_uuid: 'c391076b-ba29-465b-9d77-0ba04bd90653',
        quantity: 1
      })
    })

    const data = await res.json()
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Add to Basket (Test)</h1>
      <button
        onClick={addItem}
        style={{
          padding: '12px 20px',
          fontSize: 16,
          cursor: 'pointer'
        }}
      >
        Add Item
      </button>
    </div>
  )
}
