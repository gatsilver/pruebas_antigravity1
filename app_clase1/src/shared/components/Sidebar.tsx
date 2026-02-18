"use client";

import Link from "next/link";
import { Users, Calendar, LayoutDashboard, Settings, Package, GraduationCap } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function Sidebar({ role }: { role: string }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    };

    const links = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["owner", "therapist", "patient"] },
        { href: "/patients", label: "Pacientes", icon: Users, roles: ["owner", "therapist"] },
        { href: "/appointments", label: "Agenda", icon: Calendar, roles: ["owner", "therapist", "patient"] },
        { href: "/inventory", label: "Inventario", icon: Package, roles: ["owner", "therapist"] },
        { href: "/courses", label: "Cursos", icon: GraduationCap, roles: ["owner", "therapist", "patient", "student"] },
    ];

    return (
        <div className="w-64 bg-white border-r border-stone-200 min-h-screen flex flex-col">
            <div className="p-6 border-b border-stone-200">
                <h2 className="font-bold text-xl text-stone-800">Holistic Center</h2>
                <span className="text-xs text-stone-500 uppercase">{role}</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    if (!link.roles.includes(role)) return null;

                    const Icon = link.icon;
                    const isActive = pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-stone-100 text-stone-900"
                                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-stone-200">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
