"use client";

import PatientForm from "@/features/patients/components/PatientForm";

export default function NewPatientPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-stone-800">Registrar Paciente</h1>
                <p className="text-stone-500">Ingresa los datos del nuevo paciente para comenzar su historial.</p>
            </div>
            <PatientForm />
        </div>
    );
}
