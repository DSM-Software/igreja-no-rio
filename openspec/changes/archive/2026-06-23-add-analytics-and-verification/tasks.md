## 1. Environment & configuration

- [x] 1.1 Adicionar `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` e `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` ao `.env.example` com os valores fornecidos (`878835207994765`, `G-EX9WZW1607`, `zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs`)
- [ ] 1.2 Setar as três variáveis no ambiente de produção (registrar no runbook de deploy se necessário)
- [x] 1.3 Documentar as variáveis no `CLAUDE.md` (seção "Local environment setup")

## 2. Shared analytics module

- [x] 2.1 Criar `src/components/analytics/usePageviewTracker.ts` — hook que combina `usePathname()` + `useSearchParams()` e dispara um callback a cada mudança de URL (pulando a primeira renderização para evitar duplicação com o PageView do init)
- [x] 2.2 Garantir que o hook é seguro durante SSR (sem acesso a `window` no body do hook)

## 3. Meta Pixel component

- [x] 3.1 Criar `src/components/analytics/MetaPixel.tsx` como Client Component
- [x] 3.2 Ler `NEXT_PUBLIC_META_PIXEL_ID` (com fallback `878835207994765`); se vazio, retornar `null`
- [x] 3.3 Renderizar `<Script id="meta-pixel" strategy="afterInteractive">` com o snippet do Meta Pixel (init + PageView inicial)
- [x] 3.4 Renderizar fallback `<noscript><img .../></noscript>` com a pixel image
- [x] 3.5 Usar `usePageviewTracker` para disparar `fbq('track', 'PageView')` em mudanças de rota client-side

## 4. Google Analytics component

- [x] 4.1 Criar `src/components/analytics/GoogleAnalytics.tsx` como Client Component
- [x] 4.2 Ler `NEXT_PUBLIC_GA_MEASUREMENT_ID` (com fallback `G-EX9WZW1607`); se vazio, retornar `null`
- [x] 4.3 Renderizar `<Script src="https://www.googletagmanager.com/gtag/js?id=<id>" strategy="afterInteractive" async />` e um segundo `<Script id="ga-init" strategy="afterInteractive">` com `dataLayer`/`gtag`/`config`
- [x] 4.4 Usar `usePageviewTracker` para disparar `gtag('event', 'page_view', { page_path })` em mudanças de rota

## 5. Layout integration (frontend route group)

- [x] 5.1 Adicionar `verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs" }` ao objeto `metadata` em `src/app/(frontend)/layout.tsx`
- [x] 5.2 Renderizar `<MetaPixel />` e `<GoogleAnalytics />` envoltos em `<Suspense>` no `<body>` do `layout.tsx` (devido a `useSearchParams`)
- [x] 5.3 Confirmar que `src/app/(payload)/layout.tsx` (admin) NÃO importa nem renderiza esses componentes

## 6. Privacidade copy

- [x] 6.1 Atualizar `src/app/(frontend)/privacidade/page.tsx` mencionando uso de Google Analytics 4 e Meta Pixel, com finalidades (medir audiência, otimizar conteúdo, otimizar campanhas pagas)

## 7. E2E tests

- [x] 7.1 Criar `tests/e2e/analytics.spec.ts` com casos:
  - HTML da home contém `<script>` com `src` apontando para `googletagmanager.com/gtag/js`
  - HTML da home contém `<script>` com snippet do Meta Pixel referenciando ID `878835207994765`
  - HTML da home contém `<noscript>` com pixel image do Meta
  - HTML da home contém `<meta name="google-site-verification" content="zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs">`
  - Navegação client-side de `/` para `/blog` dispara uma requisição para `facebook.com/tr` E uma para `google-analytics.com/g/collect` (interceptar via `page.route` ou `page.waitForRequest`)
  - Em `/admin/login`, nenhuma das tags acima está presente
- [x] 7.2 Estender `tests/e2e/public-routes.spec.ts` (ou criar `tests/e2e/seo-meta.spec.ts` se ainda não existir) com cenário verificando a meta tag `google-site-verification` em pelo menos uma página interna além da home

## 8. Validation

- [x] 8.1 `npm run lint`
- [x] 8.2 `npx tsc --noEmit`
- [x] 8.3 `npm run test:e2e -- tests/e2e/analytics.spec.ts` — 9/9 passaram
- [x] 8.4 `npm run test:e2e -- tests/e2e/public-routes.spec.ts` — 51/56; as 5 falhas (`/cultos`, `/quem-somos`) são pré-existentes (reproduzidas em `git stash` antes das mudanças) e não relacionadas a este change
- [x] 8.5 Verificado via Playwright MCP: `fbevents.js` e `gtag/js` carregam na home; um único hit `facebook.com/tr?id=878835207994765&ev=PageView` por rota; GA `g/collect` com `en=page_view` na home E em `/blog` após navegação client-side
- [ ] 8.6 Após deploy em staging/preview, clicar em "Verificar" no Google Search Console e confirmar verificação aceita; abrir Meta Events Manager e GA Realtime para confirmar recebimento

## 9. OpenSpec validation

- [x] 9.1 `openspec validate --strict add-analytics-and-verification`
