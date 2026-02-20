'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    ArrowRight, Building2, Rocket, GraduationCap,
    Zap, TrendingUp, Users, Phone, Play,
    CheckCircle, AlertTriangle, DollarSign
} from 'lucide-react'

// === VARIANTES FRAMER MOTION ===
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

// === COMPONENTE CONTADOR ANIMADO ===
function AnimatedCounter({ target, suffix = '', duration = 2 }: {
    target: number
    suffix?: string
    duration?: number
}) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
        if (!inView) return
        const start = Date.now()
        const end = start + duration * 1000
        const tick = () => {
            const now = Date.now()
            const progress = Math.min((now - start) / (end - start), 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
            else setCount(target)
        }
        requestAnimationFrame(tick)
    }, [inView, target, duration])

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    )
}

// === TARJETAS SELECTOR DE PISTA ===
// Ahora fondo blanco limpio con acentos de color
const profileCards = [
    {
        icon: Building2,
        title: 'Empresas',
        headline: 'Busco Eficiencia y Escalamiento',
        description: 'Consultoría estratégica para organizaciones que necesitan resultados medibles.',
        href: '/servicios/consultoria',
        color: 'blue' as const,
        badge: 'CEOs & Directivos',
    },
    {
        icon: Rocket,
        title: 'Emprendedores',
        headline: 'Busco Orden y Crecimiento Ágil',
        description: 'Herramientas digitales y procesos para escalar sin caos.',
        href: '/servicios/digital',
        color: 'green' as const,
        badge: 'PYMEs & Startups',
    },
    {
        icon: GraduationCap,
        title: 'Profesionales',
        headline: 'Busco Entrenar mis Habilidades',
        description: 'Bootcamps y simuladores para dominar las competencias del futuro.',
        href: '/servicios/academia',
        color: 'amber' as const,
        badge: 'Líderes & Equipos',
    },
]

const colorMap = {
    blue: {
        badge: 'badge-blue',
        icon: 'text-brand-blue',
        iconBg: 'bg-blue-50 border-blue-100',
        arrow: 'text-brand-blue',
        cardHover: 'hover:border-brand-blue/30 hover:shadow-blue-glow',
    },
    green: {
        badge: 'badge-green',
        icon: 'text-brand-green',
        iconBg: 'bg-green-50 border-green-100',
        arrow: 'text-brand-green',
        cardHover: 'hover:border-brand-green/30 hover:shadow-green-glow',
    },
    amber: {
        badge: 'badge-amber',
        icon: 'text-brand-amber',
        iconBg: 'bg-amber-50 border-amber-100',
        arrow: 'text-brand-amber',
        cardHover: 'hover:border-brand-amber/30 hover:shadow-amber-glow',
    },
}

// === PAIN POINTS ===
const painPoints = [
    { icon: AlertTriangle, text: '¿Tus procesos frenan tu crecimiento?' },
    { icon: DollarSign, text: '¿La tecnología es un gasto y no una inversión?' },
    { icon: Users, text: '¿Tu equipo resiste el cambio?' },
]

// === STATS ===
const stats = [
    { value: 20, suffix: '%+', label: 'Mejora operativa promedio' },
    { value: 15, suffix: '%+', label: 'Incremento de rentabilidad' },
    { value: 30, suffix: '%-', label: 'Reducción de tiempos' },
    { value: 50, suffix: '+', label: 'Proyectos de transformación' },
]

// === LOGOS CLIENTES ===
const clients = [
    { name: 'PwC', logo: '/empresas/pwc-logo.png' },
    { name: 'Falabella', logo: '/empresas/falabella-logo.png' },
    { name: 'Banco Pichincha', logo: '/empresas/pichincha-logo.png' },
    { name: 'Auna', logo: '/empresas/auna-logo.png' },
    { name: 'Cosapi', logo: '/empresas/cosapi-logo1.png' },
    { name: 'Cerro Prieto', logo: '/empresas/cerroprieto-logo2.png' },
    { name: 'Caja Piura', logo: '/empresas/cajapiura-logo.png' },
]

export default function HomePage() {
    return (
        <div className="bg-page min-h-screen text-charcoal">

            {/* ============================================
          HERO — "La Parrilla de Salida"
          ============================================ */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20">
                {/* Fondo con grid + glow radial */}
                <div className="absolute inset-0 bg-grid-light opacity-60" />
                <div className="absolute inset-0 bg-gradient-radial-blue opacity-50" />

                {/* Glow orbs - ahora más sutiles y claros */}
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={container}
                    >
                        {/* Badge */}
                        <motion.div variants={fadeUp} className="flex justify-center mb-8">
                            <span className="badge-amber bg-white border border-amber-200 shadow-sm py-1.5 px-4 text-xs font-bold tracking-wider">
                                <Zap size={12} className="text-brand-amber" />
                                Laboratorio de Transformación Digital
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={fadeUp}
                            className="font-display font-extrabold text-display-lg md:text-display-2xl text-charcoal leading-[1.1] mb-8 tracking-tight"
                        >
                            Aceleramos la{' '}
                            <span className="text-gradient-blue relative inline-block">
                                transformación
                                {/* Underline highlight sutil */}
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-blue/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </span>
                            <br />
                            de tu negocio.
                        </motion.h1>

                        {/* Sub-headline */}
                        <motion.p
                            variants={fadeUp}
                            className="text-body-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
                        >
                            La velocidad sin dirección es solo ruido.{' '}
                            <span className="text-charcoal font-semibold">Convierte el cambio en tu ventaja competitiva.</span>
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                            <a
                                href="https://wa.me/51963477301"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary text-base px-8 py-4 shadow-blue-glow hover:shadow-blue-glow-lg transition-all"
                            >
                                <Phone size={18} />
                                Conversemos...
                            </a>
                            <Link
                                href="/nosotros"
                                className="btn-secondary text-base px-8 py-4 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-brand-blue transition-all"
                            >
                                <Play size={16} />
                                Conoce más
                            </Link>
                        </motion.div>

                        {/* Mini stats */}
                        <motion.div
                            variants={fadeUp}
                            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-200 pt-10"
                        >
                            {stats.map((s) => (
                                <div key={s.label} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                                    <p className="font-heading font-extrabold text-4xl text-brand-blue group-hover:text-brand-blue-dark transition-colors">
                                        <AnimatedCounter target={s.value} suffix={s.suffix} />
                                    </p>
                                    <p className="text-xs font-semibold text-slate-500 mt-2 uppercase tracking-wide">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ============================================
          SELECTOR DE PISTA — Segmentación por Perfil
          ============================================ */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={container}
                        className="text-center mb-16"
                    >
                        <motion.p variants={fadeUp} className="section-label mb-3">
                            ¿Cuál es tu pista?
                        </motion.p>
                        <motion.h2 variants={fadeUp} className="font-heading font-bold text-display-md text-charcoal mb-4">
                            Elige tu perfil
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-slate-600 max-w-lg mx-auto text-lg">
                            En menos de 3 segundos, identifica la solución diseñada exactamente para ti.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={container}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {profileCards.map((card) => {
                            const colors = colorMap[card.color]
                            const Icon = card.icon
                            return (
                                <motion.div key={card.title} variants={fadeUp} className="h-full">
                                    <Link
                                        href={card.href}
                                        className={`card group block p-8 h-full bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-brand-blue/20 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-lg`}
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                            <Icon size={120} className={colors.icon} />
                                        </div>

                                        {/* Badge */}
                                        <span className={`${colors.badge} text-xs mb-8 inline-flex bg-white shadow-sm`}>
                                            {card.badge}
                                        </span>

                                        {/* Icono */}
                                        <div className={`w-16 h-16 rounded-2xl border ${colors.iconBg} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon size={28} className={colors.icon} />
                                        </div>

                                        {/* Contenido */}
                                        <h3 className="font-heading font-bold text-2xl text-charcoal mb-3 group-hover:text-brand-blue transition-colors">
                                            {card.headline}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                                            {card.description}
                                        </p>

                                        {/* Link footer */}
                                        <div className={`flex items-center gap-2 text-sm font-bold ${colors.arrow} mt-auto`}>
                                            Explorar solución
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ============================================
          EL GANCHO — Pain Points + Dato Impacto
          ============================================ */}
            <section className="py-28 bg-page relative overflow-hidden">
                <div className="absolute inset-0 bg-dots-light opacity-40" />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                        {/* Dato grande */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className="text-center lg:text-left relative"
                        >
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-amber/10 rounded-full blur-3xl" />

                            <p className="section-label mb-4">La realidad de LATAM</p>
                            <p className="font-heading font-extrabold text-[8rem] leading-none text-transparent bg-clip-text bg-gradient-to-br from-brand-amber to-brand-amber-dark drop-shadow-sm">
                                52<span className="text-5xl text-brand-amber">%</span>
                            </p>
                            <p className="text-xl text-slate-600 mt-6 max-w-md font-medium leading-relaxed">
                                de empresas en LATAM podrían{' '}
                                <strong className="text-charcoal bg-amber-100/50 px-1 rounded">desaparecer en 5-10 años</strong>{' '}
                                si no aceleran su transformación digital.
                            </p>
                            <a
                                href="https://wa.me/51963477301"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-racing mt-10 inline-flex shadow-amber-glow hover:shadow-amber-glow-lg transition-all bg-gradient-amber border-none text-charcoal"
                            >
                                Haz tu diagnóstico gratuito
                                <ArrowRight size={18} />
                            </a>
                        </motion.div>

                        {/* Pain points */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={container}
                            className="space-y-5"
                        >
                            <motion.p variants={fadeUp} className="section-label mb-8 pl-1">
                                ¿Te asusta quedarte atrás?
                            </motion.p>
                            {painPoints.map((p) => {
                                const Icon = p.icon
                                return (
                                    <motion.div
                                        key={p.text}
                                        variants={fadeUp}
                                        className="card p-6 flex items-center gap-5 border border-slate-100 hover:border-brand-amber/30 transition-colors shadow-sm bg-white"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                                            <Icon size={20} className="text-brand-amber-dark" />
                                        </div>
                                        <p className="text-charcoal font-semibold text-lg">{p.text}</p>
                                    </motion.div>
                                )
                            })}

                            {/* Respuesta */}
                            <motion.div
                                variants={fadeUp}
                                className="card p-6 border-brand-green/20 bg-green-50/50 flex items-center gap-5 mt-6 shadow-sm"
                            >
                                <div className="w-12 h-12 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle size={22} className="text-brand-green-dark" />
                                </div>
                                <p className="text-charcoal font-medium text-lg">
                                    Nosotros tenemos la solución. <span className="text-brand-green-dark font-bold">Sin excusas.</span>
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
          SOCIAL PROOF — Logos de clientes
          ============================================ */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs text-slate-400 uppercase tracking-[0.2em] mb-12 font-bold">
                        Experiencias Corporativas
                    </p>
                    <div className="overflow-hidden mask-linear-fade">
                        <div className="flex animate-marquee gap-16 items-center">
                            {[...clients, ...clients].map((client, i) => (
                                <div
                                    key={`${client.name}-${i}`}
                                    className="relative w-40 h-20 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 flex-shrink-0"
                                >
                                    <Image
                                        src={client.logo}
                                        alt={client.name}
                                        fill
                                        className="object-contain" // Ajuste perfecto
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
          CTA FINAL
          ============================================ */}
            <section className="py-32 bg-page relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial-blue opacity-30" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={container}
                        className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden"
                    >
                        {/* Decoración */}
                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-brand-green/5 rounded-full blur-2xl pointer-events-none" />

                        <motion.p variants={fadeUp} className="section-label mb-6">
                            Siguiente paso
                        </motion.p>
                        <motion.h2 variants={fadeUp} className="font-heading font-extrabold text-display-md text-charcoal mb-6">
                            ¿Listo para probar el motor?
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-slate-600 mb-10 text-xl max-w-2xl mx-auto">
                            Cada segundo cuenta. Hablemos de cómo acelerar tu transformación hoy mismo.
                        </motion.p>
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 justify-center">
                            <a
                                href="https://wa.me/51963477301"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary text-base px-10 py-4 shadow-blue-glow hover:shadow-blue-glow-lg"
                            >
                                <TrendingUp size={18} />
                                Comenzar ahora
                            </a>
                            <Link href="/metodologia" className="btn-secondary text-base px-10 py-4 border-slate-200 text-slate-700 hover:text-brand-blue hover:border-brand-blue">
                                Ver metodología
                                <ArrowRight size={16} />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

        </div>
    )
}
