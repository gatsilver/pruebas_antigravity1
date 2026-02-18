'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/org-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { Plus, Search, UserCog, Loader2, Edit, Eye } from 'lucide-react'
import { PacienteModal } from './paciente-modal'
import { Database } from '@/types/supabase'

type EstadoTratamiento = Database['public']['Enums']['estado_tratamiento']

interface PacienteConCliente {
    id_paciente: string
    estado_tratamiento: EstadoTratamiento | null
    tipo_atencion: string | null
    fecha_inicio_atencion: string | null
    org_id: string
    id_cliente: string
    cliente_nombre: string
}

export default function PacientesPage() {
    const { orgId, rol, user, loading: orgLoading } = useOrg()
    const [pacientes, setPacientes] = useState<PacienteConCliente[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [assignModalOpen, setAssignModalOpen] = useState(false)
    const [editingPaciente, setEditingPaciente] = useState<PacienteConCliente | null>(null)
    const [selectedPaciente, setSelectedPaciente] = useState<PacienteConCliente | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!orgLoading && orgId) {
            loadPacientes()
        }
    }, [orgId, orgLoading, search])

    const loadPacientes = async () => {
        try {
            let query = supabase
                .from('pacientes')
                .select(`
          *,
          clientes!inner (nombres_completos)
        `)
                .eq('org_id', orgId)
                .order('created_at', { ascending: false })

            // Si es terapeuta, solo sus pacientes asignados
            if (rol === 'terapeuta' && user) {
                const { data: asignaciones } = await supabase
                    .from('pacientes_terapeutas')
                    .select('id_paciente')
                    .eq('terapeuta_id', user.id)
                    .eq('activo', true)

                if (asignaciones) {
                    const ids = asignaciones.map(a => a.id_paciente)
                    query = query.in('id_paciente', ids)
                }
            }

            if (search) {
                query = query.ilike('clientes.nombres_completos', `%${search}%`)
            }

            const { data, error } = await query.limit(50)

            if (error) {
                toast('Error al cargar pacientes', 'error')
                return
            }

            const mapped = (data || []).map(p => ({
                id_paciente: p.id_paciente,
                estado_tratamiento: p.estado_tratamiento,
                tipo_atencion: p.tipo_atencion,
                fecha_inicio_atencion: p.fecha_inicio_atencion,
                org_id: p.org_id,
                id_cliente: p.id_cliente,
                cliente_nombre: (p.clientes as any)?.nombres_completos || 'Sin nombre',
            }))

            setPacientes(mapped)
        } catch (err) {
            toast('Error de conexión', 'error')
        } finally {
            setLoading(false)
        }
    }

    const estadoVariant = (estado: string | null) => {
        const map: Record<string, 'success' | 'warning' | 'secondary' | 'destructive'> = {
            activo: 'success',
            en_espera: 'warning',
            alta: 'secondary',
            abandono: 'destructive',
        }
        return map[estado || ''] || 'secondary'
    }

    const canEdit = rol === 'admin' || rol === 'recepcion'

    if (loading || orgLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <UserCog className="h-8 w-8" />
                        Pacientes
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {pacientes.length} paciente{pacientes.length !== 1 ? 's' : ''}
                    </p>
                </div>
                {canEdit && (
                    <Button onClick={() => setModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Paciente
                    </Button>
                )}
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar paciente..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {pacientes.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No hay pacientes</h3>
                        {canEdit && (
                            <Button onClick={() => setModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Registrar Paciente
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {pacientes.map((paciente) => (
                        <Card key={paciente.id_paciente} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-xl">🧑‍⚕️</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{paciente.cliente_nombre}</h3>
                                            <div className="flex gap-2 text-sm text-muted-foreground">
                                                {paciente.tipo_atencion && <span>{paciente.tipo_atencion}</span>}
                                                {paciente.fecha_inicio_atencion && (
                                                    <span>• Desde {new Date(paciente.fecha_inicio_atencion).toLocaleDateString('es-PE')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={estadoVariant(paciente.estado_tratamiento)}>
                                            {paciente.estado_tratamiento || 'activo'}
                                        </Badge>
                                        {canEdit && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Asignar Terapeuta"
                                                    onClick={() => {
                                                        setSelectedPaciente(paciente)
                                                        setAssignModalOpen(true)
                                                    }}
                                                >
                                                    <UserCog className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingPaciente(paciente)
                                                        setModalOpen(true)
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <PacienteModal
                open={modalOpen}
                onClose={(refresh) => {
                    setModalOpen(false)
                    setEditingPaciente(null)
                    if (refresh) loadPacientes()
                }}
                paciente={editingPaciente}
                orgId={orgId}
            />

            <AsignarTerapeutaModal
                open={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                paciente={selectedPaciente}
                orgId={orgId}
            />
        </div >
    )
}

function AsignarTerapeutaModal({ open, onClose, paciente, orgId }: {
    open: boolean
    onClose: () => void
    paciente: PacienteConCliente | null
    orgId: string
}) {
    const [loading, setLoading] = useState(false)
    const [terapeutas, setTerapeutas] = useState<{ id: string, nombre: string }[]>([])
    const [asignados, setAsignados] = useState<string[]>([])
    const supabase = createClient()

    useEffect(() => {
        if (open && paciente) {
            loadData()
        }
    }, [open, paciente])

    const loadData = async () => {
        setLoading(true)
        // Cargar Terapeutas
        const { data: staff } = await supabase
            .from('membresias')
            .select('user_id, perfiles(nombre_completo)')
            .eq('org_id', orgId)
            .eq('rol_en_org', 'terapeuta')
            .eq('activo', true)

        if (staff) {
            setTerapeutas(staff.map(s => ({
                id: s.user_id,
                nombre: (s.perfiles as any)?.nombre_completo || 'Sin nombre'
            })))
        }

        // Cargar Asignaciones Actuales
        if (paciente) {
            const { data: current } = await supabase
                .from('pacientes_terapeutas')
                .select('terapeuta_id')
                .eq('org_id', orgId)
                .eq('id_paciente', paciente.id_paciente)
                .eq('activo', true)

            if (current) {
                setAsignados(current.map(c => c.terapeuta_id))
            } else {
                setAsignados([])
            }
        }
        setLoading(false)
    }

    const toggleTerapeuta = (id: string) => {
        setAsignados(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const handleSave = async () => {
        if (!paciente) return
        setLoading(true)

        try {
            // 1. Desactivar todos los actuales
            await supabase
                .from('pacientes_terapeutas')
                .delete() // O update activo=false si prefires soft-delete, pero delete es más limpio para MVP
                .eq('org_id', orgId)
                .eq('id_paciente', paciente.id_paciente)

            // 2. Insertar nuevos
            if (asignados.length > 0) {
                const inserts = asignados.map(lid => ({
                    org_id: orgId,
                    id_paciente: paciente.id_paciente,
                    terapeuta_id: lid,
                    activo: true
                }))
                const { error } = await supabase.from('pacientes_terapeutas').insert(inserts)
                if (error) throw error
            }

            toast('Asignaciones actualizadas', 'success')
            onClose()
        } catch (err) {
            console.error(err)
            toast('Error al guardar asignaciones', 'error')
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">Asignar Terapeutas</h2>
                    <button onClick={onClose}><X className="h-5 w-5" /></button>
                </div>
                <div className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">
                        Selecciona los terapeutas que atenderán a <strong>{paciente?.cliente_nombre}</strong>.
                    </p>

                    {loading && terapeutas.length === 0 ? (
                        <div className="flex justify-center py-4"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                            {terapeutas.length === 0 && <p className="text-sm text-center py-2">No hay terapeutas registrados.</p>}
                            {terapeutas.map(t => (
                                <div key={t.id} className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer" onClick={() => toggleTerapeuta(t.id)}>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${asignados.includes(t.id) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                                        {asignados.includes(t.id) && <span className="text-xs text-white">✓</span>}
                                    </div>
                                    <span className="text-sm">{t.nombre}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6">
                        <Button variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
