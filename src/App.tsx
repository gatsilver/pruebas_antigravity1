import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Loader2 } from 'lucide-react'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLayout from './components/layouts/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage' // New Import
import MembersPage from './pages/admin/MembersPage'
import ClassesPage from './pages/admin/ClassesPage'
import RecordedClassesPage from './pages/admin/RecordedClassesPage'
import ReservationsPage from './pages/admin/ReservationsPage'

import ClientLayout from './components/layouts/ClientLayout'
import SchedulePage from './pages/client/SchedulePage'
import MyReservationsPage from './pages/client/MyReservationsPage'
import VideoLibraryPage from './pages/client/VideoLibraryPage'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: ('admin' | 'cliente')[] }) => {
  const { session, role, loading } = useAuth()

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect based on actual role
    return <Navigate to={role === 'admin' ? '/admin' : '/app'} replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="recorded-classes" element={<RecordedClassesPage />} />
      </Route>

      {/* Client Routes */}
      <Route path="/app" element={
        <ProtectedRoute allowedRoles={['cliente']}>
          <ClientLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="schedule" replace />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="reservations" element={<MyReservationsPage />} />
        <Route path="videos" element={<VideoLibraryPage />} />
      </Route>

      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/app" replace />} />

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
