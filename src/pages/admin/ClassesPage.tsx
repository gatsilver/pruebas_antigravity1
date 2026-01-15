import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Plus, Search, Loader2, Calendar, Trash2, Pencil, UserPlus, X } from 'lucide-react'
import type { Database } from '../../types/supabase'
import { startOfWeek, addDays, format, nextDay, getDay } from 'date-fns'

type Class = Database['public']['Tables']['classes']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function ClassesPage() {
    const [classes, setClasses] = useState<Class[]>([])
    const [members, setMembers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)

    // Modal States
    const [isClassModalOpen, setIsClassModalOpen] = useState(false)
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)

    // Form States
    const [editingClass, setEditingClass] = useState<Partial<Class>>({
        name: '', instructor: '', day_of_week: 1, start_time: '10:00', end_time: '11:00', max_capacity: 10
    })
    const [enrollData, setEnrollData] = useState({ classId: '', userId: '', date: '' })

    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        const [classesRes, membersRes] = await Promise.all([
            supabase.from('classes').select('*').order('day_of_week', { ascending: true }).order('start_time', { ascending: true }),
            supabase.from('profiles').select('*').order('full_name', { ascending: true })
        ])

        if (classesRes.error) console.error(classesRes.error)
        if (membersRes.error) console.error(membersRes.error)

        setClasses(classesRes.data || [])
        setMembers(membersRes.data || [])
        setLoading(false)
    }

    // --- Class Management (Create/Edit) ---

    const openCreateModal = () => {
        setEditingClass({
            name: '', instructor: '', day_of_week: 1, start_time: '10:00', end_time: '11:00', max_capacity: 10
        })
        setIsClassModalOpen(true)
    }

    const openEditModal = (cls: Class) => {
        setEditingClass(cls)
        setIsClassModalOpen(true)
    }

    const handleSaveClass = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (editingClass.id) {
                // Update
                const { error } = await supabase.from('classes').update(editingClass).eq('id', editingClass.id)
                if (error) throw error
            } else {
                // Create
                const { error } = await supabase.from('classes').insert([editingClass as any])
                if (error) throw error
            }
            fetchData()
            setIsClassModalOpen(false)
        } catch (err: any) {
            alert('Error al guardar clase: ' + err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteClass = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta clase? Esto no afectará las reservas pasadas pero impedirá nuevas.')) return
        // Soft delete (deactivate) or hard delete? User asked to "delete". 
        // Let's stick to deactivate (is_active=false) to preserve history, or actual delete if user insists.
        // Given previous implementation was "deactivateClass", I'll do that but maybe renamed to logical delete.
        // User asked "Eliminar" (Delete). 
        // Let's try REAL delete first, if it fails due to FK, we warn.
        // Actually, safer to just set is_active = false for now to avoid breaking constraints.

        try {
            const { error } = await supabase.from('classes').delete().eq('id', id)
            if (error) throw error
            fetchData()
        } catch (err) {
            // If FK constraint fails, fallback to deactivate
            if (confirm('No se puede eliminar porque tiene historial. ¿Deseas DESACTIVARLA en su lugar?')) {
                await supabase.from('classes').update({ is_active: false }).eq('id', id)
                fetchData()
            }
        }
    }

    // --- Enrollment Management ---

    const openEnrollModal = (cls: Class) => {
        // Calculate next occurrence of this class day
        const today = new Date()
        const currentDay = getDay(today)
        const classDay = cls.day_of_week || 0

        let nextDate = today
        if (currentDay !== classDay) {
            // Calculate days until next occurrence
            // Using date-fns helpers or simple math
            // date-fns: nextDay(date, dayIndex)
            // But nextDay requires explicit day enum 0-6.
            const daysUntil = (classDay + 7 - currentDay) % 7 || 7
            nextDate = addDays(today, daysUntil)
        }

        setEnrollData({
            classId: cls.id,
            userId: '',
            date: format(nextDate, 'yyyy-MM-dd')
        })
        setIsEnrollModalOpen(true)
    }

    const handleEnrollStudent = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!enrollData.userId) return alert('Selecciona un alumno')

        setSubmitting(true)
        try {
            const { error } = await supabase.from('reservations').insert({
                class_id: enrollData.classId,
                user_id: enrollData.userId,
                reservation_date: enrollData.date,
                status: 'active'
            })

            if (error) throw error
            alert('Alumno inscrito correctamente.')
            setIsEnrollModalOpen(false)
        } catch (err: any) {
            alert('Error al inscribir: ' + err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Clases</h1>
                <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Clase
                </Button>
            </div>

            {/* Class Form Modal (Create/Edit) */}
            {isClassModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{editingClass.id ? 'Editar Clase' : 'Crear Clase'}</h2>
                            <button onClick={() => setIsClassModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleSaveClass} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre</label>
                                    <Input required value={editingClass.name} onChange={e => setEditingClass({ ...editingClass, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Instructor</label>
                                    <Input required value={editingClass.instructor} onChange={e => setEditingClass({ ...editingClass, instructor: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Día</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                        value={editingClass.day_of_week || 0}
                                        onChange={e => setEditingClass({ ...editingClass, day_of_week: parseInt(e.target.value) })}
                                    >
                                        {DAYS.map((day, i) => <option key={i} value={i}>{day}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cupo Máximo</label>
                                    <Input type="number" required value={editingClass.max_capacity} onChange={e => setEditingClass({ ...editingClass, max_capacity: parseInt(e.target.value) })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Hora Inicio</label>
                                    <Input type="time" required value={editingClass.start_time} onChange={e => setEditingClass({ ...editingClass, start_time: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Hora Fin</label>
                                    <Input type="time" required value={editingClass.end_time} onChange={e => setEditingClass({ ...editingClass, end_time: e.target.value })} />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsClassModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={submitting}>{editingClass.id ? 'Guardar Cambios' : 'Crear Clase'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Enroll Modal */}
            {isEnrollModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Inscribir Alumno</h2>
                            <button onClick={() => setIsEnrollModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleEnrollStudent} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Alumno</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    required
                                    value={enrollData.userId}
                                    onChange={e => setEnrollData({ ...enrollData, userId: e.target.value })}
                                >
                                    <option value="">Seleccionar alumno...</option>
                                    {members.map(m => (
                                        <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fecha de Reserva</label>
                                <Input type="date" required value={enrollData.date} onChange={e => setEnrollData({ ...enrollData, date: e.target.value })} />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsEnrollModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={submitting}>Inscribir</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Class Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => (
                    <div key={cls.id} className={`p-4 rounded-lg border ${cls.is_active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-70'} shadow-sm relative group`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-lg">{cls.name}</h3>
                                <p className="text-sm text-slate-500">{cls.instructor}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                {!cls.is_active ? (
                                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">Inactiva</span>
                                ) : (
                                    <>
                                        <button onClick={() => openEnrollModal(cls)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Inscribir Alumno">
                                            <UserPlus className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => openEditModal(cls)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar Clase">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDeleteClass(cls.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Eliminar Clase">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1 text-sm text-slate-600 mt-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{DAYS[cls.day_of_week || 0]}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono bg-slate-100 px-1 rounded">{cls.start_time?.substring(0, 5)} - {cls.end_time?.substring(0, 5)}</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-2">
                                Cupo: {cls.max_capacity} personas
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
