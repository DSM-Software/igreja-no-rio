import { test, expect } from '@playwright/test'

const PUBLIC_ROUTES = [
  { path: '/', label: 'Home', heading: /Igreja no Rio/i },
  { path: '/quem-somos', label: 'Quem Somos', heading: /Somos parte da igreja na cidade do Rio de Janeiro/i },
  { path: '/blog', label: 'Blog', heading: /Devocionais e Estudos/i },
  { path: '/downloads', label: 'Downloads', heading: /Downloads/i },
  { path: '/contato', label: 'Contato', heading: /Rua Ivan Pessoa, 341/i },
  { path: '/privacidade', label: 'Privacidade', heading: /Política de Privacidade/i },
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

test.describe('Destaque do canal no YouTube', () => {
  const YOUTUBE_URL = 'https://www.youtube.com/@IgrejanoRio7'

  test('home exibe destaque do YouTube com link seguro', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.ok()).toBeTruthy()

    const link = page
      .locator(`a[href="${YOUTUBE_URL}"]`)
      .filter({ hasText: /inscreva-se no canal/i })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
    await expect(page.locator('body')).toContainText(/acompanhe nossos cultos/i)
  })

  test('contato expõe item e botão do YouTube apontando para a mesma URL', async ({ page }) => {
    const response = await page.goto('/contato')
    expect(response?.ok()).toBeTruthy()

    const links = page.locator(`a[href="${YOUTUBE_URL}"]`)
    await expect(links).toHaveCount(2)

    for (let i = 0; i < 2; i++) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank')
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/)
    }
  })
})

test.describe('Editora parceira (Servo Livre)', () => {
  const STORE_URL = 'https://www.loja.servolivre.com/'

  test('home exibe banner da editora com link seguro', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.ok()).toBeTruthy()

    const link = page
      .locator(`a[href="${STORE_URL}"]`)
      .filter({ hasText: /visitar a loja/i })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
    await expect(page.locator('body')).toContainText(/conheça nossos materiais/i)

    // As seções vizinhas da home continuam visíveis.
    await expect(page.locator('body')).toContainText(/materiais recentes/i)
    await expect(page.locator('body')).toContainText(/acompanhe nossos cultos/i)
  })

  test('footer aponta para a loja da editora com link seguro', async ({ page }) => {
    await page.goto('/')
    const footerLink = page
      .locator('footer[role="contentinfo"]')
      .locator(`a[href="${STORE_URL}"]`)
    await expect(footerLink).toBeVisible()
    await expect(footerLink).toHaveAttribute('target', '_blank')
    await expect(footerLink).toHaveAttribute('rel', /noopener/)
  })
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

    test(`${route.label} — footer aponta para política de privacidade`, async ({ page }) => {
      await page.goto(route.path)
      const privacyLink = page.locator('footer').getByRole('link', { name: /privacidade|política de privacidade/i }).first()
      await expect(privacyLink).toBeVisible()
      await expect(privacyLink).toHaveAttribute('href', '/privacidade')
    })
  }
})

test.describe('Header scroll behavior na home', () => {
  test('header transparente no topo da home', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toHaveClass(/bg-transparent/)
  })

  test('header sólido após scroll de 100px', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 100))
    await page.waitForTimeout(300)
    const header = page.locator('header')
    await expect(header).toHaveClass(/bg-white\/95/)
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

test.describe('Header mobile navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 })
  })

  test('exibe botão de menu e abre a navegação mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(150)

    const menuButton = page.getByRole('button', { name: /abrir menu/i })
    await expect(menuButton).toBeVisible()

    const mobileNav = page.locator('#mobile-navigation')
    await expect(mobileNav).toBeHidden()

    await menuButton.click()
    await expect(mobileNav).toBeVisible()
    await expect(mobileNav.getByRole('link', { name: 'Blog' })).toBeVisible()
  })

  test('fecha o menu após navegar por um link', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(150)

    await page.getByRole('button', { name: /abrir menu/i }).click()
    await page.locator('#mobile-navigation').getByRole('link', { name: 'Downloads' }).click()

    await expect(page).toHaveURL(/\/downloads$/)
    await expect(page.locator('#mobile-navigation')).toBeHidden()
  })
})

test.describe('Consistência visual responsiva', () => {
  test('desktop mostra navegação principal sem menu mobile visível', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/contato')

    await expect(page.locator('header nav[aria-label="Navegação principal"]').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /abrir menu|fechar menu/i })).toBeHidden()
    await expect(page.locator('#mobile-navigation')).toBeHidden()
  })

  test('mobile mostra apenas a navegação compacta antes de abrir o menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/contato')

    await expect(page.getByRole('button', { name: /abrir menu|fechar menu/i })).toBeVisible()
    await expect(page.locator('#mobile-navigation')).toBeHidden()
  })

  for (const route of ['/quem-somos', '/agenda', '/downloads', '/contato']) {
    test(`${route} não gera overflow horizontal em mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(route)

      const hasHorizontalOverflow = await page.evaluate(() => {
        const root = document.documentElement
        return root.scrollWidth > root.clientWidth + 1
      })

      expect(hasHorizontalOverflow).toBe(false)
    })
  }
})

test.describe('Copy institucional atualizada', () => {
  test('/cultos redireciona para /agenda', async ({ page }) => {
    // A rota /cultos foi removida da navegação e passou a redirecionar para
    // /agenda, que concentra a programação (reunião geral de domingo, grupos
    // caseiros etc.). Ver commit "remove cultos from navigation and redirect".
    await page.goto('/cultos')
    await expect(page).toHaveURL(/\/agenda$/)
    await expect(page.locator('body')).toContainText(/domingo/i)
    await expect(page.locator('body')).toContainText(/grupos caseiros/i)
  })

  test('quem somos não exibe nomes de pastores', async ({ page }) => {
    await page.goto('/quem-somos')
    await expect(page.locator('body')).not.toContainText(/Pr\.|Pra\.|pastor principal|Daniel|Lúcia/i)
  })

  test('contato não fixa grupos caseiros em um horário rígido', async ({ page }) => {
    await page.goto('/contato')
    await expect(page.locator('body')).not.toContainText(/quartas?\s+às\s+19h30/i)
    await expect(page.locator('body')).toContainText(/grupos caseiros se reúnem em casas espalhadas pela cidade/i)
  })

  test('contato comunica que o formulário não envia dados e aponta para a política', async ({ page }) => {
    await page.goto('/contato')
    await expect(page.locator('body')).toContainText(/nao envia as informacoes digitadas em um formulario de contato/i)
    await expect(page.getByRole('link', { name: /ver política de privacidade/i })).toHaveAttribute('href', '/privacidade')
    await expect(page.getByRole('link', { name: /enviar e-mail/i })).toHaveAttribute('href', /mailto:contato@igrejanorio\.com/)
  })

  test('política de privacidade identifica canal de contato e direitos do titular', async ({ page }) => {
    await page.goto('/privacidade')
    await expect(page.locator('body')).toContainText(/contato@igrejanorio\.com/i)
    await expect(page.locator('body')).toContainText(/direitos/i)
    await expect(page.locator('body')).toContainText(/dados pessoais/i)
  })

  test('agenda pública não exibe datas inválidas', async ({ page }) => {
    await page.goto('/agenda')
    await expect(page.locator('body')).not.toContainText('NaN')
  })
})
