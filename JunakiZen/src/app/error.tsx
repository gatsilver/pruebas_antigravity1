'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            <div className="text-center text-white p-8">
                <h2 className="text-2xl font-bold mb-4">¡Algo salió mal!</h2>
                <p className="mb-6 text-purple-200">{error.message || 'Ha ocurrido un error inesperado'}</p>
                <Button
                    onClick={() => reset()}
                    className="bg-white text-purple-900 hover:bg-purple-100"
                >
                    Intentar de nuevo
                </Button>
            </div>
        </div>
    )
}
