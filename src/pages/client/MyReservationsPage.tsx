import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Button } from '../../components/ui/button'
import { Loader2, Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react'
import type { Database } from '../../types/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Reservation = Database['public']['Tables']['reservations']['Row'] & {
    classes: { name: string, start_time: string, instructor: string } | null
}

export default function MyReservationsPage() {
    const { user } = useAuth()
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReservations()
    }, [])

    const fetchReservations = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('reservations')
            .select('*, classes(name, start_time, instructor)')
            .eq('user_id', user?.id!)
            .order('reservation_date', { ascending: false })

        if (error) console.error(error)
        else setReservations(data as any || [])

        setLoading(false)
    }

    const cancelReservation = async (id: string) => {
        if (!confirm('¿Estás seguro de cancelar tu reserva?')) return
        await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id)
        fetchReservations()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Mis Reservas</h1>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>
                ) : reservations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500">No tienes reservas registradas.</p>
                    </div>
                ) : (
                    reservations.map(res => (
                        <div key={res.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-600 shrink-0">
                                    <span className="text-xs uppercase font-bold">{format(new Date(res.reservation_date), 'MMM', { locale: es })}</span>
                                    <span className="text-lg font-bold leading-none">{format(new Date(res.reservation_date), 'd')}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{res.classes?.name}</h3>
                                    <div className="flex items-center text-sm text-slate-500 gap-3 mt-1">
                                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {res.classes?.start_time.substring(0, 5)}</span>
                                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> Estudio Central</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                                {res.status === 'active' ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Confirmada
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        <XCircle className="w-3 h-3 mr-1" /> Cancelada
                                    </span>
                                )}

                                {res.status === 'active' && (
                                    <Button variant="ghost" size="sm" onClick={() => cancelReservation(res.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                        Cancelar
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
