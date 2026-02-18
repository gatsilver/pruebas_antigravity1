'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { toast } from '@/components/ui/toaster'
import { Loader2, X } from 'lucide-react'
import { Database } from '@/types/supabase'

type EstadoTratamiento = Database['public']['Enums']['estado_tratamiento']
type Cliente = { id_cliente: string; nombres_completos: string }

interface PacienteModalProps {
    open: boolean
    onClose: (refresh?: boolean) => void
    paciente: any | null
    orgId: string
}

export function PacienteModal({ open, onClose, paciente, orgId }: PacienteModalProps) {
    const [loading, setLoading] = useState(false)
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [selectedCliente, setSelectedCliente] = useState('')
    const [tipoAtencion, setTipoAtencion] = useState('')
    const [estado, setEstado] = useState<EstadoTratamiento>('activo')
    const supabase = createClient()
    const isEdit = !!paciente

    useEffect(() => {
        if (open) {
            loadClientes()
            if (paciente) {
                setSelectedCliente(paciente.id_cliente)
                setTipoAtencion(paciente.tipo_atencion || '')
                setEstado(paciente.estado_tratamiento || 'activo')
            } else {
                setSelectedCliente('')
                setTipoAtencion('')
                setEstado('activo')
            }
        }
    }, [open, paciente])

    const loadClientes = async () => {
        const { data } = await supabase
            .from('clientes')
            .select('id_cliente, nombres_completos')
            .eq('org_id', orgId)
            .eq('estado', true)
            .order('nombres_completos')

        if (data) setClientes(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!selectedCliente) {
                toast('Selecciona un cliente', 'error')
                return
            }

            if (isEdit) {
                const { error } = await supabase
                    .from('pacientes')
                    .update({
                        tipo_atencion: tipoAtencion || null,
                        estado_tratamiento: estado,
                    })
                    .eq('id_paciente', paciente.id_paciente)

                if (error) throw error
                toast('Paciente actualizado', 'success')
            } else {
                const { error } = await supabase
                    .from('pacientes')
                    .insert({
                        org_id: orgId,
                        id_cliente: selectedCliente,
                        tipo_atencion: tipoAtencion || null,
                        estado_tratamiento: estado,
                        fecha_inicio_atencion: new Date().toISOString().split('T')[0],
                    })

                if (error) throw error
                toast('Paciente registrado', 'success')
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
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {isEdit ? 'Editar Paciente' : 'Nuevo Paciente'}
                    </h2>
                    <button onClick={() => onClose()}>
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <Label>Cliente *</Label>
                        <Select
                            value={selectedCliente}
                            onChange={(e) => setSelectedCliente(e.target.value)}
                            options={clientes.map(c => ({
                                value: c.id_cliente,
                                label: c.nombres_completos,
                            }))}
                            placeholder="Seleccionar cliente"
                            disabled={isEdit}
                        />
                    </div>

                    <div>
                        <Label>Tipo de Atención</Label>
                        <Select
                            value={tipoAtencion}
                            onChange={(e) => setTipoAtencion(e.target.value)}
                            options={[
                                { value: '', label: 'General' },
                                { value: 'terapia_individual', label: 'Terapia Individual' },
                                { value: 'terapia_grupal', label: 'Terapia Grupal' },
                                { value: 'seguimiento', label: 'Seguimiento' },
                            ]}
                        />
                    </div>

                    <div>
                        <Label>Estado</Label>
                        <Select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value as EstadoTratamiento)}
                            options={[
                                { value: 'activo', label: 'Activo' },
                                { value: 'en_espera', label: 'En Espera' },
                                { value: 'alta', label: 'Alta' },
                                { value: 'abandono', label: 'Abandono' },
                            ]}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Actualizar' : 'Registrar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
