'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/org-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { formatCurrency } from '@/lib/utils'
import { Plus, Package, Loader2, Edit, Trash2, X, AlertTriangle } from 'lucide-react'
import { Database } from '@/types/supabase'

type Inventario = Database['public']['Tables']['inventario']['Row']
type EstadoStock = Database['public']['Enums']['estado_stock']

export default function InventarioPage() {
    const { orgId, rol, loading: orgLoading } = useOrg()
    const [productos, setProductos] = useState<Inventario[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<Inventario | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!orgLoading && orgId) loadProductos()
    }, [orgId, orgLoading])

    const loadProductos = async () => {
        const { data, error } = await supabase
            .from('inventario')
            .select('*')
            .eq('org_id', orgId)
            .order('nombre_producto')

        if (error) {
            toast('Error al cargar inventario', 'error')
        } else {
            setProductos(data || [])
        }
        setLoading(false)
    }

    const handleDelete = async (producto: Inventario) => {
        if (!confirm(`¿Eliminar ${producto.nombre_producto}?`)) return
        const { error } = await supabase.from('inventario').delete().eq('id_producto', producto.id_producto)
        if (error) {
            toast('Error al eliminar', 'error')
        } else {
            toast('Producto eliminado', 'success')
            loadProductos()
        }
    }

    const stockVariant = (estado: string | null): 'success' | 'warning' | 'destructive' => {
        if (estado === 'disponible') return 'success'
        if (estado === 'bajo') return 'warning'
        return 'destructive'
    }

    if (loading || orgLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const productosBajos = productos.filter(p => p.estado_stock === 'bajo' || p.estado_stock === 'agotado')

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Package className="h-8 w-8" />
                        Inventario
                    </h1>
                    <p className="text-muted-foreground mt-1">{productos.length} productos</p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                </Button>
            </div>

            {productosBajos.length > 0 && (
                <Card className="border-yellow-500 bg-yellow-50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="text-yellow-800">
                            {productosBajos.length} producto{productosBajos.length > 1 ? 's' : ''} con stock bajo o agotado
                        </span>
                    </CardContent>
                </Card>
            )}

            {productos.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">Sin productos</h3>
                        <Button onClick={() => setModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Producto
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {productos.map((producto) => (
                        <Card key={producto.id_producto} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{producto.nombre_producto}</h3>
                                        {producto.sku_codigo && (
                                            <p className="text-sm text-muted-foreground">SKU: {producto.sku_codigo}</p>
                                        )}
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant={stockVariant(producto.estado_stock)}>
                                                {producto.cantidad_actual || 0} unidades
                                            </Badge>
                                            {producto.precio_venta && (
                                                <Badge variant="outline">{formatCurrency(producto.precio_venta)}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditing(producto); setModalOpen(true) }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(producto)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <ProductoModal
                open={modalOpen}
                onClose={(refresh) => { setModalOpen(false); setEditing(null); if (refresh) loadProductos() }}
                producto={editing}
                orgId={orgId}
            />
        </div>
    )
}

function ProductoModal({ open, onClose, producto, orgId }: {
    open: boolean
    onClose: (refresh?: boolean) => void
    producto: Inventario | null
    orgId: string
}) {
    const [loading, setLoading] = useState(false)
    const [nombre, setNombre] = useState('')
    const [sku, setSku] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [precioCosto, setPrecioCosto] = useState('')
    const [precioVenta, setPrecioVenta] = useState('')
    const [proveedor, setProveedor] = useState('')
    const supabase = createClient()
    const isEdit = !!producto

    useEffect(() => {
        if (producto) {
            setNombre(producto.nombre_producto)
            setSku(producto.sku_codigo || '')
            setCantidad(producto.cantidad_actual?.toString() || '')
            setPrecioCosto(producto.precio_costo?.toString() || '')
            setPrecioVenta(producto.precio_venta?.toString() || '')
            setProveedor(producto.proveedor || '')
        } else {
            setNombre(''); setSku(''); setCantidad(''); setPrecioCosto(''); setPrecioVenta(''); setProveedor('')
        }
    }, [producto, open])

    const calcularEstado = (cant: number): EstadoStock => {
        if (cant <= 0) return 'agotado'
        if (cant <= 5) return 'bajo'
        return 'disponible'
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) { toast('Nombre requerido', 'error'); return }
        setLoading(true)

        const cantidadNum = parseInt(cantidad) || 0
        const data = {
            nombre_producto: nombre,
            sku_codigo: sku || null,
            cantidad_actual: cantidadNum,
            precio_costo: precioCosto ? parseFloat(precioCosto) : null,
            precio_venta: precioVenta ? parseFloat(precioVenta) : null,
            proveedor: proveedor || null,
            estado_stock: calcularEstado(cantidadNum),
        }

        try {
            if (isEdit) {
                const { error } = await supabase.from('inventario').update(data).eq('id_producto', producto.id_producto)
                if (error) throw error
                toast('Producto actualizado', 'success')
            } else {
                const { error } = await supabase.from('inventario').insert({ ...data, org_id: orgId })
                if (error) throw error
                toast('Producto creado', 'success')
            }
            onClose(true)
        } catch (err: any) {
            toast(err.message || 'Error', 'error')
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">{isEdit ? 'Editar' : 'Nuevo'} Producto</h2>
                    <button onClick={() => onClose()}><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <Label>Nombre *</Label>
                        <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Aceite esencial" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>SKU</Label>
                            <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="ACE-001" />
                        </div>
                        <div>
                            <Label>Cantidad</Label>
                            <Input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="10" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Precio Costo</Label>
                            <Input type="number" step="0.01" value={precioCosto} onChange={(e) => setPrecioCosto(e.target.value)} />
                        </div>
                        <div>
                            <Label>Precio Venta</Label>
                            <Input type="number" step="0.01" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label>Proveedor</Label>
                        <Input value={proveedor} onChange={(e) => setProveedor(e.target.value)} placeholder="Nombre del proveedor" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onClose()}>Cancelar</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
