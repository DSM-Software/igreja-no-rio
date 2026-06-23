'use client'

import Script from 'next/script'
import { useCallback } from 'react'
import { usePageviewTracker } from './usePageviewTracker'

const DEFAULT_GA_ID = 'G-EX9WZW1607'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? DEFAULT_GA_ID

  const trackPageview = useCallback(
    (url: string) => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', { page_path: url })
      }
    },
    [],
  )

  usePageviewTracker(trackPageview)

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
gtag('js', new Date());
gtag('config', '${gaId}');
`,
        }}
      />
    </>
  )
}
