import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Button } from '../../components/ui/button'
import { Loader2, User, Check } from 'lucide-react'
import type { Database } from '../../types/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { format, addDays, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '../../lib/utils'

type Class = Database['public']['Tables']['classes']['Row']
type Reservation = Database['public']['Tables']['reservations']['Row']

export default function SchedulePage() {
    const { user } = useAuth()
    const [classes, setClasses] = useState<Class[]>([])
    const [userReservations, setUserReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [booking, setBooking] = useState<string | null>(null)
    const [classCounts, setClassCounts] = useState<Record<string, number>>({})

    useEffect(() => {
        fetchData()
    }, [selectedDate])

    const fetchData = async () => {
        setLoading(true)
        const dateStr = format(selectedDate, 'yyyy-MM-dd')

        const [classesRes, reservationsRes] = await Promise.all([
            supabase.from('classes').select('*').eq('is_active', true),
            supabase.from('reservations').select('*').eq('user_id', user?.id!).eq('status', 'active')
        ])

        if (classesRes.error) console.error(classesRes.error)

        // Fetch raw reservation data to count per class manually
        const { data: allDailyRes, error: dailyError } = await supabase
            .from('reservations')
            .select('class_id')
            .eq('reservation_date', dateStr)
            .eq('status', 'active')

        if (dailyError) console.error(dailyError)

        const counts: Record<string, number> = {}
        allDailyRes?.forEach(r => {
            counts[r.class_id] = (counts[r.class_id] || 0) + 1
        })

        setClasses(classesRes.data || [])
        setUserReservations(reservationsRes.data || [])
        setClassCounts(counts)
        setLoading(false)
    }

    const getWeekDays = () => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday start
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i))
    }

    const weekDays = getWeekDays()
    const selectedDayIndex = selectedDate.getDay()

    const dailyClasses = classes
        .filter(c => c.day_of_week === selectedDayIndex)
        .sort((a, b) => a.start_time.localeCompare(b.start_time))

    const handleBook = async (classId: string) => {
        if (!confirm('¿Confirmar reserva para esta clase?')) return

        setBooking(classId)
        const dateStr = format(selectedDate, 'yyyy-MM-dd')

        try {
            const { error } = await supabase.from('reservations').insert({
                class_id: classId,
                user_id: user?.id!,
                reservation_date: dateStr
            })

            if (error) {
                if (error.message.includes('unique constraint')) throw new Error('Ya tienes reserva para esta clase.')
                if (error.message.includes('violates row-level security')) throw new Error('No tienes una membresía activa válida.')
                throw error
            }

            alert('¡Reserva confirmada!')
            fetchData()
        } catch (err: any) {
            alert(err.message)
        } finally {
            setBooking(null)
        }
    }

    const isReserved = (classId: string) => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        return userReservations.some(r => r.class_id === classId && r.reservation_date === dateStr)
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Calendario de Clases</h2>
                <p className="text-slate-500">Selecciona un día para ver y reservar clases disponibles.</p>
            </div>

            {/* Week Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {weekDays.map((date) => {
                    const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                    const dayName = format(date, 'EEE', { locale: es })
                    const dayNum = format(date, 'd')

                    return (
                        <button
                            key={date.toString()}
                            onClick={() => setSelectedDate(date)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[4rem] h-16 rounded-xl border transition-all",
                                isSelected
                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-105"
                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:bg-slate-50"
                            )}
                        >
                            <span className="text-xs uppercase font-semibold">{dayName}</span>
                            <span className="text-lg font-bold">{dayNum}</span>
                        </button>
                    )
                })}
            </div>

            {/* Classes List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>
                ) : dailyClasses.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500">No hay clases programadas para este día.</p>
                    </div>
                ) : (
                    dailyClasses.map(cls => {
                        const currentCount = classCounts[cls.id] || 0
                        const isFull = currentCount >= cls.max_capacity
                        const reserved = isReserved(cls.id)

                        return (
                            <div key={cls.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                {reserved && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium">Reservado</div>}
                                {isFull && !reserved && <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium">Lleno</div>}

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{cls.name}</h3>
                                        <div className="flex items-center text-slate-500 text-sm mt-1">
                                            <User className="w-3 h-3 mr-1" />
                                            {cls.instructor}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                                            {cls.start_time.substring(0, 5)}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">{cls.end_time.substring(0, 5)}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                    <div className="text-xs text-slate-400">
                                        <span className="font-semibold text-slate-600 block">Cupo</span>
                                        <span className={isFull ? "text-red-500 font-bold" : ""}>
                                            {currentCount} / {cls.max_capacity}
                                        </span>
                                    </div>

                                    {reserved ? (
                                        <Button disabled variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                                            <Check className="w-4 h-4 mr-2" />
                                            Inscrito
                                        </Button>
                                    ) : isFull ? (
                                        <Button disabled variant="outline" className="text-slate-400">
                                            Sin Cupo
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleBook(cls.id)}
                                            disabled={!!booking}
                                            className="bg-slate-900 hover:bg-slate-800"
                                        >
                                            {booking === cls.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            Reservar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
