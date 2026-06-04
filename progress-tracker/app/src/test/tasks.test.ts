import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

import { listTasks, createTask, updateTask, deleteTask } from '../modules/tasks'
import { supabase } from '../lib/supabase'
import type { SessionUser } from '../modules/auth'

const manager: SessionUser = {
  id: 'mgr-1',
  email: 'mgr@test.com',
  username: 'manager1',
  role: 'manager',
  department_id: 'dept-1',
}

const employee: SessionUser = {
  id: 'emp-1',
  email: 'emp@test.com',
  username: 'employee1',
  role: 'employee',
  department_id: 'dept-1',
}

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: null,
  status: 'pending' as const,
  status_note: null,
  priority: 'medium' as const,
  due_date: null,
  assignee_id: 'emp-1',
  created_by: 'mgr-1',
  department_id: 'dept-1',
  created_at: '2026-01-01T00:00:00Z',
}

function makeListChain(result: { data?: unknown; error?: unknown }) {
  const chain: Record<string, unknown> = {}
  ;['select', 'eq', 'ilike', 'order'].forEach(m => { chain[m] = vi.fn(() => chain) })
  // Make chain thenable so `await chain` resolves to result
  chain.then = vi.fn((resolve: (v: unknown) => void) => resolve(result))
  return chain
}

function makeSingleChain(result: { data?: unknown; error?: unknown }) {
  const chain: Record<string, unknown> = {}
  ;['select', 'insert', 'update', 'delete', 'eq', 'ilike', 'order'].forEach(m => {
    chain[m] = vi.fn(() => chain)
  })
  chain.single = vi.fn(() => Promise.resolve(result))
  return chain
}

describe('tasks — listTasks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('does not filter by department for managers', async () => {
    const chain = makeListChain({ data: [mockTask], error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await listTasks(manager)

    const eqCalls = (chain.eq as ReturnType<typeof vi.fn>).mock.calls
    const deptFilter = eqCalls.find((args: unknown[]) => args[0] === 'department_id')
    expect(deptFilter).toBeUndefined()
  })

  it('filters by department for employees', async () => {
    const chain = makeListChain({ data: [mockTask], error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await listTasks(employee)

    expect(chain.eq).toHaveBeenCalledWith('department_id', 'dept-1')
  })

  it('applies status filter when provided', async () => {
    const chain = makeListChain({ data: [], error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await listTasks(manager, { status: 'completed' })

    expect(chain.eq).toHaveBeenCalledWith('status', 'completed')
  })
})

describe('tasks — createTask', () => {
  beforeEach(() => vi.clearAllMocks())

  it('inserts with created_by and department_id from current user', async () => {
    const chain = makeSingleChain({ data: mockTask, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await createTask({ title: 'Test Task', priority: 'medium' }, manager)

    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ created_by: 'mgr-1', department_id: 'dept-1' }),
    )
  })

  it('throws when caller is an employee', async () => {
    await expect(
      createTask({ title: 'Test Task', priority: 'medium' }, employee),
    ).rejects.toThrow('Only managers can create tasks')
  })
})

describe('tasks — updateTask', () => {
  beforeEach(() => vi.clearAllMocks())

  it('allows employee to update status and status_note on their own task', async () => {
    const fetchChain = makeSingleChain({ data: { assignee_id: 'emp-1', created_by: 'mgr-1', department_id: 'dept-1' }, error: null })
    const updateChain = makeSingleChain({ data: { ...mockTask, status: 'in_progress' }, error: null })

    let callCount = 0
    ;(supabase.from as ReturnType<typeof vi.fn>).mockImplementation(() => {
      return callCount++ === 0 ? fetchChain : updateChain
    })

    const result = await updateTask('task-1', { status: 'in_progress', status_note: 'Working on it' }, employee)
    expect(result.status).toBe('in_progress')
  })

  it('throws when employee tries to update a task not assigned to them', async () => {
    const fetchChain = makeSingleChain({ data: { assignee_id: 'other-emp', created_by: 'mgr-1', department_id: 'dept-1' }, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(fetchChain)

    await expect(
      updateTask('task-1', { status: 'completed' }, employee),
    ).rejects.toThrow('Not authorized')
  })

  it('throws when manager tries to update a task they did not create', async () => {
    const fetchChain = makeSingleChain({ data: { assignee_id: 'emp-1', created_by: 'other-mgr', department_id: 'dept-1' }, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(fetchChain)

    await expect(
      updateTask('task-1', { title: 'New title' }, manager),
    ).rejects.toThrow('Not authorized')
  })
})

describe('tasks — deleteTask', () => {
  beforeEach(() => vi.clearAllMocks())

  it('throws when caller is an employee', async () => {
    await expect(deleteTask('task-1', employee)).rejects.toThrow('Only managers can delete tasks')
  })

  it('throws when manager did not create the task', async () => {
    const fetchChain = makeSingleChain({ data: { created_by: 'other-mgr' }, error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(fetchChain)

    await expect(deleteTask('task-1', manager)).rejects.toThrow('Not authorized')
  })

  it('succeeds when manager created the task', async () => {
    const fetchChain = makeSingleChain({ data: { created_by: 'mgr-1' }, error: null })
    const deleteChain = makeSingleChain({ data: null, error: null })

    let callCount = 0
    ;(supabase.from as ReturnType<typeof vi.fn>).mockImplementation(() => {
      return callCount++ === 0 ? fetchChain : deleteChain
    })

    await expect(deleteTask('task-1', manager)).resolves.toBeUndefined()
  })
})
