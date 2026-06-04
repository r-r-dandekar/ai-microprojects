import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Tasks from '../pages/Tasks'

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../modules/tasks', () => ({
  listTasks: vi.fn(),
  deleteTask: vi.fn(),
}))

vi.mock('../modules/departments', () => ({
  listDepartments: vi.fn().mockResolvedValue([]),
}))

vi.mock('../components/TaskModal', () => ({
  default: () => <div data-testid="task-modal">TaskModal</div>,
}))

vi.mock('../components/StatusModal', () => ({
  default: () => <div data-testid="status-modal">StatusModal</div>,
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

const mockManager = { ...mockEmployee, id: 'mgr-1', role: 'manager' as const }

const mockTasks = [
  {
    id: 'task-1',
    title: 'My Task',
    status: 'pending' as const,
    priority: 'medium' as const,
    due_date: null,
    assignee_id: 'emp-1',
    created_by: 'mgr-1',
    department_id: 'dept-1',
    description: null,
    status_note: null,
    created_at: '',
    assignee: { id: 'emp-1', username: 'employee1' },
    department: { id: 'dept-1', name: 'Engineering' },
  },
  {
    id: 'task-2',
    title: 'Other Task',
    status: 'in_progress' as const,
    priority: 'high' as const,
    due_date: null,
    assignee_id: 'other-emp',
    created_by: 'mgr-1',
    department_id: 'dept-1',
    description: null,
    status_note: null,
    created_at: '',
    assignee: { id: 'other-emp', username: 'other' },
    department: { id: 'dept-1', name: 'Engineering' },
  },
]

function renderTasks() {
  return render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>,
  )
}

describe('Tasks page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders one row per task', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockEmployee, isManager: false })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks)

    renderTasks()

    await waitFor(() => expect(screen.getByTestId('task-table')).toBeInTheDocument())
    expect(screen.getByTestId('task-row-task-1')).toBeInTheDocument()
    expect(screen.getByTestId('task-row-task-2')).toBeInTheDocument()
  })

  it('shows "Update Status" only on tasks assigned to the logged-in employee', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockEmployee, isManager: false })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks)

    renderTasks()

    await waitFor(() => screen.getByTestId('task-table'))
    expect(screen.getByTestId('update-status-task-1')).toBeInTheDocument()
    expect(screen.queryByTestId('update-status-task-2')).not.toBeInTheDocument()
  })

  it('does not show "New Task" button for employees', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockEmployee, isManager: false })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue([])

    renderTasks()

    await waitFor(() => screen.getByTestId('empty-state'))
    expect(screen.queryByTestId('new-task-btn')).not.toBeInTheDocument()
  })

  it('shows "New Task" button for managers', async () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockManager, isManager: true })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue([])

    renderTasks()

    await waitFor(() => expect(screen.getByTestId('new-task-btn')).toBeInTheDocument())
  })

  it('shows Edit and Delete only on tasks the manager created', async () => {
    const managerTask = { ...mockTasks[0], id: 'task-mgr', created_by: 'mgr-1' }
    const otherTask = { ...mockTasks[1], id: 'task-other', created_by: 'other-mgr' }
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: mockManager, isManager: true })
    ;(listTasks as ReturnType<typeof vi.fn>).mockResolvedValue([managerTask, otherTask])

    renderTasks()

    await waitFor(() => screen.getByTestId('task-table'))
    expect(screen.getByTestId('edit-task-mgr')).toBeInTheDocument()
    expect(screen.getByTestId('delete-task-mgr')).toBeInTheDocument()
    expect(screen.queryByTestId('edit-task-other')).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-task-other')).not.toBeInTheDocument()
  })
})
