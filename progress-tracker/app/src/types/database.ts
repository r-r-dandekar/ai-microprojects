export type TaskStatus = 'pending' | 'in_progress' | 'under_review' | 'completed' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high'
export type UserRole = 'manager' | 'employee'

export interface Department {
  id: string
  name: string
  created_at: string
}

export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  department_id: string | null
  created_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  status_note: string | null
  priority: TaskPriority
  due_date: string | null
  assignee_id: string | null
  created_by: string
  department_id: string
  created_at: string
  assignee?: { id: string; username: string } | null
  department?: { id: string; name: string } | null
}
