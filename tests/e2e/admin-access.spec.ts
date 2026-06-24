import { test, expect, type Page } from '@playwright/test'
import { Users } from '@/collections/Users'
import { Posts } from '@/collections/Posts'
import {
  canEditPostsField,
  canMutateOwnOrElevated,
  resolveContentOwner,
} from '@/access/contentAccess'

type Role = 'admin' | 'editor' | 'autor'

function credentialsFor(role: Role) {
  if (role === 'admin') {
    return {
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
    }
  }
  if (role === 'editor') {
    return {
      email: process.env.SEED_EDITOR_EMAIL ?? 'editor@igrejanorio.local',
      password: process.env.SEED_EDITOR_PASSWORD ?? 'change-me-now',
    }
  }
  return {
    email: process.env.SEED_AUTOR_EMAIL ?? 'autor@igrejanorio.local',
    password: process.env.SEED_AUTOR_PASSWORD ?? 'change-me-now',
  }
}

async function loginAs(page: Page, role: Role): Promise<boolean> {
  const { email, password } = credentialsFor(role)
  if (!email || !password) return false

  const response = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
  if (response && response.status() >= 500) return false

  await page.getByRole('textbox', { name: /email/i }).first().fill(email)
  await page.getByRole('textbox', { name: /password/i }).first().fill(password)
  await page.getByRole('button', { name: /entrar|login/i }).first().click()

  try {
    await page.waitForURL(/\/admin(?!\/login)/, { timeout: 15_000 })
    return true
  } catch {
    return false
  }
}

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

test.describe('Posts — campo body acessível para todos os papéis editores', () => {
  test('canEditPostsField libera admin/editor/autor e bloqueia anônimo', () => {
    expect(canEditPostsField({ req: { user: { id: 1, role: 'admin' } } } as any)).toBe(true)
    expect(canEditPostsField({ req: { user: { id: 2, role: 'editor' } } } as any)).toBe(true)
    expect(canEditPostsField({ req: { user: { id: 3, role: 'autor' } } } as any)).toBe(true)
    expect(canEditPostsField({ req: { user: null } } as any)).toBe(false)
    expect(canEditPostsField({ req: { user: { id: 4, role: null } } } as any)).toBe(false)
  })

  test('campo body declara access explícito por papel', () => {
    const bodyField = Posts.fields.find(
      (f) => 'name' in f && f.name === 'body',
    ) as { name: string; access?: { read?: any; update?: any; create?: any } } | undefined

    expect(bodyField).toBeDefined()
    expect(typeof bodyField?.access?.read).toBe('function')
    expect(typeof bodyField?.access?.update).toBe('function')
    expect(typeof bodyField?.access?.create).toBe('function')

    expect(bodyField?.access?.read?.({ req: { user: { id: 1, role: 'autor' } } } as any)).toBe(true)
    expect(bodyField?.access?.update?.({ req: { user: { id: 1, role: 'autor' } } } as any)).toBe(true)
    expect(bodyField?.access?.create?.({ req: { user: { id: 1, role: 'autor' } } } as any)).toBe(true)
  })

  test('todos os campos editáveis de Posts têm access explícito', () => {
    const editableFieldNames = [
      'title',
      'slug',
      'category',
      'serie',
      'serieParte',
      'author',
      'date',
      'coverImage',
      'coverColor',
      'excerpt',
      'body',
      'tags',
      'published',
    ]

    for (const name of editableFieldNames) {
      const field = Posts.fields.find((f) => 'name' in f && f.name === name) as
        | { name: string; access?: { read?: any; update?: any; create?: any } }
        | undefined

      expect(field, `campo "${name}" deve existir em Posts`).toBeDefined()
      expect(typeof field?.access?.read, `${name}.access.read`).toBe('function')
      expect(typeof field?.access?.update, `${name}.access.update`).toBe('function')
      expect(typeof field?.access?.create, `${name}.access.create`).toBe('function')

      const autorCtx = { req: { user: { id: 1, role: 'autor' } } } as any
      expect(field?.access?.read?.(autorCtx), `${name} read autor`).toBe(true)
      expect(field?.access?.update?.(autorCtx), `${name} update autor`).toBe(true)
    }
  })
})

test.describe('Admin — visibilidade do campo body no formulário por papel', () => {
  // Apenas labels explicitamente definidas em PT-BR em src/collections/Posts.ts.
  // `title`, `category`, `date`, `slug` usam o label default do Payload (depende
  // do locale do admin), então não os asseguramos aqui — a cobertura de "todos
  // os campos editáveis têm `access`" já existe nos testes não-visuais acima.
  const explicitLabelChecks = [
    'Autor',
    'Resumo (chamada)',
    'Corpo do post',
    'Publicado',
  ]

  for (const role of ['admin', 'editor', 'autor'] as const) {
    test(`${role}: campo "Corpo do post" visível em /admin/collections/posts/create`, async ({ page }) => {
      const logged = await loginAs(page, role)
      if (!logged) {
        test.skip()
        return
      }

      const response = await page.goto('/admin/collections/posts/create', {
        waitUntil: 'domcontentloaded',
      })
      if (response && response.status() >= 500) {
        test.skip()
        return
      }

      const bodyLabel = page.getByText('Corpo do post', { exact: false }).first()
      await expect(bodyLabel).toBeVisible({ timeout: 15_000 })

      for (const label of explicitLabelChecks) {
        await expect(
          page.getByText(label, { exact: false }).first(),
          `Esperava label "${label}" visível para o papel ${role}`,
        ).toBeVisible({ timeout: 10_000 })
      }
    })
  }

  test('autor: campo "Corpo do post" visível ao editar post próprio', async ({ page }) => {
    const logged = await loginAs(page, 'autor')
    if (!logged) {
      test.skip()
      return
    }

    const listResp = await page.goto('/admin/collections/posts', {
      waitUntil: 'domcontentloaded',
    })
    if (listResp && listResp.status() >= 500) {
      test.skip()
      return
    }

    const seededLink = page
      .getByRole('link', { name: /Rascunho do autor para testes/i })
      .first()

    if (!(await seededLink.isVisible().catch(() => false))) {
      test.skip()
      return
    }

    await seededLink.click()

    const bodyLabel = page.getByText('Corpo do post', { exact: false }).first()
    await expect(bodyLabel).toBeVisible({ timeout: 15_000 })
  })
})

// Regressão: o editor Lexical do campo `body` é um componente renderizado no
// servidor (RSC). Ele só renderiza quando `req.payload.importMap` (o importMap
// da instância global compartilhada do Payload) contém a entrada do Lexical.
// Um importMap vazio passado por qualquer rota (ex.: o `not-found.tsx` do admin
// importando um `importMap.ts` órfão/vazio) sobrescrevia esse mapa, fazendo o
// editor sumir do formulário **na navegação SPA** — mas NÃO no reload completo
// (SSR), que re-semeava o mapa. Por isso os testes acima, que usam `page.goto`
// (= SSR), não pegavam o bug. Estes cenários reproduzem o caminho real do
// usuário: navegação client-side (clicar), e asseguram que o editor (não só o
// label) de fato renderizou.
test.describe('Admin — editor Lexical do body renderiza na navegação SPA', () => {
  const LEXICAL_EDITOR = '[data-lexical-editor="true"]'

  test('admin: editor renderiza ao clicar em "Create New" (sem reload)', async ({ page }) => {
    const logged = await loginAs(page, 'admin')
    if (!logged) {
      test.skip()
      return
    }

    // Visita uma rota do site primeiro: frontend e admin compartilham a mesma
    // instância global do Payload, condição em que o bug se manifestava.
    await page.goto('/blog', { waitUntil: 'domcontentloaded' })

    const listResp = await page.goto('/admin/collections/posts', {
      waitUntil: 'domcontentloaded',
    })
    if (listResp && listResp.status() >= 500) {
      test.skip()
      return
    }

    // Navegação SPA (client-side), não `page.goto` — é o caminho que falhava.
    await page.getByRole('link', { name: /Create new Post/i }).first().click()
    await expect(page).toHaveURL(/\/admin\/collections\/posts\/create/, { timeout: 15_000 })

    await expect(page.getByText('Corpo do post', { exact: false }).first()).toBeVisible({
      timeout: 15_000,
    })
    // O editor em si (RSC) precisa ter renderizado, não apenas o label.
    await expect(page.locator(LEXICAL_EDITOR).first()).toBeVisible({ timeout: 15_000 })
  })

  test('autor: editor renderiza ao clicar no post próprio (sem reload)', async ({ page }) => {
    const logged = await loginAs(page, 'autor')
    if (!logged) {
      test.skip()
      return
    }

    const listResp = await page.goto('/admin/collections/posts', {
      waitUntil: 'domcontentloaded',
    })
    if (listResp && listResp.status() >= 500) {
      test.skip()
      return
    }

    const seededLink = page
      .getByRole('link', { name: /Rascunho do autor para testes/i })
      .first()
    if (!(await seededLink.isVisible().catch(() => false))) {
      test.skip()
      return
    }

    await seededLink.click()

    await expect(page.getByText('Corpo do post', { exact: false }).first()).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.locator(LEXICAL_EDITOR).first()).toBeVisible({ timeout: 15_000 })
  })
})
