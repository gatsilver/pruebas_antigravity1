"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import { User, FileText, Calendar, Activity } from "lucide-react";
import Link from "next/link";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const fetchPatient = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("patients")
                .select("*")
                .eq("id", params.id)
                .single();

            if (data) setPatient(data);
            setLoading(false);
        };

        fetchPatient();
    }, [params.id]);

    if (loading) return <div className="p-8 text-center text-stone-500">Cargando expediente...</div>;
    if (!patient) return <div className="p-8 text-center text-red-500">Paciente no encontrado</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-2xl">
                        {patient.full_name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900">{patient.full_name}</h1>
                        <p className="text-stone-500 text-sm">Expediente #{patient.id.slice(0, 8)}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">Activo</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-stone-200">
                <nav className="-mb-px flex space-x-8">
                    {["profile", "history", "appointments"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                                    ? "border-stone-800 text-stone-800"
                                    : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"}
              `}
                        >
                            {tab === "profile" && "Perfil General"}
                            {tab === "history" && "Historial Clínico"}
                            {tab === "appointments" && "Citas y Tratamientos"}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 min-h-[400px]">
                {activeTab === "profile" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" /> Información Personal
                            </h3>
                            <dl className="space-y-4 text-sm">
                                <div>
                                    <dt className="text-stone-500">Email</dt>
                                    <dd className="font-medium text-stone-900">{patient.email || "No registrado"}</dd>
                                </div>
                                <div>
                                    <dt className="text-stone-500">Teléfono</dt>
                                    <dd className="font-medium text-stone-900">{patient.phone || "No registrado"}</dd>
                                </div>
                                <div>
                                    <dt className="text-stone-500">Dirección</dt>
                                    <dd className="font-medium text-stone-900">{patient.address || "No registrada"}</dd>
                                </div>
                                <div>
                                    <dt className="text-stone-500">Fecha Nacimiento</dt>
                                    <dd className="font-medium text-stone-900">{patient.birth_date || "No registrada"}</dd>
                                </div>
                            </dl>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5" /> Emergencia y Notas
                            </h3>
                            <dl className="space-y-4 text-sm">
                                <div>
                                    <dt className="text-stone-500">Contacto de Emergencia</dt>
                                    <dd className="font-medium text-stone-900">{patient.emergency_contact || "No registrado"}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                )}

                {activeTab === "history" && (
                    <div>
                        <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" /> Antecedentes Clínicos
                        </h3>
                        <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 text-stone-700 whitespace-pre-wrap">
                            {patient.clinical_history || "Sin antecedentes registrados."}
                        </div>

                        <div className="mt-8">
                            <h4 className="font-medium text-stone-900 mb-4">Notas de Evolución (Próximamente)</h4>
                            <p className="text-stone-400 text-sm">Aquí se mostrarán las notas agregadas por los terapeutas en cada sesión.</p>
                        </div>
                    </div>
                )}

                {activeTab === "appointments" && (
                    <div>
                        <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" /> Historial de Citas
                        </h3>
                        <p className="text-stone-400 text-sm">No hay citas registradas (Módulo de Agenda en construcción).</p>
                    </div>
                )}
            </div>
        </div>
    );
}
