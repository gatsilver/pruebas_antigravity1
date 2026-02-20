'use client'

import { motion } from 'framer-motion'
import { Search, Compass, Zap, BarChart3, TrendingUp, ArrowRight } from 'lucide-react'
import { useState } from 'react'

/* ── DATOS ─────────────────────────────────────────── */
const steps = [
    {
        id: 1,
        title: 'Entender',
        description: 'Diagnosticamos tu situación actual, identificamos oportunidades y definimos el estado deseado.',
        icon: Search,
        color: '#3b82f6',        // azul
        bg: 'rgba(59,130,246,0.1)',
    },
    {
        id: 2,
        title: 'Alinear',
        description: 'Conectamos a todos los stakeholders con una visión compartida y objetivos claros.',
        icon: Compass,
        color: '#10b981',        // verde
        bg: 'rgba(16,185,129,0.1)',
    },
    {
        id: 3,
        title: 'Acción Ágil',
        description: 'Ejecutamos sprints cortos con entregables tangibles que generan impacto rápido.',
        icon: Zap,
        color: '#f59e0b',        // ámbar
        bg: 'rgba(245,158,11,0.1)',
    },
    {
        id: 4,
        title: 'Validar',
        description: 'Medimos resultados con KPIs precisos y ajustamos la estrategia en tiempo real.',
        icon: BarChart3,
        color: '#6366f1',        // índigo
        bg: 'rgba(99,102,241,0.1)',
    },
    {
        id: 5,
        title: 'Escalar',
        description: 'Ampliamos las soluciones exitosas a toda la organización de forma sostenible.',
        icon: TrendingUp,
        color: '#06b6d4',        // cian
        bg: 'rgba(6,182,212,0.1)',
    },
]

const metrics = [
    { value: '20–40%', label: 'Mejora operativa' },
    { value: '+15%', label: 'Incremento de rentabilidad' },
    { value: '-30%', label: 'Reducción de tiempos' },
]

/* ── COMPONENTE ─────────────────────────────────────── */
export default function MetodologiaPage() {
    const [active, setActive] = useState<number | null>(null)

    return (
        <div className="min-h-screen pt-20 bg-page">

            {/* ══ HERO ══════════════════════════════════════════ */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="section-label mb-3"
                    >
                        Metodología TA720
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-charcoal leading-tight mb-5"
                    >
                        El sistema que convierte{' '}
                        <span className="text-gradient-blue">estrategia en resultados</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.14 }}
                        className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        Cinco fases integradas que conectan personas, procesos y tecnología
                        para ejecutar con precisión y escalar con sostenibilidad.
                    </motion.p>
                </div>
            </section>

            {/* ══ FLUJO LINEAL ══════════════════════════════════ */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Línea horizontal + círculos (desktop) */}
                    <div className="hidden md:block">
                        {/* Contenedor relativo para la línea */}
                        <div className="relative flex items-start justify-between gap-0">

                            {/* Línea de fondo que conecta todos los nodos */}
                            <div
                                className="absolute top-[40px] left-[40px] right-[40px] h-[2px] pointer-events-none"
                                style={{
                                    background: 'linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #6366f1, #06b6d4)',
                                    opacity: 0.25,
                                }}
                            />

                            {steps.map((step, idx) => {
                                const Icon = step.icon
                                const isActive = active === idx
                                return (
                                    <button
                                        key={step.id}
                                        onClick={() => setActive(isActive ? null : idx)}
                                        className="flex flex-col items-center flex-1 group outline-none"
                                        style={{ minWidth: 0 }}
                                    >
                                        {/* Círculo */}
                                        <div
                                            className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
                                            style={{
                                                background: isActive ? step.color : '#fff',
                                                border: `2px solid ${step.color}`,
                                                transform: isActive ? 'scale(1.12)' : 'scale(1)',
                                                boxShadow: isActive ? `0 0 0 6px ${step.bg}` : '0 2px 8px rgba(0,0,0,0.06)',
                                            }}
                                        >
                                            <Icon
                                                size={28}
                                                style={{ color: isActive ? '#fff' : step.color }}
                                                className="transition-colors duration-300"
                                            />
                                        </div>

                                        {/* Título */}
                                        <p
                                            className="mt-4 font-heading font-bold text-sm transition-colors duration-200"
                                            style={{ color: isActive ? step.color : '#334155' }}
                                        >
                                            {step.title}
                                        </p>

                                        {/* Número sutil */}
                                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                                            0{idx + 1}
                                        </p>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Panel de descripción expandible */}
                        {active !== null && (
                            <div
                                className="mt-8 p-6 rounded-2xl border transition-all duration-200"
                                style={{
                                    background: steps[active].bg,
                                    borderColor: `${steps[active].color}30`,
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: steps[active].color }}
                                    >
                                        {(() => { const Icon = steps[active].icon; return <Icon size={18} color="#fff" /> })()}
                                    </div>
                                    <div>
                                        <h3
                                            className="font-heading font-bold text-lg mb-1"
                                            style={{ color: steps[active].color }}
                                        >
                                            {steps[active].title}
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                                            {steps[active].description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── MOBILE: Cards verticales ── */}
                    <div className="md:hidden space-y-3">
                        {steps.map((step, idx) => {
                            const Icon = step.icon
                            const isActive = active === idx
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setActive(isActive ? null : idx)}
                                    className="w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4"
                                    style={{
                                        background: isActive ? step.bg : '#fff',
                                        borderColor: isActive ? `${step.color}40` : '#e2e8f0',
                                    }}
                                >
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: isActive ? step.color : `${step.color}15`, }}
                                    >
                                        <Icon size={20} style={{ color: isActive ? '#fff' : step.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                                            <h3 className="font-heading font-bold text-sm" style={{ color: isActive ? step.color : '#1e293b' }}>
                                                {step.title}
                                            </h3>
                                        </div>
                                        {isActive && (
                                            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                                                {step.description}
                                            </p>
                                        )}
                                    </div>
                                    <ArrowRight
                                        size={14}
                                        className="shrink-0 mt-1 transition-transform duration-200"
                                        style={{ color: step.color, transform: isActive ? 'rotate(90deg)' : 'none', opacity: isActive ? 1 : 0.4 }}
                                    />
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ══ MÉTRICAS ══════════════════════════════════════ */}
            <section className="py-16 bg-page border-t border-slate-100">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className="section-label mb-2">Resultados probados</p>
                        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-charcoal">
                            Impacto que se <span className="text-gradient-blue">mide</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {metrics.map((m, i) => (
                            <motion.div
                                key={m.label}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="text-center p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <p className="font-heading font-black text-4xl md:text-5xl text-brand-blue mb-2 tracking-tight">{m.value}</p>
                                <p className="text-slate-500 font-medium text-sm">{m.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA ═══════════════════════════════════════════ */}
            <section className="py-14 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="font-heading font-bold text-2xl md:text-3xl text-charcoal mb-4">
                        ¿Listo para activar tu transformación?
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-xl mx-auto text-sm md:text-base">
                        Agenda una llamada de diagnóstico gratuito y descubre cómo el sistema TA720
                        puede acelerar tu organización.
                    </p>
                    <a
                        href="https://wa.me/51963477301"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        Agenda tu diagnóstico
                        <ArrowRight size={16} />
                    </a>
                </div>
            </section>
        </div>
    )
}
