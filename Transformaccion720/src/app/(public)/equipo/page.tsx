'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const team = [
  {
    name: 'Gastón Silver',
    role: 'CEO & Fundador',
    bio: 'Especialista en transformación organizacional con +15 años liderando proyectos de cambio en LATAM. Ex-consultor en McKinsey y Deloitte.',
    tags: ['Estrategia', 'Change Management', 'Cultura Organizacional'],
    initials: 'GS',
    color: 'blue',
  },
  {
    name: 'Equipo TA720',
    role: 'Consultores Senior',
    bio: 'Un equipo multidisciplinario de expertos en tecnología, procesos y personas. Cada proyecto recibe el talento exacto que necesita.',
    tags: ['Tecnología', 'Procesos', 'Personas'],
    initials: 'T7',
    color: 'green',
  },
]

export default function EquipoPage() {
  return (
    <div className="bg-page min-h-screen pt-24">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-light opacity-60" />
        <div className="absolute inset-0 bg-gradient-radial-blue opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={container}>
            <motion.p variants={fadeUp} className="section-label mb-3 text-brand-blue">Nuestro equipo</motion.p>
            <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-display-lg md:text-display-xl text-charcoal mb-5">
              Los <span className="text-gradient-blue">pilotos</span> del Paddock
            </motion.h1>
            <motion.p variants={fadeUp} className="text-body-xl text-slate-600 max-w-xl mx-auto">
              Expertos que han vivido la transformación desde adentro. No consultores de PowerPoint, sino profesionales de ejecución.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team cards */}
      <section className="py-24 bg-page">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {team.map((member) => {
              const isBlue = member.color === 'blue'
              const colorBase = isBlue ? 'blue' : 'green'
              return (
                <motion.div key={member.name} variants={fadeUp} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all shadow-sm group">
                  {/* Avatar */}
                  <div className={`w-24 h-24 rounded-2xl border flex items-center justify-center mb-6 font-heading font-extrabold text-3xl transition-transform group-hover:scale-105
                    ${isBlue
                      ? 'bg-blue-50 border-blue-100 text-brand-blue'
                      : 'bg-green-50 border-green-100 text-brand-green'
                    }`}>
                    {member.initials}
                  </div>
                  <h2 className="font-heading font-bold text-2xl text-charcoal mb-1">{member.name}</h2>
                  <p className={`text-sm font-bold uppercase tracking-wider mb-4 
                    ${isBlue ? 'text-brand-blue' : 'text-brand-green'}`}>
                    {member.role}
                  </p>
                  <p className="text-slate-600 text-base leading-relaxed mb-6">{member.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.tags.map((tag) => (
                      <span key={tag} className={`px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-20 text-center"
          >
            <p className="text-slate-500 text-base mb-6 font-medium">¿Quieres trabajar con nosotros o unirte al equipo?</p>
            <Link href="/contacto" className="btn-primary shadow-blue-glow px-8 py-3.5">
              Contáctanos
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
