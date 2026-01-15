import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Plus, Trash2, ChevronDown, ChevronRight, PlayCircle, Star, MessageCircle, Edit, BarChart3, TrendingUp, Eye } from 'lucide-react'
import { cn } from '../../lib/utils'

// Types
type Module = {
    id: string
    title: string
    description: string
    recorded_classes?: RecordedClass[]
}

type RecordedClass = {
    id: string
    module_id: string
    title: string
    video_url: string
    description: string
    duration: string
    stats?: {
        avgRating: number
        totalComments: number
        totalViews: number
    }
}

type VideoComment = {
    id: string
    content: string
    rating: number
    created_at: string
    profiles: { full_name: string }
}

export default function RecordedClassesPage() {
    const [modules, setModules] = useState<Module[]>([])
    const [expandedModule, setExpandedModule] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    // Modals
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
    const [newModule, setNewModule] = useState({ title: '', description: '' })

    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
    const [newVideo, setNewVideo] = useState({ title: '', video_url: '', description: '', duration: '' })

    const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState(false)
    const [editingVideo, setEditingVideo] = useState<RecordedClass | null>(null)

    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
    const [selectedVideoStats, setSelectedVideoStats] = useState<RecordedClass | null>(null)
    const [videoComments, setVideoComments] = useState<VideoComment[]>([])

    useEffect(() => {
        fetchModules()
    }, [])

    const fetchModules = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('modules')
            .select(`
                *,
                recorded_classes (*)
            `)
            .order('created_at', { ascending: true })

        if (error) console.error(error)
        else {
            // Fetch stats for each video
            const modulesWithStats = await Promise.all((data || []).map(async (mod) => {
                if (mod.recorded_classes) {
                    const classesWithStats = await Promise.all(mod.recorded_classes.map(async (video: RecordedClass) => {
                        const stats = await fetchVideoStats(video.id)
                        return { ...video, stats }
                    }))
                    return { ...mod, recorded_classes: classesWithStats }
                }
                return mod
            }))
            setModules(modulesWithStats)
        }
        setLoading(false)
    }

    const fetchVideoStats = async (videoId: string) => {
        const { data: comments } = await supabase
            .from('class_comments')
            .select('rating')
            .eq('class_id', videoId)

        const totalComments = comments?.length || 0
        const avgRating = totalComments > 0
            ? comments.reduce((acc, c) => acc + c.rating, 0) / totalComments
            : 0

        return {
            avgRating: Number(avgRating.toFixed(1)),
            totalComments,
            totalViews: 0 // Placeholder for future implementation
        }
    }

    const fetchVideoComments = async (videoId: string) => {
        const { data, error } = await supabase
            .from('class_comments')
            .select(`
                *,
                profiles (full_name)
            `)
            .eq('class_id', videoId)
            .order('created_at', { ascending: false })

        if (error) console.error(error)
        else setVideoComments(data || [])
    }

    const handleCreateModule = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.from('modules').insert([newModule])

        if (error) {
            console.error('Error creating module:', error)
            if (error.code === '42P01') {
                alert("Error Crítico: Las tablas de la base de datos no existen.\n\nPor favor, ejecuta el script 'migration_recorded_classes.sql' en el Editor SQL de Supabase.")
            } else {
                alert(`Error al crear módulo: ${error.message}`)
            }
        } else {
            setIsModuleModalOpen(false)
            setNewModule({ title: '', description: '' })
            fetchModules()
        }
    }

    const handleAddVideo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedModuleId) return
        const { error } = await supabase.from('recorded_classes').insert([{ ...newVideo, module_id: selectedModuleId }])
        if (error) alert(error.message)
        else {
            setIsVideoModalOpen(false)
            setNewVideo({ title: '', video_url: '', description: '', duration: '' })
            fetchModules()
        }
    }

    const handleUpdateVideo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingVideo) return

        const { error } = await supabase
            .from('recorded_classes')
            .update({
                title: editingVideo.title,
                video_url: editingVideo.video_url,
                description: editingVideo.description,
                duration: editingVideo.duration
            })
            .eq('id', editingVideo.id)

        if (error) alert(error.message)
        else {
            setIsEditVideoModalOpen(false)
            setEditingVideo(null)
            fetchModules()
        }
    }

    const handleDeleteModule = async (id: string) => {
        if (!confirm('¿Eliminar módulo y todos sus videos?')) return
        await supabase.from('modules').delete().eq('id', id)
        fetchModules()
    }

    const handleDeleteVideo = async (id: string) => {
        if (!confirm('¿Eliminar video?')) return
        await supabase.from('recorded_classes').delete().eq('id', id)
        fetchModules()
    }

    const openStatsModal = async (video: RecordedClass) => {
        setSelectedVideoStats(video)
        await fetchVideoComments(video.id)
        setIsStatsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clases Grabadas</h1>
                    <p className="text-slate-500">Gestiona los módulos y videos para tus alumnos.</p>
                </div>
                <Button onClick={() => setIsModuleModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Módulo
                </Button>
            </div>

            <div className="space-y-4">
                {modules.map((mod) => (
                    <div key={mod.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <div
                            className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                        >
                            <div className="flex items-center gap-3">
                                {expandedModule === mod.id ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                <div>
                                    <h3 className="font-semibold text-lg">{mod.title}</h3>
                                    {mod.description && <p className="text-sm text-slate-500">{mod.description}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-slate-200">
                                    {mod.recorded_classes?.length || 0} videos
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => { e.stopPropagation(); setSelectedModuleId(mod.id); setIsVideoModalOpen(true) }}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Video
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteModule(mod.id) }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Videos List with Stats */}
                        {expandedModule === mod.id && (
                            <div className="divide-y divide-slate-100">
                                {mod.recorded_classes && mod.recorded_classes.length > 0 ? (
                                    mod.recorded_classes.map((video) => (
                                        <div key={video.id} className="p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600 flex-shrink-0">
                                                        <PlayCircle className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-slate-900 mb-1">{video.title}</h4>
                                                        <a href={video.video_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-[300px] block mb-2">
                                                            {video.video_url}
                                                        </a>

                                                        {/* Stats Cards */}
                                                        <div className="flex gap-3 mt-3">
                                                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 px-3 py-2 rounded-lg border border-yellow-200 flex items-center gap-2">
                                                                <Star className="w-4 h-4 text-yellow-600 fill-yellow-400" />
                                                                <div>
                                                                    <p className="text-xs text-yellow-700 font-medium">Valoración</p>
                                                                    <p className="text-sm font-bold text-yellow-900">{video.stats?.avgRating || 0} / 5</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200 flex items-center gap-2">
                                                                <MessageCircle className="w-4 h-4 text-blue-600" />
                                                                <div>
                                                                    <p className="text-xs text-blue-700 font-medium">Comentarios</p>
                                                                    <p className="text-sm font-bold text-blue-900">{video.stats?.totalComments || 0}</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-3 py-2 rounded-lg border border-green-200 flex items-center gap-2">
                                                                <TrendingUp className="w-4 h-4 text-green-600" />
                                                                <div>
                                                                    <p className="text-xs text-green-700 font-medium">Duración</p>
                                                                    <p className="text-sm font-bold text-green-900">{video.duration || 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openStatsModal(video)}
                                                        className="gap-2"
                                                    >
                                                        <Eye className="w-4 h-4" /> Ver Detalles
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => { setEditingVideo(video); setIsEditVideoModalOpen(true) }}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-slate-400 hover:text-red-500"
                                                        onClick={() => handleDeleteVideo(video.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 italic">No hay videos en este módulo aún.</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Module Modal */}
            {isModuleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">Crear Módulo</h2>
                        <form onSubmit={handleCreateModule} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Título</label>
                                <Input required value={newModule.title} onChange={e => setNewModule({ ...newModule, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Descripción</label>
                                <Input value={newModule.description} onChange={e => setNewModule({ ...newModule, description: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setIsModuleModalOpen(false)}>Cancelar</Button>
                                <Button type="submit">Crear</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Video Modal */}
            {isVideoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">Agregar Video</h2>
                        <form onSubmit={handleAddVideo} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Título</label>
                                <Input required value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">URL del Video (YouTube)</label>
                                <Input required value={newVideo.video_url} placeholder="https://youtube.com/..." onChange={e => setNewVideo({ ...newVideo, video_url: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Duración</label>
                                <Input value={newVideo.duration} placeholder="Ej: 45 min" onChange={e => setNewVideo({ ...newVideo, duration: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Descripción</label>
                                <Input value={newVideo.description} onChange={e => setNewVideo({ ...newVideo, description: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setIsVideoModalOpen(false)}>Cancelar</Button>
                                <Button type="submit">Agregar Video</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Video Modal */}
            {isEditVideoModalOpen && editingVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">Editar Video</h2>
                        <form onSubmit={handleUpdateVideo} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Título</label>
                                <Input required value={editingVideo.title} onChange={e => setEditingVideo({ ...editingVideo, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">URL del Video (YouTube)</label>
                                <Input required value={editingVideo.video_url} onChange={e => setEditingVideo({ ...editingVideo, video_url: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Duración</label>
                                <Input value={editingVideo.duration} placeholder="Ej: 45 min" onChange={e => setEditingVideo({ ...editingVideo, duration: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Descripción</label>
                                <Input value={editingVideo.description} onChange={e => setEditingVideo({ ...editingVideo, description: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setIsEditVideoModalOpen(false)}>Cancelar</Button>
                                <Button type="submit">Guardar Cambios</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats Modal */}
            {isStatsModalOpen && selectedVideoStats && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-2xl my-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedVideoStats.title}</h2>
                                <p className="text-sm text-slate-500 mt-1">Estadísticas y Comentarios</p>
                            </div>
                            <Button variant="ghost" onClick={() => setIsStatsModalOpen(false)}>✕</Button>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-xl text-white shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <Star className="w-8 h-8 fill-white" />
                                    <div>
                                        <p className="text-sm opacity-90">Valoración Promedio</p>
                                        <p className="text-3xl font-bold">{selectedVideoStats.stats?.avgRating || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-6 rounded-xl text-white shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <MessageCircle className="w-8 h-8" />
                                    <div>
                                        <p className="text-sm opacity-90">Total Comentarios</p>
                                        <p className="text-3xl font-bold">{selectedVideoStats.stats?.totalComments || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-xl text-white shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <BarChart3 className="w-8 h-8" />
                                    <div>
                                        <p className="text-sm opacity-90">Engagement</p>
                                        <p className="text-3xl font-bold">{selectedVideoStats.stats?.totalComments ? '🔥' : '😴'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="bg-slate-50 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-blue-600" />
                                Comentarios de Alumnos
                            </h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {videoComments.map(comment => (
                                    <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {comment.profiles?.full_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-800">{comment.profiles?.full_name || 'Usuario'}</h4>
                                                    <p className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleDateString('es-ES')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(comment.rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-700 text-sm leading-relaxed">{comment.content}</p>
                                    </div>
                                ))}
                                {videoComments.length === 0 && (
                                    <div className="text-center py-12 text-slate-400">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Aún no hay comentarios para este video.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
