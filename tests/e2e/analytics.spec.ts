import { test, expect, request as playwrightRequest, type Page } from '@playwright/test'

const META_PIXEL_ID = '878835207994765'
const GA_MEASUREMENT_ID = 'G-EX9WZW1607'
const SEARCH_CONSOLE_TOKEN = 'zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs'
const CONSENT_KEY = 'ir:consent:v1'

async function seedConsent(
  page: Page,
  categories: { analytics: boolean; marketing: boolean },
) {
  await page.addInitScript(
    ({ key, payload }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          decidedAt: new Date().toISOString(),
          categories: payload,
        }),
      )
    },
    { key: CONSENT_KEY, payload: categories },
  )
}

async function clearConsent(page: Page) {
  await page.addInitScript((key) => window.localStorage.removeItem(key), CONSENT_KEY)
}

test.describe('Analytics — Meta Pixel (com consent)', () => {
  test('home injeta script do Meta Pixel quando marketing está consentido', async ({ page }) => {
    await seedConsent(page, { analytics: true, marketing: true })
    await page.goto('/')
    await expect
      .poll(async () => {
        const inlineScripts = await page.locator('script:not([src])').allTextContents()
        return inlineScripts.some((content) => content.includes(`fbq('init', '${META_PIXEL_ID}'`))
      }, { timeout: 5_000 })
      .toBe(true)
  })

  test('home NÃO contém fallback noscript (incompatível com gate de consentimento)', async ({ page }) => {
    await seedConsent(page, { analytics: true, marketing: true })
    await page.goto('/')
    await page.waitForFunction(
      () => typeof (window as unknown as { fbq?: unknown }).fbq === 'function',
      null,
      { timeout: 5_000 },
    )
    const html = await page.content()
    expect(html).not.toContain('facebook.com/tr?id=')
  })

  test('fbq fica disponível após hidratação com consent', async ({ page }) => {
    await seedConsent(page, { analytics: false, marketing: true })
    await page.goto('/')
    await page.waitForFunction(
      () => typeof (window as unknown as { fbq?: unknown }).fbq === 'function',
      null,
      { timeout: 5_000 },
    )
  })
})

test.describe('Analytics — Meta Pixel (sem consent)', () => {
  test('home NÃO injeta script do Pixel sem decisão', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/')
    const inlineScripts = await page.locator('script:not([src])').allTextContents()
    const hasInit = inlineScripts.some((content) => content.includes(`fbq('init'`))
    expect(hasInit).toBe(false)
  })

  test('home NÃO injeta script do Pixel quando marketing rejeitado', async ({ page }) => {
    await seedConsent(page, { analytics: true, marketing: false })
    await page.goto('/')
    const inlineScripts = await page.locator('script:not([src])').allTextContents()
    const hasInit = inlineScripts.some((content) => content.includes(`fbq('init'`))
    expect(hasInit).toBe(false)
  })

  test('navegação sem consent NÃO dispara hit para facebook.com/tr', async ({ page }) => {
    await seedConsent(page, { analytics: false, marketing: false })
    let hitCount = 0
    page.on('request', (req) => {
      if (req.url().startsWith('https://www.facebook.com/tr/')) hitCount += 1
    })
    await page.goto('/')
    await page.getByRole('link', { name: 'Blog' }).first().click()
    await page.waitForURL('**/blog')
    await page.waitForTimeout(500)
    expect(hitCount).toBe(0)
  })
})

test.describe('Analytics — Google Analytics 4', () => {
  test('home sempre injeta o loader do gtag.js (Consent Mode)', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/')
    const loader = page.locator(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)
    await expect(loader).toHaveCount(1)
  })

  test('dataLayer contém consent default denied antes de qualquer decisão', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/')
    await page.waitForFunction(
      () => {
        const dl = (window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer
        if (!dl || typeof dl.length !== 'number') return false
        for (let i = 0; i < dl.length; i++) {
          const entry = dl[i] as ArrayLike<unknown> | undefined
          if (!entry || typeof entry !== 'object') continue
          if (entry[0] !== 'consent' || entry[1] !== 'default') continue
          const flags = entry[2] as Record<string, unknown> | undefined
          if (flags?.analytics_storage === 'denied') return true
        }
        return false
      },
      null,
      { timeout: 5_000 },
    )
  })

  test('consent update granted aparece no dataLayer após consentir analytics', async ({ page }) => {
    await seedConsent(page, { analytics: true, marketing: false })
    await page.goto('/')
    await page.waitForFunction(
      () => {
        const dl = (window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer
        if (!dl || typeof dl.length !== 'number') return false
        for (let i = 0; i < dl.length; i++) {
          const entry = dl[i] as ArrayLike<unknown> | undefined
          if (!entry || typeof entry !== 'object') continue
          if (entry[0] !== 'consent' || entry[1] !== 'update') continue
          const flags = entry[2] as Record<string, unknown> | undefined
          if (flags?.analytics_storage === 'granted') return true
        }
        return false
      },
      null,
      { timeout: 5_000 },
    )
  })

  test('home configura gtag com config inicial', async ({ page }) => {
    await seedConsent(page, { analytics: true, marketing: false })
    await page.goto('/')
    await page.waitForFunction(
      (id) => {
        const dl = (window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer
        if (!dl || typeof dl.length !== 'number') return false
        for (let i = 0; i < dl.length; i++) {
          const entry = dl[i] as ArrayLike<unknown> | undefined
          if (!entry || typeof entry !== 'object') continue
          if (entry[0] === 'config' && entry[1] === id) return true
        }
        return false
      },
      GA_MEASUREMENT_ID,
      { timeout: 5_000 },
    )
  })
})

test.describe('Analytics — Search Console verification', () => {
  test('home tem meta tag de verificação do Search Console', async ({ page }) => {
    await page.goto('/')
    const meta = page.locator('meta[name="google-site-verification"]')
    await expect(meta).toHaveAttribute('content', SEARCH_CONSOLE_TOKEN)
  })
})

test.describe('Analytics — disparo em navegação client-side (com consent)', () => {
  test('navegação para /blog dispara hit do Meta Pixel quando marketing consentido', async ({ page }) => {
    await seedConsent(page, { analytics: true, marketing: true })
    await page.goto('/')
    await page.waitForFunction(
      () => typeof (window as unknown as { fbq?: unknown }).fbq === 'function',
      null,
      { timeout: 5_000 },
    )

    const trackingHitPromise = page.waitForRequest(
      (req) => req.url().startsWith('https://www.facebook.com/tr/') && req.url().includes('ev=PageView'),
      { timeout: 10_000 },
    )

    await page.getByRole('link', { name: 'Blog' }).first().click()
    await page.waitForURL('**/blog')
    await trackingHitPromise
  })

  test('navegação para /blog registra page_view no dataLayer quando analytics consentido', async ({ page }) => {
    await seedConsent(page, { analytics: true, marketing: false })
    await page.goto('/')
    await page.waitForFunction(
      () => Array.isArray((window as unknown as { dataLayer?: unknown[] }).dataLayer),
      null,
      { timeout: 5_000 },
    )

    await page.getByRole('link', { name: 'Blog' }).first().click()
    await page.waitForURL('**/blog')

    await page.waitForFunction(
      () => {
        const dl = (window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer
        if (!dl || typeof dl.length !== 'number') return false
        for (let i = 0; i < dl.length; i++) {
          const entry = dl[i] as ArrayLike<unknown> | undefined
          if (!entry || typeof entry !== 'object') continue
          if (entry[0] !== 'event' || entry[1] !== 'page_view') continue
          const path = (entry[2] as { page_path?: unknown } | undefined)?.page_path
          if (typeof path === 'string' && path.includes('/blog')) return true
        }
        return false
      },
      null,
      { timeout: 5_000 },
    )
  })
})

test.describe('Analytics — admin sem tracking', () => {
  test('/admin/login não carrega Meta Pixel nem gtag.js', async () => {
    const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
    const ctx = await playwrightRequest.newContext({ baseURL })
    const response = await ctx.get('/admin/login')
    const html = await response.text()
    expect(html).not.toContain('fbevents.js')
    expect(html).not.toContain('googletagmanager.com/gtag/js')
    expect(html).not.toContain(`fbq('init'`)
    await ctx.dispose()
  })
})
