'use client'

import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { useConsent } from './useConsent'
import { isConsentValid } from '@/lib/consent'

const OPEN_CUSTOMIZE_EVENT = 'ir:consent:open-customize'

const subscribeNoop = () => () => {}
const getHydratedClient = () => true
const getHydratedServer = () => false

export function ConsentBanner() {
  const { state, accept, acceptAll, rejectAll } = useConsent()
  const hydrated = useSyncExternalStore(subscribeNoop, getHydratedClient, getHydratedServer)
  const [mode, setMode] = useState<'default' | 'customize'>('default')
  const [analyticsToggle, setAnalyticsToggle] = useState(false)
  const [marketingToggle, setMarketingToggle] = useState(false)

  useEffect(() => {
    const handler = () => {
      setMode('customize')
      setAnalyticsToggle(false)
      setMarketingToggle(false)
    }
    window.addEventListener(OPEN_CUSTOMIZE_EVENT, handler)
    return () => window.removeEventListener(OPEN_CUSTOMIZE_EVENT, handler)
  }, [])

  if (!hydrated) return null
  if (isConsentValid(state)) return null

  const buttonBase =
    'inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'

  return (
    <div
      data-testid="cookie-consent-banner"
      role="dialog"
      aria-live="polite"
      aria-label="Preferências de cookies"
      className="fixed bottom-0 inset-x-0 z-50 border-t border-ink/10 bg-bg shadow-soft"
    >
      <div className="mx-auto max-w-content px-4 py-4 sm:px-6 sm:py-5">
        {mode === 'default' ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-sm leading-relaxed text-ink-2">
              Usamos cookies e dados de navegação para entender como o site é
              usado e melhorar a experiência. Você pode aceitar, recusar ou
              personalizar.{' '}
              <Link href="/privacidade" className="font-medium text-brand-600 underline">
                Saiba mais
              </Link>
              .
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
              <button
                type="button"
                onClick={() => setMode('customize')}
                className={`${buttonBase} bg-transparent text-ink hover:bg-ink/5`}
              >
                Personalizar
              </button>
              <button
                type="button"
                onClick={() => rejectAll()}
                className={`${buttonBase} border border-ink/20 bg-bg text-ink hover:bg-ink/5`}
              >
                Rejeitar todos
              </button>
              <button
                type="button"
                onClick={() => acceptAll()}
                className={`${buttonBase} bg-brand-600 text-white hover:bg-brand-700`}
              >
                Aceitar todos
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                Preferências de cookies
              </h2>
              <p className="mt-1 text-sm text-ink-2">
                Escolha quais categorias de dados de navegação podem ser coletadas.
                Você pode mudar essa decisão a qualquer momento em{' '}
                <Link href="/privacidade" className="font-medium text-brand-600 underline">
                  /privacidade
                </Link>
                .
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              <ConsentToggle
                title="Essenciais"
                description="Necessários para o funcionamento básico do site (não envolve rastreamento)."
                checked
                disabled
                onChange={() => {}}
              />
              <ConsentToggle
                title="Analíticos"
                description="Ajuda a entender quais páginas e conteúdos são mais úteis para melhorar o site."
                checked={analyticsToggle}
                onChange={setAnalyticsToggle}
              />
              <ConsentToggle
                title="Marketing"
                description="Permite medir o alcance das nossas publicações em redes sociais."
                checked={marketingToggle}
                onChange={setMarketingToggle}
              />
            </ul>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
              <button
                type="button"
                onClick={() => setMode('default')}
                className={`${buttonBase} bg-transparent text-ink hover:bg-ink/5`}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() =>
                  accept({ analytics: analyticsToggle, marketing: marketingToggle })
                }
                className={`${buttonBase} bg-brand-600 text-white hover:bg-brand-700`}
              >
                Salvar preferências
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type ConsentToggleProps = {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (next: boolean) => void
}

function ConsentToggle({ title, description, checked, disabled, onChange }: ConsentToggleProps) {
  const id = `consent-toggle-${title.toLowerCase()}`
  return (
    <li className="flex items-start justify-between gap-4 rounded-md border border-ink/10 bg-bg-2 p-3">
      <div>
        <label htmlFor={id} className="block font-medium text-ink">
          {title}
        </label>
        <p className="mt-0.5 text-xs text-ink-2">{description}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-ink/30 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
      />
    </li>
  )
}
