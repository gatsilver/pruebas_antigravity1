export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            <div className="text-center text-white p-8">
                <h2 className="text-6xl font-bold mb-4">404</h2>
                <p className="text-xl mb-6 text-purple-200">Página no encontrada</p>
                <a
                    href="/"
                    className="inline-block px-6 py-3 bg-white text-purple-900 rounded-lg hover:bg-purple-100 transition-colors"
                >
                    Volver al inicio
                </a>
            </div>
        </div>
    )
}
