'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/org-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { Calendar, Users, UserCheck, ClipboardList, Package, TrendingUp, Clock, AlertTriangle } from 'lucide-react'

interface DashboardStats {
    totalPacientes: number
    citasHoy: number
    citasPendientes: number
    inventarioBajo: number
}

interface CitaAgenda {
    id_cita: string
    fecha_hora: string
    estado_cita: string
    paciente_nombre?: string
    servicio_nombre?: string
    terapeuta_nombre?: string
}

interface Terapeuta {
    id: string
    nombre_completo: string
    especialidad?: string
}

export default function DashboardPage() {
    const { orgId, rol, perfil, loading: orgLoading } = useOrg()
    const [stats, setStats] = useState<DashboardStats>({ totalPacientes: 0, citasHoy: 0, citasPendientes: 0, inventarioBajo: 0 })
    const [citasHoy, setCitasHoy] = useState<CitaAgenda[]>([])
    const [terapeutas, setTerapeutas] = useState<Terapeuta[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (!orgLoading && orgId) {
            loadDashboard()
        }
    }, [orgId, orgLoading])

    const loadDashboard = async () => {
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            // Estadísticas básicas
            const [pacientesRes, citasHoyRes, citasPendientesRes, inventarioRes] = await Promise.all([
                supabase.from('pacientes').select('id_paciente', { count: 'exact' }).eq('org_id', orgId),
                supabase.from('citas').select('id_cita', { count: 'exact' }).eq('org_id', orgId).gte('fecha_hora', today.toISOString()).lt('fecha_hora', tomorrow.toISOString()),
                supabase.from('citas').select('id_cita', { count: 'exact' }).eq('org_id', orgId).eq('estado_cita', 'pendiente'),
                supabase.from('inventario').select('id_producto', { count: 'exact' }).eq('org_id', orgId).eq('estado_stock', 'bajo'),
            ])

            setStats({
                totalPacientes: pacientesRes.count || 0,
                citasHoy: citasHoyRes.count || 0,
                citasPendientes: citasPendientesRes.count || 0,
                inventarioBajo: inventarioRes.count || 0,
            })

            // Citas de hoy con detalles
            const { data: citas } = await supabase
                .from('citas')
                .select(`
          id_cita,
          fecha_hora,
          estado_cita,
          pacientes!inner (
            clientes!inner (nombres_completos)
          ),
          servicios (nombre_servicio),
          perfiles (nombre_completo)
        `)
                .eq('org_id', orgId)
                .gte('fecha_hora', today.toISOString())
                .lt('fecha_hora', tomorrow.toISOString())
                .order('fecha_hora', { ascending: true })
                .limit(10)

            if (citas) {
                setCitasHoy(citas.map(c => ({
                    id_cita: c.id_cita,
                    fecha_hora: c.fecha_hora,
                    estado_cita: c.estado_cita || 'pendiente',
                    paciente_nombre: (c.pacientes as any)?.clientes?.nombres_completos,
                    servicio_nombre: (c.servicios as any)?.nombre_servicio,
                    terapeuta_nombre: (c.perfiles as any)?.nombre_completo,
                })))
            }

            // Cargar Terapeutas para Pacientes
            if (rol === 'paciente') {
                const { data: assignments } = await supabase
                    .from('pacientes_terapeutas')
                    .select(`
                        terapeuta_id,
                        perfiles:terapeuta_id (nombre_completo)
                    `)
                    .eq('org_id', orgId)
                    .eq('activo', true)

                if (assignments) {
                    setTerapeutas(assignments.map((a: any) => ({
                        id: a.terapeuta_id,
                        nombre_completo: a.perfiles?.nombre_completo || 'Sin nombre',
                    })))
                }
            }
        } catch (err) {
            console.error('Error loading dashboard:', err)
        } finally {
            setLoading(false)
        }
    }

    const estadoCitaVariant = (estado: string) => {
        const map: Record<string, 'default' | 'secondary' | 'destructive' | 'success' | 'warning'> = {
            pendiente: 'warning',
            confirmada: 'default',
            realizada: 'success',
            cancelada: 'destructive',
            no_asistio: 'destructive',
        }
        return map[estado] || 'secondary'
    }

    if (loading || orgLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">
                    {rol === 'paciente' ? '¡Hola' : 'Dashboard'}
                    {perfil?.nombre_completo && `, ${perfil.nombre_completo.split(' ')[0]}`}!
                </h1>
                <p className="text-muted-foreground mt-1">
                    {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stats Grid - Solo para admin/recepcion */}
            {(rol === 'admin' || rol === 'recepcion') && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPacientes}</div>
                            <p className="text-xs text-muted-foreground">Total registrados</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.citasHoy}</div>
                            <p className="text-xs text-muted-foreground">Programadas para hoy</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.citasPendientes}</div>
                            <p className="text-xs text-muted-foreground">Por confirmar</p>
                        </CardContent>
                    </Card>
                    {rol === 'admin' && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Inventario Bajo</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{stats.inventarioBajo}</div>
                                <p className="text-xs text-muted-foreground">Productos por reabastecer</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Agenda del día */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {rol === 'paciente' ? 'Tus Próximas Citas' : 'Agenda de Hoy'}
                    </CardTitle>
                    <CardDescription>
                        {citasHoy.length === 0
                            ? 'No hay citas programadas'
                            : `${citasHoy.length} cita${citasHoy.length > 1 ? 's' : ''} programada${citasHoy.length > 1 ? 's' : ''}`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {citasHoy.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay citas para mostrar</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {citasHoy.map((cita) => (
                                <div
                                    key={cita.id_cita}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold">
                                                {new Date(cita.fecha_hora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium">{cita.paciente_nombre || 'Paciente'}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {cita.servicio_nombre || 'Servicio general'}
                                                {cita.terapeuta_nombre && ` • ${cita.terapeuta_nombre}`}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={estadoCitaVariant(cita.estado_cita)}>
                                        {cita.estado_cita}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Mis Terapeutas - Solo para Pacientes */}
            {rol === 'paciente' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Mis Terapeutas
                        </CardTitle>
                        <CardDescription>
                            Profesionales asignados a tu tratamiento
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {terapeutas.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No tienes terapeutas asignados aún.</p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {terapeutas.map((terapeuta) => (
                                    <div key={terapeuta.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="font-semibold text-primary text-sm">
                                                {terapeuta.nombre_completo.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{terapeuta.nombre_completo}</p>
                                            <p className="text-xs text-muted-foreground">Terapeuta</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions */}
            {(rol === 'admin' || rol === 'recepcion') && (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Nueva Cita</h3>
                                <p className="text-sm text-muted-foreground">Agendar consulta</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="p-3 bg-green-500/10 rounded-xl">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Nuevo Paciente</h3>
                                <p className="text-sm text-muted-foreground">Registrar paciente</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <ClipboardList className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Ver Reportes</h3>
                                <p className="text-sm text-muted-foreground">Estadísticas</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
