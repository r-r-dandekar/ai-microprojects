import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

import { signup, login, logout, getSession } from '../modules/auth'
import { supabase } from '../lib/supabase'
import bcrypt from 'bcryptjs'

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
  role: 'employee',
  department_id: 'dept-1',
}

const mockUserWithHash = { ...mockUser, password_hash: '$2a$10$hashed' }

// In-memory localStorage stub — no jsdom required
function makeLocalStorageStub() {
  const store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  }
}

function makeChain(result: { data?: unknown; error?: unknown }) {
  const chain: Record<string, unknown> = {}
  const terminal = () => Promise.resolve(result)
  ;['select', 'insert', 'eq', 'ilike', 'order'].forEach(m => {
    chain[m] = vi.fn(() => chain)
  })
  chain.single = vi.fn(terminal)
  return chain
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('localStorage', makeLocalStorageStub())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('auth — signup', () => {
  it('hashes password before storing', async () => {
    ;(bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('$2a$10$hashed')
    const chain = makeChain({ data: mockUser, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await signup('test@example.com', 'testuser', 'password123', 'employee', 'dept-1')

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
  })

  it('writes session without password_hash to localStorage', async () => {
    ;(bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('$2a$10$hashed')
    const chain = makeChain({ data: mockUser, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await signup('test@example.com', 'testuser', 'password123', 'employee', 'dept-1')

    const session = JSON.parse(localStorage.getItem('abc_session')!)
    expect(session.email).toBe('test@example.com')
    expect(session.password_hash).toBeUndefined()
  })

  it('throws "Email already in use" on duplicate email', async () => {
    ;(bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('$2a$10$hashed')
    const chain = makeChain({ data: null, error: { code: '23505', message: 'users_email_key' } })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await expect(
      signup('test@example.com', 'testuser', 'password123', 'employee', 'dept-1'),
    ).rejects.toThrow('Email already in use')
  })

  it('throws "Username already taken" on duplicate username', async () => {
    ;(bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('$2a$10$hashed')
    const chain = makeChain({ data: null, error: { code: '23505', message: 'users_username_key' } })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await expect(
      signup('test@example.com', 'testuser', 'password123', 'employee', 'dept-1'),
    ).rejects.toThrow('Username already taken')
  })
})

describe('auth — login', () => {
  it('queries by email when identifier contains @', async () => {
    const chain = makeChain({ data: mockUserWithHash, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)
    ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true)

    await login('test@example.com', 'password123')

    expect(chain.eq).toHaveBeenCalledWith('email', 'test@example.com')
  })

  it('queries by username when identifier has no @', async () => {
    const chain = makeChain({ data: mockUserWithHash, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)
    ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true)

    await login('testuser', 'password123')

    expect(chain.eq).toHaveBeenCalledWith('username', 'testuser')
  })

  it('writes session without password_hash on success', async () => {
    const chain = makeChain({ data: mockUserWithHash, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)
    ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true)

    await login('testuser', 'password123')

    const session = JSON.parse(localStorage.getItem('abc_session')!)
    expect(session.id).toBe('user-1')
    expect(session.password_hash).toBeUndefined()
  })

  it('throws on wrong password', async () => {
    const chain = makeChain({ data: mockUserWithHash, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)
    ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false)

    await expect(login('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials')
  })

  it('does not write session when password is wrong', async () => {
    const chain = makeChain({ data: mockUserWithHash, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)
    ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false)

    try { await login('testuser', 'wrongpassword') } catch { /* expected */ }

    expect(localStorage.getItem('abc_session')).toBeNull()
  })

  it('throws when user is not found', async () => {
    const chain = makeChain({ data: null, error: { message: 'No rows found' } })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await expect(login('unknown', 'password123')).rejects.toThrow('Invalid credentials')
  })
})

describe('auth — logout', () => {
  it('removes session from localStorage', () => {
    localStorage.setItem('abc_session', JSON.stringify(mockUser))
    logout()
    expect(localStorage.getItem('abc_session')).toBeNull()
  })
})

describe('auth — getSession', () => {
  it('returns null when localStorage is empty', () => {
    expect(getSession()).toBeNull()
  })

  it('returns the stored user object', () => {
    localStorage.setItem('abc_session', JSON.stringify(mockUser))
    expect(getSession()).toEqual(mockUser)
  })

  it('returns null for corrupted data', () => {
    localStorage.setItem('abc_session', 'not-json{{{')
    expect(getSession()).toBeNull()
  })
})
