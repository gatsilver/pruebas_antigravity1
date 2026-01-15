import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // 1. Sign up the user
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                    },
                },
            })

            if (signUpError) throw signUpError

            if (data.user) {
                // 2. Profile creation is handled by the Database Trigger (handle_new_user)
                // We just need to wait or navigate. 
                // However, triggers can fail silently or async. 
                // For a robust app, we might check, but for now we rely on the trigger.

                // Navigate to dashboard or show success message
                // If email confirmation is enabled, we should show a message.
                // Assuming it's disabled or auto-confirm for now as per usual dev setup,
                // otherwise we show a check email message.
                // Navigate to dashboard or show success message
                // If email confirmation is enabled, we should show a message.
                // Assuming it's disabled or auto-confirm for now as per usual dev setup,
                // otherwise we show a check email message.
                navigate('/app')
            }
        } catch (err: any) {
            setError(err.message || 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Image/Decoration (Reversed from Login for variety) */}
            <div className="hidden lg:block bg-slate-100 relative overflow-hidden order-last lg:order-first">
                <img
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
                    alt="Pilates Reformer"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/20" />
                <div className="absolute bottom-10 left-10 text-white p-6">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "La forma física es el primer requisito para la felicidad."
                        </p>
                        <footer className="text-sm bg-black/20 text-white backdrop-blur-sm px-4 py-2 rounded-full inline-block">Joseph Pilates</footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="mx-auto w-full max-w-[350px] space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Crear Cuenta</h1>
                        <p className="text-sm text-slate-500">
                            Únete para reservar tus clases de Pilates
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium leading-none">Nombre Completo</label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Juan Pérez"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
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
                            <label htmlFor="phone" className="text-sm font-medium leading-none">Teléfono (Opcional)</label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+52 123 456 7890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">Contraseña</label>
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
                            Registrarse
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        Ya tienes cuenta?{' '}
                        <Link to="/login" className="font-medium text-slate-900 hover:underline">
                            Inicia Sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
