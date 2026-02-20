// Configuración del sitio corporativo TransformAcción 720
export const siteConfig = {
  firmName: 'TransformAcción 720',
  tagline: 'El Paddock de la Innovación',
  description: 'Aceleramos la transformación digital de organizaciones en LATAM. Estrategia, tecnología y personas para resultados reales.',
  contact: {
    phone: '+51963477301',
    phoneDisplay: '+51 963 477 301',
    whatsappUrl: 'https://wa.me/51963477301',
    email: 'contacto@transformaccion720.com',
    city: 'Lima',
    country: 'Perú',
    location: 'Lima, Perú',
  },
  social: {
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  },
  seo: {
    siteTitle: 'TransformAcción 720 | Consultora de Transformación Digital',
    titleTemplate: '%s | TransformAcción 720',
    defaultDescription: 'Aceleramos la transformación digital de organizaciones en LATAM.',
    locale: 'es_PE',
  },
  // Para compat con código legado
  services: [] as { title: string; slug: string; icon: string; fullDescription: string }[],
}
