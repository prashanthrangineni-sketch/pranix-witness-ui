import { notFound } from 'next/navigation'

const LEGAL_MAP: Record<
  string,
  { title: string; file: string }
> = {
  terms: {
    title: 'Terms of Service',
    file: '/legal/Terms_of_Service.pdf',
  },
  privacy: {
    title: 'Privacy Policy',
    file: '/legal/Privacy_Policy.pdf',
  },
  affiliate: {
    title: 'Affiliate Disclosure',
    file: '/legal/Affiliate_Disclosure.pdf',
  },
  neutrality: {
    title: 'Neutrality Disclosure',
    file: '/legal/Neutrality_Disclosure.pdf',
  },
}

export default function LegalPage({
  params,
}: {
  params: { slug: string }
}) {
  const doc = LEGAL_MAP[params.slug]

  if (!doc) return notFound()

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
        {doc.title}
      </h1>

      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
        This document is provided for transparency and compliance.
      </p>

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        <iframe
          src={doc.file}
          title={doc.title}
          style={{
            width: '100%',
            height: '75vh',
            border: 'none',
          }}
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <a
          href={doc.file}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: '#111827',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Download PDF
        </a>
      </div>
    </main>
  )
}
