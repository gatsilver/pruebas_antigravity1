'use client'

import { motion } from 'framer-motion'
import { Target, RefreshCw, BarChart3, ArrowRight } from 'lucide-react'
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
        icon: Target,
        title: 'Excelencia Operacional',
        description: 'Eliminamos cuellos de botella. Mapeamos, optimizamos y automatizamos.',
        features: ['Mapeo de procesos AS-IS / TO-BE', 'Identificación de ineficiencias', 'Implementación de mejoras ágiles'],
    },
    {
        icon: RefreshCw,
        title: 'Gestión del Cambio',
        description: 'Transformamos la resistencia en adopción con frameworks probados.',
        features: ['Diagnóstico de cultura organizacional', 'Plan de comunicación del cambio', 'Gestión de stakeholders'],
    },
    {
        icon: BarChart3,
        title: 'Diagnóstico de Madurez',
        description: 'Evaluamos dónde estás y diseñamos la ruta hacia donde necesitas llegar.',
        features: ['Assessment de madurez digital', 'Roadmap de transformación', 'KPIs y métricas de seguimiento'],
    },
]

export default function ConsultoriaPage() {
    return (
        <div className="bg-page min-h-screen pt-24">
            {/* Hero */}
            <section className="py-24 relative overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute inset-0 bg-grid-light opacity-60" />
                <div className="absolute inset-0 bg-gradient-radial-blue opacity-30" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
                        <motion.span variants={fadeUp} className="badge-blue mb-6 inline-flex bg-white shadow-sm border border-blue-100">
                            Para CEOs & Directivos
                        </motion.span>
                        <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-display-lg md:text-display-xl text-charcoal mb-6 leading-tight">
                            Transformación de <br /><span className="text-brand-blue">Negocio</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-body-xl text-slate-600 max-w-2xl leading-relaxed">
                            Estrategia, cultura y procesos para organizaciones que necesitan <span className="text-charcoal font-semibold">resultados, no PowerPoints.</span>
                        </motion.p>
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
                                <motion.div key={s.title} variants={fadeUp} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-brand-blue/40 hover:shadow-lg transition-all shadow-sm group">
                                    <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                                        <Icon size={24} className="text-brand-blue group-hover:text-white" />
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-charcoal mb-4 group-hover:text-brand-blue transition-colors">{s.title}</h3>
                                    <p className="text-slate-600 text-sm mb-6 leading-relaxed border-b border-slate-100 pb-6">{s.description}</p>
                                    <ul className="space-y-3">
                                        {s.features.map((f) => (
                                            <li key={f} className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
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
                        <Link href="/contacto" className="btn-primary text-base px-10 py-4 shadow-blue-glow hover:shadow-blue-glow-lg">
                            Agenda tu diagnóstico gratuito
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
