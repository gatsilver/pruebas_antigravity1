import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { LayoutDashboard, Users, Calendar, BookOpen, LogOut, Bell, Search, Menu, Settings, Video } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Miembros', href: '/admin/members' },
    { icon: Calendar, label: 'Clases', href: '/admin/classes' },
    { icon: BookOpen, label: 'Reservas', href: '/admin/reservations' },
    { icon: Video, label: 'Clases Grabadas', href: '/admin/recorded-classes' },
]

export default function AdminLayout() {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [notification, setNotification] = useState<{ message: string, visible: boolean } | null>(null)
    const [isSidebarOpen, setSidebarOpen] = useState(false) // Closed by default on mobile

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    useEffect(() => {
        let mounted = true
        const channel = supabase
            .channel('admin-reservations')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'reservations' },
                async (payload: unknown) => {
                    console.log('New reservation!', payload)
                    if (mounted) {
                        showNotification('¡Nueva reserva recibida!')
                    }
                }
            )
            .subscribe()

        return () => {
            mounted = false
            supabase.removeChannel(channel)
        }
    }, [])

    const showNotification = (msg: string) => {
        setNotification({ message: msg, visible: true })
        setTimeout(() => setNotification(null), 5000)
    }

    return (
        <div className="min-h-screen bg-slate-50 relative font-sans">
            {/* Notification Toast */}
            {notification && notification.visible && (
                <div className="fixed top-20 right-4 z-[100] bg-slate-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-300">
                    <div className="bg-green-500 rounded-full p-2 text-white"><Bell className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold">Notificación</h4>
                        <p className="text-sm text-slate-300">{notification.message}</p>
                    </div>
                </div>
            )}

            {/* TOP HEADER - Blue */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-blue-600 z-50 flex items-center justify-between px-4 shadow-md">
                <div className="flex items-center gap-4 w-64">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-white/80 hover:text-white lg:hidden">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2 text-white">
                        <div className="bg-white/20 p-1.5 rounded-lg">
                            <span className="font-bold text-lg tracking-tight">MP</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden md:block">Material Able</span>
                    </div>
                </div>

                {/* Search Bar (Hidden on mobile and tablet) */}
                <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full bg-blue-700/50 text-white placeholder-blue-200 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-white/20 text-sm"
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="text-white/80 hover:text-white relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-600"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-blue-500">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full bg-white/10"
                        />
                        <span className="text-white text-sm font-medium hidden md:block">{user?.email?.split('@')[0]}</span>
                    </div>
                </div>
            </header>

            {/* Backdrop Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR - White */}
            <aside className={cn(
                "fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-300 ease-in-out overflow-y-auto",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                "lg:translate-x-0" // Always visible on desktop
            )}>
                <div className="py-6 px-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Navegación</p>
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href))
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm font-medium group relative overflow-hidden",
                                        isActive
                                            ? "bg-blue-50 text-blue-600 shadow-sm"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>}
                                    <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-8 mb-4 px-2">Cuenta</p>
                    <nav className="space-y-1">
                        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition-colors">
                            <Settings className="w-5 h-5 text-slate-400" />
                            <span>Configuración</span>
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="pt-16 lg:ml-64 min-h-screen transition-all duration-300">
                <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
