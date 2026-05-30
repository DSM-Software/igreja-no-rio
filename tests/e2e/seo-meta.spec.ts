import { test, expect } from '@playwright/test'
import { request as playwrightRequest } from '@playwright/test'

const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/quem-somos', name: 'Quem Somos' },
  { path: '/cultos', name: 'Cultos' },
  { path: '/blog', name: 'Blog' },
  { path: '/downloads', name: 'Downloads' },
  { path: '/contato', name: 'Contato' },
]

test.describe('SEO — <title>', () => {
  test('home title contém "Início" (ou "Igreja no Rio")', async ({ page }) => {
    await page.goto('/')
    // Layout template: '%s — Igreja no Rio'; page title: 'Início'
    // In dev mode Turbopack may render just 'Início' or 'Início — Igreja no Rio'
    await expect(page).toHaveTitle(/Início|Igreja no Rio/)
  })

  for (const route of ROUTES.filter((r) => r.path !== '/')) {
    test(`${route.name} — title inclui nome da página`, async ({ page }) => {
      await page.goto(route.path)
      await expect(page).toHaveTitle(new RegExp(route.name, 'i'))
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
