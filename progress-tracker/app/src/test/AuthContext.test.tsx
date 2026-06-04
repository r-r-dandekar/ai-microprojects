import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

vi.mock('../modules/auth', () => ({
  getSession: vi.fn(),
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
}))

import * as authModule from '../modules/auth'

const mockManager = {
  id: 'mgr-1',
  email: 'mgr@test.com',
  username: 'manager1',
  role: 'manager' as const,
  department_id: 'dept-1',
}

const mockEmployee = {
  id: 'emp-1',
  email: 'emp@test.com',
  username: 'employee1',
  role: 'employee' as const,
  department_id: 'dept-1',
}

function RoleDisplay() {
  const { isManager, isEmployee, currentUser } = useAuth()
  return (
    <div>
      <span data-testid="is-manager">{String(isManager)}</span>
      <span data-testid="is-employee">{String(isEmployee)}</span>
      <span data-testid="username">{currentUser?.username ?? 'none'}</span>
    </div>
  )
}

function renderWithAuth(session: typeof mockManager | typeof mockEmployee | null) {
  ;(authModule.getSession as ReturnType<typeof vi.fn>).mockReturnValue(session)
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RoleDisplay />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('AuthContext', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sets isManager=true for manager role', () => {
    renderWithAuth(mockManager)
    expect(screen.getByTestId('is-manager').textContent).toBe('true')
    expect(screen.getByTestId('is-employee').textContent).toBe('false')
  })

  it('sets isEmployee=true for employee role', () => {
    renderWithAuth(mockEmployee)
    expect(screen.getByTestId('is-manager').textContent).toBe('false')
    expect(screen.getByTestId('is-employee').textContent).toBe('true')
  })

  it('restores username from session on mount', () => {
    renderWithAuth(mockEmployee)
    expect(screen.getByTestId('username').textContent).toBe('employee1')
  })

  it('shows no user when session is null', () => {
    renderWithAuth(null)
    expect(screen.getByTestId('username').textContent).toBe('none')
  })
})

describe('ProtectedRoute', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders children when user is authenticated', () => {
    ;(authModule.getSession as ReturnType<typeof vi.fn>).mockReturnValue(mockEmployee)
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<div data-testid="protected">Protected Content</div>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('protected')).toBeInTheDocument()
  })

  it('redirects to /login when unauthenticated', () => {
    ;(authModule.getSession as ReturnType<typeof vi.fn>).mockReturnValue(null)
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('login-page')).toBeInTheDocument()
  })

  it('redirects employee to / when accessing manager-only route', () => {
    ;(authModule.getSession as ReturnType<typeof vi.fn>).mockReturnValue(mockEmployee)
    render(
      <MemoryRouter initialEntries={['/departments']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<div data-testid="home">Home</div>} />
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedRoute managerOnly />}>
                <Route path="/departments" element={<div>Departments</div>} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('home')).toBeInTheDocument()
  })
})
