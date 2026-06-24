import { test, expect, type Page } from '@playwright/test'

const CONSENT_KEY = 'ir:consent:v1'

async function seedConsent(page: Page) {
  await page.addInitScript(
    ({ key }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          decidedAt: new Date().toISOString(),
          categories: { analytics: false, marketing: false },
        }),
      )
    },
    { key: CONSENT_KEY },
  )
}

test.describe('Site search — gatilho no header', () => {
  test('gatilho visível em viewport desktop em rotas públicas', async ({ page }) => {
    await seedConsent(page)
    for (const route of ['/', '/blog', '/agenda']) {
      const response = await page.goto(route)
      expect(response?.ok()).toBeTruthy()
      const trigger = page
        .locator('header[role="banner"]')
        .locator('button[aria-label="Buscar"]')
        .first()
      await expect(trigger).toBeVisible()
    }
  })

  test('gatilho visível em viewport mobile', async ({ page }) => {
    await seedConsent(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const triggers = page
      .locator('header[role="banner"]')
      .locator('button[aria-label="Buscar"]:visible')
    await expect(triggers).toHaveCount(1)
  })
})

test.describe('Site search — overlay e atalho /', () => {
  test('clique no gatilho abre o overlay com input focado', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page
      .locator('header[role="banner"]')
      .locator('button[aria-label="Buscar"]')
      .first()
      .click()

    const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
    await expect(dialog).toBeVisible()

    const input = dialog.getByRole('combobox')
    await expect(input).toBeFocused()
  })

  test('atalho / abre o overlay em desktop', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page.locator('body').click({ position: { x: 5, y: 5 } })
    await page.keyboard.press('/')
    const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
    await expect(dialog).toBeVisible()
  })

  test('atalho Ctrl/Cmd+K abre o overlay', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page.locator('body').click({ position: { x: 5, y: 5 } })
    await page.keyboard.press('ControlOrMeta+k')
    const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
    await expect(dialog).toBeVisible()
  })

  test('atalho / é ignorado dentro de um input editável', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/busca')
    const formInput = page.getByRole('search').getByLabel('Buscar')
    await formInput.focus()
    await formInput.fill('')
    await page.keyboard.press('/')

    await expect(page.getByRole('dialog', { name: 'Buscar no site' })).toHaveCount(0)
    await expect(formInput).toHaveValue('/')
  })

  test('Esc fecha overlay e devolve foco ao gatilho', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    const trigger = page
      .locator('header[role="banner"]')
      .locator('button[aria-label="Buscar"]')
      .first()
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })
})

test.describe('Site search — resultados no overlay', () => {
  test('digitar termo com 2+ letras dispara busca e exibe agrupamento', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page
      .locator('header[role="banner"]')
      .locator('button[aria-label="Buscar"]')
      .first()
      .click()

    const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
    await dialog.getByRole('combobox').fill('igreja')

    // Aguarda pelo menos um hit aparecer (debounce + fetch)
    await expect(dialog.getByRole('listbox')).toBeVisible()
    await expect(dialog.getByRole('option').first()).toBeVisible({ timeout: 8000 })
    // O grupo de Posts é renderizado quando há matches em posts
    await expect(dialog.getByText('Posts', { exact: true })).toBeVisible()
  })

  test('navegação por seta + Enter abre o hit destacado', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page
      .locator('header[role="banner"]')
      .locator('button[aria-label="Buscar"]')
      .first()
      .click()
    const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
    await dialog.getByRole('combobox').fill('igreja')
    await expect(dialog.getByRole('option').first()).toBeVisible({ timeout: 8000 })

    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL(/\/blog\/|\/agenda/)
  })

  test('estado "nada encontrado" com links para /blog e /agenda', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page
      .locator('header[role="banner"]')
      .locator('button[aria-label="Buscar"]')
      .first()
      .click()
    const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
    await dialog.getByRole('combobox').fill('zzzqxptv')
    await expect(dialog.getByText(/Nada encontrado para/i)).toBeVisible({ timeout: 8000 })
    await expect(dialog.getByRole('link', { name: 'Ver todos os posts' })).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Ver a agenda' })).toBeVisible()
  })

  test('post não publicado não aparece em resultados', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page
      .locator('header[role="banner"]')
      .locator('button[aria-label="Buscar"]')
      .first()
      .click()
    const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
    await dialog.getByRole('combobox').fill('rascunho')
    // Esperar debounce + fetch resolver (loading some quando estado vira success)
    await expect(dialog.getByText('Buscando…')).toHaveCount(0, { timeout: 8000 })
    await expect(
      dialog.getByText(/rascunho do autor para testes/i),
    ).toHaveCount(0)
  })
})

test.describe('Site search — overlay cobre chrome elevado da página', () => {
  // A nav de categorias de /downloads é position: sticky com z-index próprio.
  // O backdrop do overlay deve pintar acima dela — sem deixar uma faixa branca.
  async function openSearchOnDownloads(page: Page) {
    await seedConsent(page)
    const response = await page.goto('/downloads')
    expect(response?.ok()).toBeTruthy()

    const categoryNav = page.locator('.downloads-category-nav')
    await expect(categoryNav).toBeVisible()

    await page
      .locator('header[role="banner"]')
      .locator('button[aria-label="Buscar"]:visible')
      .first()
      .click()
    await expect(page.getByRole('dialog', { name: 'Buscar no site' })).toBeVisible()
    return categoryNav
  }

  // No ponto onde a nav de categorias está, o elemento pintado no topo deve ser
  // o backdrop do overlay (ou um descendente), nunca a nav de categorias.
  async function topElementOverNavIsOverlay(page: Page) {
    return page.evaluate(() => {
      const nav = document.querySelector('.downloads-category-nav')
      if (!nav) return { ok: false, reason: 'sem nav' }
      const rect = nav.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const el = document.elementFromPoint(x, y)
      const insideNav = Boolean(el?.closest('.downloads-category-nav'))
      const insideOverlay = Boolean(
        el?.closest('[role="presentation"], [role="dialog"][aria-label="Buscar no site"]'),
      )
      return { ok: insideOverlay && !insideNav, insideNav, insideOverlay }
    })
  }

  test('desktop: backdrop cobre a nav de categorias em /downloads', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await openSearchOnDownloads(page)
    const result = await topElementOverNavIsOverlay(page)
    expect(result.insideNav).toBe(false)
    expect(result.insideOverlay).toBe(true)
  })

  test('mobile: backdrop cobre a nav de categorias em /downloads', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await openSearchOnDownloads(page)
    const result = await topElementOverNavIsOverlay(page)
    expect(result.insideNav).toBe(false)
    expect(result.insideOverlay).toBe(true)
  })
})

test.describe('Site search — página /busca', () => {
  test('/busca?q=igreja retorna 200 com noindex e seções', async ({ page }) => {
    await seedConsent(page)
    const response = await page.goto('/busca?q=igreja')
    expect(response?.ok()).toBeTruthy()
    await expect(page).toHaveTitle(/Buscar/i)
    await expect(
      page.locator('meta[name="robots"]'),
    ).toHaveAttribute('content', /noindex/i)
    await expect(
      page.getByRole('heading', { name: /Resultados para/i }),
    ).toBeVisible()
  })

  test('busca acento-insensitive: oração ≡ oracao', async ({ page }) => {
    await seedConsent(page)
    const [withAccent, withoutAccent] = await Promise.all([
      page.request.get('/api/search?q=' + encodeURIComponent('oração')),
      page.request.get('/api/search?q=oracao'),
    ])
    expect(withAccent.ok()).toBeTruthy()
    expect(withoutAccent.ok()).toBeTruthy()
    const a = (await withAccent.json()) as { total: number }
    const b = (await withoutAccent.json()) as { total: number }
    // Comparamos totais — não exigimos ordem idêntica (similaridade pode variar minimamente)
    expect(a.total).toBe(b.total)
  })

  test('/busca sem q exibe campo de busca em destaque', async ({ page }) => {
    await seedConsent(page)
    const response = await page.goto('/busca')
    expect(response?.ok()).toBeTruthy()
    await expect(
      page.getByText(/Digite o que você procura para começar/i),
    ).toBeVisible()
    await expect(page.getByRole('search')).toBeVisible()
  })

  test('endpoint cap query longa para limitar custo de busca', async ({ page }) => {
    // Defesa contra DoS: q gigante deve ser truncado antes de chegar ao DB.
    const longQuery = 'a'.repeat(2_000)
    const res = await page.request.get(
      '/api/search?q=' + encodeURIComponent(longQuery),
    )
    expect(res.status()).toBe(200)
    const body = (await res.json()) as { posts: unknown[]; events: unknown[] }
    expect(Array.isArray(body.posts)).toBe(true)
    expect(Array.isArray(body.events)).toBe(true)
  })
})
