'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    message: string
    type: ToastType
}

let toastListeners: ((toast: Toast) => void)[] = []

export function toast(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).substring(7)
    toastListeners.forEach(listener => listener({ id, message, type }))
}

export function Toaster() {
    const [toasts, setToasts] = useState<Toast[]>([])

    useEffect(() => {
        const listener = (newToast: Toast) => {
            setToasts(prev => [...prev, newToast])
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== newToast.id))
            }, 5000)
        }
        toastListeners.push(listener)
        return () => {
            toastListeners = toastListeners.filter(l => l !== listener)
        }
    }, [])

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle,
    }

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map(t => {
                const Icon = icons[t.type]
                return (
                    <div
                        key={t.id}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg min-w-[300px] animate-in slide-in-from-right',
                            colors[t.type]
                        )}
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        <p className="flex-1 text-sm">{t.message}</p>
                        <button
                            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                            className="shrink-0 hover:opacity-70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
