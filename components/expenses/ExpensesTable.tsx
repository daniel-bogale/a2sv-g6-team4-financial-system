'use client'

import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export type Expense = {
  id: string
  budget_id: string | null
  amount: number
  category: string | null
  verified: boolean | null
  created_by: string
  created_at: string
}

export default function ExpensesTable() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [rows, setRows] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setRows((data ?? []) as Expense[])
    } catch (e: any) {
      setError(e.message ?? 'Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <div>Loading expenses...</div>
  if (error) return (
    <div className="space-y-2">
      <div className="text-red-600 text-sm">{error}</div>
      <button onClick={load} className="px-2 py-1 text-sm rounded bg-muted">Retry</button>
    </div>
  )

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Budget</th>
            <th className="p-2 text-left">Verified</th>
            <th className="p-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.category ?? '-'}</td>
              <td className="p-2">{new Intl.NumberFormat().format(r.amount)}</td>
              <td className="p-2">{r.budget_id ?? '—'}</td>
              <td className="p-2">{r.verified ? 'Yes' : 'No'}</td>
              <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={5}>
                No expenses recorded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
