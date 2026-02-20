'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Shield, Target, Zap, BarChart3, Users2, Lightbulb,
    Clock, Award, BookOpen, CheckCircle2, X,
    ArrowRight, Star, Lock, ChevronRight, Video
} from 'lucide-react'

/* ══ TIPOS ══════════════════════════════════════════ */
type CategoryKey = 'todos' | 'agilidad' | 'innovacion' | 'liderazgo'
type BadgeKey = 'popular' | 'demanda' | 'enterprise' | 'nuevo' | 'pronto'

interface Course {
    id: number
    title: string
    subtitle: string
    hours: string
    format: string
    level: string
    category: CategoryKey
    badge: BadgeKey
    icon: React.ElementType
    certifier: string
    description: string
    learnings: string[]
    color: string
    available: boolean
    courseLogo?: string
}

/* ══ DATOS ═══════════════════════════════════════════ */
const categories: { key: CategoryKey; label: string; icon: React.ElementType }[] = [
    { key: 'todos', label: 'Todos', icon: Star },
    { key: 'agilidad', label: 'Agilidad & Scrum', icon: Zap },
    { key: 'innovacion', label: 'Innovación', icon: Lightbulb },
    { key: 'liderazgo', label: 'Liderazgo', icon: Users2 },
]

const badgeMeta: Record<BadgeKey, { label: string; bg: string; text: string }> = {
    popular: { label: 'MÁS POPULAR', bg: '#0891b2', text: '#fff' },
    demanda: { label: 'ALTA DEMANDA', bg: '#d97706', text: '#fff' },
    enterprise: { label: 'ENTERPRISE', bg: '#7c3aed', text: '#fff' },
    nuevo: { label: 'NUEVO', bg: '#059669', text: '#fff' },
    pronto: { label: 'MUY PRONTO', bg: 'rgba(255,255,255,0.08)', text: '#94a3b8' },
}

const courses: Course[] = [
    {
        id: 1,
        title: 'Scrum Master',
        subtitle: 'Professional Scrum Master',
        hours: '18 horas',
        format: 'Virtual en vivo',
        level: 'Intermedio',
        category: 'agilidad',
        badge: 'popular',
        icon: Shield,
        certifier: 'Certiprof® + TA720',
        color: '#06b6d4',
        available: true,
        courseLogo: '/cursos/scrum_master.webp',
        description: 'Domina el framework Scrum y lidera equipos ágiles de alto rendimiento. Aprende a facilitar ceremonias, eliminar impedimentos y crear entornos de trabajo colaborativos bajo el método CORE720.',
        learnings: [
            'Simulaciones de sprints reales con equipos multidisciplinarios',
            'Framework de resolución de conflictos en equipos ágiles',
            'Herramientas avanzadas de facilitación y coaching',
            'Examen de certificación internacional incluido',
        ],
    },
    {
        id: 2,
        title: 'Product Owner',
        subtitle: 'Professional Product Owner',
        hours: '18 horas',
        format: 'Virtual en vivo',
        level: 'Intermedio',
        category: 'agilidad',
        badge: 'pronto',
        icon: Target,
        certifier: 'Certiprof® + TA720',
        color: '#f59e0b',
        available: false,
        description: 'Aprende a maximizar el valor del producto, gestionar el backlog y priorizar features que generan impacto real en el negocio y en los usuarios.',
        learnings: [
            'Técnicas avanzadas de backlog refinement y priorización',
            'Mapas de impacto y user story mapping',
            'Gestión de stakeholders y comunicación estratégica',
            'Desarrollo de visión de producto y roadmap',
        ],
    },
    {
        id: 3,
        title: 'Business Agility',
        subtitle: 'Enterprise Agility Strategies',
        hours: '24 horas',
        format: 'Virtual en vivo',
        level: 'Avanzado',
        category: 'agilidad',
        badge: 'pronto',
        icon: BarChart3,
        certifier: 'Certiprof® + TA720',
        color: '#8b5cf6',
        available: false,
        description: 'Estrategias para escalar la agilidad a toda la organización. Conecta la estrategia con la ejecución y adapta tu empresa al cambio constante.',
        learnings: [
            'Modelos de escalado ágil y portafolio estratégico',
            'Business Agility Value Streams',
            'Métricas de flujo y OKRs organizacionales',
            'Gestión del cambio y cultura ágil',
        ],
    },
    {
        id: 4,
        title: 'Design Thinking',
        subtitle: 'Human-Centered Innovation',
        hours: '18 horas',
        format: 'Virtual en vivo',
        level: 'Básico',
        category: 'innovacion',
        badge: 'pronto',
        icon: Lightbulb,
        certifier: 'Certiprof® + TA720',
        color: '#10b981',
        available: false,
        description: 'Desarrolla soluciones innovadoras centradas en las personas. Aprende a empatizar, definir problemas, idear, prototipar y testear con usuarios reales.',
        learnings: [
            'Entrevistas etnográficas y técnicas de observación',
            'Facilitación de talleres de Design Sprint',
            'Prototipado rápido con materiales y wireframes digitales',
            'Testing con usuarios y mejora continua',
        ],
    },
    {
        id: 5,
        title: 'Innovación Estratégica',
        subtitle: 'Jobs to be Done & Blue Ocean',
        hours: '18 horas',
        format: 'Virtual en vivo',
        level: 'Avanzado',
        category: 'innovacion',
        badge: 'pronto',
        icon: Zap,
        certifier: 'Certiprof® + TA720',
        color: '#f97316',
        available: false,
        description: 'Integra los frameworks de innovación más poderosos para crear ventajas competitivas sostenibles. Combina Jobs to be Done con estrategia de Océano Azul.',
        learnings: [
            'Mapeo de Canvas de Innovación de Valor',
            'Técnicas de JTBD para descubrir necesidades latentes',
            'Creación de espacios de mercado sin competencia',
            'Portafolio de innovación y gestión del cambio',
        ],
    },
    {
        id: 6,
        title: 'Liderazgo Transformacional',
        subtitle: 'High Performance Leadership',
        hours: '18 horas',
        format: 'Virtual en vivo',
        level: 'Avanzado',
        category: 'liderazgo',
        badge: 'pronto',
        icon: Users2,
        certifier: 'Certiprof® + TA720',
        color: '#3b82f6',
        available: false,
        description: 'Desarrolla las competencias clave para liderar equipos de alto rendimiento en entornos de incertidumbre. Inspira, comunica y ejecuta con claridad.',
        learnings: [
            'Inteligencia emocional aplicada al liderazgo situacional',
            'Comunicación ejecutiva y storytelling estratégico',
            'Construcción de culturas de alto rendimiento',
            'Gestión del cambio y resiliencia organizacional',
        ],
    },
]

/* ══ MODAL ════════════════════════════════════════════ */
function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
    const badge = badgeMeta[course.badge]
    const Icon = course.icon

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(9, 14, 28, 0.88)', backdropFilter: 'blur(10px)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 16 }}
                transition={{ type: 'spring', damping: 25, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
                style={{
                    background: 'linear-gradient(135deg, #1a2235 0%, #151d2e 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                {/* Glow acento en header */}
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
                    style={{ background: `linear-gradient(90deg, transparent, ${course.color}, transparent)` }} />

                {/* Header */}
                <div className="px-8 pt-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-start gap-5">
                        {/* Logo o Icono */}
                        {course.courseLogo ? (
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                                <Image src={course.courseLogo} alt={course.title} width={64} height={64} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                                style={{ background: `${course.color}15`, border: `1px solid ${course.color}30` }}>
                                <Icon size={30} style={{ color: course.color }} />
                            </div>
                        )}

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-md tracking-widest border border-white/10 text-slate-400">
                                    + CORE720
                                </span>
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-md tracking-widest"
                                    style={{ background: badge.bg, color: badge.text }}>
                                    {badge.label}
                                </span>
                            </div>
                            <h2 className="text-white font-bold text-2xl leading-tight">{course.title}</h2>
                            <p className="text-slate-400 text-sm mt-1">{course.subtitle}</p>
                        </div>

                        <button onClick={onClose}
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 hover:bg-white/10"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                            <X size={16} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        {[
                            { label: 'DURACIÓN', value: course.hours, icon: Clock },
                            { label: 'FORMATO', value: course.format, icon: BarChart3 },
                            { label: 'NIVEL', value: course.level, icon: Award },
                        ].map(({ label, value, icon: StatIcon }) => (
                            <div key={label} className="rounded-xl p-3 text-center"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <StatIcon size={16} className="mx-auto mb-2" style={{ color: course.color }} />
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">{label}</p>
                                <p className="text-white text-xs font-semibold leading-snug">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-6 max-h-[36vh] overflow-y-auto">
                    <div>
                        <h3 className="flex items-center gap-2 text-white font-bold text-sm mb-3">
                            <BookOpen size={15} style={{ color: course.color }} />
                            Descripción
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{course.description}</p>
                    </div>

                    <div>
                        <h3 className="flex items-center gap-2 text-white font-bold text-sm mb-3">
                            <CheckCircle2 size={15} style={{ color: course.color }} />
                            Lo que aprenderás
                        </h3>
                        <ul className="space-y-2.5">
                            {course.learnings.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: course.color, opacity: 0.7 }} />
                                    <span className="text-slate-400 text-sm leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Certifier */}
                <div className="mx-8 mb-5 p-4 rounded-2xl flex items-center gap-4"
                    style={{ background: `linear-gradient(120deg, ${course.color}08, transparent)`, border: `1px solid ${course.color}20` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${course.color}15` }}>
                        <Award size={22} style={{ color: course.color }} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold mb-0.5">Certificación Oficial</p>
                        <p className="text-white font-bold text-sm">{course.certifier}</p>
                    </div>
                </div>

                {/* CTA — solo un botón */}
                <div className="px-8 pb-8">
                    {course.available ? (
                        <a href={`https://wa.me/51963477301?text=Hola%2C+quiero+inscribirme+en+${encodeURIComponent(course.title)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 text-white transition-all hover:scale-[1.01] hover:shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}bb)`, boxShadow: `0 4px 20px ${course.color}40` }}>
                            Inscribirme Ahora
                            <ArrowRight size={16} />
                        </a>
                    ) : (
                        <div className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Lock size={15} />
                            Inscripciones próximamente
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

/* ══ CARD ═════════════════════════════════════════════ */
function CourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
    const badge = badgeMeta[course.badge]
    const Icon = course.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            onClick={onClick}
            className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
            style={{
                background: 'linear-gradient(145deg, #1c2538 0%, #17202f 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                cursor: course.available ? 'pointer' : 'default',
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            {/* Borde top de acento al hacer hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${course.color}, transparent)` }} />

            {/* Zona imagen/icono superior */}
            <div className="relative h-36 flex items-center justify-center overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${course.color}10, ${course.color}05)` }}>

                {/* + CORE720 en la esquina */}
                <div className="absolute top-3 right-3 text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border"
                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}>
                    + CORE720
                </div>

                {course.courseLogo ? (
                    <div className="relative w-28 h-28 drop-shadow-2xl">
                        <Image src={course.courseLogo} alt={course.title} fill className="object-contain" />
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{ background: `${course.color}18`, border: `1px solid ${course.color}30` }}>
                        <Icon size={38} style={{ color: course.color }} />
                    </div>
                )}

                {/* Overlay MUY PRONTO para cursos no disponibles */}
                {!course.available && (
                    <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: 'rgba(11,16,26,0.5)', backdropFilter: 'blur(1px)' }}>
                        <span className="text-[10px] font-black px-3 py-1 rounded-full tracking-widest border"
                            style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: '#94a3b8' }}>
                            MUY PRONTO
                        </span>
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-md tracking-widest mr-1"
                        style={{ background: badge.bg, color: badge.text }}>
                        {badge.label}
                    </span>
                </div>

                <h3 className="text-white font-bold text-lg leading-snug mb-1 group-hover:text-blue-200 transition-colors">
                    {course.title}
                </h3>
                <p className="text-slate-500 text-xs mb-4">{course.subtitle}</p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs mt-auto pt-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={11} style={{ color: course.color }} />
                        {course.hours}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                        <Video size={11} style={{ color: course.color }} />
                        Virtual
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                        <Award size={11} style={{ color: course.color }} />
                        Certiprof + TA720
                    </span>
                </div>

                {/* CTA */}
                {course.available && (
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-bold transition-all group-hover:gap-2.5"
                        style={{ color: course.color }}>
                        Ver detalle
                        <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </div>
                )}
            </div>
        </motion.div>
    )
}

/* ══ PÁGINA ═══════════════════════════════════════════ */
export default function EntrenamientoPage() {
    const [activeCategory, setActiveCategory] = useState<CategoryKey>('todos')
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

    const filtered = activeCategory === 'todos'
        ? courses
        : courses.filter(c => c.category === activeCategory)

    return (
        <div className="min-h-screen pt-20"
            style={{ background: 'linear-gradient(160deg, #0f1624 0%, #131c2e 40%, #0f1624 100%)' }}>

            {/* ══ HERO ══ */}
            <section className="pt-16 pb-10 px-6 relative overflow-hidden">
                {/* Glow centro */}
                <div className="absolute top-[-60px] left-[10%] w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-30"
                    style={{ background: 'radial-gradient(circle, #3b82f6 0%, #06b6d4 50%, transparent 80%)' }} />
                <div className="absolute top-[-40px] right-[5%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-10"
                    style={{ background: '#8b5cf6' }} />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-14">

                        {/* Textos */}
                        <div className="max-w-2xl">
                            {/* Método CORE720 badge introductorio */}
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                                style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="text-cyan-300 text-[10px] font-black uppercase tracking-[0.2em]">
                                    + Método CORE720
                                </span>
                            </motion.div>

                            {/* Título principal con efecto */}
                            <motion.h1
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.06 }}
                                className="font-heading font-extrabold text-4xl sm:text-5xl leading-tight mb-5"
                            >
                                <span className="text-white drop-shadow-sm">Certifícate con los </span>
                                <span className="relative inline-block">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 animate-gradient-x">
                                        mejores
                                    </span>
                                    {/* Línea decorativa bajo la palabra */}
                                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-400/0 via-cyan-400/60 to-cyan-400/0" />
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.12 }}
                                className="text-slate-400 text-base leading-relaxed max-w-lg"
                            >
                                Programas internacionales con certificación oficial. Aprende de los frameworks
                                que usan las empresas más innovadoras del planeta.
                            </motion.p>
                        </div>

                        {/* Filtros de categoría */}
                        <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.16 }}
                            className="flex flex-wrap gap-2"
                        >
                            {categories.map((cat) => {
                                const Icon = cat.icon
                                const isActive = activeCategory === cat.key
                                return (
                                    <button
                                        key={cat.key}
                                        onClick={() => setActiveCategory(cat.key)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                                        style={{
                                            background: isActive ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
                                            color: isActive ? '#22d3ee' : 'rgba(255,255,255,0.6)',
                                            borderTop: isActive ? '1px solid rgba(6,182,212,0.35)' : '1px solid rgba(255,255,255,0.08)',
                                            borderLeft: isActive ? '1px solid rgba(6,182,212,0.35)' : '1px solid rgba(255,255,255,0.08)',
                                            borderRight: isActive ? '1px solid rgba(6,182,212,0.35)' : '1px solid rgba(255,255,255,0.08)',
                                            borderBottom: isActive ? '1px solid rgba(6,182,212,0.35)' : '1px solid rgba(255,255,255,0.08)',
                                        }}
                                    >
                                        <Icon size={14} />
                                        {cat.label}
                                    </button>
                                )
                            })}
                        </motion.div>
                    </div>

                    {/* Grid */}
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={activeCategory}
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filtered.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onClick={() => setSelectedCourse(course)}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selectedCourse && (
                    <CourseModal
                        course={selectedCourse}
                        onClose={() => setSelectedCourse(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
