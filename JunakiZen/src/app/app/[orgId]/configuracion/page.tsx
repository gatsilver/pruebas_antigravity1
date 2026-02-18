'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/org-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { Settings, Users, Building2, Loader2, Plus, Trash2, Edit, X, Save } from 'lucide-react'
import { Database } from '@/types/supabase'

type Membresia = Database['public']['Tables']['membresias']['Row'] & {
    perfiles?: { nombre_completo: string | null }
}
type RolUsuario = Database['public']['Enums']['rol_usuario']

export default function ConfiguracionPage() {
    const { orgId, orgName, rol, perfil, loading: orgLoading } = useOrg()
    const [membresias, setMembresias] = useState<Membresia[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingPerfil, setEditingPerfil] = useState(false)
    const [nombrePerfil, setNombrePerfil] = useState('')
    const supabase = createClient()

    useEffect(() => {
        if (!orgLoading && orgId) {
            loadMembresias()
            setNombrePerfil(perfil?.nombre_completo || '')
        }
    }, [orgId, orgLoading, perfil])

    const loadMembresias = async () => {
        const { data, error } = await supabase
            .from('membresias')
            .select(`
        *,
        perfiles (nombre_completo)
      `)
            .eq('org_id', orgId)
            .order('created_at')

        if (error) {
            toast('Error al cargar miembros', 'error')
        } else {
            setMembresias(data as Membresia[] || [])
        }
        setLoading(false)
    }

    const handleSavePerfil = async () => {
        if (!perfil) return

        const { error } = await supabase
            .from('perfiles')
            .update({ nombre_completo: nombrePerfil })
            .eq('id', perfil.id)

        if (error) {
            toast('Error al guardar', 'error')
        } else {
            toast('Perfil actualizado', 'success')
            setEditingPerfil(false)
        }
    }

    const handleToggleMiembro = async (membresia: Membresia) => {
        const { error } = await supabase
            .from('membresias')
            .update({ activo: !membresia.activo })
            .eq('id_membresia', membresia.id_membresia)

        if (error) {
            toast('Error al actualizar', 'error')
        } else {
            toast(membresia.activo ? 'Miembro desactivado' : 'Miembro activado', 'success')
            loadMembresias()
        }
    }

    const rolLabels: Record<string, string> = {
        admin: 'Administrador',
        terapeuta: 'Terapeuta',
        recepcion: 'Recepción',
        paciente: 'Paciente',
    }

    if (loading || orgLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Settings className="h-8 w-8" />
                    Configuración
                </h1>
                <p className="text-muted-foreground mt-1">Administra tu organización y perfil</p>
            </div>

            {/* Información de Organización */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Organización
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold">{orgName}</p>
                            <p className="text-sm text-muted-foreground">ID: {orgId}</p>
                        </div>
                        <Badge>{rol}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Mi Perfil */}
            <Card>
                <CardHeader>
                    <CardTitle>Mi Perfil</CardTitle>
                    <CardDescription>Información personal de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👤</span>
                        </div>
                        <div className="flex-1">
                            {editingPerfil ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={nombrePerfil}
                                        onChange={(e) => setNombrePerfil(e.target.value)}
                                        placeholder="Tu nombre completo"
                                        className="max-w-xs"
                                    />
                                    <Button size="icon" onClick={handleSavePerfil}>
                                        <Save className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => setEditingPerfil(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">{perfil?.nombre_completo || 'Sin nombre'}</p>
                                    <Button size="icon" variant="ghost" onClick={() => setEditingPerfil(true)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <Badge variant="secondary" className="mt-1">
                                {rolLabels[rol || ''] || rol}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Miembros - Solo Admin */}
            {rol === 'admin' && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Miembros del Equipo
                                </CardTitle>
                                <CardDescription>{membresias.length} miembros</CardDescription>
                            </div>
                            <Button onClick={() => setModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Invitar
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {membresias.map((membresia) => (
                                <div
                                    key={membresia.id_membresia}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span>👤</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {membresia.perfiles?.nombre_completo || 'Usuario'}
                                            </p>
                                            <Badge variant="secondary" className="text-xs">
                                                {rolLabels[membresia.rol_en_org] || membresia.rol_en_org}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={membresia.activo ? 'success' : 'secondary'}>
                                            {membresia.activo ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleMiembro(membresia)}
                                        >
                                            {membresia.activo ? 'Desactivar' : 'Activar'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Modal de invitación */}
            {modalOpen && (
                <InvitarModal
                    onClose={(refresh) => { setModalOpen(false); if (refresh) loadMembresias() }}
                    orgId={orgId}
                />
            )}
        </div>
    )
}

function InvitarModal({ onClose, orgId }: {
    onClose: (refresh?: boolean) => void
    orgId: string
}) {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [rol, setRol] = useState<RolUsuario>('terapeuta')
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || !email.includes('@')) {
            toast('Ingresa un email válido', 'error')
            return
        }
        setLoading(true)

        try {
            // 1. Resolver Email -> UUID
            const { data: userId, error: rpcError } = await supabase
                .rpc('get_user_id_by_email', { email_input: email.trim() })

            if (rpcError) throw rpcError
            if (!userId) {
                toast('Usuario no encontrado. Asegúrate de que se haya registrado primero.', 'error')
                setLoading(false)
                return
            }

            // 2. Insertar Membresia
            const { error: insertError } = await supabase.from('membresias').insert({
                org_id: orgId,
                user_id: userId,
                rol_en_org: rol,
                activo: true,
            })

            if (insertError) {
                if (insertError.message.includes('duplicate')) {
                    toast('El usuario ya es miembro de esta organización', 'error')
                } else {
                    throw insertError
                }
            } else {
                toast('Miembro agregado exitosamente', 'success')
                onClose(true)
            }
        } catch (err: any) {
            console.error(err)
            toast(err.message || 'Error al invitar usuario', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">Agregar Miembro</h2>
                    <button onClick={() => onClose()}><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <Label>Email del Usuario *</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@ejemplo.com"
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            El usuario debe tener una cuenta registrada en JunakiZen.
                        </p>
                    </div>
                    <div>
                        <Label>Rol en la Organización</Label>
                        <Select
                            value={rol}
                            onChange={(e) => setRol(e.target.value as RolUsuario)}
                            options={[
                                { value: 'admin', label: 'Administrador' },
                                { value: 'terapeuta', label: 'Terapeuta' },
                                { value: 'recepcion', label: 'Recepción' },
                                { value: 'paciente', label: 'Paciente' },
                            ]}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onClose()}>Cancelar</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Agregar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
