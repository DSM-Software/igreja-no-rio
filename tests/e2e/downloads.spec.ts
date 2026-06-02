import { test, expect } from '@playwright/test'

const downloadCards = (page: import('@playwright/test').Page) =>
  page.locator('.downloads-list > div')

test.describe('Downloads — listagem agrupada', () => {
  test('exibe .download-card e heading de categoria (com seed)', async ({ page }) => {
    await page.goto('/downloads')
    const cards = downloadCards(page)
    await expect(cards.first()).toBeVisible()
    const categoryHeading = page.locator('section.downloads-category-section h2').first()
    await expect(categoryHeading).not.toBeEmpty()
  })

  test('exibe "Nenhum material disponível ainda" quando vazio', async ({ page }) => {
    await page.goto('/downloads')
    const cards = downloadCards(page)
    const count = await cards.count()
    if (count === 0) {
      await expect(page.locator('body')).toContainText(/Nenhum material disponível ainda\.?/i)
    } else {
      test.skip()
    }
  })
})

test.describe('Downloads — ícones por tipo', () => {
  test('metadado Áudio presente para itens de áudio', async ({ page }) => {
    await page.goto('/downloads')
    const audioLabel = page.locator('span', { hasText: /^Áudio$/ }).first()
    const count = await audioLabel.count()
    if (count === 0) {
      test.skip()
      return
    }
    await expect(audioLabel).toBeVisible()
  })

  test('metadado PDF presente para itens de pdf', async ({ page }) => {
    await page.goto('/downloads')
    const pdfLabel = page.locator('span', { hasText: /^PDF$/ }).first()
    const count = await pdfLabel.count()
    if (count === 0) {
      test.skip()
      return
    }
    await expect(pdfLabel).toBeVisible()
  })
})

test.describe('Downloads — botão de download', () => {
  test('botão "Baixar" tem href não vazio quando há arquivo', async ({ page }) => {
    await page.goto('/downloads')
    // Button only renders when item has externalUrl or uploaded file
    const downloadBtns = page.getByRole('link', { name: /baixar/i })
    const count = await downloadBtns.count()
    if (count === 0) {
      test.skip()
      return
    }
    const href = await downloadBtns.first().getAttribute('href')
    expect(href).toBeTruthy()
    expect(href!.length).toBeGreaterThan(0)
  })

  test('botões públicos de download não usam protocolos inseguros', async ({ page }) => {
    await page.goto('/downloads')
    const downloadBtns = page.getByRole('link', { name: /baixar/i })
    const count = await downloadBtns.count()
    if (count === 0) {
      test.skip()
      return
    }

    for (let index = 0; index < count; index++) {
      const href = await downloadBtns.nth(index).getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).not.toMatch(/^javascript:/i)
    }
  })
})
