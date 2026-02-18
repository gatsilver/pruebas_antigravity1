'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { Building2, Loader2, LogOut, Wrench } from 'lucide-react'
import { Database } from '@/types/supabase'

type Membresia = Database['public']['Tables']['membresias']['Row'] & {
    organizaciones: Database['public']['Tables']['organizaciones']['Row']
}

export default function OrgSelectorPage() {
    const [loading, setLoading] = useState(true)
    const [membresias, setMembresias] = useState<Membresia[]>([])
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadMembresias()
    }, [])

    const loadMembresias = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('membresias')
                .select(`
          *,
          organizaciones (*)
        `)
                .eq('user_id', user.id)
                .eq('activo', true)

            if (error) {
                console.error('Error loading membresias:', error)
                toast('Error al cargar organizaciones', 'error')
                setLoading(false)
                return
            }

            if (!data || data.length === 0) {
                toast('No tienes acceso a ninguna organización', 'warning')
                setLoading(false)
                return
            }

            // Si solo hay una org, redirigir directamente
            if (data.length === 1) {
                router.push(`/app/${data[0].org_id}/dashboard`)
                return
            }

            setMembresias(data as Membresia[])
        } catch (err) {
            console.error('Error:', err)
            toast('Error de conexión', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleSelectOrg = (orgId: string) => {
        router.push(`/app/${orgId}/dashboard`)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleAutoFix = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase.rpc('fix_my_user_access')
            if (error) throw error

            toast('Cuenta reparada: ' + data, 'success')
            // Recargar para verificar y redirigir
            window.location.reload()
        } catch (err: any) {
            console.error(err)
            toast('Fallo al reparar: ' + (err.message || 'Error desconocido'), 'error')
            setLoading(false)
        }
    }

    const rolLabels: Record<string, string> = {
        admin: 'Administrador',
        terapeuta: 'Terapeuta',
        recepcion: 'Recepción',
        paciente: 'Paciente',
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white/95 backdrop-blur">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                        <Building2 className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl">Selecciona tu Organización</CardTitle>
                    <CardDescription>
                        Tienes acceso a múltiples organizaciones
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {membresias.map((membresia) => (
                        <button
                            key={membresia.id_membresia}
                            onClick={() => handleSelectOrg(membresia.org_id)}
                            className="w-full p-4 rounded-xl border-2 border-transparent hover:border-purple-500 bg-purple-50 hover:bg-purple-100 transition-all text-left flex items-center justify-between group"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">
                                    {membresia.organizaciones?.nombre_org}
                                </h3>
                                <Badge variant="secondary" className="mt-1">
                                    {rolLabels[membresia.rol_en_org] || membresia.rol_en_org}
                                </Badge>
                            </div>
                            <div className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                →
                            </div>
                        </button>
                    ))}


                    <div className="pt-4 border-t">
                        <Button variant="ghost" className="w-full text-gray-500" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
