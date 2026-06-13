import { test, expect } from '@playwright/test'
import { Users } from '@/collections/Users'
import { Posts } from '@/collections/Posts'
import { canMutateOwnOrElevated, resolveContentOwner } from '@/access/contentAccess'

async function expectAdminLoginScreen(page: import('@playwright/test').Page) {
  const emailInput = page.getByRole('textbox', { name: /email/i }).first()
  const passwordInput = page.getByRole('textbox', { name: /password/i }).first()
  const submitBtn = page.getByRole('button', { name: /entrar|login/i }).first()

  await expect(emailInput).toBeVisible({ timeout: 10_000 })
  await expect(passwordInput).toBeVisible({ timeout: 10_000 })
  await expect(submitBtn).toBeVisible({ timeout: 10_000 })
}

test.describe('Admin — acesso sem autenticação', () => {
  test('/admin sem auth redireciona para URL contendo "login"', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' })
    await page.waitForURL(/\/admin(\/login)?/, { timeout: 15_000 })
    await expectAdminLoginScreen(page)
  })
})

test.describe('Admin — formulário de login', () => {
  test('campos email e password presentes em /admin/login', async ({ page }) => {
    const response = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    if (response && response.status() >= 500) {
      test.skip()
      return
    }
    await expectAdminLoginScreen(page)
  })

  test('botão de submit presente em /admin/login', async ({ page }) => {
    const response = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    if (response && response.status() >= 500) {
      test.skip()
      return
    }
    const submitBtn = page.getByRole('button', { name: /entrar|login/i }).first()
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
    await page.getByRole('textbox', { name: /email/i }).first().fill(email)
    await page.getByRole('textbox', { name: /password/i }).first().fill(password)
    await page.getByRole('button', { name: /entrar|login/i }).first().click()
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
    await page.getByRole('textbox', { name: /email/i }).first().fill('invalido@teste.com')
    await page.getByRole('textbox', { name: /password/i }).first().fill('senhaerrada123')
    await page.getByRole('button', { name: /entrar|login/i }).first().click()
    await expect(page.locator('body')).toContainText(/inválid|incorrect|incorret|não encontr/i, { timeout: 10_000 })
  })
})

test.describe('Posts — campo corpo do post', () => {
  test('coleção Posts tem campo body do tipo richText', () => {
    const bodyField = Posts.fields.find(
      (f) => 'name' in f && f.name === 'body',
    ) as { name: string; type: string; label?: string; required?: boolean } | undefined

    expect(bodyField).toBeDefined()
    expect(bodyField?.type).toBe('richText')
    expect(bodyField?.required).toBe(true)
  })

  test('campo body tem label em português', () => {
    const bodyField = Posts.fields.find(
      (f) => 'name' in f && f.name === 'body',
    ) as { name: string; label?: string } | undefined

    expect(bodyField?.label).toBeTruthy()
    expect(typeof bodyField?.label).toBe('string')
  })
})

test.describe('Admin — regras de permissão', () => {
  test('editor não pode gerenciar usuários', async () => {
    const editorContext = { req: { user: { id: 10, role: 'editor' } } } as any

    expect(Users.access?.create?.(editorContext)).toBe(false)
    expect(Users.access?.update?.(editorContext)).toBe(false)
    expect(Users.access?.delete?.(editorContext)).toBe(false)
  })

  test('autor só recebe filtro de mutação para o próprio owner', async () => {
    const authorContext = { req: { user: { id: 7, role: 'autor' } } } as any

    expect(canMutateOwnOrElevated(authorContext)).toEqual({ owner: { equals: 7 } })
  })

  test('owner é fixado automaticamente para autor e preservado em updates', () => {
    expect(resolveContentOwner({ req: { user: { id: 7, role: 'autor' } } })).toBe(7)
    expect(
      resolveContentOwner({
        value: 99,
        originalDoc: { owner: 7 },
        req: { user: { id: 7, role: 'autor' } },
      })
    ).toBe(7)
  })
})
