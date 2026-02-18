import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Holistic Center SaaS | Gestión Integral",
    description: "Plataforma All-in-One para centros de terapia holística. Gestiona pacientes, agenda e inventario.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body
                className={`${inter.className} antialiased bg-background text-foreground`}

            >
                {children}
            </body>
        </html>
    );
}
