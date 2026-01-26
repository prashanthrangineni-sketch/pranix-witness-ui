const handleSearch = async () => {
  if (!query) return;

  await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })

  setQuery('')
}
