import { test, expect } from '@playwright/test'

// Cobre a capability `community-imagery`: fotografia da comunidade no hero da
// home, na banda de CTA final e no bloco institucional de Quem Somos, sempre
// com o texto/CTA permanecendo legível sobre a imagem.

test.describe('Imagens da comunidade — home', () => {
  test('home carrega com status 200', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.ok()).toBeTruthy()
  })

  test('hero exibe foto de boas-vindas com título legível', async ({ page }) => {
    await page.goto('/')
    const heroImg = page.locator('section img[src*="boas-vindas"]').first()
    await expect(heroImg).toBeVisible()
    // Título permanece visível sobre a foto (overlay garante contraste)
    await expect(
      page.getByRole('heading', { name: /bem-vindo/i }),
    ).toBeVisible()
  })

  test('banda de CTA final exibe foto de comunhão com ações visíveis', async ({
    page,
  }) => {
    await page.goto('/')
    const ctaImg = page.locator('section img[src*="comunhao"]').first()
    await expect(ctaImg).toBeVisible()
    await expect(
      page.getByRole('link', { name: /venha no domingo/i }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /fale conosco/i }),
    ).toBeVisible()
  })
})

test.describe('Imagens da comunidade — Quem Somos', () => {
  test('quem-somos carrega com status 200', async ({ page }) => {
    const response = await page.goto('/quem-somos')
    expect(response?.ok()).toBeTruthy()
  })

  test('seção Missão exibe foto da comunidade no lugar do placeholder', async ({
    page,
  }) => {
    await page.goto('/quem-somos')
    const missionImg = page.locator('img[src*="adoracao"]').first()
    await expect(missionImg).toBeVisible()
    await expect(missionImg).toHaveAttribute('alt', /comunidade|adoração/i)
  })
})
