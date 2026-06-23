## 1. Consent core module

- [x] 1.1 Criar `src/lib/consent.ts` exportando os tipos `ConsentCategories`, `ConsentState`, e as funções puras `readConsent()`, `writeConsent(categories)`, `resetConsent()`, `subscribeConsent(cb)`, `isConsentValid(state)` (TTL de 12 meses)
- [x] 1.2 Garantir SSR-safety: todas as funções retornam noop / `null` quando `typeof window === 'undefined'`
- [x] 1.3 Notificação cross-tab via `window.addEventListener('storage', ...)` E mesma-aba via `EventTarget` interno
- [x] 1.4 Constante `CONSENT_STORAGE_KEY = 'ir:consent:v1'` e `CONSENT_TTL_MS = 12 * 30 * 24 * 60 * 60 * 1000`

## 2. React hook

- [x] 2.1 Criar `src/components/consent/useConsent.ts` usando `useSyncExternalStore` para fornecer o estado atual de consentimento e métodos `accept(categories)`, `reject()`, `reset()`
- [x] 2.2 Hook expõe `state: ConsentState | null` (null = ainda não decidido) e `hasConsent(category): boolean`

## 3. Banner component

- [x] 3.1 Criar `src/components/consent/ConsentBanner.tsx` como Client Component
- [x] 3.2 Renderiza `null` até `useConsent()` confirmar que não há decisão válida (evita flash no SSR)
- [x] 3.3 Layout bottom-fixed com Tailwind: `fixed bottom-0 inset-x-0 z-50 bg-bg shadow-soft border-t border-ink/10 p-4`
- [x] 3.4 Texto em PT-BR mencionando Google Analytics, Meta Pixel e link para `/privacidade`
- [x] 3.5 Três botões com igual proeminência (mesma altura, padding, font-size): `Aceitar todos`, `Rejeitar todos`, `Personalizar`
- [x] 3.6 Layout responsivo: desktop (≥ 640px) com botões à direita do texto; mobile com texto em cima, botões empilhados full-width
- [x] 3.7 Atributo `data-testid="cookie-consent-banner"` no root do banner

## 4. Preferences panel

- [x] 4.1 Estado interno `mode: 'default' | 'customize'` no banner — clique em "Personalizar" muda para `customize`
- [x] 4.2 No modo customize, renderizar 3 toggles: `Essenciais` (disabled, checked), `Analíticos`, `Marketing` (com descrição curta cada)
- [x] 4.3 Botão `Salvar preferências` em modo customize chama `accept({ analytics, marketing })` com os toggles atuais e fecha o banner
- [x] 4.4 Botão `Voltar` no modo customize retorna ao modo default

## 5. Reopening from /privacidade

- [x] 5.1 Adicionar componente `src/components/consent/ManagePreferencesButton.tsx` (Client) que chama `resetConsent()` + dispara `window.dispatchEvent(new CustomEvent('ir:consent:open-customize'))`
- [x] 5.2 `ConsentBanner` escuta o evento `ir:consent:open-customize` e abre em modo `customize`
- [x] 5.3 `src/app/(frontend)/privacidade/page.tsx` ganha uma nova seção "Gerenciar preferências de cookies" com texto explicando o que faz e o botão importado

## 6. Analytics integration

- [x] 6.1 Atualizar `src/components/analytics/GoogleAnalytics.tsx`:
  - Antes do `gtag('config', ...)`, emitir `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })` no snippet inline
  - Usar `useConsent()` para emitir `gtag('consent', 'update', { analytics_storage: 'granted' })` (ou `denied`) sempre que o estado mudar
  - `usePageviewTracker` continua disparando page_view; Consent Mode bloqueia o transporte sem consentimento
- [x] 6.2 Atualizar `src/components/analytics/MetaPixel.tsx`:
  - Não renderizar `<Script>` nem `<noscript>` enquanto `hasConsent('marketing') !== true`
  - Quando o consentimento for concedido, o script carrega e o PageView inicial dispara via o init do snippet
  - Quando for revogado após carregamento, parar de chamar `fbq('track', 'PageView')` nas próximas mudanças de rota
- [x] 6.3 Layout `src/app/(frontend)/layout.tsx`: adicionar `<ConsentBanner />` envolto em `<Suspense fallback={null}>` no `<body>`, depois dos componentes de analytics

## 7. Copy & docs

- [x] 7.1 Atualizar `src/app/(frontend)/privacidade/page.tsx` mencionando o banner de consentimento e como revogar (seção dedicada acima da seção de direitos)
- [x] 7.2 Atualizar `CLAUDE.md` mencionando o gate de consentimento (seção sobre analytics envs)

## 8. E2E tests

- [x] 8.1 Criar `tests/e2e/cookie-consent.spec.ts` com casos:
  - Banner aparece em primeira visita à home (sem `localStorage`)
  - Banner não aparece quando `localStorage.ir:consent:v1` foi populado com decisão recente
  - Banner não aparece em `/admin/login`
  - Clique em "Aceitar todos" grava `analytics=true` e `marketing=true` em `localStorage` e fecha o banner
  - Clique em "Rejeitar todos" grava `analytics=false` e `marketing=false` e fecha o banner
  - Clique em "Personalizar" mostra 3 toggles; salvar com só `Analíticos` marca `analytics=true, marketing=false`
  - Botões `Aceitar todos` e `Rejeitar todos` têm a mesma altura computada e o mesmo `font-size`
  - Decisão persiste após navegar para `/blog` (banner não reaparece)
  - Decisão persiste após `page.reload()`
  - Botão "Gerenciar preferências de cookies" em `/privacidade` reabre o banner e limpa a entrada de `localStorage`
- [x] 8.2 Atualizar `tests/e2e/analytics.spec.ts`:
  - Os testes que verificam carregamento de Pixel/GA passam a pré-popular `localStorage` antes do `goto` (helper `seedConsent(page, { analytics, marketing })`)
  - Adicionar cenários "sem decisão" e "rejeitado": confirmar que nenhum hit sai para `facebook.com/tr` ou `google-analytics.com/g/collect` (com Consent Mode, GA pode ainda emitir hits sem cookies; o teste deve esperar zero `g/collect` com cookies/cid completos)
  - Cenário: após `seedConsent({ analytics: true })`, verificar entrada `['consent', 'update', { analytics_storage: 'granted' }]` no `dataLayer`

## 9. Validation

- [x] 9.1 `npm run lint`
- [x] 9.2 `npx tsc --noEmit`
- [x] 9.3 `npm run test:e2e -- tests/e2e/cookie-consent.spec.ts`
- [x] 9.4 `npm run test:e2e -- tests/e2e/analytics.spec.ts`
- [x] 9.5 Verificado via Playwright MCP: home com `localStorage` limpo mostra banner; sem consent o `fbevents.js` não é requisitado e o GA envia somente pings em Consent Mode `gcs=G100` (sem cookies)

## 10. Pre-deploy

- [x] 10.1 Review de copy do banner com a liderança da igreja (texto curto, sem termos em inglês, tom institucional)
- [x] 10.2 Comunicar à liderança a queda esperada de volume no GA/Meta após o deploy

## 11. OpenSpec validation

- [x] 11.1 `openspec validate --strict add-cookie-consent`
