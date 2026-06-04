import { supabase } from '../lib/supabase'

export interface UserSummary {
  id: string
  username: string
}

export async function listDepartmentEmployees(departmentId: string): Promise<UserSummary[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, username')
    .eq('department_id', departmentId)
    .eq('role', 'employee')
    .order('username')

  if (error) throw error
  return data
}

export async function updateUserDepartment(userId: string, departmentId: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ department_id: departmentId })
    .eq('id', userId)

  if (error) throw error
}
