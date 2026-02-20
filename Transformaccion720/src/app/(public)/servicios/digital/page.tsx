'use client'

import { motion } from 'framer-motion'
import { Zap, Monitor, Database, ArrowRight } from 'lucide-react'
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
        icon: Zap,
        title: 'Automatización',
        badge: 'RPA & Low-Code',
        description: 'Eliminamos tareas repetitivas. Tu equipo se enfoca en lo que importa.',
        features: ['Automatización de procesos', 'Integración de sistemas', 'Bots y workflows inteligentes'],
    },
    {
        icon: Monitor,
        title: 'Tableros de Control',
        badge: 'BI & Analytics',
        highlight: 'De la intuición al control total',
        description: 'BI & Analytics para visibilidad total de tu negocio en tiempo real.',
        features: ['Dashboards ejecutivos', 'KPIs en tiempo real', 'Reportería automatizada'],
    },
    {
        icon: Database,
        title: 'Gobierno de Datos',
        badge: 'Data Architecture',
        description: 'Arquitectura de datos limpia, segura y escalable.',
        features: ['Estrategia de datos', 'Data quality & governance', 'Seguridad y cumplimiento'],
    },
]

export default function DigitalPage() {
    return (
        <div className="bg-page min-h-screen pt-24">
            {/* Hero */}
            <section className="py-20 relative overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute inset-0 bg-grid-light opacity-60" />
                <div className="absolute inset-0 bg-gradient-radial-green opacity-20" />

                {/* Líneas decorativas tipo código */}
                <div className="absolute left-8 top-1/3 font-mono text-xs text-brand-green/40 leading-loose hidden lg:block bg-green-50 p-4 rounded-xl border border-green-100 rotate-3">
                    <div>{'{'}</div>
                    <div className="ml-4">"status": "transforming",</div>
                    <div className="ml-4">"speed": "720x",</div>
                    <div className="ml-4">"impact": "∞"</div>
                    <div>{'}'}</div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center">
                        <motion.span variants={fadeUp} className="badge-green mb-6 inline-flex">
                            Para PYMEs & Startups Tech
                        </motion.span>
                        <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-display-lg md:text-display-xl text-charcoal mb-5">
                            Soluciones <span className="text-gradient-blue">Digitales</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-body-xl text-slate-600 max-w-2xl mx-auto">
                            La telemetría de tu negocio. Datos en tiempo real para decisiones precisas.
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
                        {servicios.map((s: any) => {
                            const Icon = s.icon
                            return (
                                <motion.div key={s.title} variants={fadeUp} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-brand-green/40 hover:shadow-lg transition-all shadow-sm group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                                    {s.highlight && (
                                        <div className="badge-amber mb-6 inline-block">{s.highlight}</div>
                                    )}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform">
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <span className="text-xs text-brand-green font-bold uppercase tracking-wider block mb-1">{s.badge}</span>
                                            <h3 className="font-heading font-bold text-xl text-charcoal group-hover:text-brand-green transition-colors">{s.title}</h3>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-sm mb-6 leading-relaxed border-b border-slate-100 pb-6">{s.description}</p>

                                    <ul className="space-y-3">
                                        {s.features.map((f: string) => (
                                            <li key={f} className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="mt-20 text-center"
                    >
                        <Link href="/contacto" className="btn-green text-base px-10 py-4 shadow-green-glow hover:shadow-green-glow-lg">
                            Solicita una demo
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
