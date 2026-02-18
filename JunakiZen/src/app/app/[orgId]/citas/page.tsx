'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/org-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { formatDateTime } from '@/lib/utils'
import { Plus, Search, Calendar, Clock, Edit, Trash2, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { CitaWizard } from './cita-wizard'
import { Database } from '@/types/supabase'

type EstadoCita = Database['public']['Enums']['estado_cita']

interface CitaConDetalles {
    id_cita: string
    fecha_hora: string
    estado_cita: EstadoCita | null
    observaciones: string | null
    org_id: string
    id_paciente: string
    id_servicio: string | null
    terapeuta_id: string | null
    paciente_nombre?: string
    servicio_nombre?: string
    terapeuta_nombre?: string
}

export default function CitasPage() {
    const { orgId, rol, loading: orgLoading, user } = useOrg()
    const [citas, setCitas] = useState<CitaConDetalles[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'todas' | 'hoy' | 'pendientes'>('hoy')
    const [wizardOpen, setWizardOpen] = useState(false)
    const [editingCita, setEditingCita] = useState<CitaConDetalles | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!orgLoading && orgId) {
            loadCitas()
        }
    }, [orgId, orgLoading, filter])

    const loadCitas = async () => {
        try {
            let query = supabase
                .from('citas')
                .select(`
          *,
          pacientes!inner (
            clientes!inner (nombres_completos)
          ),
          servicios (nombre_servicio),
          perfiles (nombre_completo)
        `)
                .eq('org_id', orgId)
                .order('fecha_hora', { ascending: true })

            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            if (filter === 'hoy') {
                query = query
                    .gte('fecha_hora', today.toISOString())
                    .lt('fecha_hora', tomorrow.toISOString())
            } else if (filter === 'pendientes') {
                query = query.in('estado_cita', ['pendiente', 'confirmada'])
            }

            // Si es terapeuta, solo sus citas
            if (rol === 'terapeuta' && user) {
                query = query.eq('terapeuta_id', user.id)
            }

            const { data, error } = await query.limit(100)

            if (error) {
                toast('Error al cargar citas: ' + error.message, 'error')
                return
            }

            const mapped = (data || []).map(c => ({
                id_cita: c.id_cita,
                fecha_hora: c.fecha_hora,
                estado_cita: c.estado_cita,
                observaciones: c.observaciones,
                org_id: c.org_id,
                id_paciente: c.id_paciente,
                id_servicio: c.id_servicio,
                terapeuta_id: c.terapeuta_id,
                paciente_nombre: (c.pacientes as any)?.clientes?.nombres_completos,
                servicio_nombre: (c.servicios as any)?.nombre_servicio,
                terapeuta_nombre: (c.perfiles as any)?.nombre_completo,
            }))

            setCitas(mapped)
        } catch (err) {
            toast('Error de conexión', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleChangeStatus = async (cita: CitaConDetalles, newStatus: EstadoCita) => {
        const { error } = await supabase
            .from('citas')
            .update({ estado_cita: newStatus })
            .eq('id_cita', cita.id_cita)

        if (error) {
            toast('Error al actualizar: ' + error.message, 'error')
            return
        }

        toast(`Cita ${newStatus}`, 'success')
        loadCitas()
    }

    const handleDelete = async (cita: CitaConDetalles) => {
        if (!confirm('¿Eliminar esta cita?')) return

        const { error } = await supabase
            .from('citas')
            .delete()
            .eq('id_cita', cita.id_cita)

        if (error) {
            toast('Error al eliminar: ' + error.message, 'error')
            return
        }

        toast('Cita eliminada', 'success')
        loadCitas()
    }

    const handleWizardClose = (refresh?: boolean) => {
        setWizardOpen(false)
        setEditingCita(null)
        if (refresh) loadCitas()
    }

    const canCreate = rol === 'admin' || rol === 'recepcion'
    const canEdit = rol === 'admin' || rol === 'recepcion'

    const estadoConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning'; icon: any }> = {
        pendiente: { variant: 'warning', icon: Clock },
        confirmada: { variant: 'default', icon: CheckCircle },
        realizada: { variant: 'success', icon: CheckCircle },
        cancelada: { variant: 'destructive', icon: XCircle },
        no_asistio: { variant: 'secondary', icon: AlertCircle },
    }

    if (loading || orgLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Calendar className="h-8 w-8" />
                        Citas
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona las citas de tus pacientes
                    </p>
                </div>
                {canCreate && (
                    <Button onClick={() => setWizardOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Cita
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['hoy', 'pendientes', 'todas'] as const).map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(f)}
                    >
                        {f === 'hoy' ? 'Hoy' : f === 'pendientes' ? 'Pendientes' : 'Todas'}
                    </Button>
                ))}
            </div>

            {/* Lista */}
            {citas.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No hay citas</h3>
                        <p className="text-muted-foreground mb-4">
                            {filter === 'hoy' ? 'No hay citas programadas para hoy' : 'No se encontraron citas'}
                        </p>
                        {canCreate && (
                            <Button onClick={() => setWizardOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Agendar Cita
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {citas.map((cita) => {
                        const config = estadoConfig[cita.estado_cita || 'pendiente']
                        const Icon = config.icon
                        return (
                            <Card key={cita.id_cita} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="text-center p-3 bg-primary/10 rounded-xl min-w-[80px]">
                                                <div className="text-sm font-medium text-muted-foreground">
                                                    {new Date(cita.fecha_hora).toLocaleDateString('es-PE', { weekday: 'short' })}
                                                </div>
                                                <div className="text-2xl font-bold">
                                                    {new Date(cita.fecha_hora).getDate()}
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {new Date(cita.fecha_hora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{cita.paciente_nombre || 'Paciente'}</h3>
                                                <p className="text-muted-foreground">
                                                    {cita.servicio_nombre || 'Consulta general'}
                                                </p>
                                                {cita.terapeuta_nombre && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Terapeuta: {cita.terapeuta_nombre}
                                                    </p>
                                                )}
                                                {cita.observaciones && (
                                                    <p className="text-sm text-muted-foreground mt-1 italic">
                                                        "{cita.observaciones}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant={config.variant} className="flex items-center gap-1">
                                                <Icon className="h-3 w-3" />
                                                {cita.estado_cita}
                                            </Badge>

                                            {/* Estado Actions */}
                                            {(canEdit || rol === 'terapeuta') && cita.estado_cita === 'pendiente' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleChangeStatus(cita, 'confirmada')}
                                                >
                                                    Confirmar
                                                </Button>
                                            )}
                                            {(canEdit || rol === 'terapeuta') && cita.estado_cita === 'confirmada' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() => handleChangeStatus(cita, 'realizada')}
                                                    >
                                                        Atendida
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleChangeStatus(cita, 'no_asistio')}
                                                    >
                                                        No asistió
                                                    </Button>
                                                </>
                                            )}

                                            {canEdit && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditingCita(cita)
                                                            setWizardOpen(true)
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cita)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Wizard */}
            <CitaWizard
                open={wizardOpen}
                onClose={handleWizardClose}
                cita={editingCita as any}
                orgId={orgId}
            />
        </div>
    )
}
