import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Calendar, Clock, LogOut, Video } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

const navItems = [
    { icon: Calendar, label: 'Clases', href: '/app/schedule' },
    { icon: Clock, label: 'Mis Reservas', href: '/app/reservations' },
    { icon: Video, label: 'Videos', href: '/app/videos' },
]

export default function ClientLayout() {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <h1 className="text-xl font-bold tracking-tight">PILATES<span className="text-green-500">.</span></h1>

                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = location.pathname.startsWith(item.href)
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors text-sm font-medium",
                                            isActive
                                                ? "bg-slate-900 text-white"
                                                : "text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-900">{user?.email}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Salir
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4 sm:p-8">
                <Outlet />
            </main>

            {/* Mobile Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors text-xs font-medium w-full",
                                isActive
                                    ? "text-slate-900 bg-slate-100"
                                    : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <Icon className="w-5 h-5 mb-1" />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
