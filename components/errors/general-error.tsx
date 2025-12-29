'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Component, type ReactNode } from 'react'

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
    minimal?: boolean
}

// Fallback translations for when NextIntlClientProvider is not available
const fallbackTranslations: Record<string, string> = {
    oopsSomethingWrong: 'Oops! Something went wrong',
    apologizeInconvenience: 'We apologize for the inconvenience.',
    tryAgainLater: 'Please try again later.',
    goBack: 'Go Back',
    backToHome: 'Back to Home',
}

// Component that uses translations (will error if context is missing)
function GeneralErrorWithTranslations({
    className,
    minimal = false,
}: GeneralErrorProps) {
    const router = useRouter()

    return (
        <div className={cn('h-dvh w-full', className)}>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                {!minimal && (
                    <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
                )}
                <span className='font-medium'>oopsSomethingWrong</span>
                <p className='text-muted-foreground text-center'>
                    apologizeInconvenience <br /> tryAgainLater
                </p>
                {!minimal && (
                    <div className='mt-6 flex gap-4'>
                        <Button variant='outline' onClick={() => router.back()}>
                            goBack
                        </Button>
                        <Button onClick={() => router.push('/')}>
                            backToHome
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

// Fallback component when translations are not available
function GeneralErrorFallback({
    className,
    minimal = false,
}: GeneralErrorProps) {
    const router = useRouter()
    const t = (key: string) => fallbackTranslations[key] || key

    return (
        <div className={cn('h-dvh w-full', className)}>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                {!minimal && (
                    <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
                )}
                <span className='font-medium'>{t('oopsSomethingWrong')}</span>
                <p className='text-muted-foreground text-center'>
                    {t('apologizeInconvenience')} <br /> {t('tryAgainLater')}
                </p>
                {!minimal && (
                    <div className='mt-6 flex gap-4'>
                        <Button variant='outline' onClick={() => router.back()}>
                            {t('goBack')}
                        </Button>
                        <Button onClick={() => router.push('/')}>
                            {t('backToHome')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

// Error Boundary class component to catch translation errors
class TranslationErrorBoundary extends Component<
    { children: ReactNode; fallback: ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: ReactNode; fallback: ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error) {
        // Log error if needed
        if (error.message.includes('useTranslations')) {
            // This is expected when context is missing
            console.warn('Translation context not available, using fallback')
        }
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback
        }
        return this.props.children
    }
}

export function GeneralError(props: GeneralErrorProps) {
    return (
        <TranslationErrorBoundary fallback={<GeneralErrorFallback {...props} />}>
            <GeneralErrorWithTranslations {...props} />
        </TranslationErrorBoundary>
    )
}

