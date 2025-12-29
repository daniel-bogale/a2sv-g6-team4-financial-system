'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function NotFoundError() {
    const router = useRouter()

    return (
        <div className='h-dvh'>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
                <span className='font-medium'>oopsPageNotFound</span>
                <p className='text-muted-foreground text-center'>
                    pageNotExist
                </p>
                <div className='mt-6 flex gap-4'>
                    <Button variant='outline' onClick={() => router.back()}>
                        goBack
                    </Button>
                    <Button onClick={() => router.push('/')}>
                        backToHome
                    </Button>
                </div>
            </div>
        </div>
    )
}
