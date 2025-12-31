'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NewCashRequestPage() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [budgetId, setBudgetId] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [purpose, setPurpose] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload: any = { amount, purpose }
      if (budgetId.trim().length > 0) payload.budget_id = budgetId.trim()
      const { error } = await supabase.from('cash_requests').insert(payload)
      if (error) throw error
      router.push('/cash-requests')
      router.refresh()
    } catch (e: any) {
      setError(e.message ?? 'Failed to create request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">New Cash Request</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm">Budget ID (optional)</label>
          <input value={budgetId} onChange={(e)=>setBudgetId(e.target.value)} className="w-full border rounded p-2 bg-background" placeholder="budget-uuid or leave empty" />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Amount</label>
          <input type="number" min={0} step="1" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="w-full border rounded p-2 bg-background" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Purpose</label>
          <textarea value={purpose} onChange={(e)=>setPurpose(e.target.value)} className="w-full border rounded p-2 bg-background" required />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="px-3 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50">
            {loading ? 'Creating...' : 'Create'}
          </button>
          <button type="button" onClick={()=>router.back()} className="px-3 py-2 rounded border">Cancel</button>
        </div>
      </form>
    </div>
  )
}
