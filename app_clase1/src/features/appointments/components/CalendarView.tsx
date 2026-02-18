"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react";
import { getMonthDays, formatDate, nextMonth, prevMonth, areSameDay, isCurrentMonth } from "../utils/calendar";
import { createClient } from "@/shared/lib/supabase/client";
import AppointmentModal from "./AppointmentModal";
import { cn } from "@/shared/lib/utils"; // Assuming utils exists, if not I'll inline or use clsx directly

interface Appointment {
    id: string;
    start_time: string;
    end_time: string;
    patient: { full_name: string } | null;
    status: "scheduled" | "confirmed" | "completed" | "cancelled";
}

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Simple trigger to refetch
    const days = getMonthDays(currentDate);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            const supabase = createClient();

            // Fetch appointments for the current month view range
            // For simplicity in V1, fetching all future appointments or a broader range
            // Ideally should filter by start_time >= startOfMonth and <= endOfMonth

            const { data, error } = await supabase
                .from("appointments")
                .select(`
          id,
          start_time,
          end_time,
          status,
          patient:patients(full_name)
        `)
                .order("start_time");

            if (data) {
                // Transform data if necessary or just set it
                // Supabase returns patient as an object or array depending on relation, usually object if single
                setAppointments(data as any); // Type assertion for now to match interface
            }
            setLoading(false);
        };

        fetchAppointments();
    }, [currentDate, refreshKey]);

    const handlePrevMonth = () => setCurrentDate(prevMonth(currentDate));
    const handleNextMonth = () => setCurrentDate(nextMonth(currentDate));

    const getAppointmentsForDay = (day: Date) => {
        return appointments.filter((apt) => areSameDay(new Date(apt.start_time), day));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-green-100 text-green-700 border-green-200";
            case "completed": return "bg-stone-100 text-stone-600 border-stone-200";
            case "cancelled": return "bg-red-50 text-red-400 border-red-100 line-through";
            default: return "bg-blue-50 text-blue-600 border-blue-100"; // scheduled
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-stone-100">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-stone-800 capitalize">
                        {formatDate(currentDate, "MMMM yyyy")}
                    </h2>
                    <div className="flex bg-stone-100 rounded-lg p-1">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-white rounded-md shadow-sm transition-all">
                            <ChevronLeft className="w-5 h-5 text-stone-600" />
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-medium text-stone-600 hover:bg-white rounded-md transition-all">
                            Hoy
                        </button>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded-md shadow-sm transition-all">
                            <ChevronRight className="w-5 h-5 text-stone-600" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-stone-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-stone-700 transition-colors shadow-sm text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Cita
                </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 border-b border-stone-100 bg-stone-50">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-stone-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-stone-200 gap-px">
                {days.map((day, dayIdx) => {
                    const isCurrent = isCurrentMonth(day, currentDate);
                    const isTodayDate = areSameDay(day, new Date());
                    const dayAppointments = getAppointmentsForDay(day);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => {
                                // Optional: Open modal with this date selected
                            }}
                            className={`bg-white min-h-[100px] p-2 flex flex-col gap-1 transition-colors hover:bg-stone-50 ${!isCurrent ? "bg-stone-50/50 text-stone-400" : "text-stone-900"
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isTodayDate ? "bg-stone-800 text-white" : ""
                                    }`}>
                                    {formatDate(day, "d")}
                                </span>
                                {dayAppointments.length > 0 && (
                                    <span className="text-xs text-stone-400 font-medium">{dayAppointments.length} citas</span>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col gap-1 overflow-y-auto mt-1 custom-scrollbar">
                                {dayAppointments.map((apt) => (
                                    <div
                                        key={apt.id}
                                        className={`text-xs p-1.5 rounded border mb-0.5 truncate cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(apt.status)}`}
                                    >
                                        <div className="flex items-center gap-1 font-semibold">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(new Date(apt.start_time), "HH:mm")}
                                        </div>
                                        <div className="truncate">
                                            {apt.patient?.full_name || "Paciente Eliminado"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => setRefreshKey(k => k + 1)}
            />
        </div>
    );
}
