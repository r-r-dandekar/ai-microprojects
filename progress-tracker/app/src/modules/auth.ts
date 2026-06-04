import { supabase } from '../lib/supabase'
import bcrypt from 'bcryptjs'
import type { UserRole } from '../types/database'

export interface SessionUser {
  id: string
  email: string
  username: string
  role: UserRole
  department_id: string | null
}

const SESSION_KEY = 'abc_session'

export async function signup(
  email: string,
  username: string,
  password: string,
  role: UserRole,
  departmentId?: string | null,
): Promise<SessionUser> {
  const passwordHash = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('users')
    .insert({ email, username, password_hash: passwordHash, role, department_id: departmentId ?? null })
    .select('id, email, username, role, department_id')
    .single()

  if (error) {
    if (error.code === '23505') {
      if (error.message.includes('email')) throw new Error('Email already in use')
      if (error.message.includes('username')) throw new Error('Username already taken')
    }
    throw new Error(error.message ?? 'Sign up failed')
  }

  const session: SessionUser = data
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export async function login(identifier: string, password: string): Promise<SessionUser> {
  const field = identifier.includes('@') ? 'email' : 'username'

  const { data, error } = await supabase
    .from('users')
    .select('id, email, username, password_hash, role, department_id')
    .eq(field, identifier)
    .single()

  if (error) throw new Error(error.message ?? 'Login failed')
  if (!data) throw new Error('Invalid credentials')

  const match = await bcrypt.compare(password, data.password_hash)
  if (!match) throw new Error('Invalid credentials')

  const session: SessionUser = {
    id: data.id,
    email: data.email,
    username: data.username,
    role: data.role,
    department_id: data.department_id,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function updateSession(updates: Partial<SessionUser>): SessionUser | null {
  const current = getSession()
  if (!current) return null
  const updated = { ...current, ...updates }
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
  return updated
}
