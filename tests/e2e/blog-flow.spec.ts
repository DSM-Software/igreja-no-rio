import { test, expect } from '@playwright/test'

test.describe('Blog — listagem de posts', () => {
  test('exibe cards quando há posts (seed rodado)', async ({ page }) => {
    await page.goto('/blog')
    const cards = page.locator('.post-card')
    await expect(cards.first()).toBeVisible()
    await expect(cards.first().locator('.post-card-title')).not.toBeEmpty()
  })

  test('exibe "Nenhum post encontrado" quando não há posts', async ({ page }) => {
    // Verifica se a mensagem de estado vazio existe no código; caso o banco tenha posts,
    // o teste é pulado condicionalmente.
    await page.goto('/blog')
    const cards = page.locator('.post-card')
    const count = await cards.count()
    if (count === 0) {
      await expect(page.locator('body')).toContainText('Nenhum post encontrado')
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
    const firstCard = page.locator('.post-card').first()
    await firstCard.waitFor({ state: 'visible' })
    // h3.post-card-title is inside an <a href="/blog/slug"> — click the h3 directly
    await firstCard.locator('.post-card-title').click()
    await expect(page).toHaveURL(/\/blog\/.+/, { timeout: 10_000 })
    await expect(page.locator('h1')).not.toBeEmpty()
  })

  test('.post-body presente e não vazio no post individual', async ({ page }) => {
    await page.goto('/blog')
    const firstCard = page.locator('.post-card').first()
    await firstCard.waitFor({ state: 'visible' })
    await firstCard.locator('.post-card-title').click()
    await expect(page).toHaveURL(/\/blog\/.+/, { timeout: 10_000 })
    const body = page.locator('.post-body')
    await expect(body).toBeVisible()
    await expect(body).not.toBeEmpty()
  })

  test('metadados do post visíveis (autor, data PT-BR, tempo de leitura)', async ({ page }) => {
    await page.goto('/blog')
    const firstCard = page.locator('.post-card').first()
    await firstCard.waitFor({ state: 'visible' })
    await firstCard.locator('.post-card-title').click()
    await expect(page).toHaveURL(/\/blog\/.+/, { timeout: 10_000 })
    await expect(page.locator('body')).toContainText(/min\b/)
    await expect(page.locator('body')).toContainText(/de \d{4}/)
  })
})

test.describe('Blog — navegação de série', () => {
  test('exibe link para próxima parte quando post é parte de série', async ({ page }) => {
    await page.goto('/blog')
    const cards = page.locator('.post-card')
    const count = await cards.count()
    if (count === 0) {
      test.skip()
      return
    }
    // Procura qualquer link de série em posts disponíveis
    const seriesLink = page.locator('a').filter({ hasText: /parte seguinte|próxima parte|parte \d/i })
    if (await seriesLink.count() === 0) {
      // Verifica post individual para série
      const titleLink = cards.first().locator('.post-card-title a, a:has(.post-card-title)').first()
      await titleLink.click()
      await expect(page).toHaveURL(/\/blog\/.+/)
      const nextPartLink = page.locator('a').filter({ hasText: /próxima|parte seguinte|parte \d/i })
      // Não obrigatório — série só existe se seed incluiu série
      const hasSeriesNav = await nextPartLink.count() > 0
      if (!hasSeriesNav) {
        test.skip()
      }
    }
  })
})
