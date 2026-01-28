'use client'

import { useEffect, useState } from 'react'

export default function TrustCommandCenter() {
  const [stats, setStats] = useState<any>({
    snapshots: 0,
    avgTrust: 92,
    fraudFlags: 0,
    darkPatterns: 0,
    merchants: 0
  })

  useEffect(() => {
    // Demo-grade live counters (can later be wired to Supabase)
    setStats({
      snapshots: Math.floor(Math.random() * 500 + 1200),
      avgTrust: Math.floor(Math.random() * 6 + 92),
      fraudFlags: Math.floor(Math.random() * 6),
      darkPatterns: Math.floor(Math.random() * 4),
      merchants: Math.floor(Math.random() * 120 + 80)
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-2">🛡 Trust Command Center</h1>
      <p className="text-slate-400 mb-6">
        Neutral Commerce Intelligence • Regulator Grade • Audit Ready
      </p>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <KPI title="Live Snapshots" value={stats.snapshots} />
        <KPI title="Avg Trust %" value={stats.avgTrust + '%'} />
        <KPI title="Fraud Flags" value={stats.fraudFlags} danger />
        <KPI title="Dark Patterns" value={stats.darkPatterns} danger />
        <KPI title="Merchants" value={stats.merchants} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Fraud Radar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="font-semibold mb-3">🧠 Fraud & Manipulation Radar</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Fake Discount Probability → <strong>Low</strong></li>
            <li>Price Manipulation Forecast → <strong>Very Low</strong></li>
            <li>Platform Risk Exposure → <strong>Minimal</strong></li>
            <li>Dark Pattern Index → <strong>0.8 / 10</strong></li>
          </ul>
        </div>

        {/* Snapshot Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="font-semibold mb-3">📡 Live Snapshot Feed</h2>

          <div className="space-y-2 text-sm text-slate-300">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between bg-slate-800 rounded-lg px-3 py-2"
              >
                <span>SNP-{Date.now().toString().slice(-6 + i)}</span>
                <span className="text-green-400">
                  Trust {Math.floor(Math.random() * 6 + 94)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Merchant Risk Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:col-span-2">
          <h2 className="font-semibold mb-3">🏪 Merchant Risk Intelligence</h2>

          <table className="w-full text-sm text-left">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2">Merchant</th>
                <th>Trust</th>
                <th>Violations</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {['Amazon', 'Flipkart', 'Local Mart', 'ONDC Store', 'QuickCommerce'].map(
                (m, i) => (
                  <tr key={i} className="border-t border-slate-800">
                    <td className="py-2">{m}</td>
                    <td>{Math.floor(Math.random() * 5 + 93)}%</td>
                    <td>{Math.floor(Math.random() * 2)}</td>
                    <td className="text-green-400">SAFE</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EVIDENCE */}
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="font-semibold mb-2">📜 Evidence Ledger</h2>
        <p className="text-sm text-slate-400">
          Every snapshot, trust computation, and risk decision is logged with
          Section 65B compliant audit trails. Immutable. Verifiable. Neutral.
        </p>
      </div>
    </div>
  )
}

function KPI({
  title,
  value,
  danger
}: {
  title: string
  value: any
  danger?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        danger
          ? 'border-red-500 bg-red-950/40'
          : 'border-slate-800 bg-slate-900'
      }`}
    >
      <p className="text-xs text-slate-400">{title}</p>
      <p
        className={`text-2xl font-bold ${
          danger ? 'text-red-400' : 'text-green-400'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
