'use client'

import { resetConsent } from '@/lib/consent'

const OPEN_CUSTOMIZE_EVENT = 'ir:consent:open-customize'

export function ManagePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => {
        resetConsent()
        window.dispatchEvent(new CustomEvent(OPEN_CUSTOMIZE_EVENT))
      }}
      className="inline-flex h-11 items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      Gerenciar preferências de cookies
    </button>
  )
}
