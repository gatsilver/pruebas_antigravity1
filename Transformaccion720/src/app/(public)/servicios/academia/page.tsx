'use client'

import { motion } from 'framer-motion'
import { Code, Gamepad2, Users, Medal, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const servicios = [
    {
        icon: Code,
        title: 'Bootcamps Prácticos',
        description: 'Inmersiones intensivas en habilidades digitales. Aprende haciendo, no memorizando.',
        features: ['Proyectos reales en cada sesión', 'Instructores con experiencia en campo', 'Certificado al completar'],
    },
    {
        icon: Gamepad2,
        title: 'Simuladores de Negocio',
        description: 'Aprende tomando decisiones reales en entornos controlados. Error sin consecuencias reales.',
        features: ['Simulaciones de alta fidelidad', 'Retroalimentación en tiempo real', 'Competencias de liderazgo'],
    },
    {
        icon: Users,
        title: 'Mentoring para Líderes',
        description: 'Acompañamiento 1:1 para líderes en transformación. Tu ritmo, tu contexto, tus metas.',
        features: ['Sesiones personalizadas', 'Plan de desarrollo individual', 'Red de líderes LATAM'],
    },
]

export default function AcademiaPage() {
    return (
        <div className="bg-page min-h-screen pt-24">
            {/* Hero */}
            <section className="py-20 relative overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute inset-0 bg-grid-light opacity-60" />
                <div className="absolute inset-0 bg-gradient-radial-amber opacity-20" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center">
                        <motion.span variants={fadeUp} className="badge-amber mb-6 inline-flex">
                            Para Líderes & Equipos
                        </motion.span>
                        <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-display-lg md:text-display-xl text-charcoal mb-5">
                            Academia &{' '}
                            <span className="text-brand-amber">Entrenamiento</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-body-xl text-slate-600 max-w-2xl mx-auto">
                            Learning by Doing. Porque los negocios no se aprenden en un PDF.
                        </motion.p>

                        {/* Simuladores concept */}
                        <motion.div variants={fadeUp} className="mt-6 inline-block bg-amber-50 text-brand-amber-dark font-mono text-sm px-4 py-2 rounded-lg border border-amber-100">
                            &gt; Concepto: Simuladores de Vuelo para Negocios
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Servicios */}
            <section className="py-24 bg-page">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {servicios.map((s) => {
                            const Icon = s.icon
                            return (
                                <motion.div key={s.title} variants={fadeUp} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-brand-amber/40 hover:shadow-lg transition-all shadow-sm group">
                                    <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6 group-hover:bg-brand-amber group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                                        <Icon size={24} className="text-brand-amber group-hover:text-white" />
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-charcoal mb-4 group-hover:text-brand-amber transition-colors">{s.title}</h3>
                                    <p className="text-slate-600 text-sm mb-6 leading-relaxed border-b border-slate-100 pb-6">{s.description}</p>
                                    <ul className="space-y-3">
                                        {s.features.map((f) => (
                                            <li key={f} className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-amber flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    {/* Badge certificación */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="mt-20 text-center"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-amber-200 shadow-sm mb-10">
                            <Medal size={28} className="text-brand-amber" />
                            <span className="font-heading font-bold text-charcoal text-lg">🏅 Certificación Internacional incluida</span>
                        </div>
                        <br />
                        <Link href="/contacto" className="btn-primary bg-brand-amber border-brand-amber hover:bg-brand-amber-dark text-white px-10 py-4 shadow-amber-glow hover:shadow-amber-glow-lg">
                            Inscríbete ahora
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
