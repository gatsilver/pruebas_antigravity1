import type { Metadata } from 'next'
import ContactoClient from './ContactoClient'

export const metadata: Metadata = {
  title: 'Contacto — Agenda tu Diagnóstico Gratuito',
  description:
    'Contáctanos para agendar tu diagnóstico gratuito de transformación digital. WhatsApp, email o formulario. Respuesta en menos de 24 horas. Lima, Perú.',
  openGraph: {
    title: 'Contacto | TransformAcción 720 — Pit Wall',
    description: 'Agenda tu diagnóstico gratuito. Hablemos de cómo acelerar tu transformación.',
  },
  alternates: { canonical: 'https://transformaccion720.com/contacto' },
}

export default function ContactoPage() {
  return <ContactoClient />
}
