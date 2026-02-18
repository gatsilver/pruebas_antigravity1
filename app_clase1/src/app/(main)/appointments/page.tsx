"use client";

import CalendarView from "@/features/appointments/components/CalendarView";

export default function AppointmentsPage() {
    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">Agenda</h1>
                    <p className="text-stone-500">Gestiona las citas y disponibilidad de los terapeutas.</p>
                </div>
            </div>
            <CalendarView />
        </div>
    );
}
