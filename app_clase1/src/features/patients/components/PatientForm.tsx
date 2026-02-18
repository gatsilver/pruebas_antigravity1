"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/client";

export default function PatientForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        birth_date: "",
        address: "",
        emergency_contact: "",
        clinical_history: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();

        // 1. Create Profile (Optional: If patient needs login immediately)
        // For now, we just create the Patient record directly linked to no profile
        // or we can create an auth user if email is provided. 
        // V1 Simplification: Just create the patient record.

        const { error } = await supabase.from("patients").insert([
            {
                full_name: formData.full_name,
                email: formData.email || null,
                phone: formData.phone || null,
                birth_date: formData.birth_date || null,
                address: formData.address || null,
                emergency_contact: formData.emergency_contact || null,
                clinical_history: formData.clinical_history || null,
            },
        ]);

        if (error) {
            alert("Error al crear paciente: " + error.message);
        } else {
            router.push("/patients");
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold text-stone-800 mb-6">Nuevo Paciente</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-stone-700">Nombre Completo *</label>
                        <input
                            type="text"
                            name="full_name"
                            required
                            className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700">Teléfono</label>
                        <input
                            type="tel"
                            name="phone"
                            className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            name="birth_date"
                            className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                            value={formData.birth_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700">Contacto de Emergencia</label>
                        <input
                            type="text"
                            name="emergency_contact"
                            placeholder="Nombre y Teléfono"
                            className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                            value={formData.emergency_contact}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-stone-700">Dirección</label>
                        <input
                            type="text"
                            name="address"
                            className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-stone-700">Antecedentes / Notas Iniciales</label>
                        <textarea
                            name="clinical_history"
                            rows={4}
                            className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                            value={formData.clinical_history}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-800 hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:opacity-50"
                    >
                        {loading ? "Guardando..." : "Guardar Paciente"}
                    </button>
                </div>
            </form>
        </div>
    );
}
