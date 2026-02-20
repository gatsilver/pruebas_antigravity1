import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Instagram, Youtube, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react'

const quickLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/servicios/consultoria', label: 'Transformación de Negocio' },
    { href: '/servicios/digital', label: 'Soluciones Digitales' },
    { href: '/servicios/academia', label: 'Academia & Entrenamiento' },
    { href: '/metodologia', label: 'Metodología' },
    { href: '/contacto', label: 'Contacto' },
]

const socialLinks = [
    { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
    { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
]

export function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">

                    {/* Columna 1: Logo + Tagline */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block group">
                            <div className="relative h-14 w-56 mb-4">
                                <Image
                                    src="/logo/Logo_firma.png"
                                    alt="TransformAcción 720"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
                            Aceleramos la transformación digital de organizaciones en LATAM.
                            Estrategia, tecnología y personas en perfecta sintonía.
                        </p>
                        {/* Redes sociales */}
                        <div className="flex gap-3">
                            {socialLinks.map(({ href, icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-blue hover:border-brand-blue hover:shadow-blue-glow transition-all duration-300"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Columna 2: Links Rápidos */}
                    <div>
                        <p className="section-label mb-6 text-brand-blue">Navegación</p>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-600 hover:text-brand-blue text-sm transition-colors flex items-center gap-2 group font-medium"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-brand-blue transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 3: Contacto */}
                    <div>
                        <p className="section-label mb-6 text-brand-blue">Contacto</p>
                        <ul className="space-y-5">
                            <li>
                                <a
                                    href="https://wa.me/51963477301"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-4 group hover:translate-x-1 transition-transform"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center mt-0.5 group-hover:bg-brand-green group-hover:text-white transition-all duration-300 text-brand-green">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">WhatsApp</p>
                                        <p className="text-base text-charcoal font-semibold group-hover:text-brand-green transition-colors">+51 963 477 301</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:contacto@transformaccion720.com"
                                    className="flex items-start gap-4 group hover:translate-x-1 transition-transform"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mt-0.5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 text-brand-blue">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Email</p>
                                        <p className="text-base text-charcoal font-semibold group-hover:text-brand-blue transition-colors">contacto@transformaccion720.com</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mt-0.5 text-brand-amber">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Ubicación</p>
                                        <p className="text-base text-charcoal font-medium">Lima, Perú</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-400 text-xs font-medium">
                        © {new Date().getFullYear()} TransformAcción 720. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/terminos" className="text-slate-400 text-xs hover:text-brand-blue transition-colors">
                            Términos y Condiciones
                        </Link>
                        <Link href="/privacidad" className="text-slate-400 text-xs hover:text-brand-blue transition-colors">
                            Política de Privacidad
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
