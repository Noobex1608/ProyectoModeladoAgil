// ...existing code...
import { ref } from 'vue'
import { supabase } from '../lib/conectionWithSupabase'
import type { Database } from '../lib/supabase'

type BudgetRow = Database['public']['Tables']['budgets']['Row']
type BudgetInsert = Database['public']['Tables']['budgets']['Insert']
type BudgetUpdate = Database['public']['Tables']['budgets']['Update']

export function useBudget() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAllByUser = async (userId: string): Promise<BudgetRow[] | null> => {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
    loading.value = false
    if (err) {
      error.value = err.message
      return null
    }
    return (data ?? []) as BudgetRow[]
  }

  const fetchById = async (id: string): Promise<BudgetRow | null> => {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .single()
    loading.value = false
    if (err) {
      error.value = err.message
      return null
    }
    return data as BudgetRow
  }

  const createBudget = async (payload: Omit<BudgetInsert, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('budgets')
      .insert(payload)
      .select()
    loading.value = false
    if (err) {
      error.value = err.message
      return { data: null as BudgetRow | null, error: err }
    }
    return { data: (data?.[0] ?? null) as BudgetRow | null, error: null }
  }

  const updateBudget = async (id: string, changes: Partial<BudgetUpdate>) => {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('budgets')
      .update(changes)
      .eq('id', id)
      .select()
    loading.value = false
    if (err) {
      error.value = err.message
      return { data: null as BudgetRow | null, error: err }
    }
    return { data: (data?.[0] ?? null) as BudgetRow | null, error: null }
  }

  const deleteBudget = async (id: string) => {
    loading.value = true
    error.value = null
    const { error: err } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
    loading.value = false
    if (err) {
      error.value = err.message
      return { success: false, error: err }
    }
    return { success: true, error: null }
  }

  const upsertBudget = async (payload: BudgetInsert) => {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('budgets')
      .upsert(payload, { onConflict: 'user_id,category_id,month,year' })
      .select()
    loading.value = false
    if (err) {
      error.value = err.message
      return { data: null as BudgetRow | null, error: err }
    }
    return { data: (data?.[0] ?? null) as BudgetRow | null, error: null }
  }

  const subscribeBudgets = (callback: (payload: any) => void) => {
    const channel = supabase
      .channel('public:budgets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budgets' }, payload => {
        callback(payload)
      })
      .subscribe()
    return channel
  }

  const unsubscribe = async (channel: any) => {
    if (!channel) return
    await supabase.removeChannel(channel)
  }

  return {
    loading,
    error,
    fetchAllByUser,
    fetchById,
    createBudget,
    updateBudget,
    deleteBudget,
    upsertBudget,
    subscribeBudgets,
    unsubscribe
  }
}