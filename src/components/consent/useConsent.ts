'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  type ConsentCategories,
  type ConsentCategory,
  type ConsentState,
  hasConsent as hasConsentPure,
  readConsent,
  resetConsent,
  subscribeConsent,
  writeConsent,
} from '@/lib/consent'

function getServerSnapshot(): ConsentState | null {
  return null
}

export type UseConsentReturn = {
  state: ConsentState | null
  hasConsent: (category: ConsentCategory) => boolean
  accept: (categories: ConsentCategories) => void
  acceptAll: () => void
  rejectAll: () => void
  reset: () => void
}

export function useConsent(): UseConsentReturn {
  const state = useSyncExternalStore(subscribeConsent, readConsent, getServerSnapshot)

  const accept = useCallback((categories: ConsentCategories) => {
    writeConsent(categories)
  }, [])

  const acceptAll = useCallback(() => {
    writeConsent({ analytics: true, marketing: true })
  }, [])

  const rejectAll = useCallback(() => {
    writeConsent({ analytics: false, marketing: false })
  }, [])

  const reset = useCallback(() => {
    resetConsent()
  }, [])

  const hasConsent = useCallback(
    (category: ConsentCategory) => hasConsentPure(state, category),
    [state],
  )

  return { state, hasConsent, accept, acceptAll, rejectAll, reset }
}
