import { test, expect } from '@playwright/test'

test.describe('Hero da home — saudação "Seja bem-vindo"', () => {
  test('h1 do hero contém "Seja bem-vindo" e não menciona "encontrado"', async ({
    page,
  }) => {
    await page.goto('/')
    const heading = page.getByRole('heading', { level: 1 }).first()
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/seja bem-vindo/i)
    await expect(heading).not.toContainText(/encontrado/i)
  })
})

test.describe('Quem Somos — seção Missão', () => {
  test('corpo da Missão afirma pertencimento à igreja', async ({ page }) => {
    await page.goto('/quem-somos')
    await expect(page.locator('body')).toContainText(
      /não vamos à igreja\s*—\s*somos a igreja/i,
    )
  })

  test('corpo da Missão menciona família e propósito eterno', async ({
    page,
  }) => {
    await page.goto('/quem-somos')
    await expect(page.locator('body')).toContainText(/propósito eterno/i)
    await expect(page.locator('body')).toContainText(
      /família,?\s*de muitos filhos/i,
    )
  })

  test('citação de Romanos 8:29 exibida em <blockquote> com atribuição', async ({
    page,
  }) => {
    await page.goto('/quem-somos')
    const quote = page.locator('blockquote').first()
    await expect(quote).toBeVisible()
    await expect(quote).toContainText(/predestinou para serem conformes/i)
    await expect(quote).toContainText(/Romanos 8:29/i)
  })
})
