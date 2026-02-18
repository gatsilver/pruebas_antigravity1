'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/org-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { formatCurrency } from '@/lib/utils'
import { Plus, Stethoscope, Loader2, Edit, Trash2, X } from 'lucide-react'
import { Database } from '@/types/supabase'

type Servicio = Database['public']['Tables']['servicios']['Row']

export default function ServiciosPage() {
    const { orgId, rol, loading: orgLoading } = useOrg()
    const [servicios, setServicios] = useState<Servicio[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<Servicio | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!orgLoading && orgId) loadServicios()
    }, [orgId, orgLoading])

    const loadServicios = async () => {
        const { data, error } = await supabase
            .from('servicios')
            .select('*')
            .eq('org_id', orgId)
            .order('nombre_servicio')

        if (error) {
            toast('Error al cargar servicios', 'error')
        } else {
            setServicios(data || [])
        }
        setLoading(false)
    }

    const handleDelete = async (servicio: Servicio) => {
        if (!confirm(`¿Eliminar ${servicio.nombre_servicio}?`)) return

        const { error } = await supabase
            .from('servicios')
            .delete()
            .eq('id_servicio', servicio.id_servicio)

        if (error) {
            toast('Error al eliminar', 'error')
        } else {
            toast('Servicio eliminado', 'success')
            loadServicios()
        }
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
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Stethoscope className="h-8 w-8" />
                        Servicios
                    </h1>
                    <p className="text-muted-foreground mt-1">{servicios.length} servicios</p>
                </div>
                {canEdit && (
                    <Button onClick={() => setModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Servicio
                    </Button>
                )}
            </div>

            {servicios.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No hay servicios</h3>
                        {canEdit && (
                            <Button onClick={() => setModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Servicio
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {servicios.map((servicio) => (
                        <Card key={servicio.id_servicio} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{servicio.nombre_servicio}</h3>
                                        {servicio.descripcion && (
                                            <p className="text-sm text-muted-foreground mt-1">{servicio.descripcion}</p>
                                        )}
                                        <div className="flex gap-2 mt-2">
                                            {servicio.duracion_min && (
                                                <Badge variant="secondary">{servicio.duracion_min} min</Badge>
                                            )}
                                            {servicio.precio_unitario && (
                                                <Badge variant="outline">{formatCurrency(servicio.precio_unitario)}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    {canEdit && (
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditing(servicio); setModalOpen(true) }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(servicio)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            <ServicioModal
                open={modalOpen}
                onClose={(refresh) => {
                    setModalOpen(false)
                    setEditing(null)
                    if (refresh) loadServicios()
                }}
                servicio={editing}
                orgId={orgId}
            />
        </div>
    )
}

function ServicioModal({ open, onClose, servicio, orgId }: {
    open: boolean
    onClose: (refresh?: boolean) => void
    servicio: Servicio | null
    orgId: string
}) {
    const [loading, setLoading] = useState(false)
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [duracion, setDuracion] = useState('')
    const [precio, setPrecio] = useState('')
    const supabase = createClient()
    const isEdit = !!servicio

    useEffect(() => {
        if (servicio) {
            setNombre(servicio.nombre_servicio)
            setDescripcion(servicio.descripcion || '')
            setDuracion(servicio.duracion_min?.toString() || '')
            setPrecio(servicio.precio_unitario?.toString() || '')
        } else {
            setNombre('')
            setDescripcion('')
            setDuracion('')
            setPrecio('')
        }
    }, [servicio, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) {
            toast('El nombre es requerido', 'error')
            return
        }
        setLoading(true)

        const data = {
            nombre_servicio: nombre,
            descripcion: descripcion || null,
            duracion_min: duracion ? parseInt(duracion) : null,
            precio_unitario: precio ? parseFloat(precio) : null,
            estado: true,
        }

        try {
            if (isEdit) {
                const { error } = await supabase.from('servicios').update(data).eq('id_servicio', servicio.id_servicio)
                if (error) throw error
                toast('Servicio actualizado', 'success')
            } else {
                const { error } = await supabase.from('servicios').insert({ ...data, org_id: orgId })
                if (error) throw error
                toast('Servicio creado', 'success')
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
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">{isEdit ? 'Editar' : 'Nuevo'} Servicio</h2>
                    <button onClick={() => onClose()}><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <Label>Nombre *</Label>
                        <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Masaje terapéutico" required />
                    </div>
                    <div>
                        <Label>Descripción</Label>
                        <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción del servicio" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Duración (min)</Label>
                            <Input type="number" value={duracion} onChange={(e) => setDuracion(e.target.value)} placeholder="60" />
                        </div>
                        <div>
                            <Label>Precio (S/.)</Label>
                            <Input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="100.00" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onClose()}>Cancelar</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
