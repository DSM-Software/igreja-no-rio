import { test, expect } from '@playwright/test'

test.describe('Home — próximo evento', () => {
  test('home carrega sem datas inválidas na área de eventos', async ({
    page,
  }) => {
    const res = await page.goto('/')
    expect(res?.ok()).toBeTruthy()
    await expect(page.locator('body')).not.toContainText('NaN')
  })

  test('botão "Ver agenda" do destaque aponta para /agenda', async ({
    page,
  }) => {
    await page.goto('/')
    const banner = page.locator('section.bg-brand-500')
    if (await banner.count()) {
      await expect(
        banner.getByRole('link', { name: /ver agenda/i }),
      ).toHaveAttribute('href', '/agenda')
    }
  })

  test('evento em destaque na home é um evento válido presente na agenda', async ({
    page,
  }) => {
    await page.goto('/')
    const banner = page.locator('section.bg-brand-500')

    // O destaque só aparece quando há evento elegível (recorrente ou futuro).
    test.skip(
      (await banner.count()) === 0,
      'Sem eventos elegíveis para destaque no momento',
    )

    const title = (
      await banner.locator('p.font-bold').first().innerText()
    ).trim()
    expect(title.length).toBeGreaterThan(0)

    // Como o destaque nunca pode ser um evento passado, ele deve constar na
    // agenda (que filtra passados): recorrentes e futuros aparecem lá.
    await page.goto('/agenda')
    await expect(page.locator('body')).toContainText(title)
  })
})
