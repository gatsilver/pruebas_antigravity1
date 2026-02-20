import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'TransformAcción 720 | Consultora de Transformación Digital',
    template: '%s | TransformAcción 720',
  },
  description: 'Aceleramos la transformación digital de organizaciones en LATAM. Estrategia, tecnología y personas para resultados reales.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
