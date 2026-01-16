import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Button } from '../../components/ui/button'
import { PlayCircle, MessageCircle, Star, ChevronLeft, Send, Lock, CheckCircle, TrendingUp } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'

// Types
type Module = {
    id: string
    title: string
    description: string
    recorded_classes: RecordedClass[]
}

type RecordedClass = {
    id: string
    title: string
    video_url: string
    description: string
    duration: string
}

type Comment = {
    id: string
    user_id: string
    content: string
    rating: number
    created_at: string
    profiles: { full_name: string }
}

export default function VideoLibraryPage() {
    const { user } = useAuth()
    const [modules, setModules] = useState<Module[]>([])
    const [selectedModule, setSelectedModule] = useState<Module | null>(null)
    const [selectedVideo, setSelectedVideo] = useState<RecordedClass | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [newRating, setNewRating] = useState(5)
    const [loading, setLoading] = useState(true)
    const [hasAccess, setHasAccess] = useState(false)
    const [userComment, setUserComment] = useState<Comment | null>(null)

    useEffect(() => {
        checkAccessAndFetch()
    }, [])

    useEffect(() => {
        if (selectedVideo) {
            fetchComments(selectedVideo.id)
        }
    }, [selectedVideo])

    const checkAccessAndFetch = async () => {
        setLoading(true)

        // Simplified: Allow all authenticated users
        // If you want to restrict by membership, uncomment the code below

        /*
        const { data: memberData } = await supabase
            .from('memberships')
            .select('status')
            .eq('user_id', user?.id)
            .eq('status', 'active')
            .single()

        if (!memberData) {
            setHasAccess(false)
            setLoading(false)
            return
        }
        */

        setHasAccess(true)
        fetchModules()
        setLoading(false)
    }

    const fetchModules = async () => {
        const { data, error } = await supabase
            .from('modules')
            .select(`
                *,
                recorded_classes (*)
            `)
            .order('created_at', { ascending: true })
        if (error) console.error(error)
        else setModules(data || [])
    }

    const fetchComments = async (classId: string) => {
        const { data, error } = await supabase
            .from('class_comments')
            .select(`
                *,
                profiles (full_name)
            `)
            .eq('class_id', classId)
            .order('created_at', { ascending: false })

        if (error) console.error(error)
        else {
            setComments(data || [])
            // Check if current user has already commented
            const existingComment = data?.find((c: Comment) => c.user_id === user?.id)
            if (existingComment) {
                setUserComment(existingComment)
                setNewComment(existingComment.content)
                setNewRating(existingComment.rating)
            } else {
                setUserComment(null)
                setNewComment('')
                setNewRating(5)
            }
        }
    }

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedVideo || !newComment.trim()) return

        if (userComment) {
            // Update existing comment
            const { error } = await supabase
                .from('class_comments')
                .update({
                    content: newComment,
                    rating: newRating
                })
                .eq('id', userComment.id)

            if (error) {
                alert(error.message)
            } else {
                fetchComments(selectedVideo.id)
            }
        } else {
            // Create new comment
            const { error } = await supabase.from('class_comments').insert({
                class_id: selectedVideo.id,
                user_id: user?.id,
                content: newComment,
                rating: newRating
            })

            if (error) {
                if (error.code === '23505') { // Unique constraint violation
                    alert('Ya has comentado este video. Puedes editar tu comentario existente.')
                } else {
                    alert(error.message)
                }
            } else {
                fetchComments(selectedVideo.id)
            }
        }
    }

    const getYouTubeVideoId = (url: string) => {
        try {
            if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0]
            if (url.includes('youtube.com/watch?v=')) return url.split('v=')[1].split('&')[0]
            if (url.includes('youtube.com/embed/')) return url.split('embed/')[1].split('?')[0]
            return null
        } catch {
            return null
        }
    }

    const getYouTubeThumbnail = (url: string) => {
        const videoId = getYouTubeVideoId(url)
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/placeholder-video.jpg'
    }

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = getYouTubeVideoId(url)
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url
    }

    const calculateAverageRating = () => {
        if (comments.length === 0) return 0
        const sum = comments.reduce((acc, c) => acc + c.rating, 0)
        return (sum / comments.length).toFixed(1)
    }

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )

    if (!hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 shadow-lg">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 p-6 rounded-full text-white mb-6 shadow-xl">
                    <Lock className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Contenido Exclusivo</h2>
                <p className="text-slate-600 max-w-md leading-relaxed">
                    Esta biblioteca de videos es exclusiva para alumnos con <strong>membresía activa</strong>.
                    Por favor, contacta con administración para activar tu suscripción.
                </p>
            </div>
        )
    }

    // Video Player View
    if (selectedVideo) {
        const avgRating = calculateAverageRating()
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Button
                    variant="ghost"
                    className="pl-0 hover:pl-2 transition-all group"
                    onClick={() => setSelectedVideo(null)}
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Volver a la Biblioteca
                </Button>

                <div className="bg-black aspect-video rounded-2xl overflow-hidden shadow-2xl relative group">
                    <iframe
                        src={getYouTubeEmbedUrl(selectedVideo.video_url)}
                        title={selectedVideo.title}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedVideo.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <PlayCircle className="w-4 h-4" />
                                    {selectedVideo.duration || 'Duración no especificada'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    {avgRating} ({comments.length} valoraciones)
                                </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{selectedVideo.description || 'Sin descripción disponible.'}</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                                <MessageCircle className="w-6 h-6 text-blue-500" />
                                Comentarios y Valoraciones
                            </h3>

                            <form onSubmit={handlePostComment} className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                {userComment && (
                                    <div className="mb-3 text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                                        ℹ️ Estás editando tu comentario anterior
                                    </div>
                                )}
                                <textarea
                                    className="w-full p-4 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder={userComment ? "Edita tu comentario..." : "Comparte tu experiencia con esta clase..."}
                                    rows={3}
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                />
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-600">Tu valoración:</span>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewRating(star)}
                                                    className={cn(
                                                        "transition-all hover:scale-110",
                                                        star <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'
                                                    )}
                                                >
                                                    <Star className="w-6 h-6" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Button size="sm" type="submit" disabled={!newComment.trim()} className="gap-2">
                                        <Send className="w-4 h-4" /> {userComment ? 'Actualizar' : 'Publicar'}
                                    </Button>
                                </div>
                            </form>

                            <div className="space-y-6">
                                {comments.map(comment => (
                                    <div key={comment.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0 hover:bg-slate-50 p-4 rounded-lg transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {comment.profiles?.full_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-800">{comment.profiles?.full_name || 'Usuario'}</h4>
                                                    <p className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(comment.rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-700 leading-relaxed pl-13">{comment.content}</p>
                                    </div>
                                ))}
                                {comments.length === 0 && (
                                    <div className="text-center py-12 text-slate-400">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Sé el primero en comentar esta clase.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg">
                            <h4 className="font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Estadísticas
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="opacity-90">Valoración promedio</span>
                                    <span className="font-bold text-lg">{avgRating} ⭐</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="opacity-90">Total comentarios</span>
                                    <span className="font-bold text-lg">{comments.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="opacity-90">Duración</span>
                                    <span className="font-bold">{selectedVideo.duration}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <h4 className="font-semibold text-green-900">Módulo</h4>
                            </div>
                            <p className="text-green-800 font-medium">{selectedModule?.title}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Module Grid View
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">📚 Biblioteca de Clases</h1>
                <p className="text-slate-500 text-lg">Accede a tus clases grabadas y practica en casa cuando quieras.</p>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((mod) => (
                    <div key={mod.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                        <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <PlayCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{mod.title}</h3>
                                    <p className="text-xs text-slate-400">{mod.recorded_classes?.length || 0} videos disponibles</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2 mb-4">{mod.description}</p>

                            <div className="space-y-2">
                                {mod.recorded_classes?.slice(0, 3).map((video) => (
                                    <button
                                        key={video.id}
                                        onClick={() => { setSelectedModule(mod); setSelectedVideo(video) }}
                                        className="w-full group/video"
                                    >
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-slate-100 hover:border-blue-200 transition-all">
                                            <img
                                                src={getYouTubeThumbnail(video.video_url)}
                                                alt={video.title}
                                                className="w-20 h-12 object-cover rounded-lg shadow-sm"
                                            />
                                            <div className="flex-1 text-left">
                                                <p className="font-medium text-sm text-slate-800 group-hover/video:text-blue-600 transition-colors line-clamp-1">
                                                    {video.title}
                                                </p>
                                                <p className="text-xs text-slate-400">{video.duration}</p>
                                            </div>
                                            <PlayCircle className="w-5 h-5 text-slate-300 group-hover/video:text-blue-500 transition-colors" />
                                        </div>
                                    </button>
                                ))}
                                {(!mod.recorded_classes || mod.recorded_classes.length === 0) && (
                                    <p className="text-xs text-slate-400 italic py-4 text-center">Próximamente videos...</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modules.length === 0 && (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <PlayCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-400 text-lg">No hay módulos disponibles por el momento.</p>
                </div>
            )}
        </div>
    )
}
