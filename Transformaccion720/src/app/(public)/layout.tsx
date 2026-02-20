import type { Metadata } from 'next'
import { Navbar } from '@/components/ta720/Navbar'
import { Footer } from '@/components/ta720/Footer'

const BASE_URL = 'https://transformaccion720.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'TransformAcción 720 | Consultora de Transformación Digital en Lima, Perú',
    template: '%s | TransformAcción 720',
  },
  description:
    'Aceleramos la transformación digital de organizaciones en LATAM. Estrategia, tecnología y personas para resultados reales. Consultoría B2B en Lima, Perú.',
  keywords: [
    'transformación digital',
    'consultoría empresarial',
    'cambio organizacional',
    'automatización de procesos',
    'Lima Perú',
    'LATAM',
    'business agility',
    'consultoría tecnológica',
  ],
  authors: [{ name: 'TransformAcción 720', url: BASE_URL }],
  creator: 'TransformAcción 720',
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: BASE_URL,
    siteName: 'TransformAcción 720',
    title: 'TransformAcción 720 | El Paddock de la Innovación',
    description:
      'Aceleramos la transformación digital de organizaciones en LATAM. Estrategia, tecnología y personas.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TransformAcción 720 — El Paddock de la Innovación',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TransformAcción 720 | El Paddock de la Innovación',
    description: 'Aceleramos la transformación digital de organizaciones en LATAM.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

// Schema.org Organization + LocalBusiness
const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'TransformAcción 720',
      url: BASE_URL,
      description:
        'Consultora de transformación digital en LATAM especializada en estrategia, procesos y tecnología.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lima',
        addressCountry: 'PE',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+51-978-800-884',
        contactType: 'customer service',
        availableLanguage: ['Spanish'],
      },
      sameAs: ['https://linkedin.com', 'https://instagram.com'],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'TransformAcción 720',
      publisher: { '@id': `${BASE_URL}/#organization` },
    },
  ],
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
