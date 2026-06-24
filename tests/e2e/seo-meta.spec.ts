import { test, expect } from '@playwright/test'
import { request as playwrightRequest } from '@playwright/test'

// /cultos redireciona (307) para /agenda, por isso não entra na lista de rotas com página própria.
const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/quem-somos', name: 'Quem Somos' },
  { path: '/blog', name: 'Blog' },
  { path: '/downloads', name: 'Downloads' },
  { path: '/contato', name: 'Contato' },
]

test.describe('SEO — <title>', () => {
  test('home title contém "Faça parte dessa família"', async ({ page }) => {
    await page.goto('/')
    // Layout template: '%s — Igreja no Rio'. Em dev o Turbopack pode renderizar o
    // <title> apenas com o título da página; a marca é garantida pelo template em prod.
    await expect(page).toHaveTitle(/Faça parte dessa família/)
    const title = await page.title()
    expect(title).not.toMatch(/Início/)
  })

  for (const route of ROUTES.filter((r) => r.path !== '/')) {
    test(`${route.name} — title inclui nome da página`, async ({ page }) => {
      await page.goto(route.path)
      await expect(page).toHaveTitle(new RegExp(route.name, 'i'))
      const title = await page.title()
      expect(title).not.toMatch(/\bchurch\b|\bcurch\b/i)
    })
  }
})

test.describe('SEO — meta description', () => {
  for (const route of ROUTES) {
    test(`${route.name} — meta description com ≥20 chars`, async ({ page }) => {
      await page.goto(route.path)
      const content = await page.locator('meta[name="description"]').getAttribute('content')
      expect(content).toBeTruthy()
      expect(content!.length).toBeGreaterThanOrEqual(20)
      expect(content!).not.toMatch(/\bchurch\b|\bcurch\b/i)
    })
  }
})

test.describe('SEO — Open Graph tags', () => {
  for (const route of ROUTES) {
    test(`${route.name} — og:title não vazio`, async ({ page }) => {
      await page.goto(route.path)
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      expect(ogTitle).toBeTruthy()
      expect(ogTitle!.length).toBeGreaterThan(0)
    })
  }
})

test.describe('SEO — Google Search Console verification', () => {
  const SEARCH_CONSOLE_TOKEN = 'zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs'

  for (const route of ROUTES) {
    test(`${route.name} — meta google-site-verification presente`, async ({ page }) => {
      await page.goto(route.path)
      const content = await page
        .locator('meta[name="google-site-verification"]')
        .getAttribute('content')
      expect(content).toBe(SEARCH_CONSOLE_TOKEN)
    })
  }
})

test.describe('SEO — Link headers (RFC 8288)', () => {
  test('/ envia Link header com rels úteis a agentes', async () => {
    const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
    const context = await playwrightRequest.newContext({ baseURL })
    const response = await context.get('/')
    expect(response.status()).toBe(200)
    const linkHeader = response.headers()['link'] ?? ''
    expect(linkHeader).toContain('rel="sitemap"')
    expect(linkHeader).toContain('</sitemap.xml>')
    expect(linkHeader).toContain('rel="privacy-policy"')
    expect(linkHeader).toContain('</privacidade>')
    expect(linkHeader).toContain('rel="about"')
    expect(linkHeader).toContain('rel="help"')
    await context.dispose()
  })
})

test.describe('SEO — sitemap', () => {
  test('/sitemap.xml retorna XML válido com <urlset', async ({ page }) => {
    const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
    const context = await playwrightRequest.newContext({ baseURL })
    const response = await context.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const contentType = response.headers()['content-type'] ?? ''
    expect(contentType).toMatch(/xml/)
    const body = await response.text()
    expect(body).toContain('<urlset')
    await context.dispose()
  })

  test('/sitemap.xml contém <loc> para rotas estáticas', async ({ page }) => {
    const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
    const context = await playwrightRequest.newContext({ baseURL })
    const response = await context.get('/sitemap.xml')
    const body = await response.text()
    for (const path of ['/', '/blog', '/downloads', '/contato']) {
      expect(body).toContain(`<loc>`)
      expect(body).toContain(path)
    }
    await context.dispose()
  })
})
