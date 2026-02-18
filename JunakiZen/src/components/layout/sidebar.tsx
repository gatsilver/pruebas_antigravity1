'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/org-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    LayoutDashboard,
    Calendar,
    Users,
    UserCog,
    Stethoscope,
    Package,
    ClipboardList,
    Settings,
    LogOut,
    Menu,
    X,
    Building2,
    FileText,
    Lightbulb,
} from 'lucide-react'

const allMenuItems = [
    { href: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'terapeuta', 'recepcion', 'paciente'] },
    { href: 'citas', label: 'Citas', icon: Calendar, roles: ['admin', 'terapeuta', 'recepcion', 'paciente'] },
    { href: 'clientes', label: 'Clientes', icon: Users, roles: ['admin', 'recepcion'] },
    { href: 'pacientes', label: 'Pacientes', icon: UserCog, roles: ['admin', 'recepcion', 'terapeuta'] },
    { href: 'servicios', label: 'Servicios', icon: Stethoscope, roles: ['admin', 'recepcion', 'paciente'] },
    { href: 'historial', label: 'Historial Clínico', icon: FileText, roles: ['admin', 'terapeuta', 'paciente'] },
    { href: 'inventario', label: 'Inventario', icon: Package, roles: ['admin'] },
    { href: 'ideas', label: 'Ideas', icon: Lightbulb, roles: ['admin', 'terapeuta', 'recepcion'] },
    { href: 'configuracion', label: 'Configuración', icon: Settings, roles: ['admin'] },
]

export function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { orgId, orgName, rol, perfil } = useOrg()
    const supabase = createClient()

    const menuItems = allMenuItems.filter(item =>
        rol && item.roles.includes(rol)
    )

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const rolLabels: Record<string, string> = {
        admin: 'Administrador',
        terapeuta: 'Terapeuta',
        recepcion: 'Recepción',
        paciente: 'Paciente',
    }

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🧘</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">JunakiZen</h1>
                        <p className="text-xs text-muted-foreground truncate max-w-[140px]">{orgName}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname.includes(`/${item.href}`)
                    return (
                        <Link
                            key={item.href}
                            href={`/app/${orgId}/${item.href}`}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {perfil?.nombre_completo || 'Usuario'}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                            {rolLabels[rol || ''] || rol}
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/org-selector" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <Building2 className="h-4 w-4 mr-1" />
                            Cambiar
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-lg shadow-lg border"
            >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-background border-r flex flex-col transition-transform lg:translate-x-0',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <SidebarContent />
            </aside>
        </>
    )
}
