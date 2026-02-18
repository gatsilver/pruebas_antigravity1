"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import { X, Calendar as CalendarIcon, Clock, User, FileText } from "lucide-react";

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialDate?: Date;
}

interface Patient {
    id: string;
    full_name: string;
}

export default function AppointmentModal({ isOpen, onClose, onSuccess, initialDate }: AppointmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [formData, setFormData] = useState({
        patient_id: "",
        date: initialDate ? initialDate.toISOString().split('T')[0] : "",
        start_time: "09:00",
        end_time: "10:00",
        notes: "",
    });

    useEffect(() => {
        if (isOpen) {
            const fetchPatients = async () => {
                const supabase = createClient();
                const { data } = await supabase.from("patients").select("id, full_name").order("full_name");
                if (data) setPatients(data);
            };
            fetchPatients();
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialDate) {
            setFormData(prev => ({
                ...prev,
                date: initialDate.toISOString().split('T')[0]
            }));
        }
    }, [initialDate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const supabase = createClient();

        // Construct timestamps
        const startDateTime = new Date(`${formData.date}T${formData.start_time}:00`);
        const endDateTime = new Date(`${formData.date}T${formData.end_time}:00`);

        const { error } = await supabase.from("appointments").insert([
            {
                patient_id: formData.patient_id,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                notes: formData.notes,
                status: "pending",
            },
        ]);

        if (error) {
            alert("Error al agendar cita: " + error.message);
        } else {
            onSuccess();
            onClose();
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                    <h2 className="font-bold text-stone-800 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-stone-600" />
                        Nueva Cita
                    </h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Paciente</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <select
                                name="patient_id"
                                required
                                className="w-full pl-9 pr-3 py-2 rounded-md border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none text-sm bg-white"
                                value={formData.patient_id}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar paciente...</option>
                                {patients.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Fecha</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="date"
                                name="date"
                                required
                                className="w-full pl-9 pr-3 py-2 rounded-md border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none text-sm"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Inicio</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="time"
                                    name="start_time"
                                    required
                                    className="w-full pl-9 pr-3 py-2 rounded-md border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none text-sm"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Fin</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="time"
                                    name="end_time"
                                    required
                                    className="w-full pl-9 pr-3 py-2 rounded-md border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none text-sm"
                                    value={formData.end_time}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Notas</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                            <textarea
                                name="notes"
                                rows={3}
                                className="w-full pl-9 pr-3 py-2 rounded-md border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none text-sm"
                                placeholder="Detalles de la sesión..."
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-stone-800 text-white rounded-md text-sm font-medium hover:bg-stone-900 transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {loading ? "Agendando..." : "Confirmar Cita"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
