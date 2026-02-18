'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { toast } from '@/components/ui/toaster'
import { Loader2, X, ChevronLeft, ChevronRight, User, Stethoscope, Calendar } from 'lucide-react'
import { Database } from '@/types/supabase'

type Paciente = { id_paciente: string; nombre: string }
type Servicio = Database['public']['Tables']['servicios']['Row']
type Terapeuta = { id: string; nombre_completo: string | null }

interface CitaWizardProps {
    open: boolean
    onClose: (refresh?: boolean) => void
    cita: any | null
    orgId: string
}

export function CitaWizard({ open, onClose, cita, orgId }: CitaWizardProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)

    // Data
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [servicios, setServicios] = useState<Servicio[]>([])
    const [terapeutas, setTerapeutas] = useState<Terapeuta[]>([])

    // Form
    const [selectedPaciente, setSelectedPaciente] = useState('')
    const [selectedServicio, setSelectedServicio] = useState('')
    const [selectedTerapeuta, setSelectedTerapeuta] = useState('')
    const [fechaHora, setFechaHora] = useState('')
    const [observaciones, setObservaciones] = useState('')

    const supabase = createClient()
    const isEdit = !!cita

    useEffect(() => {
        if (open) {
            loadData()
            if (cita) {
                setSelectedPaciente(cita.id_paciente)
                setSelectedServicio(cita.id_servicio || '')
                setSelectedTerapeuta(cita.terapeuta_id || '')
                setFechaHora(cita.fecha_hora?.slice(0, 16) || '')
                setObservaciones(cita.observaciones || '')
                setStep(3) // Ir directo al último paso en edición
            } else {
                resetForm()
            }
        }
    }, [open, cita])

    const resetForm = () => {
        setStep(1)
        setSelectedPaciente('')
        setSelectedServicio('')
        setSelectedTerapeuta('')
        setFechaHora('')
        setObservaciones('')
    }

    const loadData = async () => {
        setLoadingData(true)
        try {
            // Cargar pacientes con nombre de cliente
            const { data: pacientesData } = await supabase
                .from('pacientes')
                .select(`
          id_paciente,
          clientes!inner (nombres_completos)
        `)
                .eq('org_id', orgId)
                .eq('estado_tratamiento', 'activo')

            if (pacientesData) {
                setPacientes(pacientesData.map(p => ({
                    id_paciente: p.id_paciente,
                    nombre: (p.clientes as any)?.nombres_completos || 'Sin nombre',
                })))
            }

            // Cargar servicios
            const { data: serviciosData } = await supabase
                .from('servicios')
                .select('*')
                .eq('org_id', orgId)
                .eq('estado', true)

            if (serviciosData) {
                setServicios(serviciosData)
            }

            // Cargar terapeutas (usuarios con rol terapeuta en la org)
            const { data: membresiasData } = await supabase
                .from('membresias')
                .select(`
          user_id,
          perfiles!inner (id, nombre_completo)
        `)
                .eq('org_id', orgId)
                .eq('rol_en_org', 'terapeuta')
                .eq('activo', true)

            if (membresiasData) {
                setTerapeutas(membresiasData.map(m => ({
                    id: m.user_id,
                    nombre_completo: (m.perfiles as any)?.nombre_completo,
                })))
            }
        } catch (err) {
            console.error('Error loading data:', err)
        } finally {
            setLoadingData(false)
        }
    }

    const handleSubmit = async () => {
        setLoading(true)

        try {
            if (!selectedPaciente || !fechaHora) {
                toast('Paciente y fecha son requeridos', 'error')
                return
            }

            const citaData = {
                org_id: orgId,
                id_paciente: selectedPaciente,
                id_servicio: selectedServicio || null,
                terapeuta_id: selectedTerapeuta || null,
                fecha_hora: new Date(fechaHora).toISOString(),
                observaciones: observaciones || null,
                estado_cita: 'pendiente' as const,
            }

            if (isEdit) {
                const { error } = await supabase
                    .from('citas')
                    .update(citaData)
                    .eq('id_cita', cita.id_cita)

                if (error) throw error
                toast('Cita actualizada', 'success')
            } else {
                const { error } = await supabase
                    .from('citas')
                    .insert(citaData)

                if (error) throw error
                toast('Cita creada', 'success')
            }

            onClose(true)
        } catch (err: any) {
            toast(err.message || 'Error al guardar', 'error')
        } finally {
            setLoading(false)
        }
    }

    const canNext = () => {
        if (step === 1) return !!selectedPaciente
        if (step === 2) return true // Servicio es opcional
        if (step === 3) return !!fechaHora
        return false
    }

    if (!open) return null

    const steps = [
        { num: 1, title: 'Paciente', icon: User },
        { num: 2, title: 'Servicio', icon: Stethoscope },
        { num: 3, title: 'Fecha y Hora', icon: Calendar },
    ]

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {isEdit ? 'Editar Cita' : 'Nueva Cita'}
                    </h2>
                    <button onClick={() => onClose()} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Steps Indicator */}
                <div className="px-6 pt-4">
                    <div className="flex items-center justify-between">
                        {steps.map((s, i) => (
                            <div key={s.num} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    <s.icon className="h-5 w-5" />
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`w-12 h-1 mx-2 ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        {steps.map(s => (
                            <span key={s.num} className={step === s.num ? 'text-primary font-medium' : ''}>
                                {s.title}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 min-h-[200px]">
                    {loadingData ? (
                        <div className="flex items-center justify-center h-32">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Paciente */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <Label>Selecciona un paciente</Label>
                                    {pacientes.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-8">
                                            No hay pacientes registrados
                                        </p>
                                    ) : (
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                            {pacientes.map(p => (
                                                <button
                                                    key={p.id_paciente}
                                                    onClick={() => setSelectedPaciente(p.id_paciente)}
                                                    className={`w-full p-3 rounded-lg text-left transition-colors ${selectedPaciente === p.id_paciente
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted hover:bg-muted/80'
                                                        }`}
                                                >
                                                    <span className="font-medium">{p.nombre}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Servicio */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <Label>Selecciona un servicio (opcional)</Label>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                        <button
                                            onClick={() => setSelectedServicio('')}
                                            className={`w-full p-3 rounded-lg text-left transition-colors ${!selectedServicio ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                                                }`}
                                        >
                                            <span className="font-medium">Consulta General</span>
                                        </button>
                                        {servicios.map(s => (
                                            <button
                                                key={s.id_servicio}
                                                onClick={() => setSelectedServicio(s.id_servicio)}
                                                className={`w-full p-3 rounded-lg text-left transition-colors ${selectedServicio === s.id_servicio
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted hover:bg-muted/80'
                                                    }`}
                                            >
                                                <span className="font-medium">{s.nombre_servicio}</span>
                                                {s.duracion_min && (
                                                    <span className="text-sm opacity-70 ml-2">({s.duracion_min} min)</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Fecha, Hora, Terapeuta */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="fechaHora">Fecha y Hora *</Label>
                                        <Input
                                            id="fechaHora"
                                            type="datetime-local"
                                            value={fechaHora}
                                            onChange={(e) => setFechaHora(e.target.value)}
                                            min={new Date().toISOString().slice(0, 16)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="terapeuta">Terapeuta (opcional)</Label>
                                        <Select
                                            id="terapeuta"
                                            value={selectedTerapeuta}
                                            onChange={(e) => setSelectedTerapeuta(e.target.value)}
                                            options={[
                                                { value: '', label: 'Sin asignar' },
                                                ...terapeutas.map(t => ({
                                                    value: t.id,
                                                    label: t.nombre_completo || 'Terapeuta',
                                                })),
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="observaciones">Observaciones</Label>
                                        <Input
                                            id="observaciones"
                                            value={observaciones}
                                            onChange={(e) => setObservaciones(e.target.value)}
                                            placeholder="Notas adicionales..."
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between p-6 border-t">
                    <Button
                        variant="outline"
                        onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                        disabled={loading}
                    >
                        {step > 1 ? (
                            <>
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Anterior
                            </>
                        ) : (
                            'Cancelar'
                        )}
                    </Button>

                    {step < 3 ? (
                        <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
                            Siguiente
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading || !canNext()}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : isEdit ? (
                                'Actualizar Cita'
                            ) : (
                                'Crear Cita'
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
