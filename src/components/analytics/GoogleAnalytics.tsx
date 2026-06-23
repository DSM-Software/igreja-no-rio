'use client'

import Script from 'next/script'
import { useCallback, useEffect, useRef } from 'react'
import { usePageviewTracker } from './usePageviewTracker'
import { useConsent } from '@/components/consent/useConsent'

const DEFAULT_GA_ID = 'G-EX9WZW1607'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? DEFAULT_GA_ID
  const { hasConsent } = useConsent()
  const analyticsGranted = hasConsent('analytics')
  const lastSentGrant = useRef<boolean | null>(null)

  const trackPageview = useCallback(
    (url: string) => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', { page_path: url })
      }
    },
    [],
  )

  usePageviewTracker(trackPageview)

  useEffect(() => {
    if (!gaId) return
    if (typeof window === 'undefined') return
    if (lastSentGrant.current === analyticsGranted) return
    if (typeof window.gtag !== 'function') {
      const dl = (window.dataLayer = window.dataLayer || [])
      dl.push(['consent', 'update', { analytics_storage: analyticsGranted ? 'granted' : 'denied' }])
    } else {
      window.gtag('consent', 'update', {
        analytics_storage: analyticsGranted ? 'granted' : 'denied',
      })
    }
    lastSentGrant.current = analyticsGranted
  }, [analyticsGranted, gaId])

  if (!gaId) return null

  return (
    <>
      <Script
        id="ga-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('js', new Date());
gtag('config', '${gaId}');
`,
        }}
      />
    </>
  )
}
