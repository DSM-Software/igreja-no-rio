import { test, expect } from '@playwright/test'

const MONTHS_SHORT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

interface CardInfo {
  day: number
  month: number
  time: string
}

test.describe('Agenda — ordenação por data e horário', () => {
  test('eventos com a mesma data aparecem em ordem crescente de horário', async ({
    page,
  }) => {
    await page.goto('/agenda')

    const upcomingHeading = page.getByRole('heading', { name: /próximos eventos/i })
    const hasUpcoming = await upcomingHeading.count()
    test.skip(!hasUpcoming, 'Sem seção "Próximos eventos" para validar ordenação')

    const upcomingSection = upcomingHeading.locator('xpath=..')
    const cards = upcomingSection.locator('.events-list > div')
    const cardCount = await cards.count()

    test.skip(
      cardCount < 2,
      'Menos de 2 eventos próximos — ordenação não é observável',
    )

    const infos: CardInfo[] = []
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i)
      const dayText = (await card.locator('p.font-extrabold').innerText()).trim()
      const monText = (await card.locator('p.uppercase').first().innerText()).trim().toLowerCase()
      const timeBlock = (await card.locator('p').nth(1).innerText()).trim()
      const timeMatch = timeBlock.match(/(\d{1,2}):(\d{2})/)

      if (!timeMatch) continue
      const monthIndex = MONTHS_SHORT.indexOf(monText)
      if (monthIndex === -1) continue
      const day = Number.parseInt(dayText, 10)
      if (Number.isNaN(day)) continue

      infos.push({
        day,
        month: monthIndex,
        time: `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`,
      })
    }

    test.skip(infos.length < 2, 'Não foi possível ler ao menos 2 cards parseáveis')

    for (let i = 1; i < infos.length; i++) {
      const prev = infos[i - 1]
      const curr = infos[i]

      if (prev.month === curr.month && prev.day === curr.day) {
        expect(
          prev.time <= curr.time,
          `Eventos no mesmo dia devem aparecer em ordem crescente de horário: "${prev.time}" antes de "${curr.time}"`,
        ).toBeTruthy()
      }
    }
  })
})
