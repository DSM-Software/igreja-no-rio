'use client'

import Script from 'next/script'
import { useCallback } from 'react'
import { usePageviewTracker } from './usePageviewTracker'
import { useConsent } from '@/components/consent/useConsent'

const DEFAULT_PIXEL_ID = '878835207994765'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? DEFAULT_PIXEL_ID
  const { hasConsent } = useConsent()
  const marketingGranted = hasConsent('marketing')

  const trackPageview = useCallback(() => {
    if (!marketingGranted) return
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView')
    }
  }, [marketingGranted])

  usePageviewTracker(trackPageview)

  if (!pixelId) return null
  if (!marketingGranted) return null

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
`,
      }}
    />
  )
}
