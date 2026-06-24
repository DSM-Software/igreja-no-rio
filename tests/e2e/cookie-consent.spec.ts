import { test, expect, type Page } from '@playwright/test'

const CONSENT_KEY = 'ir:consent:v1'

async function seedConsent(
  page: Page,
  categories: { analytics: boolean; marketing: boolean },
) {
  await page.addInitScript(
    ({ key, payload }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          decidedAt: new Date().toISOString(),
          categories: payload,
        }),
      )
    },
    { key: CONSENT_KEY, payload: categories },
  )
}

async function clearConsent(page: Page) {
  await page.addInitScript((key) => window.localStorage.removeItem(key), CONSENT_KEY)
}

test.describe('Consent banner — visibilidade', () => {
  test('banner aparece em primeira visita à home', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/')
    await expect(page.getByTestId('cookie-consent-banner')).toBeVisible()
  })

  test('banner ausente quando decisão recente está em localStorage', async ({ page }) => {
    await seedConsent(page, { analytics: true, marketing: true })
    await page.goto('/')
    await expect(page.getByTestId('cookie-consent-banner')).toHaveCount(0)
  })

  test('banner ausente em /admin/login', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/admin/login')
    await expect(page.getByTestId('cookie-consent-banner')).toHaveCount(0)
  })
})

test.describe('Consent banner — ações', () => {
  test('Aceitar todos grava analytics=true e marketing=true', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/')
    const banner = page.getByTestId('cookie-consent-banner')
    await expect(banner).toBeVisible()
    await banner.getByRole('button', { name: /aceitar todos/i }).click()
    await expect(banner).toHaveCount(0)

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), CONSENT_KEY)
    const parsed = JSON.parse(stored ?? '{}')
    expect(parsed.categories.analytics).toBe(true)
    expect(parsed.categories.marketing).toBe(true)
    expect(typeof parsed.decidedAt).toBe('string')
  })

  test('Rejeitar todos grava analytics=false e marketing=false', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/')
    const banner = page.getByTestId('cookie-consent-banner')
    await banner.getByRole('button', { name: /rejeitar todos/i }).click()
    await expect(banner).toHaveCount(0)

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), CONSENT_KEY)
    const parsed = JSON.parse(stored ?? '{}')
    expect(parsed.categories.analytics).toBe(false)
    expect(parsed.categories.marketing).toBe(false)
  })

  test('Personalizar mostra 3 toggles e salva escolha granular', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/')
    const banner = page.getByTestId('cookie-consent-banner')
    await banner.getByRole('button', { name: /personalizar/i }).click()

    await expect(banner.getByText(/essenciais/i)).toBeVisible()
    await expect(banner.getByText(/^analíticos$/i)).toBeVisible()
    await expect(banner.getByText(/^marketing$/i)).toBeVisible()

    const checkboxes = banner.getByRole('checkbox')
    await expect(checkboxes).toHaveCount(3)
    await expect(checkboxes.nth(0)).toBeDisabled()
    await expect(checkboxes.nth(0)).toBeChecked()

    await checkboxes.nth(1).check()
    await banner.getByRole('button', { name: /salvar preferências/i }).click()

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), CONSENT_KEY)
    const parsed = JSON.parse(stored ?? '{}')
    expect(parsed.categories.analytics).toBe(true)
    expect(parsed.categories.marketing).toBe(false)
  })

  test('Aceitar e Rejeitar tem igual proeminência visual (altura e font-size)', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/')
    const banner = page.getByTestId('cookie-consent-banner')
    const accept = banner.getByRole('button', { name: /aceitar todos/i })
    const reject = banner.getByRole('button', { name: /rejeitar todos/i })

    const acceptBox = await accept.boundingBox()
    const rejectBox = await reject.boundingBox()
    expect(acceptBox).not.toBeNull()
    expect(rejectBox).not.toBeNull()
    expect(acceptBox!.height).toBeCloseTo(rejectBox!.height, 0)

    const acceptFont = await accept.evaluate((el) => getComputedStyle(el).fontSize)
    const rejectFont = await reject.evaluate((el) => getComputedStyle(el).fontSize)
    expect(acceptFont).toBe(rejectFont)
  })

  test('Aceitar e Rejeitar mantêm texto em linha única no desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await clearConsent(page)
    await page.goto('/')
    const banner = page.getByTestId('cookie-consent-banner')
    const accept = banner.getByRole('button', { name: /aceitar todos/i })
    const reject = banner.getByRole('button', { name: /rejeitar todos/i })

    // Cada botão deve renderizar seu texto numa única linha (sem wrap).
    const acceptLines = await accept.evaluate((el) => el.getClientRects().length)
    const rejectLines = await reject.evaluate((el) => el.getClientRects().length)
    expect(acceptLines).toBe(1)
    expect(rejectLines).toBe(1)
  })
})

test.describe('Consent banner — persistência', () => {
  test('decisão persiste após navegar para /blog', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/')
    const banner = page.getByTestId('cookie-consent-banner')
    await banner.getByRole('button', { name: /aceitar todos/i }).click()
    await expect(banner).toHaveCount(0)

    await page.locator('a[href="/blog"]').first().click()
    await page.waitForURL('**/blog')

    await expect(page.getByTestId('cookie-consent-banner')).toHaveCount(0)
  })

  test('decisão persiste após reload', async ({ page }) => {
    await clearConsent(page)
    await page.goto('/')
    await page.getByTestId('cookie-consent-banner').getByRole('button', { name: /aceitar todos/i }).click()
    await page.reload()
    await expect(page.getByTestId('cookie-consent-banner')).toHaveCount(0)
  })
})

test.describe('Consent banner — revogação via /privacidade', () => {
  test('botão "Gerenciar preferências" limpa localStorage e reabre o banner em modo customize', async ({ page }) => {
    await seedConsent(page, { analytics: true, marketing: true })
    await page.goto('/privacidade')

    const manageButton = page.getByRole('button', { name: /gerenciar preferências/i })
    await expect(manageButton).toBeVisible()
    await manageButton.click({ force: true })

    const banner = page.getByTestId('cookie-consent-banner')
    await expect(banner).toBeVisible()
    await expect(banner.getByRole('button', { name: /salvar preferências/i })).toBeVisible()

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), CONSENT_KEY)
    expect(stored).toBeNull()
  })
})
