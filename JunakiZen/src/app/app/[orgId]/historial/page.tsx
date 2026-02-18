'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/org-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/toaster'
import { Plus, FileText, Loader2, Edit, X, Search } from 'lucide-react'
import { Database } from '@/types/supabase'

interface HistorialConPaciente {
    id_historial: string
    fecha_sesion: string | null
    motivo_consulta: string | null
    notas_evolucion: string | null
    observaciones: string | null
    id_paciente: string
    paciente_nombre: string
}

export default function HistorialPage() {
    const { orgId, rol, user, loading: orgLoading } = useOrg()
    const [registros, setRegistros] = useState<HistorialConPaciente[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<HistorialConPaciente | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!orgLoading && orgId) loadHistorial()
    }, [orgId, orgLoading, search])

    const loadHistorial = async () => {
        try {
            let query = supabase
                .from('historial_paciente')
                .select(`
          *,
          pacientes!inner (
            id_paciente,
            clientes!inner (nombres_completos)
          )
        `)
                .eq('org_id', orgId)
                .order('fecha_sesion', { ascending: false })

            const { data, error } = await query.limit(50)

            if (error) throw error

            const mapped = (data || []).map(h => ({
                id_historial: h.id_historial,
                fecha_sesion: h.fecha_sesion,
                motivo_consulta: h.motivo_consulta,
                notas_evolucion: h.notas_evolucion,
                observaciones: h.observaciones,
                id_paciente: h.id_paciente,
                paciente_nombre: (h.pacientes as any)?.clientes?.nombres_completos || 'Paciente',
            }))

            setRegistros(search
                ? mapped.filter(r => r.paciente_nombre.toLowerCase().includes(search.toLowerCase()))
                : mapped
            )
        } catch (err) {
            toast('Error al cargar historial', 'error')
        } finally {
            setLoading(false)
        }
    }

    const canEdit = rol === 'admin' || rol === 'terapeuta'

    if (loading || orgLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FileText className="h-8 w-8" />
                        Historial Clínico
                    </h1>
                    <p className="text-muted-foreground mt-1">{registros.length} registros</p>
                </div>
                {canEdit && (
                    <Button onClick={() => setModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Evolución
                    </Button>
                )}
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por paciente..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {registros.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">Sin registros</h3>
                        {canEdit && (
                            <Button onClick={() => setModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Crear Registro
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {registros.map((registro) => (
                        <Card key={registro.id_historial} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold">{registro.paciente_nombre}</h3>
                                            {registro.fecha_sesion && (
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(registro.fecha_sesion).toLocaleDateString('es-PE')}
                                                </span>
                                            )}
                                        </div>
                                        {registro.motivo_consulta && (
                                            <p className="text-sm"><strong>Motivo:</strong> {registro.motivo_consulta}</p>
                                        )}
                                        {registro.notas_evolucion && (
                                            <p className="text-sm mt-1"><strong>Evolución:</strong> {registro.notas_evolucion}</p>
                                        )}
                                        {registro.observaciones && (
                                            <p className="text-sm text-muted-foreground mt-1 italic">{registro.observaciones}</p>
                                        )}
                                    </div>
                                    {canEdit && (
                                        <Button variant="ghost" size="icon" onClick={() => { setEditing(registro); setModalOpen(true) }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <HistorialModal
                open={modalOpen}
                onClose={(refresh) => { setModalOpen(false); setEditing(null); if (refresh) loadHistorial() }}
                registro={editing}
                orgId={orgId}
            />
        </div>
    )
}

function HistorialModal({ open, onClose, registro, orgId }: {
    open: boolean
    onClose: (refresh?: boolean) => void
    registro: HistorialConPaciente | null
    orgId: string
}) {
    const [loading, setLoading] = useState(false)
    const [pacientes, setPacientes] = useState<{ id_paciente: string; nombre: string }[]>([])
    const [selectedPaciente, setSelectedPaciente] = useState('')
    const [fecha, setFecha] = useState('')
    const [motivo, setMotivo] = useState('')
    const [evolucion, setEvolucion] = useState('')
    const [observaciones, setObservaciones] = useState('')
    const supabase = createClient()
    const isEdit = !!registro

    useEffect(() => {
        if (open) {
            loadPacientes()
            if (registro) {
                setSelectedPaciente(registro.id_paciente)
                setFecha(registro.fecha_sesion?.split('T')[0] || '')
                setMotivo(registro.motivo_consulta || '')
                setEvolucion(registro.notas_evolucion || '')
                setObservaciones(registro.observaciones || '')
            } else {
                setSelectedPaciente(''); setFecha(new Date().toISOString().split('T')[0]); setMotivo(''); setEvolucion(''); setObservaciones('')
            }
        }
    }, [open, registro])

    const loadPacientes = async () => {
        const { data } = await supabase
            .from('pacientes')
            .select('id_paciente, clientes!inner(nombres_completos)')
            .eq('org_id', orgId)
            .eq('estado_tratamiento', 'activo')

        if (data) {
            setPacientes(data.map(p => ({
                id_paciente: p.id_paciente,
                nombre: (p.clientes as any)?.nombres_completos || 'Paciente',
            })))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedPaciente) { toast('Selecciona un paciente', 'error'); return }
        setLoading(true)

        const data = {
            id_paciente: selectedPaciente,
            fecha_sesion: fecha || null,
            motivo_consulta: motivo || null,
            notas_evolucion: evolucion || null,
            observaciones: observaciones || null,
        }

        try {
            if (isEdit) {
                const { error } = await supabase.from('historial_paciente').update(data).eq('id_historial', registro.id_historial)
                if (error) throw error
                toast('Registro actualizado', 'success')
            } else {
                const { error } = await supabase.from('historial_paciente').insert({ ...data, org_id: orgId })
                if (error) throw error
                toast('Registro creado', 'success')
            }
            onClose(true)
        } catch (err: any) {
            toast(err.message || 'Error', 'error')
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">{isEdit ? 'Editar' : 'Nueva'} Evolución</h2>
                    <button onClick={() => onClose()}><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Paciente *</Label>
                            <select
                                value={selectedPaciente}
                                onChange={(e) => setSelectedPaciente(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                disabled={isEdit}
                            >
                                <option value="">Seleccionar...</option>
                                {pacientes.map(p => (
                                    <option key={p.id_paciente} value={p.id_paciente}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Fecha de Sesión</Label>
                            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label>Motivo de Consulta</Label>
                        <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Dolor lumbar crónico" />
                    </div>
                    <div>
                        <Label>Notas de Evolución</Label>
                        <textarea
                            value={evolucion}
                            onChange={(e) => setEvolucion(e.target.value)}
                            placeholder="Descripción detallada de la sesión..."
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <Label>Observaciones</Label>
                        <Input value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Notas adicionales" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onClose()}>Cancelar</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
