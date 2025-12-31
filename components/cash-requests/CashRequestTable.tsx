'use client'

import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useUserProfile } from '@/hooks/use-user-profile'
import Link from 'next/link'

export type CashRequest = {
  id: string
  budget_id: string | null
  amount: number
  purpose: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED'
  created_by: string
  created_at: string
}

export default function CashRequestTable() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const { profile } = useUserProfile()
  const [rows, setRows] = useState<CashRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isFinance = profile?.role === 'FINANCE'

  async function load() {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from('cash_requests').select('*').order('created_at', { ascending: false })
      if (!isFinance && profile?.id) {
        query = query.eq('created_by', profile.id)
      }
      const { data, error } = await query
      if (error) throw error
      setRows((data ?? []) as CashRequest[])
    } catch (e: any) {
      setError(e.message ?? 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profile?.role])

  async function updateStatus(id: string, next: CashRequest['status']) {
    try {
      setError(null)
      let query = supabase.from('cash_requests').update({ status: next }).eq('id', id).select()
      if (next === 'DISBURSED') {
        // Only disburse approved
        query = supabase
          .from('cash_requests')
          .update({ status: next })
          .eq('id', id)
          .eq('status', 'APPROVED')
          .select()
      }
      const { error } = await query
      if (error) throw error
      await load()
    } catch (e: any) {
      setError(e.message ?? 'Failed to update')
    }
  }

  async function deleteRequest(id: string) {
    try {
      setError(null)
      const { error } = await supabase.from('cash_requests').delete().eq('id', id)
      if (error) throw error
      await load()
    } catch (e: any) {
      setError(e.message ?? 'Failed to delete')
    }
  }

  if (loading) return <div>Loading requests...</div>
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
            <th className="p-2 text-left">Purpose</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Budget</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Created At</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.purpose ?? '-'}</td>
              <td className="p-2">{new Intl.NumberFormat().format(r.amount)}</td>
              <td className="p-2">{r.budget_id ?? '—'}</td>
              <td className="p-2">
                <span className="inline-flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs">{r.status}</span>
                </span>
              </td>
              <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
              <td className="p-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Edit allowed for STAFF only own PENDING or FINANCE any */}
                  {(isFinance || r.status === 'PENDING') && (
                    <Link className="px-2 py-1 rounded border" href={`/cash-requests/${r.id}`}>
                      View
                    </Link>
                  )}

                  {isFinance && r.status === 'PENDING' && (
                    <>
                      <button className="px-2 py-1 rounded bg-green-600 text-white" onClick={() => updateStatus(r.id, 'APPROVED')}>Approve</button>
                      <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => updateStatus(r.id, 'REJECTED')}>Reject</button>
                    </>
                  )}

                  {isFinance && r.status === 'APPROVED' && (
                    <button className="px-2 py-1 rounded bg-blue-600 text-white" onClick={() => updateStatus(r.id, 'DISBURSED')}>Disburse</button>
                  )}

                  {/* Delete: FINANCE any; STAFF only own PENDING - enforced by RLS */}
                  <button className="px-2 py-1 rounded border" onClick={() => deleteRequest(r.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={6}>
                No cash requests yet. <Link href="/cash-requests/new" className="underline">Create one</Link>.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
