'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-page flex items-center justify-center px-6 relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 bg-grid-light opacity-50" />
            <div className="absolute inset-0 bg-gradient-radial-blue opacity-30" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 text-center max-w-lg"
            >
                {/* Number */}
                <div className="font-heading font-extrabold text-[120px] leading-none text-brand-blue mb-4 select-none opacity-20">
                    404
                </div>

                {/* Racing flag decoration */}
                <div className="flex justify-center gap-2 mb-8 -mt-16 relative z-20">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-6 h-6 rounded-md shadow-sm border border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-charcoal'}`}
                        />
                    ))}
                </div>

                <h1 className="font-heading font-bold text-3xl text-charcoal mb-4">
                    Fuera de pista
                </h1>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    Esta página no existe o fue movida. Regresa antes de que salgas la bandera roja.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/" className="btn-primary px-8 py-3 shadow-lg">
                        <Home size={18} />
                        Volver al Inicio
                    </Link>
                    <Link href="/contacto" className="btn-secondary px-8 py-3">
                        Contactar Soporte
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
