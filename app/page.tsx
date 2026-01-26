export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Cart2Save</h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        India's First Trust-Based Price Discovery Platform.
        <br />
        Compare prices across platforms & local merchants instantly.
      </p>

      <a
        href="/search"
        className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
      >
        Start Searching
      </a>

      <div className="mt-10 text-sm opacity-80">
        Powered by Pranix AI Labs Pvt Ltd
      </div>
    </main>
  );
}
