## Why

O site recém-adicionado Meta Pixel e Google Analytics 4 carregam imediatamente em toda visita pública, sem consentimento prévio do visitante. A LGPD (Lei 13.709/2018) e a Orientação da ANPD sobre cookies (out/2023) tratam cookies de marketing e analytics como tratamento que requer **consentimento livre, informado, específico e por ação afirmativa** (Art. 7º, I + Art. 8º). Hoje:

- O Pixel/GA disparam antes mesmo de o visitante chegar à `/privacidade` — ou seja, há tratamento sem consentimento prévio.
- Não há canal para o titular **rejeitar** ou **revogar** o tratamento (Art. 8º, §5º).
- A página `/privacidade` informa o uso, mas informar não é o mesmo que pedir consentimento.

A escolha "mais completa e LGPD-compliant" é implementar um **banner de consentimento granular com default-deny**, em vez do caminho mais fraco de "apenas informar". A justificativa: como rodamos Meta Pixel (marketing) — não apenas analytics próprio — a opção de "apenas avisar" não cobre o uso real, e a alegação de "não guardamos nada" seria falsa (o Meta/Google sim guardam).

## What Changes

- Introduzir um **banner de consentimento** fixo (bottom-fixed) que aparece na primeira visita e enquanto não houver decisão registrada. O banner SHALL apresentar três ações com igual proeminência visual (sem dark pattern): **Aceitar todos**, **Rejeitar todos**, **Personalizar**.
- **BREAKING (analytics)**: Meta Pixel e GA4 **não** SHALL ser injetados/disparados até que o usuário tenha consentido explicitamente para a categoria correspondente (`marketing` para Pixel, `analytics` para GA). Default = deny.
- Granularidade em 3 categorias:
  - `essential` — sempre ativa, sem consentimento (Search Console verification meta, fontes, manifest etc.). Não envolve cookies de rastreamento.
  - `analytics` — Google Analytics 4. Opt-in.
  - `marketing` — Meta Pixel. Opt-in.
- **Persistência**: A decisão é gravada em `localStorage` (chave dedicada, com `version`, `decidedAt`, `categories: { analytics, marketing }`) válida por 12 meses. Após expiração, o banner reaparece.
- **Revogação**: A página `/privacidade` ganha uma seção "Gerenciar preferências de cookies" com um botão que reabre o painel de preferências (limpa decisão + relança o banner em modo "personalizar").
- **Google Consent Mode v2**: o snippet do GA SHALL inicializar com `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })` antes do `config`. Ao consentir, o site emite `gtag('consent', 'update', { ... })`. Isso garante que mesmo se o script já estiver carregado, o GA respeita o estado de consentimento.
- **Meta Pixel**: o script `fbevents.js` só SHALL ser carregado depois que o usuário consentir explicitamente a categoria `marketing`. Como o Meta não tem um equivalente robusto a Consent Mode, o gate é binário: sem consentimento, o `<script>` não é injetado e nenhum `fbq()` é chamado. O fallback `<noscript>` (pixel image) também SHALL ser omitido até o consentimento.
- **Telemetria do consentimento**: registrar em `localStorage` o `decidedAt` (ISO), a versão da política e quais categorias foram aceitas, para comprovação em caso de auditoria — sem enviar nada para terceiros (o registro é local; o titular pode revogar/visualizar a qualquer momento).
- **Texto do banner** em português brasileiro, breve, mencionando as ferramentas usadas e linkando para `/privacidade`. Sem termos em inglês como "cookies" sozinho — explicitar "dados de navegação" + "Google Analytics" + "Meta Pixel".
- Cobertura E2E garantindo: (a) banner aparece em primeira visita, (b) Pixel/GA não disparam antes da decisão, (c) "Aceitar todos" libera ambos, (d) "Rejeitar todos" mantém ambos bloqueados em todas as rotas, (e) preferências persistem entre rotas e recarregamentos, (f) painel "Personalizar" permite ativar só `analytics`, (g) link de "Gerenciar preferências" em `/privacidade` reabre o painel.

## Capabilities

### New Capabilities

- `cookie-consent`: Banner de consentimento granular, persistência local da decisão, API client para consultar/atualizar o estado de consentimento, e painel de personalização e revogação.

### Modified Capabilities

- `analytics-tracking`: Meta Pixel e GA4 passam a ser **gated por consentimento**, não mais carregados incondicionalmente. As regras de roteamento (carrega apenas em `(frontend)`, não em `/admin`) permanecem.

## Impact

- **Código afetado**:
  - Novos: `src/components/consent/` (Banner, PreferencesPanel, hook `useConsent`, store em `localStorage`), `src/lib/consent.ts` (API pura para ler/escrever estado, sem React).
  - Modificados: `src/components/analytics/MetaPixel.tsx`, `src/components/analytics/GoogleAnalytics.tsx` (passam a observar consentimento e só renderizar o `<Script>` quando autorizado; GA inicializa em Consent Mode `denied` por padrão), `src/app/(frontend)/layout.tsx` (adiciona o `<ConsentBanner />` envolto em Suspense), `src/app/(frontend)/privacidade/page.tsx` (nova seção + botão para reabrir o painel).
- **Dependências**: zero novas — banner custom in-house em Tailwind + ~150 LOC. Reuso de `next/script` e React state.
- **Variáveis de ambiente**: nenhuma. (As envs `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` continuam idênticas — o gate de consentimento é ortogonal ao gate de ID.)
- **Métricas de tráfego**: queda imediata esperada — todos os usuários começam com tracking desligado e precisam consentir. Comunicar isso à liderança antes do deploy.
- **Visual**: novo banner ocupa rodapé em primeira visita; precisa de design coerente com tokens Tailwind (`bg`/`ink`/`brand-*`). Acessibilidade: foco visível, escape para fechar painel, contraste ≥ 4.5:1.
- **Testes**: novo `tests/e2e/cookie-consent.spec.ts`. Atualização dos asserts em `tests/e2e/analytics.spec.ts` que hoje esperam Pixel/GA "sempre presentes" — agora dependem do estado de consentimento (a maioria dos testes vai pré-popular `localStorage` para simular o consentimento concedido).
- **Documentação**: `CLAUDE.md` ganha menção do consent gate; `/privacidade` ganha texto explicando o fluxo de revogação.
