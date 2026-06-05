import { test, expect } from '@playwright/test'

const blogCards = (page: import('@playwright/test').Page) =>
  page.locator('article').filter({ has: page.locator('a[href^="/blog/"] h3') })

test.describe('Blog — listagem de posts', () => {
  test('exibe cards quando há posts (seed rodado)', async ({ page }) => {
    await page.goto('/blog')
    const cards = blogCards(page)
    await expect(cards.first()).toBeVisible()
    await expect(cards.first().locator('h3')).not.toBeEmpty()
  })

  test('exibe "Nenhum post encontrado" quando não há posts', async ({ page }) => {
    // Verifica se a mensagem de estado vazio existe no código; caso o banco tenha posts,
    // o teste é pulado condicionalmente.
    await page.goto('/blog')
    const cards = blogCards(page)
    const count = await cards.count()
    if (count === 0) {
      await expect(page.locator('body')).toContainText(/Nenhum post encontrado\.?/i)
    } else {
      test.skip()
    }
  })
})

test.describe('Blog — filtro por categoria', () => {
  test('filtro "Devocional" adiciona ?category=Devocional na URL', async ({ page }) => {
    await page.goto('/blog')
    const filterBtn = page.getByRole('button', { name: /devocional/i })
    await filterBtn.waitFor({ state: 'visible', timeout: 10_000 })
    await filterBtn.click()
    await expect(page).toHaveURL(/category=Devocional/)
  })

  test('filtro "Todos" remove parâmetro category da URL', async ({ page }) => {
    await page.goto('/blog?category=Devocional')
    const todosBtn = page.getByRole('button', { name: /todos/i })
    await todosBtn.waitFor({ state: 'visible', timeout: 10_000 })
    await todosBtn.click()
    await expect(page).not.toHaveURL(/category=/)
  })
})

test.describe('Blog — navegação para post individual', () => {
  test('clique no título do card navega para /blog/<slug>', async ({ page }) => {
    await page.goto('/blog')
    const firstCard = blogCards(page).first()
    await firstCard.waitFor({ state: 'visible' })
    await firstCard.locator('a:has(h3)').first().click()
    await expect(page).toHaveURL(/\/blog\/.+/, { timeout: 10_000 })
    await expect(page.locator('h1')).not.toBeEmpty()
  })

  test('.post-body presente e não vazio no post individual', async ({ page }) => {
    await page.goto('/blog')
    const firstCard = blogCards(page).first()
    await firstCard.waitFor({ state: 'visible' })
    await firstCard.locator('a:has(h3)').first().click()
    await expect(page).toHaveURL(/\/blog\/.+/, { timeout: 10_000 })
    const body = page.locator('.post-body')
    await expect(body).toBeVisible()
    await expect(body).not.toBeEmpty()
  })

  test('metadados do post visíveis (autor, data PT-BR, tempo de leitura)', async ({ page }) => {
    await page.goto('/blog')
    const firstCard = blogCards(page).first()
    await firstCard.waitFor({ state: 'visible' })
    await firstCard.locator('a:has(h3)').first().click()
    await expect(page).toHaveURL(/\/blog\/.+/, { timeout: 10_000 })
    await expect(page.locator('body')).toContainText(/min\b/)
    await expect(page.locator('body')).toContainText(/de \d{4}/)
  })
})

test.describe('Blog — paginação', () => {
  test('exibe no máximo 12 post-cards por página', async ({ page }) => {
    await page.goto('/blog')
    const cards = blogCards(page)
    await cards.first().waitFor({ state: 'visible' })
    const count = await cards.count()
    expect(count).toBeLessThanOrEqual(12)
  })

  test('controle de paginação visível quando há mais de 12 posts (seed)', async ({ page }) => {
    await page.goto('/blog')
    await blogCards(page).first().waitFor({ state: 'visible' })
    const cards = blogCards(page)
    const count = await cards.count()
    if (count < 12) {
      test.skip()
      return
    }
    await expect(page.locator('nav[aria-label="Paginação"]')).toBeVisible()
  })

  test('página 2 exibe posts diferentes da página 1', async ({ page }) => {
    await page.goto('/blog')
    const cards = blogCards(page)
    const firstPageCount = await cards.count()
    if (firstPageCount < 12) {
      test.skip()
      return
    }
    const firstTitle = await cards.first().locator('h3').textContent()
    await page.goto('/blog?page=2')
    await blogCards(page).first().waitFor({ state: 'visible' })
    const secondTitle = await blogCards(page).first().locator('h3').textContent()
    expect(secondTitle).not.toBe(firstTitle)
  })

  test('navegar para próxima página preserva filtro de categoria na URL', async ({ page }) => {
    await page.goto('/blog?category=Devocional')
    await blogCards(page).first().waitFor({ state: 'visible' }).catch(() => null)
    const nav = page.locator('nav[aria-label="Paginação"]')
    const hasNav = await nav.isVisible()
    if (!hasNav) {
      test.skip()
      return
    }
    const nextLink = nav.getByText(/Próxima/)
    await nextLink.click()
    await expect(page).toHaveURL(/category=Devocional/)
    await expect(page).toHaveURL(/page=2/)
  })

  test('mudar filtro reseta page e remove ?page da URL', async ({ page }) => {
    await page.goto('/blog?page=2')
    const filterBtn = page.getByRole('button', { name: /devocional/i })
    await filterBtn.waitFor({ state: 'visible', timeout: 10_000 })
    await filterBtn.click()
    await expect(page).toHaveURL(/category=Devocional/)
    await expect(page).not.toHaveURL(/page=/)
  })
})

test.describe('Blog — navegação de série', () => {
  test('exibe link para próxima parte quando post é parte de série', async ({ page }) => {
    await page.goto('/blog')
    const cards = blogCards(page)
    const count = await cards.count()
    if (count === 0) {
      test.skip()
      return
    }

    await cards.first().locator('a:has(h3)').first().click()
    await expect(page).toHaveURL(/\/blog\/.+/)

    const hasSeriesHeader = (await page.locator('body').textContent())?.includes('Série:')
    if (!hasSeriesHeader) {
      test.skip()
      return
    }

    await expect(page.locator('body')).toContainText(/Série:/)
    const seriesNavLinks = page.locator('a').filter({ hasText: /parte|próxima|anterior|←|→/i })
    await expect(seriesNavLinks.first()).toBeVisible()
  })
})
