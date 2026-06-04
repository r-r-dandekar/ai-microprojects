import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

import { listDepartments, createDepartment } from '../modules/departments'
import { supabase } from '../lib/supabase'

const mockDepts = [
  { id: 'dept-1', name: 'Engineering', created_at: '2026-01-01T00:00:00Z' },
  { id: 'dept-2', name: 'Marketing', created_at: '2026-01-02T00:00:00Z' },
]

function makeChain(result: { data?: unknown; error?: unknown }) {
  const chain: Record<string, unknown> = {}
  const resolved = Promise.resolve(result)
  ;['select', 'insert', 'eq'].forEach(m => { chain[m] = vi.fn(() => chain) })
  chain.order = vi.fn(() => resolved)
  chain.single = vi.fn(() => resolved)
  return chain
}

describe('departments — listDepartments', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns all departments', async () => {
    const chain = makeChain({ data: mockDepts, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    const result = await listDepartments()
    expect(result).toEqual(mockDepts)
  })

  it('throws when Supabase returns an error', async () => {
    const chain = makeChain({ data: null, error: { message: 'connection failed' } })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await expect(listDepartments()).rejects.toBeDefined()
  })
})

describe('departments — createDepartment', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns the newly created department', async () => {
    const chain = makeChain({ data: mockDepts[0], error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    const result = await createDepartment('Engineering')
    expect(result).toEqual(mockDepts[0])
  })

  it('throws on duplicate department name', async () => {
    const chain = makeChain({
      data: null,
      error: { message: 'duplicate key value violates unique constraint "departments_name_key"' },
    })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await expect(createDepartment('Engineering')).rejects.toBeDefined()
  })
})
