interface Props {
  params: { slug: string }
}

const LEGAL_MAP: Record<string, { title: string; file: string }> = {
  terms: {
    title: 'Terms of Service',
    file: '/legal/Terms_of_Service.pdf',
  },
  privacy: {
    title: 'Privacy Policy',
    file: '/legal/Privacy_Policy.pdf',
  },
  neutrality: {
    title: 'Neutrality Disclosure',
    file: '/legal/Neutrality_Disclosure.pdf',
  },
  affiliate: {
    title: 'Affiliate Disclosure',
    file: '/legal/Affiliate_Disclosure.pdf',
  },
}

export default function LegalPage({ params }: Props) {
  const doc = LEGAL_MAP[params.slug]

  if (!doc) {
    return <div style={{ padding: 32 }}>Document not found.</div>
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
        {doc.title}
      </h1>

      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        This document is provided for transparency and compliance.
      </p>

      <iframe
        src={doc.file}
        style={{
          width: '100%',
          height: '70vh',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
        }}
      />
    </main>
  )
}
