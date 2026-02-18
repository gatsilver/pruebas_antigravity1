"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Profile {
    role: string;
}

interface Profile {
    role: string;
}

export function DashboardView() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkRole = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();

                const profile = data as Profile | null;
                setRole(profile?.role || "patient");
            }
            setLoading(false);
        };

        checkRole();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-stone-50">
                <div className="animate-pulse text-stone-500">Cargando tu espacio...</div>
            </div>
        );
    }

    // Role-Based Views (To be expanded in Phase 2)
    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            <header className="flex justify-between items-center border-b border-stone-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">
                        {role === "owner" && "Panel de Administración"}
                        {role === "therapist" && "Mi Consultorio"}
                        {role === "patient" && "Bienvenido a tu Espacio"}
                    </h1>
                    <p className="text-stone-500">
                        Rol detectado: <span className="font-semibold uppercase">{role}</span>
                    </p>
                </div>
                <button
                    onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        router.push("/login");
                    }}
                    className="text-sm text-stone-500 hover:text-stone-800"
                >
                    Cerrar Sesión
                </button>
            </header>

            {/* Placeholder Content for V1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100">
                    <h3 className="font-semibold text-stone-700 mb-2">Próximas Citas</h3>
                    <p className="text-2xl font-bold text-stone-900">0</p>
                    <p className="text-xs text-stone-400 mt-1">Sin citas programadas</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100">
                    <h3 className="font-semibold text-stone-700 mb-2">Notificaciones</h3>
                    <p className="text-2xl font-bold text-stone-900">0</p>
                    <p className="text-xs text-stone-400 mt-1">Todo al día</p>
                </div>

                {role === "owner" && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100">
                        <h3 className="font-semibold text-stone-700 mb-2">Ingresos Mes</h3>
                        <p className="text-2xl font-bold text-stone-900">$0.00</p>
                        <p className="text-xs text-stone-400 mt-1">Proyección</p>
                    </div>
                )}
            </div>
        </div>
    );
}
