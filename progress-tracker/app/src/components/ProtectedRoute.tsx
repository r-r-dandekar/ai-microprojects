import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  managerOnly?: boolean
}

export default function ProtectedRoute({ managerOnly = false }: Props) {
  const { currentUser, loading } = useAuth()

  if (loading) return null

  if (!currentUser) return <Navigate to="/login" replace />

  if (managerOnly && currentUser.role !== 'manager') return <Navigate to="/" replace />

  return <Outlet />
}
