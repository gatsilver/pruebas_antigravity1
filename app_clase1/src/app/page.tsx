"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/client";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                router.push("/dashboard");
            } else {
                router.push("/login"); // Redirect to login by default for now
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center bg-stone-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-stone-200 mb-4"></div>
                <div className="text-stone-500 font-medium">Iniciando Holistic Center...</div>
            </div>
        </div>
    );
}
