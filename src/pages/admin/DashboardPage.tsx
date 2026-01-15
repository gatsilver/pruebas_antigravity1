import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import {
    Users, Calendar, BookOpen, Star, Activity, TrendingUp
} from 'lucide-react'
import { cn } from '../../lib/utils'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        classCount: 0,
        memberCount: 0,
        reservationCount: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                // 1. Total Active Classes
                const { count: classCount } = await supabase
                    .from('classes')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_active', true)

                // 2. Active Memberships
                const { count: memberCount } = await supabase
                    .from('memberships')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'active')

                // 3. Active Reservations (Future bookings)
                const today = new Date().toISOString().split('T')[0]
                const { count: reservationCount } = await supabase
                    .from('reservations')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'active')
                    .gte('reservation_date', today)

                setStats({
                    classCount: classCount || 0,
                    memberCount: memberCount || 0,
                    reservationCount: reservationCount || 0
                })
            } catch (error) {
                console.error('Error fetching dashboard stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-blue-100 mt-1">Bienvenido a Pilates App - Panel Administrativo</p>
                </div>
                {/* Decorative circle */}
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BigColorCard
                    color="bg-emerald-500"
                    title={loading ? "..." : stats.classCount.toString()}
                    subtitle="Cantidad de Clases"
                    icon={Calendar}
                    footer="Clases activas en sistema"
                />
                <BigColorCard
                    color="bg-blue-500"
                    title={loading ? "..." : stats.memberCount.toString()}
                    subtitle="Alumnos con Membresía"
                    icon={Users}
                    footer="Suscripciones vigentes"
                />
                <BigColorCard
                    color="bg-amber-500"
                    title={loading ? "..." : stats.reservationCount.toString()}
                    subtitle="Alumnos en Clases Reservadas"
                    icon={BookOpen}
                    footer="Futuras asistencias"
                />
            </div>
        </div>
    )
}

function BigColorCard({ color, title, subtitle, icon: Icon, footer }: any) {
    return (
        <div className={cn("p-6 rounded-xl shadow-lg text-white relative overflow-hidden transition-transform hover:-translate-y-1", color)}>
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-4xl font-bold mb-1">{title}</h3>
                    <p className="text-white/90 font-medium text-lg">{subtitle}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <Icon className="w-8 h-8 text-white" />
                </div>
            </div>
            {footer && (
                <div className="relative z-10 mt-6 pt-4 border-t border-white/20 text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {footer}
                </div>
            )}
            {/* Decor */}
            <Icon className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 rotate-12" />
        </div>
    )
}
