export default function GigEnrollPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Gig Partner Enrollment</h1>
      <form method="POST" action="/api/gig/enroll">
        <input
          name="name"
          placeholder="Full Name"
          required
          style={{ display: "block", marginBottom: "10px", padding: "10px" }}
        />
        <input
          name="phone"
          placeholder="Phone"
          required
          style={{ display: "block", marginBottom: "10px", padding: "10px" }}
        />
        <button type="submit">Apply</button>
      </form>
    </main>
  );
}
