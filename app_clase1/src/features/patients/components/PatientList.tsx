"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, User } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/client";

interface Patient {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
}

export default function PatientList() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("patients")
                .select("id, full_name, email, phone")
                .order("full_name");

            if (data) setPatients(data);
            setLoading(false);
        };

        fetchPatients();
    }, []);

    const filteredPatients = patients.filter((p) =>
        p.full_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">Directorio de Pacientes</h1>
                    <p className="text-stone-500 text-sm">Gestión de expedientes clínicos</p>
                </div>
                <Link
                    href="/patients/new"
                    className="bg-stone-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-stone-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Paciente
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {loading ? (
                <div className="text-center py-12 text-stone-400">Cargando pacientes...</div>
            ) : filteredPatients.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-stone-200">
                    <User className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500 font-medium">No se encontraron pacientes</p>
                    <p className="text-stone-400 text-sm">Intenta con otro término o registra uno nuevo.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Nombre</th>
                                <th className="px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Contacto</th>
                                <th className="px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-xs font-semibold text-stone-500 uppercase text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-stone-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-xs">
                                                {patient.full_name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-stone-900">{patient.full_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-600">
                                        <div className="flex flex-col">
                                            <span>{patient.email || "Sin email"}</span>
                                            <span className="text-xs text-stone-400">{patient.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            Activo
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/patients/${patient.id}`}
                                            className="text-stone-400 hover:text-stone-900 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Ver Ficha →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
