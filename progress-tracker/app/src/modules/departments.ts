import { supabase } from '../lib/supabase'
import type { Department } from '../types/database'

export type { Department }

export async function listDepartments(): Promise<Department[]> {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

export async function createDepartment(name: string): Promise<Department> {
  const { data, error } = await supabase
    .from('departments')
    .insert({ name })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDepartment(id: string): Promise<void> {
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id)

  if (error) {
    if (error.code === '23503') throw new Error('Cannot delete — this department still has tasks assigned to it.')
    throw new Error(error.message ?? 'Failed to delete department')
  }
}
