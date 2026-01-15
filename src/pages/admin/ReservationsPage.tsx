import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Button } from '../../components/ui/button'
import { Loader2, XCircle, CheckCircle } from 'lucide-react'
import type { Database } from '../../types/supabase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Reservation = Database['public']['Tables']['reservations']['Row'] & {
    profiles: { full_name: string } | null
    classes: { name: string, start_time: string } | null
}

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [creating, setCreating] = useState(false)

    // Form selection data
    const [students, setStudents] = useState<{ id: string, full_name: string }[]>([])
    const [classes, setClasses] = useState<{ id: string, name: string, start_time: string, day_of_week: number }[]>([])

    // New Reservation State
    const [newRes, setNewRes] = useState({
        user_id: '',
        class_id: '',
        date: format(new Date(), 'yyyy-MM-dd')
    })

    useEffect(() => {
        fetchReservations()
        fetchFormData()
    }, [])

    const fetchFormData = async () => {
        const { data: studentsData } = await supabase.from('profiles').select('id, full_name').eq('role', 'cliente')
        const { data: classesData } = await supabase.from('classes').select('id, name, start_time, day_of_week').eq('is_active', true)

        if (studentsData) setStudents(studentsData)
        if (classesData) setClasses(classesData)
    }

    const fetchReservations = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('reservations')
            .select('*, profiles(full_name), classes(name, start_time)')
            .order('reservation_date', { ascending: false })
            .order('created_at', { ascending: false })

        if (error) console.error(error)
        else setReservations(data as any || [])

        setLoading(false)
    }

    const handleCreateReservation = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)
        try {
            // Basic validation
            if (!newRes.user_id || !newRes.class_id || !newRes.date) {
                throw new Error('Todos los campos son obligatorios')
            }

            const { error } = await supabase.from('reservations').insert([{
                user_id: newRes.user_id,
                class_id: newRes.class_id,
                reservation_date: newRes.date,
                status: 'active'
            }])

            if (error) throw error

            alert('Reserva creada exitosamente')
            setIsModalOpen(false)
            setNewRes({ user_id: '', class_id: '', date: format(new Date(), 'yyyy-MM-dd') })
            fetchReservations()

        } catch (err: any) {
            alert('Error al crear reserva: ' + err.message)
        } finally {
            setCreating(false)
        }
    }

    const cancelReservation = async (id: string) => {
        if (!confirm('¿Cancelar reserva?')) return
        await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id)
        fetchReservations()
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    Nueva Reserva
                </Button>
            </div>

            {/* Modal Nueva Reserva */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4">Asignar Alumno a Clase</h2>
                        <form onSubmit={handleCreateReservation} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Alumno</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    value={newRes.user_id}
                                    onChange={e => setNewRes({ ...newRes, user_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar Alumno...</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.full_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Clase</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    value={newRes.class_id}
                                    onChange={e => setNewRes({ ...newRes, class_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar Clase...</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.start_time})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fecha</label>
                                <input
                                    type="date"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    value={newRes.date}
                                    onChange={e => setNewRes({ ...newRes, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={creating}>
                                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Asignar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Fecha</th>
                                <th className="px-6 py-3 font-medium">Hora</th>
                                <th className="px-6 py-3 font-medium">Clase</th>
                                <th className="px-6 py-3 font-medium">Miembro</th>
                                <th className="px-6 py-3 font-medium">Estado</th>
                                <th className="px-6 py-3 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" /></td>
                                </tr>
                            ) : reservations.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No hay reservas registradas</td></tr>
                            ) : (
                                reservations.map(res => (
                                    <tr key={res.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-6 py-4">{format(new Date(res.reservation_date + 'T00:00:00'), 'dd PPP', { locale: es })}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{res.classes?.start_time?.substring(0, 5)}</td>
                                        <td className="px-6 py-4 font-medium">{res.classes?.name}</td>
                                        <td className="px-6 py-4">{res.profiles?.full_name}</td>
                                        <td className="px-6 py-4">
                                            {res.status === 'active' ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Activa
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                    <XCircle className="w-3 h-3 mr-1" /> Cancelada
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {res.status === 'active' && (
                                                <Button variant="ghost" size="sm" onClick={() => cancelReservation(res.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    Cancelar
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
