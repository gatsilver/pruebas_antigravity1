'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'

const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/nosotros', label: 'Nosotros' },
    {
        label: 'Servicios',
        children: [
            { href: '/servicios/consultoria', label: 'Transformación de Negocio' },
            { href: '/servicios/digital', label: 'Soluciones Digitales' },
            { href: '/servicios/academia', label: 'Academia & Entrenamiento' },
        ]
    },
    { href: '/metodologia', label: 'Metodología' },
    { href: '/entrenamiento', label: 'Entrenamiento 720' },
    { href: '/contacto', label: 'Contacto' },
]

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [servicesOpen, setServicesOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    // Detectar si estamos en una página con fondo oscuro
    const isDarkPage = pathname === '/entrenamiento'

    // Clases dinámicas para texto
    // Si scrolleó, el fondo es blanco/glass -> texto oscuro
    // Si no scrolleó y es darkPage -> texto blanco
    // Si no scrolleó y es lightPage -> texto oscuro (o lo que fuera default)
    const textColorClass = scrolled
        ? 'text-slate-600 hover:text-brand-blue'
        : (isDarkPage ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-brand-blue')

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'glass-panel shadow-card py-3 bg-white/90 backdrop-blur-md'
                : 'py-5 bg-transparent'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className={`relative h-12 w-48 transition-all duration-300 ${!scrolled && isDarkPage ? 'brightness-0 invert' : ''}`}>
                        <Image
                            src="/logo/Logo_firma.png"
                            alt="TransformAcción 720"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        if (link.children) {
                            return (
                                <div key={link.label} className="relative group">
                                    <button
                                        className={`flex items-center gap-1.5 py-2 font-medium transition-colors ${textColorClass}`}
                                        onMouseEnter={() => setServicesOpen(true)}
                                        onMouseLeave={() => setServicesOpen(false)}
                                    >
                                        {link.label}
                                        <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                                    </button>

                                    {/* Dropdown */}
                                    <div
                                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${servicesOpen
                                            ? 'opacity-100 pointer-events-auto translate-y-0'
                                            : 'opacity-0 pointer-events-none -translate-y-2'
                                            }`}
                                        onMouseEnter={() => setServicesOpen(true)}
                                        onMouseLeave={() => setServicesOpen(false)}
                                    >
                                        <div className="bg-white border border-gray-100 rounded-2xl p-2 w-64 shadow-elevated">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block px-4 py-3 rounded-xl text-sm text-slate-600 hover:text-brand-blue hover:bg-blue-50 transition-all duration-150 font-medium"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        // Link normal
                        const isActive = pathname === link.href
                        const activeColor = scrolled || !isDarkPage ? 'text-brand-blue font-bold' : 'text-cyan-400 font-bold'

                        return (
                            <Link
                                key={link.href}
                                href={link.href!}
                                className={`transition-colors font-medium py-2 ${isActive ? activeColor : textColorClass
                                    }`}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                </div>

                {/* CTA Desktop */}
                <div className="hidden md:flex items-center gap-3">
                    <a
                        href="https://wa.me/51978800884"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm px-5 py-2.5 shadow-lg shadow-blue-500/20"
                    >
                        <Phone size={15} />
                        Agenda una llamada
                    </a>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 rounded-lg text-dark-600 hover:text-brand-blue hover:bg-blue-50 transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Abrir menú"
                >
                    {mobileOpen ? <X size={22} className={!scrolled && isDarkPage ? 'text-white' : ''} /> : <Menu size={22} className={!scrolled && isDarkPage ? 'text-white' : ''} />}
                </button>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-slide-in-right h-screen absolute top-full left-0 right-0">
                    <div className="px-6 py-6 space-y-1">
                        {navLinks.map((link) => {
                            if (link.children) {
                                return (
                                    <div key={link.label}>
                                        <p className="section-label py-3 mt-2 font-bold text-slate-400 text-xs uppercase tracking-wider">{link.label}</p>
                                        {link.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className="block pl-4 py-2.5 text-slate-600 hover:text-brand-blue transition-colors text-sm font-medium"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )
                            }
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href!}
                                    className={`block py-3 font-medium transition-colors ${pathname === link.href
                                        ? 'text-brand-blue'
                                        : 'text-slate-700 hover:text-brand-blue'
                                        }`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                        <div className="pt-8">
                            <a
                                href="https://wa.me/51963477301"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary w-full justify-center text-sm py-3"
                            >
                                <Phone size={16} />
                                Agenda una llamada
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
