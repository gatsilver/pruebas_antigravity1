import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
            {/* Header */}
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🧘</span>
                    </div>
                    <span className="text-2xl font-bold text-white">JunakiZen</span>
                </div>
                <Link href="/login">
                    <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0">
                        Iniciar Sesión
                    </Button>
                </Link>
            </header>

            {/* Hero */}
            <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center">
                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Gestión Integral de{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                            Terapias Holísticas
                        </span>
                    </h1>
                    <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
                        Simplifica la administración de tu centro de bienestar. Citas, pacientes,
                        historiales clínicos y más, todo en una plataforma segura y fácil de usar.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-100 px-8">
                                Comenzar Ahora
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                            Ver Demo
                        </Button>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl">
                    {[
                        { icon: '📅', title: 'Agenda Inteligente', desc: 'Gestiona citas con facilidad' },
                        { icon: '👥', title: 'Multi-Terapeuta', desc: 'Asigna pacientes a tu equipo' },
                        { icon: '🔒', title: 'Seguro y Privado', desc: 'Datos protegidos por RLS' },
                    ].map((feature, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-purple-200 text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-6 text-center text-purple-300 text-sm">
                © 2026 JunakiZen — Powered by Antigravity
            </footer>
        </div>
    )
}
