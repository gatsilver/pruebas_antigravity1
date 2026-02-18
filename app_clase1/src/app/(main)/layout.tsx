"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/shared/components/Sidebar";
import { createClient } from "@/shared/lib/supabase/client";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
                setRole(data?.role || "patient");
            }
        };
        fetchRole();
    }, []);

    if (!role) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Cargando...</div>;

    return (
        <div className="flex min-h-screen bg-stone-50">
            <Sidebar role={role} />
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
