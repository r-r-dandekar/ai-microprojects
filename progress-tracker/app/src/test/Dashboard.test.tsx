import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../modules/tasks', () => ({
  listTasks: vi.fn(),
}))

import { useAuth } from '../contexts/AuthContext'
import { listTasks } from '../modules/tasks'

const mockEmployee = {
  id: 'emp-1',
  email: 'emp@test.com',
  username: 'employee1',
  role: 'employee' as const,
  department_id: 'dept-1',
}

const mockManager = { ...mockEmployee, id: 'mgr-1', role: 'manager' as const, username: 'manager1' }

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(today.getDate() - 1)
const pastDue = yesterday.toISOString().split('T')[0]

const mockTasks = [
  { id: 't1', title: 'Task A', status: 'pending', priority: 'medium', due_date: null, assignee_id: 'emp-1', created_by: 'mgr-1', department_id: 'dept-1', description: null, status_note: null, created_at: '', department: { id: 'dept-1', name: 'Engineering' }, assignee: { id: 'emp-1', username: 'employee1' } },
  { id: 't2', title: 'Task B', status: 'completed', priority: 'high', due_date: null, assignee_id: 'emp-1', created_by: 'mgr-1', department_id: 'dept-1', description: null, status_note: null, created_at: '', department: { id: 'dept-1', name: 'Engineering' }, assignee: null },
  { id: 't3', title: 'Overdue Task', status: 'in_progress', priority: 'high', due_date: pastDue, assignee_id: 'emp-1', created_by: 'mgr-1', department_id: 'dept-1', description: null, status_note: null, created_at: '', department: { id: 'dept-1', name: 'Engineering' }, assignee: null },
]

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<div data-testid="tasks-page">Tasks</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Dashboard', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders five status cards', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockEmployee, isManager: false })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks)

    renderDashboard()

    await waitFor(() => expect(screen.getByTestId('status-cards')).toBeInTheDocument())
    expect(screen.getByTestId('status-card-pending')).toBeInTheDocument()
    expect(screen.getByTestId('status-card-in_progress')).toBeInTheDocument()
    expect(screen.getByTestId('status-card-under_review')).toBeInTheDocument()
    expect(screen.getByTestId('status-card-completed')).toBeInTheDocument()
    expect(screen.getByTestId('status-card-blocked')).toBeInTheDocument()
  })

  it('displays correct task counts per status', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockEmployee, isManager: false })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks)

    renderDashboard()

    await waitFor(() => expect(screen.getByTestId('count-pending').textContent).toBe('1'))
    expect(screen.getByTestId('count-completed').textContent).toBe('1')
    expect(screen.getByTestId('count-in_progress').textContent).toBe('1')
    expect(screen.getByTestId('count-blocked').textContent).toBe('0')
  })

  it('shows overdue task in overdue section', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockEmployee, isManager: false })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks)

    renderDashboard()

    await waitFor(() => expect(screen.getByTestId('overdue-table')).toBeInTheDocument())
    expect(screen.getByText('Overdue Task')).toBeInTheDocument()
  })

  it('does not show completed tasks in overdue section', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockEmployee, isManager: false })
    const completedOverdue = [{ ...mockTasks[1], due_date: pastDue }]
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue(completedOverdue)

    renderDashboard()

    await waitFor(() => expect(screen.getByTestId('no-overdue')).toBeInTheDocument())
  })

  it('clicking a status card navigates to /tasks?status=<status>', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockEmployee, isManager: false })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue([])

    renderDashboard()

    await waitFor(() => expect(screen.getByTestId('status-card-pending')).toBeInTheDocument())
    await userEvent.click(screen.getByTestId('status-card-pending'))

    expect(screen.getByTestId('tasks-page')).toBeInTheDocument()
  })

  it('shows department breakdown table for managers', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockManager, isManager: true })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks)

    renderDashboard()

    await waitFor(() => expect(screen.getByTestId('dept-breakdown')).toBeInTheDocument())
  })

  it('does not show department breakdown for employees', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockEmployee, isManager: false })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks)

    renderDashboard()

    await waitFor(() => screen.getByTestId('status-cards'))
    expect(screen.queryByTestId('dept-breakdown')).not.toBeInTheDocument()
  })
})
