import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  getSession,
  login as authLogin,
  signup as authSignup,
  logout as authLogout,
  updateSession,
} from '../modules/auth'
import type { SessionUser } from '../modules/auth'
import type { UserRole } from '../types/database'

interface AuthContextType {
  currentUser: SessionUser | null
  isManager: boolean
  isEmployee: boolean
  loading: boolean
  login: (identifier: string, password: string) => Promise<void>
  signup: (email: string, username: string, password: string, role: UserRole, departmentId?: string | null) => Promise<void>
  logout: () => void
  refreshSession: (updates: Partial<SessionUser>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setCurrentUser(getSession())
    setLoading(false)
  }, [])

  const login = async (identifier: string, password: string) => {
    const user = await authLogin(identifier, password)
    setCurrentUser(user)
  }

  const signup = async (
    email: string,
    username: string,
    password: string,
    role: UserRole,
    departmentId?: string | null,
  ) => {
    const user = await authSignup(email, username, password, role, departmentId)
    setCurrentUser(user)
  }

  const logout = () => {
    authLogout()
    setCurrentUser(null)
  }

  const refreshSession = (updates: Partial<SessionUser>) => {
    const updated = updateSession(updates)
    if (updated) setCurrentUser(updated)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isManager: currentUser?.role === 'manager',
        isEmployee: currentUser?.role === 'employee',
        loading,
        login,
        signup,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
