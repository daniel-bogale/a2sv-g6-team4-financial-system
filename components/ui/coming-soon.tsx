'use client'

import { Telescope } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ComingSoon() {
  const t = useTranslations('common2')

  return (
    <div
      className={'h-[calc(100dvh-(120px))]'}
    >
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <Telescope size={72} />
        <h1 className='text-4xl leading-tight font-bold'>{t('comingSoon')}</h1>
        <p className='text-muted-foreground text-center'>
          {t('comingSoonDescription')} <br />
          {t('stayTuned')}
        </p>
      </div>
    </div>
  )
}
