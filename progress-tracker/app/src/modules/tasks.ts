import { supabase } from '../lib/supabase'
import type { Task, TaskStatus, TaskPriority } from '../types/database'
import type { SessionUser } from './auth'

export type { Task, TaskStatus, TaskPriority }

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  department_id?: string
  search?: string
}

export interface CreateTaskData {
  title: string
  description?: string
  priority: TaskPriority
  due_date?: string
  assignee_id?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  priority?: TaskPriority
  due_date?: string
  assignee_id?: string
  status?: TaskStatus
  status_note?: string
}

export async function listTasks(currentUser: SessionUser, filters?: TaskFilters): Promise<Task[]> {
  let query = supabase
    .from('tasks')
    .select('*, assignee:assignee_id(id, username), department:department_id(id, name)')
    .order('created_at', { ascending: false })

  if (currentUser.role === 'employee') {
    query = query.eq('department_id', currentUser.department_id)
  }

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.priority) query = query.eq('priority', filters.priority)
  if (filters?.department_id) query = query.eq('department_id', filters.department_id)
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createTask(data: CreateTaskData, currentUser: SessionUser): Promise<Task> {
  if (currentUser.role !== 'manager') throw new Error('Only managers can create tasks')
  if (!currentUser.department_id) throw new Error('Please set your department before creating tasks')

  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      ...data,
      created_by: currentUser.id,
      department_id: currentUser.department_id,
    })
    .select('*, assignee:assignee_id(id, username), department:department_id(id, name)')
    .single()

  if (error) throw error
  return task
}

export async function updateTask(id: string, updates: UpdateTaskData, currentUser: SessionUser): Promise<Task> {
  const { data: existing, error: fetchError } = await supabase
    .from('tasks')
    .select('assignee_id, created_by, department_id')
    .eq('id', id)
    .single()

  if (fetchError || !existing) throw new Error('Task not found')

  let payload: UpdateTaskData

  if (currentUser.role === 'employee') {
    if (existing.assignee_id !== currentUser.id) throw new Error('Not authorized')
    payload = {
      ...(updates.status !== undefined ? { status: updates.status } : {}),
      ...(updates.status_note !== undefined ? { status_note: updates.status_note } : {}),
    }
  } else {
    if (existing.created_by !== currentUser.id) throw new Error('Not authorized')
    payload = updates
  }

  const { data: task, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .select('*, assignee:assignee_id(id, username), department:department_id(id, name)')
    .single()

  if (error) throw error
  return task
}

export async function deleteTask(id: string, currentUser: SessionUser): Promise<void> {
  if (currentUser.role !== 'manager') throw new Error('Only managers can delete tasks')

  const { data: existing, error: fetchError } = await supabase
    .from('tasks')
    .select('created_by')
    .eq('id', id)
    .single()

  if (fetchError || !existing) throw new Error('Task not found')
  if (existing.created_by !== currentUser.id) throw new Error('Not authorized')

  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}
