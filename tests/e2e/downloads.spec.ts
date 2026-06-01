import { test, expect } from '@playwright/test'

test.describe('Downloads — listagem agrupada', () => {
  test('exibe .download-card e heading de categoria (com seed)', async ({ page }) => {
    await page.goto('/downloads')
    const cards = page.locator('.download-card')
    await expect(cards.first()).toBeVisible()
    const categoryHeading = page.locator('h2').first()
    await expect(categoryHeading).not.toBeEmpty()
  })

  test('exibe "Nenhum material disponível ainda" quando vazio', async ({ page }) => {
    await page.goto('/downloads')
    const cards = page.locator('.download-card')
    const count = await cards.count()
    if (count === 0) {
      await expect(page.locator('body')).toContainText('Nenhum material disponível ainda')
    } else {
      test.skip()
    }
  })
})

test.describe('Downloads — ícones por tipo', () => {
  test('.download-icon-audio presente para tipo audio', async ({ page }) => {
    await page.goto('/downloads')
    const audioIcon = page.locator('.download-icon-audio').first()
    const count = await audioIcon.count()
    if (count === 0) {
      test.skip()
      return
    }
    await expect(audioIcon).toBeVisible()
  })

  test('.download-icon-pdf presente para tipo pdf', async ({ page }) => {
    await page.goto('/downloads')
    const pdfIcon = page.locator('.download-icon-pdf').first()
    const count = await pdfIcon.count()
    if (count === 0) {
      test.skip()
      return
    }
    await expect(pdfIcon).toBeVisible()
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
