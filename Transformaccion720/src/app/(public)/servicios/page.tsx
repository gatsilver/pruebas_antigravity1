'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Building2, Rocket, GraduationCap, ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const serviciosCategories = [
  {
    icon: Building2,
    title: 'Transformación de Negocio',
    description: 'Estrategia, cultura y procesos para organizaciones que necesitan resultados, no PowerPoints.',
    href: '/servicios/consultoria',
    badge: 'Para CEOs & Directivos',
    color: 'blue',
  },
  {
    icon: Rocket,
    title: 'Soluciones Digitales',
    description: 'La telemetría de tu negocio. Datos en tiempo real para decisiones precisas.',
    href: '/servicios/digital',
    badge: 'Para PYMEs & Startups',
    color: 'green',
  },
  {
    icon: GraduationCap,
    title: 'Academia & Entrenamiento',
    description: 'Learning by Doing. Porque los negocios no se aprenden en un PDF.',
    href: '/servicios/academia',
    badge: 'Para Líderes & Equipos',
    color: 'amber',
  },
]

export default function ServiciosPage() {
  return (
    <div className="bg-dark-800 pt-24">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute inset-0 bg-gradient-radial-blue" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={container}>
            <motion.p variants={fadeUp} className="section-label mb-3">Nuestras soluciones</motion.p>
            <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-display-lg md:text-display-xl text-white mb-5">
              Servicios <span className="text-gradient-blue">diseñados</span> para ti
            </motion.h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 pb-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {serviciosCategories.map((s) => {
              const Icon = s.icon
              const isBlue = s.color === 'blue'
              const isGreen = s.color === 'green'
              const cardClass = isBlue
                ? 'hover:border-brand-blue/40 hover:shadow-blue-glow'
                : isGreen
                  ? 'hover:border-brand-green/40 hover:shadow-green-glow'
                  : 'hover:border-brand-amber/40 hover:shadow-amber-glow'
              const iconClass = isBlue ? 'text-brand-blue bg-brand-blue/10 border-brand-blue/20'
                : isGreen ? 'text-brand-green bg-brand-green/10 border-brand-green/20'
                  : 'text-brand-amber bg-brand-amber/10 border-brand-amber/20'
              return (
                <motion.div key={s.title} variants={fadeUp}>
                  <Link href={s.href} className={`card-racing block p-8 h-full group ${cardClass}`}>
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 ${iconClass}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-white mb-3">{s.title}</h3>
                    <p className="text-dark-200 text-sm leading-relaxed mb-6">{s.description}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-blue group-hover:gap-3 transition-all">
                      Ver más <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
