import { test, expect, request as playwrightRequest } from '@playwright/test'

const META_PIXEL_ID = '878835207994765'
const GA_MEASUREMENT_ID = 'G-EX9WZW1607'
const SEARCH_CONSOLE_TOKEN = 'zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs'

test.describe('Analytics — Meta Pixel', () => {
  test('home injeta script do Meta Pixel com o ID configurado', async ({ page }) => {
    await page.goto('/')
    const inlineScripts = await page.locator('script:not([src])').allTextContents()
    const hasInit = inlineScripts.some((content) => content.includes(`fbq('init', '${META_PIXEL_ID}'`))
    expect(hasInit).toBe(true)
  })

  test('home contém noscript com pixel image do Meta', async () => {
    const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
    const ctx = await playwrightRequest.newContext({ baseURL })
    const response = await ctx.get('/')
    const html = await response.text()
    expect(html).toContain(`facebook.com/tr?id=${META_PIXEL_ID}`)
    expect(html).toContain('ev=PageView')
    expect(html).toContain('noscript=1')
    await ctx.dispose()
  })

  test('fbq fica disponível após hidratação', async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => typeof (window as unknown as { fbq?: unknown }).fbq === 'function', null, {
      timeout: 5_000,
    })
  })
})

test.describe('Analytics — Google Analytics 4', () => {
  test('home injeta loader do gtag.js com o ID configurado', async ({ page }) => {
    await page.goto('/')
    const loader = page.locator(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)
    await expect(loader).toHaveCount(1)
  })

  test('home configura dataLayer/gtag com config inicial', async ({ page }) => {
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

test.describe('Analytics — disparo em navegação client-side', () => {
  test('navegação para /blog dispara hit do Meta Pixel', async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => typeof (window as unknown as { fbq?: unknown }).fbq === 'function', null, {
      timeout: 5_000,
    })

    const trackingHitPromise = page.waitForRequest(
      (req) => req.url().startsWith('https://www.facebook.com/tr/') && req.url().includes('ev=PageView'),
      { timeout: 10_000 },
    )

    await page.getByRole('link', { name: 'Blog' }).first().click()
    await page.waitForURL('**/blog')
    await trackingHitPromise
  })

  test('navegação para /blog registra page_view no dataLayer do GA', async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => Array.isArray((window as unknown as { dataLayer?: unknown[] }).dataLayer), null, {
      timeout: 5_000,
    })

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
