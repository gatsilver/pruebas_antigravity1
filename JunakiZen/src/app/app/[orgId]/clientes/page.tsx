'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/org-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { formatDate } from '@/lib/utils'
import { Plus, Search, Edit, Trash2, Users, Loader2 } from 'lucide-react'
import { ClienteModal } from './cliente-modal'
import { Database } from '@/types/supabase'

type Cliente = Database['public']['Tables']['clientes']['Row']

export default function ClientesPage() {
    const { orgId, rol, loading: orgLoading } = useOrg()
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!orgLoading && orgId) {
            loadClientes()
        }
    }, [orgId, orgLoading, search])

    const loadClientes = async () => {
        try {
            let query = supabase
                .from('clientes')
                .select('*')
                .eq('org_id', orgId)
                .order('created_at', { ascending: false })

            if (search) {
                query = query.or(`nombres_completos.ilike.%${search}%,dni.ilike.%${search}%,correo.ilike.%${search}%`)
            }

            const { data, error } = await query.limit(50)

            if (error) {
                toast('Error al cargar clientes: ' + error.message, 'error')
                return
            }

            setClientes(data || [])
        } catch (err) {
            toast('Error de conexión', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (cliente: Cliente) => {
        setEditingCliente(cliente)
        setModalOpen(true)
    }

    const handleDelete = async (cliente: Cliente) => {
        if (!confirm(`¿Eliminar a ${cliente.nombres_completos}? Esta acción no se puede deshacer.`)) {
            return
        }

        const { error } = await supabase
            .from('clientes')
            .delete()
            .eq('id_cliente', cliente.id_cliente)

        if (error) {
            toast('Error al eliminar: ' + error.message, 'error')
            return
        }

        toast('Cliente eliminado', 'success')
        loadClientes()
    }

    const handleModalClose = (refresh?: boolean) => {
        setModalOpen(false)
        setEditingCliente(null)
        if (refresh) {
            loadClientes()
        }
    }

    const canEdit = rol === 'admin' || rol === 'recepcion'

    if (loading || orgLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Users className="h-8 w-8" />
                        Clientes
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} registrado{clientes.length !== 1 ? 's' : ''}
                    </p>
                </div>
                {canEdit && (
                    <Button onClick={() => setModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Cliente
                    </Button>
                )}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre, DNI o correo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Lista */}
            {clientes.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No hay clientes</h3>
                        <p className="text-muted-foreground mb-4">
                            {search ? 'No se encontraron resultados' : 'Comienza registrando tu primer cliente'}
                        </p>
                        {canEdit && !search && (
                            <Button onClick={() => setModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Cliente
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {clientes.map((cliente) => (
                        <Card key={cliente.id_cliente} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-xl">👤</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{cliente.nombres_completos}</h3>
                                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                                {cliente.dni && <span>DNI: {cliente.dni}</span>}
                                                {cliente.telefono && <span>• {cliente.telefono}</span>}
                                                {cliente.correo && <span>• {cliente.correo}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={cliente.estado ? 'success' : 'secondary'}>
                                            {cliente.estado ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                        {canEdit && (
                                            <>
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(cliente)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(cliente)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            <ClienteModal
                open={modalOpen}
                onClose={handleModalClose}
                cliente={editingCliente}
                orgId={orgId}
            />
        </div>
    )
}
