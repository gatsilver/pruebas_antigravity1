'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Phone, Mail, MapPin, Send, CheckCircle, MessageSquare, Zap } from 'lucide-react'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const PERFIL_OPTIONS = [
    { value: '', label: 'Selecciona tu perfil...' },
    { value: 'empresa', label: 'Empresa / Corporativo' },
    { value: 'emprendedor', label: 'Emprendedor / PYME' },
    { value: 'profesional', label: 'Profesional / Alumno' },
]

export default function ContactoClient() {
    const [sent, setSent] = useState(false)
    const [form, setForm] = useState({
        nombre: '', email: '', telefono: '', perfil: '', mensaje: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const msg = encodeURIComponent(
            `Hola TransformAcción 720!\nNombre: ${form.nombre}\nEmail: ${form.email}\nPerfil: ${form.perfil}\nMensaje: ${form.mensaje}`
        )
        window.open(`https://wa.me/51963477301?text=${msg}`, '_blank')
        setSent(true)
    }

    return (
        <div className="bg-page min-h-screen pt-24">
            <section className="py-20 relative overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute inset-0 bg-grid-light opacity-60" />
                <div className="absolute inset-0 bg-gradient-radial-blue opacity-40" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                        <motion.p variants={fadeUp} className="section-label mb-3 text-brand-blue">Pit Wall</motion.p>
                        <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-display-lg md:text-display-xl text-charcoal mb-4">
                            ¿Listo para probar el{' '}
                            <span className="text-gradient-blue">motor</span>?
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-body-xl text-slate-600 max-w-xl mx-auto">
                            Cada segundo cuenta. Hablemos de cómo acelerar tu transformación.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 pb-24 bg-page">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                        {/* Formulario */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="lg:col-span-3"
                        >
                            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
                                {/* Decoración de fondo */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-bl-full pointer-events-none" />

                                <h2 className="font-heading font-bold text-2xl text-charcoal mb-8 flex items-center gap-3 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue">
                                        <MessageSquare size={20} />
                                    </div>
                                    Envíanos un mensaje
                                </h2>

                                {sent ? (
                                    <div className="text-center py-16 bg-green-50 rounded-2xl border border-green-100">
                                        <div className="w-20 h-20 rounded-full bg-white border border-green-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                            <CheckCircle size={40} className="text-brand-green" />
                                        </div>
                                        <h3 className="font-heading font-bold text-2xl text-charcoal mb-2">¡Mensaje enviado!</h3>
                                        <p className="text-slate-600 text-lg mb-8">Te contactaremos en menos de 24 horas.</p>
                                        <button onClick={() => setSent(false)} className="text-sm font-semibold text-brand-blue hover:text-brand-blue-dark underline underline-offset-4 transition-colors">
                                            Enviar otro mensaje
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre completo *</label>
                                            <input id="nombre" type="text" required value={form.nombre}
                                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                                placeholder="Tu nombre completo"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-charcoal placeholder:text-slate-400 text-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email *</label>
                                                <input id="email" type="email" required value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    placeholder="tu@empresa.com"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-charcoal placeholder:text-slate-400 text-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Teléfono</label>
                                                <input id="telefono" type="tel" value={form.telefono}
                                                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                                                    placeholder="+51 999 999 999"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-charcoal placeholder:text-slate-400 text-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">¿Cuál es tu perfil? *</label>
                                            <div className="relative">
                                                <select id="perfil" required value={form.perfil}
                                                    onChange={(e) => setForm({ ...form, perfil: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-charcoal text-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all appearance-none font-medium cursor-pointer"
                                                >
                                                    {PERFIL_OPTIONS.map((o) => (
                                                        <option key={o.value} value={o.value} disabled={o.value === ''}>{o.label}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" data-testid="select-arrow"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mensaje *</label>
                                            <textarea id="mensaje" required rows={4} value={form.mensaje}
                                                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                                                placeholder="Cuéntanos sobre tu empresa y qué quieres transformar..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-charcoal placeholder:text-slate-400 text-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all resize-none font-medium"
                                            />
                                        </div>

                                        <button id="btn-enviar-contacto" type="submit" className="btn-primary w-full justify-center py-4 text-base shadow-blue-glow hover:shadow-blue-glow-lg transition-all mt-4">
                                            <Send size={18} />
                                            Enviar por WhatsApp
                                        </button>
                                        <p className="text-slate-400 text-xs text-center pt-2">Al enviar, serás redirigido a WhatsApp para confirmar tu mensaje.</p>
                                    </form>
                                )}
                            </div>
                        </motion.div>

                        {/* Datos de contacto */}
                        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="lg:col-span-2 space-y-6">
                            <motion.div variants={fadeUp}>
                                <p className="section-label mb-6 text-brand-blue">Contacto directo</p>
                            </motion.div>

                            <motion.a variants={fadeUp} href="https://wa.me/51963477301" target="_blank" rel="noopener noreferrer"
                                className="bg-white block p-6 rounded-2xl border border-slate-200 hover:border-brand-green hover:shadow-green-glow group transition-all duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all duration-300 text-brand-green shadow-sm">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">WhatsApp</p>
                                        <p className="text-charcoal font-bold text-lg">+51 963 477 301</p>
                                        <p className="text-xs text-brand-green font-semibold mt-1 bg-green-50 inline-block px-2 py-0.5 rounded-full">Respuesta rápida</p>
                                    </div>
                                </div>
                            </motion.a>

                            <motion.a variants={fadeUp} href="mailto:contacto@transformaccion720.com"
                                className="bg-white block p-6 rounded-2xl border border-slate-200 hover:border-brand-blue hover:shadow-blue-glow group transition-all duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 text-brand-blue shadow-sm">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">Email</p>
                                        <p className="text-charcoal font-bold text-lg break-all">contacto@transformaccion720.com</p>
                                    </div>
                                </div>
                            </motion.a>

                            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-brand-amber shadow-sm">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">Ubicación</p>
                                        <p className="text-charcoal font-bold text-lg">Lima, Perú</p>
                                        <p className="text-xs text-slate-500 mt-1">Atendemos toda LATAM</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeUp} className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 items-start">
                                <div className="mt-0.5 text-brand-amber">
                                    <Zap size={18} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-brand-amber-dark text-xs font-bold uppercase tracking-wider mb-1">¿Es urgente?</p>
                                    <p className="text-slate-700 text-sm font-medium">Escríbenos directamente por WhatsApp para atención inmediata. Priorizamos casos críticos.</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
