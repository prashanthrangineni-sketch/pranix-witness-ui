export default function MerchantProductsPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Upload Products</h1>
      <form method="POST" action="/api/merchant/products">
        <input
          name="title"
          placeholder="Product Title"
          required
          style={{ display: "block", marginBottom: "10px", padding: "10px" }}
        />
        <input
          name="price"
          placeholder="Price"
          required
          style={{ display: "block", marginBottom: "10px", padding: "10px" }}
        />
        <button type="submit">Upload</button>
      </form>
    </main>
  );
}
