export default function MerchantEnrollPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Merchant Enrollment</h1>
      <form method="POST" action="/api/merchant/enroll">
        <input
          name="name"
          placeholder="Business Name"
          required
          style={{ display: "block", marginBottom: "10px", padding: "10px" }}
        />
        <input
          name="email"
          placeholder="Email"
          required
          style={{ display: "block", marginBottom: "10px", padding: "10px" }}
        />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
