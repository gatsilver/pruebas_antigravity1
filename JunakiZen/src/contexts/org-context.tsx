'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import { User } from '@supabase/supabase-js'

type RolUsuario = Database['public']['Enums']['rol_usuario']

interface OrgContextType {
    user: User | null
    orgId: string
    orgName: string
    rol: RolUsuario | null
    loading: boolean
    perfil: Database['public']['Tables']['perfiles']['Row'] | null
}

const OrgContext = createContext<OrgContextType>({
    user: null,
    orgId: '',
    orgName: '',
    rol: null,
    loading: true,
    perfil: null,
})

export function useOrg() {
    return useContext(OrgContext)
}

interface OrgProviderProps {
    children: ReactNode
    orgId: string
}

export function OrgProvider({ children, orgId }: OrgProviderProps) {
    const [state, setState] = useState<OrgContextType>({
        user: null,
        orgId,
        orgName: '',
        rol: null,
        loading: true,
        perfil: null,
    })

    const supabase = createClient()

    useEffect(() => {
        loadUserAndOrg()
    }, [orgId])

    const loadUserAndOrg = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setState(prev => ({ ...prev, loading: false }))
                return
            }

            // Cargar membresía y org
            const { data: membresia } = await supabase
                .from('membresias')
                .select(`
          rol_en_org,
          organizaciones (nombre_org)
        `)
                .eq('user_id', user.id)
                .eq('org_id', orgId)
                .eq('activo', true)
                .single()

            // Cargar perfil
            const { data: perfil } = await supabase
                .from('perfiles')
                .select('*')
                .eq('id', user.id)
                .single()

            setState({
                user,
                orgId,
                orgName: (membresia?.organizaciones as any)?.nombre_org || '',
                rol: membresia?.rol_en_org || null,
                loading: false,
                perfil,
            })
        } catch (err) {
            console.error('Error loading org context:', err)
            setState(prev => ({ ...prev, loading: false }))
        }
    }

    return (
        <OrgContext.Provider value={state}>
            {children}
        </OrgContext.Provider>
    )
}
