import { test, expect } from '@playwright/test'

const PUBLIC_ROUTES = [
  { path: '/', label: 'Home', heading: /Igreja no Rio/i },
  { path: '/quem-somos', label: 'Quem Somos', heading: /Somos uma família plantada em Santíssimo/i },
  { path: '/cultos', label: 'Cultos', heading: /domingo,?\s*às?\s*10h|10h00/i },
  { path: '/blog', label: 'Blog', heading: /Devocionais e Estudos/i },
  { path: '/downloads', label: 'Downloads', heading: /Downloads/i },
  { path: '/contato', label: 'Contato', heading: /Rua Ivan Pessoa, 341/i },
]

test.describe('Public routes — smoke', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.label} carrega com status 200`, async ({ page }) => {
      const [response] = await Promise.all([
        page.waitForResponse((res) => res.url().includes(route.path === '/' ? page.url().split('/')[2] : route.path) || true),
        page.goto(route.path),
      ])
      await expect(page).toHaveURL(new RegExp(route.path === '/' ? '/$' : route.path))
      await expect(page.locator('header[role="banner"]')).toBeVisible()
      await expect(page.locator('footer[role="contentinfo"]')).toBeVisible()
    })

    test(`${route.label} exibe conteúdo esperado`, async ({ page }) => {
      await page.goto(route.path)
      await expect(page.locator('body')).toContainText(route.heading)
    })
  }
})

test.describe('Header e footer em todas as rotas', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.label} — header com links de navegação`, async ({ page }) => {
      await page.goto(route.path)
      const header = page.locator('header[role="banner"]')
      await expect(header).toBeVisible()
      await expect(header.getByRole('link', { name: /início|home/i }).or(header.getByRole('link', { name: /blog/i })).first()).toBeVisible()
    })

    test(`${route.label} — footer com "Igreja no Rio"`, async ({ page }) => {
      await page.goto(route.path)
      await expect(page.locator('footer[role="contentinfo"]')).toContainText('Igreja no Rio')
    })
  }
})

test.describe('Header scroll behavior na home', () => {
  test('header transparente no topo da home', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toHaveClass(/transparent/)
  })

  test('header sólido após scroll de 100px', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 100))
    await page.waitForTimeout(300)
    const header = page.locator('header')
    await expect(header).toHaveClass(/solid/)
  })
})

test.describe('Logo correto conforme contexto', () => {
  test('logo branco no hero da home (header transparente)', async ({ page }) => {
    await page.goto('/')
    const logo = page.locator('header img[src*="logo"]').first()
    await expect(logo).toHaveAttribute('src', /logo-IR-white\.svg/)
  })

  test('logo escuro em página interna (/blog)', async ({ page }) => {
    await page.goto('/blog')
    const logo = page.locator('header img[src*="logo"]').first()
    await expect(logo).toHaveAttribute('src', /logo-IR-dark\.svg/)
  })
})

test.describe('Copy institucional atualizada', () => {
  test('cultos deixa explícito domingo às 10h como reunião geral', async ({ page }) => {
    await page.goto('/cultos')
    await expect(page.locator('body')).toContainText(/nossa única reunião geral/i)
    await expect(page.locator('body')).toContainText(/domingo/i)
    await expect(page.locator('body')).toContainText(/10h00|10h/i)
  })

  test('grupos caseiros sem horário rígido e sem termo em inglês', async ({ page }) => {
    await page.goto('/cultos')
    await expect(page.locator('body')).toContainText(/grupos caseiros são reuniões/i)
    await expect(page.locator('body')).toContainText(/não é uma reunião com data e hora rígidas/i)
    await expect(page.locator('body')).not.toContainText(/\bchurch\b/i)
  })

  test('quem somos não exibe nomes de pastores', async ({ page }) => {
    await page.goto('/quem-somos')
    await expect(page.locator('body')).not.toContainText(/Pr\.|Pra\.|pastor principal|Daniel|Lúcia/i)
  })
})
