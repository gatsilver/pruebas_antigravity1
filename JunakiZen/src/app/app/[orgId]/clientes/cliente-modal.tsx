'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toaster'
import { Loader2, X } from 'lucide-react'
import { Database } from '@/types/supabase'

type Cliente = Database['public']['Tables']['clientes']['Row']
type ClienteInsert = Database['public']['Tables']['clientes']['Insert']

interface ClienteModalProps {
    open: boolean
    onClose: (refresh?: boolean) => void
    cliente: Cliente | null
    orgId: string
}

export function ClienteModal({ open, onClose, cliente, orgId }: ClienteModalProps) {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<Partial<ClienteInsert>>({})
    const supabase = createClient()
    const isEdit = !!cliente

    useEffect(() => {
        if (cliente) {
            setForm({
                nombres_completos: cliente.nombres_completos,
                dni: cliente.dni || '',
                correo: cliente.correo || '',
                telefono: cliente.telefono || '',
                fecha_nacimiento: cliente.fecha_nacimiento || '',
                direccion: cliente.direccion || '',
                pais: cliente.pais || 'Peru',
                provincia: cliente.provincia || '',
                distrito: cliente.distrito || '',
                estado: cliente.estado ?? true,
            })
        } else {
            setForm({
                nombres_completos: '',
                dni: '',
                correo: '',
                telefono: '',
                fecha_nacimiento: '',
                direccion: '',
                pais: 'Peru',
                provincia: '',
                distrito: '',
                estado: true,
            })
        }
    }, [cliente, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!form.nombres_completos?.trim()) {
                toast('El nombre es requerido', 'error')
                return
            }

            if (isEdit) {
                const { error } = await supabase
                    .from('clientes')
                    .update({
                        nombres_completos: form.nombres_completos,
                        dni: form.dni || null,
                        correo: form.correo || null,
                        telefono: form.telefono || null,
                        fecha_nacimiento: form.fecha_nacimiento || null,
                        direccion: form.direccion || null,
                        pais: form.pais || null,
                        provincia: form.provincia || null,
                        distrito: form.distrito || null,
                        estado: form.estado,
                    })
                    .eq('id_cliente', cliente.id_cliente)

                if (error) throw error
                toast('Cliente actualizado', 'success')
            } else {
                const { error } = await supabase
                    .from('clientes')
                    .insert({
                        org_id: orgId,
                        nombres_completos: form.nombres_completos!,
                        dni: form.dni || null,
                        correo: form.correo || null,
                        telefono: form.telefono || null,
                        fecha_nacimiento: form.fecha_nacimiento || null,
                        direccion: form.direccion || null,
                        pais: form.pais || null,
                        provincia: form.provincia || null,
                        distrito: form.distrito || null,
                        estado: form.estado ?? true,
                    })

                if (error) throw error
                toast('Cliente creado', 'success')
            }

            onClose(true)
        } catch (err: any) {
            toast(err.message || 'Error al guardar', 'error')
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h2>
                    <button onClick={() => onClose()} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label htmlFor="nombres_completos">Nombre Completo *</Label>
                            <Input
                                id="nombres_completos"
                                value={form.nombres_completos || ''}
                                onChange={(e) => setForm({ ...form, nombres_completos: e.target.value })}
                                placeholder="Juan Pérez García"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="dni">DNI</Label>
                            <Input
                                id="dni"
                                value={form.dni || ''}
                                onChange={(e) => setForm({ ...form, dni: e.target.value })}
                                placeholder="12345678"
                            />
                        </div>

                        <div>
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input
                                id="telefono"
                                value={form.telefono || ''}
                                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                                placeholder="999 888 777"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <Label htmlFor="correo">Correo Electrónico</Label>
                            <Input
                                id="correo"
                                type="email"
                                value={form.correo || ''}
                                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                                placeholder="correo@ejemplo.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                            <Input
                                id="fecha_nacimiento"
                                type="date"
                                value={form.fecha_nacimiento || ''}
                                onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="pais">País</Label>
                            <Input
                                id="pais"
                                value={form.pais || ''}
                                onChange={(e) => setForm({ ...form, pais: e.target.value })}
                                placeholder="Peru"
                            />
                        </div>

                        <div>
                            <Label htmlFor="provincia">Provincia</Label>
                            <Input
                                id="provincia"
                                value={form.provincia || ''}
                                onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                                placeholder="Lima"
                            />
                        </div>

                        <div>
                            <Label htmlFor="distrito">Distrito</Label>
                            <Input
                                id="distrito"
                                value={form.distrito || ''}
                                onChange={(e) => setForm({ ...form, distrito: e.target.value })}
                                placeholder="Miraflores"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <Label htmlFor="direccion">Dirección</Label>
                            <Input
                                id="direccion"
                                value={form.direccion || ''}
                                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                                placeholder="Av. Principal 123"
                            />
                        </div>

                        <div className="sm:col-span-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="estado"
                                checked={form.estado ?? true}
                                onChange={(e) => setForm({ ...form, estado: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="estado">Cliente activo</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : isEdit ? (
                                'Actualizar'
                            ) : (
                                'Crear Cliente'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
