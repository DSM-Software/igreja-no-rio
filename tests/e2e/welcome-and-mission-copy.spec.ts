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

test.describe('Quem Somos — apresentação editorial', () => {
  test('hero exibe título "Quem somos?" como h1 com a foto da comunidade', async ({
    page,
  }) => {
    await page.goto('/quem-somos')
    const heading = page.getByRole('heading', { level: 1 }).first()
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/quem somos\?/i)
    await expect(page.locator('img[src*="adoracao"]').first()).toBeVisible()
  })

  test('corpo apresenta a litania "Somos…" e afirma pertencimento à igreja', async ({
    page,
  }) => {
    await page.goto('/quem-somos')
    await expect(page.locator('body')).toContainText(
      /Somos sal da terra e luz do mundo/i,
    )
    await expect(page.locator('body')).toContainText(
      /Somos parte da igreja do Senhor Jesus Cristo na cidade do Rio de Janeiro/i,
    )
  })

  test('encerra com o crescendo "Somos filhos de Deus!"', async ({ page }) => {
    await page.goto('/quem-somos')
    await expect(page.locator('body')).toContainText(
      /Somos do bem\. Somos de Deus\. Somos filhos de Deus!/i,
    )
  })

  test('mantém o CTA "Quer nos conhecer pessoalmente?" com as ações', async ({
    page,
  }) => {
    await page.goto('/quem-somos')
    const main = page.getByRole('main')
    await expect(
      main.getByRole('heading', { name: /quer nos conhecer pessoalmente\?/i }),
    ).toBeVisible()
    await expect(
      main.getByRole('link', { name: /ver horários dos cultos/i }),
    ).toBeVisible()
    await expect(
      main.getByRole('link', { name: /fale conosco/i }),
    ).toBeVisible()
  })
})
