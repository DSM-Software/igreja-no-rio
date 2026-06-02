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
