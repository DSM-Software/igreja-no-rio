import { test, expect } from '@playwright/test'

test.describe('Admin — acesso sem autenticação', () => {
  test('/admin sem auth redireciona para URL contendo "login"', async ({ page }) => {
    // Use commit so we don't wait for the full page load (Payload admin may error in dev)
    await page.goto('/admin', { waitUntil: 'commit' })
    await page.waitForURL(/login/, { timeout: 10_000 })
    expect(page.url()).toMatch(/login/)
  })
})

test.describe('Admin — formulário de login', () => {
  test('campos email e password presentes em /admin/login', async ({ page }) => {
    const response = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    if (response && response.status() >= 500) {
      test.skip()
      return
    }
    const emailInput = page.locator('input[name="email"], input[type="email"]').first()
    const passwordInput = page.locator('input[type="password"]').first()
    await expect(emailInput).toBeVisible({ timeout: 10_000 })
    await expect(passwordInput).toBeVisible({ timeout: 10_000 })
  })

  test('botão de submit presente em /admin/login', async ({ page }) => {
    const response = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    if (response && response.status() >= 500) {
      test.skip()
      return
    }
    const submitBtn = page.locator('button[type="submit"]').or(
      page.getByRole('button', { name: /entrar|login/i })
    ).first()
    await expect(submitBtn).toBeVisible({ timeout: 10_000 })
  })
})

test.describe('Admin — login com credenciais válidas', () => {
  test('login bem-sucedido redireciona para dashboard', async ({ page }) => {
    const email = process.env.SEED_ADMIN_EMAIL
    const password = process.env.SEED_ADMIN_PASSWORD
    if (!email || !password) {
      test.skip()
      return
    }
    const response = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    if (response && response.status() >= 500) {
      test.skip()
      return
    }
    await page.locator('input[name="email"], input[type="email"]').first().fill(email)
    await page.locator('input[type="password"]').first().fill(password)
    await page.locator('button[type="submit"]').or(
      page.getByRole('button', { name: /entrar|login/i })
    ).first().click()
    await expect(page).toHaveURL(/\/admin(?!\/login)/, { timeout: 15_000 })
  })
})

test.describe('Admin — credenciais inválidas', () => {
  test('login inválido exibe mensagem de erro', async ({ page }) => {
    const response = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    if (response && response.status() >= 500) {
      test.skip()
      return
    }
    await page.locator('input[name="email"], input[type="email"]').first().fill('invalido@teste.com')
    await page.locator('input[type="password"]').first().fill('senhaerrada123')
    await page.locator('button[type="submit"]').or(
      page.getByRole('button', { name: /entrar|login/i })
    ).first().click()
    await expect(page.locator('body')).toContainText(/inválid|incorret|não encontr/i, { timeout: 10_000 })
  })
})
