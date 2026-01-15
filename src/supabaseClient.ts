// import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase Config:', { supabaseUrl, supabaseAnonKey })

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

// @ts-ignore
const supabaseLib = window.supabase || window.Supabase

if (!supabaseLib) {
    console.error('CRITICAL: Supabase Global Object not found!', window)
    throw new Error('Supabase SDK not loaded')
}

const createClient = supabaseLib.createClient

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
