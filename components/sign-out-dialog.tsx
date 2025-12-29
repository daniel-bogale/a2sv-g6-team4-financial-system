'use client'

import { useRouter } from 'next/navigation'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

interface SignOutDialogProps {
    open: boolean
    onOpenChange: (open: boolean | null) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createSupabaseBrowserClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={(value) => onOpenChange(value ? true : null)}
            title='Sign out'
            desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
            confirmText='Sign out'
            destructive
            handleConfirm={handleSignOut}
            className='sm:max-w-sm'
        />
    )
}
