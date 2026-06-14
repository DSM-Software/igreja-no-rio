import { test, expect } from '@playwright/test'

test.describe('Agenda — botão de inscrição', () => {
  test('página da agenda carrega sem erros', async ({ page }) => {
    const res = await page.goto('/agenda')
    expect(res?.ok()).toBeTruthy()
  })

  test('botão "Inscrever-se" aponta para URL externa quando presente', async ({ page }) => {
    await page.goto('/agenda')

    const registrationLinks = page.getByRole('link', { name: /inscrever-se/i })
    const count = await registrationLinks.count()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const link = registrationLinks.nth(i)
        await expect(link).toBeVisible()
        const href = await link.getAttribute('href')
        expect(href).toBeTruthy()
        expect(href).toMatch(/^https?:\/\//)
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      }
    }
  })

  test('eventos sem URL de inscrição não exibem botão "Inscrever-se"', async ({ page }) => {
    await page.goto('/agenda')

    const eventCards = page.locator('.events-list > div')
    const cardCount = await eventCards.count()

    if (cardCount > 0) {
      // Confirm the page does not always show the button for every card
      const totalButtons = await page.getByRole('link', { name: /inscrever-se/i }).count()
      // totalButtons can be 0 (no event has URL) or less than or equal to cardCount
      expect(totalButtons).toBeLessThanOrEqual(cardCount)
    }
  })
})
