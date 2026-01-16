import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'

type AuthContextType = {
    session: Session | null
    user: User | null
    role: 'admin' | 'cliente' | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    role: null,
    loading: true,
    signOut: async () => { }
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [role, setRole] = useState<'admin' | 'cliente' | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
            if (!mounted) return
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchRole(session.user.id, mounted)
            } else {
                setLoading(false)
            }
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
            if (!mounted) return
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchRole(session.user.id, mounted)
            } else {
                setRole(null)
                setLoading(false)
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const fetchRole = async (userId: string, mounted = true) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single()

            if (!mounted) return

            if (error) {
                console.error('Error fetching role:', error)
            } else {
                setRole(data?.role as 'admin' | 'cliente')
            }
        } catch (error) {
            console.error('Error fetching role:', error)
        } finally {
            if (mounted) {
                setLoading(false)
            }
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setRole(null)
    }

    return (
        <AuthContext.Provider value={{ session, user, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
