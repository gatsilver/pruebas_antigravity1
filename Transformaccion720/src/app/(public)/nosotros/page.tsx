'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Users, Settings, Cpu, LineChart, Quote, Award } from 'lucide-react'

/* ── ANIMACIONES ───────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

/* ── DATOS PILARES ────────────────────────────────── */
const pillars = [
    {
        icon: LineChart,
        title: 'Datos',
        description: 'La brújula moderna. Sin datos precisos, la estrategia es solo opinión.',
        color: 'purple' as const,
    },
    {
        icon: Users,
        title: 'Personas',
        description: 'El talento humano es el combustible. Sin compromiso, no hay movimiento.',
        color: 'blue' as const,
    },
    {
        icon: Settings,
        title: 'Procesos',
        description: 'El chasis operativo. Sin estructura eficiente, la velocidad es peligrosa.',
        color: 'green' as const,
    },
    {
        icon: Cpu,
        title: 'Tecnología',
        description: 'El motor acelerador. Potencia el resultado cuando todo lo demás está alineado.',
        color: 'amber' as const,
    },
]

const colorMap = {
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
}

/* ── DATOS EMPRESAS (Carrusel) ─────────────────────── */
const corporateClients = [
    { name: 'PwC', logo: '/empresas/pwc-logo.png' },
    { name: 'Falabella', logo: '/empresas/falabella-logo.png' },
    { name: 'Banco Pichincha', logo: '/empresas/pichincha-logo.png' },
    { name: 'Auna', logo: '/empresas/auna-logo.png' },
    { name: 'Cosapi', logo: '/empresas/cosapi-logo1.png' },
    { name: 'Cerro Prieto', logo: '/empresas/cerroprieto-logo2.png' },
    { name: 'Caja Piura', logo: '/empresas/cajapiura-logo.png' },
    { name: 'EFE', logo: '/empresas/efe-logo.png' },
]

/* ── DATOS PARTNERS (Aliados) ──────────────────────── */
const strategicPartners = [
    {
        name: 'CPLS / Certiprof',
        logo: '/parnerts/Certiprof-logo.png',
        desc: 'Partner oficial certificado para soluciones de aprendizaje y certificaciones internacionales.',
        borderColor: 'border-yellow-400'
    },
    {
        name: 'Colegio de Ingenieros del Perú',
        logo: '/parnerts/CIP-LOGO.png',
        desc: 'Alianza estratégica para formación profesional y desarrollo de competencias.',
        borderColor: 'border-red-500'
    },
]


/* ── COMPONENTE PRINCIPAL ──────────────────────────── */
export default function NosotrosPage() {
    return (
        <div className="bg-page min-h-screen pt-20">

            {/* ══ HERO: ELEGANCIA & IMPACTO ════════════════ */}
            <section className="relative py-28 overflow-hidden bg-slate-900 border-b border-slate-800">
                {/* Fondo Tech Sutil */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
                    }}
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light" />

                {/* Glow decorativo */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    <motion.div initial="hidden" animate="visible" variants={container}>
                        <motion.div variants={fadeUp} className="inline-block mb-6">
                            <span className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
                                ADN TA720
                            </span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white mb-8 leading-tight">
                            Somos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Un Laboratorio de Transformación</span>
                        </motion.h1>

                        <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
                            <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed italic">
                                "No somos consultores de paso. Trabajamos juntos para transformar el ritmo de tu organización."
                            </p>
                            <div className="mt-8 w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ══ LOS 4 PILARES ════════════════════════════ */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900">
                            Nuestros 4 Pilares
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                            Una metodología integral que sostiene cada transformación.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pillars.map((pillar, idx) => {
                            const Icon = pillar.icon
                            const c = colorMap[pillar.color]
                            return (
                                <motion.div
                                    key={pillar.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1 ${c.bg.replace('bg-', 'bg-gradient-to-r from-transparent via-')}-400 to-transparent`} />

                                    <div className={`w-16 h-16 rounded-2xl ${c.bg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={32} className={c.icon} />
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-slate-800 mb-3">{pillar.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{pillar.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ══ ALIADOS ESTRATÉGICOS ═════════════════════ */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Título Elegante con Marco Sutil */}
                    <div className="relative mb-20 text-center">
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <div className="w-64 h-[1px] bg-slate-900"></div>
                        </div>
                        <div className="relative inline-block px-8 py-3 border-y-2 border-slate-200 bg-slate-50">
                            <h2 className="font-heading font-bold text-2xl uppercase tracking-widest text-slate-700">
                                Aliados Estratégicos
                            </h2>
                        </div>
                    </div>

                    {/* Grid de Aliados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                        {strategicPartners.map((partner) => (
                            <motion.div
                                key={partner.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-shadow text-center flex flex-col items-center"
                            >
                                {/* Imagen Logo grande */}
                                <div className={`w-40 h-40 relative flex items-center justify-center mb-6`}>
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        fill
                                        className="object-contain drop-shadow-sm"
                                    />
                                </div>

                                {/* Nombre */}
                                <h3 className="text-xl font-bold text-blue-600 mb-3">
                                    {partner.name}
                                </h3>

                                {/* Descripción */}
                                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                                    {partner.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ EXPERIENCIAS CORPORATIVAS (CARRUSEL) ═════ */}
            <section className="py-24 bg-white overflow-hidden border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                    {/* Título Elegante */}
                    <div className="relative inline-block px-8 py-3 border-b-2 border-cyan-100">
                        <h2 className="font-heading font-bold text-2xl uppercase tracking-widest text-slate-700">
                            Experiencias Corporativas
                        </h2>
                    </div>
                </div>

                <div className="relative w-full">
                    {/* Degradados laterales para suavizar entrada/salida */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

                    {/* Marquee Container */}
                    <div className="flex w-full overflow-hidden select-none group">
                        <div className="flex animate-marquee min-w-full shrink-0 gap-16 items-center justify-around py-4">
                            {corporateClients.map((client, i) => (
                                <div key={i} className="relative w-40 h-20 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
                                    <Image src={client.logo} alt={client.name} fill className="object-contain" />
                                </div>
                            ))}
                            {corporateClients.map((client, i) => (
                                <div key={`dup-${i}`} className="relative w-40 h-20 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
                                    <Image src={client.logo} alt={client.name} fill className="object-contain" />
                                </div>
                            ))}
                        </div>
                        {/* Duplicado para loop infinito perfecto si el contenido no llena pantalla ancha,
                             o simplemente para mantener el flujo constante. 
                             Este 2do bloque es redundante visualmente con el mapped 'dup' arriba, 
                             pero necesario para CSS animation infinite scroll sin gaps. */}
                        <div className="flex animate-marquee min-w-full shrink-0 gap-16 items-center justify-around py-4 ml-16">
                            {corporateClients.map((client, i) => (
                                <div key={`loop-${i}`} className="relative w-40 h-20 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
                                    <Image src={client.logo} alt={client.name} fill className="object-contain" />
                                </div>
                            ))}
                            {corporateClients.map((client, i) => (
                                <div key={`loop-dup-${i}`} className="relative w-40 h-20 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
                                    <Image src={client.logo} alt={client.name} fill className="object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Estilos para animación Marquee */}
            <style jsx>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    )
}
