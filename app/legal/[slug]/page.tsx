import { notFound } from 'next/navigation'

const LEGAL_MAP: Record<string, string> = {
  terms: 'Terms_of_Service.pdf',
  privacy: 'Privacy_Policy.pdf',
  affiliate: 'Affiliate_Disclosure.pdf',
  neutrality: 'Neutrality_Disclosure.pdf',
}

export default function LegalPage({
  params,
}: {
  params: { slug: string }
}) {
  const file = LEGAL_MAP[params.slug]

  if (!file) {
    notFound()
  }

  return (
    <main
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '24px 16px',
      }}
    >
      <h1
        style={{
          fontSize: '22px',
          fontWeight: 700,
          marginBottom: '12px',
        }}
      >
        {params.slug.replace('-', ' ').toUpperCase()}
      </h1>

      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
        This document is provided for transparency and compliance.
      </p>

      <iframe
        src={`/legal/${file}`}
        style={{
          width: '100%',
          height: '80vh',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}
      />
    </main>
  )
}
