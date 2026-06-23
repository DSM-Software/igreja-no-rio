## Context

O site acabou de ganhar Meta Pixel e GA4 (change `add-analytics-and-verification`, arquivado em 2026-06-23). Hoje os scripts carregam em todo `(frontend)` sem consentimento. A LGPD trata Pixel/GA como tratamento que requer consentimento (ANPD/2023 — cookies de marketing e analytics). O site é institucional (igreja), público brasileiro, sem login para visitantes — não há mecanismo paralelo para coletar consentimento (cadastro etc.). A única superfície disponível é o próprio banner no site.

Stack: Next.js 15 App Router + Tailwind. Já existe `src/components/analytics/{MetaPixel,GoogleAnalytics}.tsx` com `next/script`. A `/privacidade` é estática, sem estado client-side.

## Goals / Non-Goals

**Goals:**
- Cumprir os requisitos da LGPD/ANPD para consentimento em cookies/trackers: livre, informado, específico, por ação afirmativa, granular, e revogável.
- Default-deny: scripts de tracking não rodam até consentimento explícito.
- Reject tão fácil quanto Accept (sem dark pattern, mesma proeminência visual).
- Granularidade por categoria (essencial / analytics / marketing).
- Revogação acessível pela `/privacidade` em ≤ 2 cliques.
- Zero dependências novas — manter o bundle enxuto.
- Não bloquear conteúdo principal: banner é overlay, não modal full-screen.

**Non-Goals:**
- Banner de aviso (ePrivacy-style "we use cookies, ok?") sem opção real de recusa — explicitamente descartado.
- Suporte multi-idioma — site é PT-BR apenas hoje.
- Consent log no servidor — guardar local (`localStorage`) é suficiente como prova de boa-fé; auditoria séria viria com integração paga (Cookiebot, Iubenda) — fora do escopo.
- Integração com TCF v2 / IAB — não usamos ad-tech de leilão.
- Customização de subcategorias dentro de analytics (ex.: GA mas não Microsoft Clarity) — temos só GA e Pixel.

## Decisions

### 1. Categorias: 3 buckets fixos

**Decisão:** `essential` (sempre ativa, não exposta no painel como opcional), `analytics` (GA4), `marketing` (Meta Pixel).

**Por quê:** Cobre o uso atual sem inflar a UI. Quando adicionarmos um terceiro tracker, alocamos na categoria existente correspondente.

**Alternativas:**
- Categoria única "tracking" — perde granularidade exigida pela ANPD.
- 5+ categorias (preferências, social, etc.) — over-engineering para um trabalho pastoral.

### 2. Estado armazenado em `localStorage`

**Decisão:** Chave `ir:consent:v1` com formato:
```json
{
  "version": 1,
  "decidedAt": "2026-06-23T19:00:00.000Z",
  "categories": { "analytics": true, "marketing": false }
}
```
TTL = 12 meses (calculado a partir de `decidedAt`). Após expirar, o banner reaparece.

**Por quê:** `localStorage` é universal, não envia nada ao servidor, e o titular pode inspecionar/limpar pelo DevTools. Versão (`v1`) permite migração quando mudarmos categorias.

**Alternativas:**
- Cookie em vez de localStorage: enviaria de volta ao servidor em cada request, sem ganho.
- IndexedDB: overkill.
- Servidor: introduz banco/endpoint só para consentimento; sem login não há identidade do usuário, então o registro seria por device — mesmo escopo do localStorage, mas mais complexo.

### 3. Google Consent Mode v2 + lazy script para o Pixel

**Decisão:**
- **GA4**: o `<Script>` do gtag continua a ser injetado em todas as visitas (incluindo pré-consentimento), mas o snippet de init declara consent default = denied para todas as flags relevantes. Após consentimento `analytics`, emitimos `gtag('consent', 'update', { analytics_storage: 'granted' })`.
- **Meta Pixel**: o `<Script>` só SHALL ser injetado quando `consent.marketing === true`. Sem consent mode equivalente robusto, a abordagem mais defensável é não carregar nada. O `<noscript>` (pixel image) também só renderiza após consentimento.

**Por quê:** Consent Mode é a forma oficial do Google e preserva dados básicos do funil (sessões agregadas sem cookies) — útil quando o usuário diz não. O Meta não tem isso, então gate hard. Esta assimetria reflete a realidade dos vendors.

**Alternativas:**
- Não injetar nenhum script até consentimento: perde modeling do GA. Aceitável mas inferior.
- Carregar Pixel sempre + gate em `fbq()`: insuficiente — o `fbevents.js` já contacta servidores do Meta no carregamento.

### 4. UI: banner bottom-fixed com 3 ações horizontais

**Decisão:** Bottom bar com `position: fixed; bottom: 0`. Layout:
- Texto curto à esquerda (com link para `/privacidade`).
- Três botões à direita: `Personalizar` (ghost), `Rejeitar todos` (secundário), `Aceitar todos` (primário brand).
- Em mobile (< 640px): texto em cima, botões em coluna full-width abaixo.
- "Personalizar" abre painel inline (expande o banner) com 3 toggles: `Essenciais` (disabled, sempre on), `Analíticos`, `Marketing`. Botão `Salvar preferências` confirma.

**Por quê:** Bottom-fixed é o padrão estabelecido e menos intrusivo. Três botões com igual peso visual atende à exigência da ANPD de "rejeitar tão fácil quanto aceitar".

**Trade-off:** Bottom bar cobre conteúdo na primeira fold do mobile. Mitigação: o banner tem altura controlada e `padding-bottom` é adicionado ao `<main>` enquanto o banner estiver visível para evitar que o footer fique sob ele.

### 5. SSR: banner é puro client-side, default hidden

**Decisão:** O `<ConsentBanner />` é Client Component. No SSR ele sempre renderiza `null` (ou um wrapper vazio). Após hidratação, lê `localStorage` e decide se aparece.

**Por quê:** SSR não tem acesso ao `localStorage`. Se renderizássemos o banner no servidor, ele apareceria por ~100ms até o cliente decidir esconder (mismatch + flash). Renderizando do zero no cliente, o flash é inverso (sem banner por ~100ms até aparecer) — menos disruptivo.

**Alternativas:**
- Cookie HttpOnly setado pelo cliente para o servidor saber: complexidade alta, ganho marginal.

### 6. API: hook `useConsent()` + módulo puro `consent.ts`

**Decisão:** Módulo `src/lib/consent.ts` exporta:
- `readConsent(): ConsentState | null` — SSR-safe (retorna `null` no servidor).
- `writeConsent(categories: { analytics: boolean; marketing: boolean }): void`.
- `resetConsent(): void` — limpa para reabrir banner.
- `subscribeConsent(cb: (state) => void): () => void` — observa mudanças (via `window.addEventListener('storage')` + um EventTarget custom para mudanças na mesma aba).

Hook React `useConsent()` em `src/components/consent/useConsent.ts` wraps esse módulo com `useSyncExternalStore`.

**Por quê:** Separar lógica pura (`consent.ts`) facilita testar e usar em componentes não-React (ex.: snippet do GA inline). `useSyncExternalStore` é o padrão correto para subscrever a external state no React 18+.

### 7. Reabrir painel a partir de `/privacidade`

**Decisão:** Adicionar uma seção em `/privacidade` com botão "Gerenciar preferências de cookies". Clique chama `resetConsent()` + dispara um evento que faz o Banner reabrir em modo "Personalizar" (sem fechar até decisão).

**Alternativas:**
- Rota dedicada `/privacidade/preferencias`: mais navegação, menos contexto.
- Link no footer global: redundância — quem quer mudar opinion vai à /privacidade.

### 8. Texto do banner — copy

**Decisão:** Texto enxuto, em PT-BR, sem jargão:
> "Usamos cookies e dados de navegação para entender como o site é usado (Google Analytics) e para medir o alcance de publicações (Meta Pixel). Você pode aceitar, recusar ou personalizar. [Saiba mais](/privacidade)."

Sem dark patterns: "Rejeitar todos" tem o mesmo tamanho/peso visual de "Aceitar todos".

## Risks / Trade-offs

- **Risco:** Volume de dados no GA/Meta cai bruscamente — provavelmente 30–60% dos visitantes vão rejeitar ou ignorar o banner (que conta como rejeição até decidirem). → **Mitigação:** Avisar liderança antes do deploy; o Consent Mode v2 ainda preserva conversões agregadas (modeled data) no GA.
- **Risco:** Banner aparece em rotas onde já existem hooks visuais (ex.: hero da home com CTA), competindo por atenção. → **Mitigação:** Texto curto, posição bottom, animação de entrada suave (≥300ms).
- **Risco:** Usuário muda de idéia entre rotas (consenso por aba) — `localStorage` é cross-tab. → **Mitigação:** Aceitável; o `subscribeConsent` ouve mudanças cross-tab via `storage` event, então o estado fica coerente.
- **Risco:** Snippet do GA inline lê `localStorage` antes do React hidratar — race condition. → **Mitigação:** O GA inicia em `denied`; só o `consent update` depende do React (e React, em produção, hidrata em <100ms). Pior caso = primeira PageView com `denied` enviada ao GA, e o `update` chegar depois — comportamento documentado e aceitável pelo Google.
- **Risco:** Pixel rejeitado por extensões de privacidade — não impacta este change (já era risco antes).
- **Trade-off:** Não logamos consentimentos no servidor — em uma auditoria séria isso é fraqueza. Aceitável para esta fase; podemos adicionar endpoint depois.

## Migration Plan

1. Deploy do code: scripts param de carregar incondicionalmente; passam a depender de consentimento.
2. Em produção, primeira visita de qualquer usuário verá o banner (não há decisão registrada).
3. Para usuários que **já** visitaram o site antes deste change e tiveram Pixel/GA disparados (mas não consentiram): nada a fazer — o tratamento prévio era sem consentimento, então a primeira visita pós-deploy os trata como "novo" e pede consentimento. Não há retroação possível (dados já estão com Meta/Google).
4. Verificação pós-deploy: abrir site anônimo → confirmar banner aparece, Network sem hits para Meta/GA antes de aceitar; clicar Aceitar → confirmar hits; clicar Rejeitar em sessão limpa → confirmar zero hits.
5. Rollback: o banner é puramente aditivo. Em caso de bug crítico, revert do PR restaura o estado anterior (tracking sempre on) — sem dados perdidos.

## Open Questions

- A liderança da igreja quer revisar o copy do banner antes do deploy? Texto proposto está enxuto, mas o tom precisa caber no posicionamento institucional. → Incluído como tarefa "review de copy" antes do merge.
- TTL de 12 meses é o padrão ANPD-friendly, mas alguns sites usam 6. Mantemos 12 (menos atrito), revisitamos se a liderança preferir.
