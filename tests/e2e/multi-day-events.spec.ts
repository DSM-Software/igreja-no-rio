import { test, expect, type APIRequestContext, type Page } from '@playwright/test'

/**
 * Eventos de mais de um dia: um evento em andamento (começou ontem, termina
 * amanhã ou depois) deve continuar visível na home e na /agenda até o dia de
 * término, e o card deve exibir o intervalo de datas e horários.
 *
 * O evento é semeado via API REST com o usuário editor do seed
 * (`npm run seed`) e removido ao final.
 */

const EDITOR = {
  email: process.env.SEED_EDITOR_EMAIL ?? 'editor@igrejanorio.local',
  password: process.env.SEED_EDITOR_PASSWORD ?? 'change-me-now',
}

const TITLE = '[E2E] Acampamento multi-dia de teste'

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

function isoAtNoonUTC(offsetDays: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + offsetDays)
  return `${d.toISOString().slice(0, 10)}T12:00:00.000Z`
}

async function loginEditor(request: APIRequestContext): Promise<string | null> {
  const res = await request.post('/api/users/login', {
    data: { email: EDITOR.email, password: EDITOR.password },
  })
  if (!res.ok()) return null
  const body = await res.json()
  return body?.token ?? null
}

// Serial: os testes logam com o mesmo usuário de seed, e logins concorrentes
// em workers paralelos invalidam a sessão um do outro (403 intermitente).
test.describe.configure({ mode: 'serial' })

test.describe('Eventos de mais de um dia', () => {
  let token: string | null = null
  let eventId: number | null = null

  test.beforeEach(async ({ request }) => {
    token = await loginEditor(request)
    test.skip(!token, 'Usuários de seed indisponíveis — rode `npm run seed`')

    const res = await request.post('/api/events', {
      headers: { Authorization: `JWT ${token}` },
      data: {
        title: TITLE,
        date: isoAtNoonUTC(-1),
        time: '08:00',
        isMultiDay: true,
        endDate: isoAtNoonUTC(2),
        endTime: '12:00',
        location: 'Sítio de teste',
      },
    })
    expect(res.ok(), `Falha ao criar evento de teste: ${res.status()}`).toBeTruthy()
    const body = await res.json()
    eventId = body?.doc?.id ?? null
  })

  test.afterEach(async ({ request }) => {
    if (token && eventId) {
      await request.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `JWT ${token}` },
      })
    }
  })

  test('evento em andamento aparece na agenda com o intervalo', async ({
    page,
  }) => {
    // A lista da home tem só 4 vagas (preenchíveis por recorrentes), então a
    // presença determinística é validada na agenda; a elegibilidade da home é
    // coberta pelo teste do banner de destaque abaixo.
    await page.goto('/agenda')
    const card = page
      .locator('.events-list > div', { hasText: TITLE })
      .first()
    await expect(card).toBeVisible()

    // Linha de horário exibe início → término com o dia de término
    const end = new Date(isoAtNoonUTC(2))
    const endDay = String(end.getUTCDate()).padStart(2, '0')
    await expect(card).toContainText(`08:00 → 12:00 (dia ${endDay})`)

    // Bloco de data: intervalo "DD–DD" no mesmo mês, ou "até DD mês" cruzando meses
    const start = new Date(isoAtNoonUTC(-1))
    const startDay = String(start.getUTCDate()).padStart(2, '0')
    if (start.getUTCMonth() === end.getUTCMonth()) {
      await expect(card).toContainText(`${startDay}–${endDay}`)
    } else {
      await expect(card).toContainText(
        `até ${endDay} ${MONTHS_SHORT[end.getUTCMonth()]}`,
      )
    }
  })

  test('evento em andamento é elegível para o banner de destaque da home', async ({
    page,
    request,
  }) => {
    const auth = { Authorization: `JWT ${token}` }

    // Entre eventos marcados, o banner exibe o primeiro por data de início;
    // desmarca destaques pré-existentes para isolar o teste e restaura ao final.
    const highlightedRes = await request.get(
      '/api/events?where[highlight][equals]=true&limit=100',
      { headers: auth },
    )
    const previouslyHighlighted: number[] = (
      (await highlightedRes.json())?.docs ?? []
    ).map((doc: { id: number }) => doc.id)

    try {
      for (const id of previouslyHighlighted) {
        await request.patch(`/api/events/${id}`, {
          headers: auth,
          data: { highlight: false },
        })
      }

      // Marca o evento em andamento como destaque para forçar a elegibilidade
      const res = await request.patch(`/api/events/${eventId}`, {
        headers: auth,
        data: { highlight: true },
      })
      expect(res.ok()).toBeTruthy()

      await page.goto('/')
      const banner = page.locator('section.bg-brand-500')
      await expect(banner).toContainText(TITLE)

      const end = new Date(isoAtNoonUTC(2))
      const endDay = String(end.getUTCDate()).padStart(2, '0')
      await expect(banner).toContainText(
        `até ${endDay} ${MONTHS_SHORT[end.getUTCMonth()]}, 12:00`,
      )
    } finally {
      for (const id of previouslyHighlighted) {
        await request.patch(`/api/events/${id}`, {
          headers: auth,
          data: { highlight: true },
        })
      }
    }
  })
})

test.describe('Admin — formulário de eventos', () => {
  async function loginAdminUI(page: Page): Promise<boolean> {
    const response = await page.goto('/admin/login', {
      waitUntil: 'domcontentloaded',
    })
    if (response && response.status() >= 500) return false

    await page.getByRole('textbox', { name: /email/i }).first().fill(EDITOR.email)
    await page
      .getByRole('textbox', { name: /password/i })
      .first()
      .fill(EDITOR.password)
    await page.getByRole('button', { name: /entrar|login/i }).first().click()

    try {
      await page.waitForURL(/\/admin(?!\/login)/, { timeout: 15_000 })
      return true
    } catch {
      return false
    }
  }

  test('criação de evento tem labels em português e campos de término condicionais', async ({
    page,
  }) => {
    const logged = await loginAdminUI(page)
    test.skip(!logged, 'Usuários de seed indisponíveis — rode `npm run seed`')

    await page.goto('/admin/collections/events/create')

    // Labels em português (os obrigatórios ganham " *" do Payload)
    await expect(page.getByRole('textbox', { name: /título/i })).toBeVisible()
    await expect(page.getByText('Data de início').first()).toBeVisible()
    await expect(
      page.getByRole('textbox', { name: /horário de início/i }),
    ).toBeVisible()
    await expect(page.getByRole('textbox', { name: /^local/i })).toBeVisible()

    // Campos de término escondidos até marcar o checkbox multi-dia
    const endDateLabel = page.getByText('Data de término')
    await expect(endDateLabel).toHaveCount(0)

    await page
      .locator('label', { hasText: 'Evento de mais de um dia?' })
      .first()
      .click()

    await expect(endDateLabel.first()).toBeVisible()
    await expect(
      page.getByRole('textbox', { name: /horário de término/i }),
    ).toBeVisible()
  })
})
