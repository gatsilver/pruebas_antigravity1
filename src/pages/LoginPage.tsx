import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            if (data.session) {
                // Redirection is handled by the ProtectedRoute / App logic based on role, 
                // but we can look up the role here to speed it up or just navigate to root
                // and let the guard redirect.
                // Redirect to main app by default. ProtectedRoute will handle role redirection if needed.
                navigate('/app')
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="mx-auto w-full max-w-[350px] space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Bienvenido</h1>
                        <p className="text-sm text-slate-500">
                            Ingresa tus credenciales para acceder al sistema de reservas
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nombre@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Contraseña</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Iniciar Sesión
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="font-medium text-slate-900 hover:underline">
                            Regístrate aquí
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Decoration */}
            <div className="hidden lg:block bg-slate-100 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop"
                    alt="Pilates Studio"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/20" />
                <div className="absolute bottom-10 left-10 text-white p-6">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "El cambio ocurre a través del movimiento y el movimiento cura."
                        </p>
                        <footer className="text-sm bg-black/20 text-white backdrop-blur-sm px-4 py-2 rounded-full inline-block">Pilates Studio System</footer>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}
