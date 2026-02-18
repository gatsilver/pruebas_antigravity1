'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/org-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { Plus, Lightbulb, Loader2, X } from 'lucide-react'
import { Database } from '@/types/supabase'

type Idea = Database['public']['Tables']['ideas']['Row']

export default function IdeasPage() {
    const { orgId, user, loading: orgLoading } = useOrg()
    const [ideas, setIdeas] = useState<Idea[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (!orgLoading && orgId) loadIdeas()
    }, [orgId, orgLoading])

    const loadIdeas = async () => {
        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .eq('org_id', orgId)
            .order('fecha_idea', { ascending: false })

        if (error) {
            toast('Error al cargar ideas', 'error')
        } else {
            setIdeas(data || [])
        }
        setLoading(false)
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
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Lightbulb className="h-8 w-8" />
                        Ideas
                    </h1>
                    <p className="text-muted-foreground mt-1">Captura y organiza tus ideas</p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Idea
                </Button>
            </div>

            {ideas.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">Sin ideas registradas</h3>
                        <Button onClick={() => setModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Idea
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ideas.map((idea) => (
                        <Card key={idea.id_idea} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{idea.idea_principal}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {idea.detalle_idea && <p className="text-sm text-muted-foreground mb-2">{idea.detalle_idea}</p>}
                                <div className="flex justify-between items-center mt-2">
                                    {idea.impacto && <Badge variant="secondary">{idea.impacto}</Badge>}
                                    {idea.fecha_idea && (
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(idea.fecha_idea).toLocaleDateString('es-PE')}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {modalOpen && (
                <IdeaModal
                    onClose={(refresh) => { setModalOpen(false); if (refresh) loadIdeas() }}
                    orgId={orgId}
                    userId={user?.id || ''}
                />
            )}
        </div>
    )
}

function IdeaModal({ onClose, orgId, userId }: {
    onClose: (refresh?: boolean) => void
    orgId: string
    userId: string
}) {
    const [loading, setLoading] = useState(false)
    const [titulo, setTitulo] = useState('')
    const [detalle, setDetalle] = useState('')
    const [impacto, setImpacto] = useState('')
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!titulo.trim()) { toast('El título es requerido', 'error'); return }
        setLoading(true)

        const { error } = await supabase.from('ideas').insert({
            org_id: orgId,
            autor_id: userId || null,
            idea_principal: titulo,
            detalle_idea: detalle || null,
            impacto: impacto || null,
            fecha_idea: new Date().toISOString().split('T')[0],
        })

        if (error) {
            toast(error.message, 'error')
        } else {
            toast('Idea guardada', 'success')
            onClose(true)
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">Nueva Idea</h2>
                    <button onClick={() => onClose()}><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <Label>Título *</Label>
                        <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Mi idea brillante" required />
                    </div>
                    <div>
                        <Label>Detalle</Label>
                        <textarea
                            value={detalle}
                            onChange={(e) => setDetalle(e.target.value)}
                            placeholder="Descripción de la idea..."
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <Label>Impacto</Label>
                        <select
                            value={impacto}
                            onChange={(e) => setImpacto(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Sin definir</option>
                            <option value="alto">Alto</option>
                            <option value="medio">Medio</option>
                            <option value="bajo">Bajo</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onClose()}>Cancelar</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
