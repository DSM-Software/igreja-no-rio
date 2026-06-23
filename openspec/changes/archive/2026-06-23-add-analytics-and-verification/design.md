## Context

O site é um Next.js 15 App Router (SSR/SSG). O `<head>` é gerenciado por `metadata` em `src/app/(frontend)/layout.tsx`. Não há scripts de terceiros hoje — o único asset externo é a fonte do Google Fonts via `next/font`. Não existe consent banner / cookie wall, e a página `/privacidade` apenas descreve políticas; ela precisará mencionar Meta e Google.

A navegação dentro do app é client-side via `next/link` — não há full page reload entre rotas. Tanto Meta Pixel (`fbq('track', 'PageView')`) quanto GA4 (`gtag('config', id, { page_path })`) só disparam PageView automático no carregamento inicial; navegações client-side precisam de disparo manual.

IDs/tokens fornecidos:
- Meta Pixel: `878835207994765`
- GA4 Measurement ID: `G-EX9WZW1607`
- Google Search Console verification token: `zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs`

## Goals / Non-Goals

**Goals:**
- Carregar Meta Pixel e GA4 em todas as rotas públicas com impacto mínimo no LCP/CLS (scripts assíncronos, `next/script` com estratégia `afterInteractive`).
- Disparar `PageView` (Meta) e `page_view`/`config` (GA) em mudanças de rota client-side do App Router.
- Verificar o domínio no Google Search Console via meta tag no `<head>`.
- Manter os scripts opt-in por ID — se a env estiver vazia, o script não é injetado (útil para dev/CI/preview).
- Manter o admin (`/admin`) livre de tracking — analytics só rodam no route group `(frontend)`.

**Non-Goals:**
- Implementar banner de consentimento / Consent Mode v2. Hoje o site não tem opt-in de cookies; tratar isso é um change separado (provavelmente exigido por LGPD em algum momento, mas fora do escopo aqui).
- Disparar eventos custom (Lead, Contact, ViewContent etc.) — apenas PageView automático nesta primeira iteração.
- Configurar enhanced measurement, conversões customizadas no GA, ou Conversions API server-side do Meta.
- Verificação do Search Console via DNS TXT — usaremos meta tag por ser mais simples (controlamos o HTML).

## Decisions

### 1. Usar `next/script` em vez de `<script>` cru

**Decisão:** Wrap dos snippets de Meta Pixel e GA em componentes que usam `next/script` com `strategy="afterInteractive"`.

**Por quê:** `next/script` deduplica injeções entre re-renders, executa fora do path crítico de hidratação e respeita ordem de execução. Snippets crus no `layout.tsx` rodam em todo render do RSC e podem causar reinit ou warnings de hidratação.

**Alternativas consideradas:**
- Snippet inline no `<head>` via `Metadata.other` ou `<head>` literal: simples, mas dispara warning de hidratação e duplica em fast refresh.
- `useEffect` carregando script via DOM: perde SSR/preload, prejudica LCP.

### 2. Componentes dedicados em `src/components/analytics/`

**Decisão:** Criar `MetaPixel.tsx` e `GoogleAnalytics.tsx` como Client Components. Cada um:
- Lê seu ID de `process.env.NEXT_PUBLIC_*` (passado via prop pelo layout server component, ou lido direto — ambos funcionam em Next).
- Retorna `null` se o ID estiver vazio.
- Injeta o snippet via `<Script>` na primeira renderização.
- Usa `usePathname()` + `useSearchParams()` em um `useEffect` para disparar PageView a cada mudança de rota.

**Por quê:** Separa responsabilidades, mantém `layout.tsx` legível, facilita teste e troca futura por uma lib como `@next/third-parties`.

**Alternativas consideradas:**
- `@next/third-parties` (`<GoogleAnalytics gaId=...>`): cobre GA mas não cobre Meta Pixel. Para manter consistência e ter controle do route-change tracking de ambos, optamos por componentes próprios. Pode ser migrado depois se Next adicionar `<MetaPixel>`.

### 3. Disparo de PageView em mudança de rota

**Decisão:** Hook compartilhado `usePageviewTracker(callback)` em `src/components/analytics/usePageviewTracker.ts` que observa `usePathname()` + `useSearchParams()` e chama o callback sempre que a URL muda. Cada componente passa seu próprio callback (`fbq('track', 'PageView')` ou `gtag('event', 'page_view', ...)`).

**Por quê:** Evita duplicar a lógica de detecção de mudança de rota. `useSearchParams()` força o componente a entrar em Suspense boundary — vamos envolvê-lo em `<Suspense>` no layout para não bloquear renderização do conteúdo.

### 4. Verificação do Search Console via `metadata.verification.google` do Next

**Decisão:** Adicionar ao objeto `metadata` em `layout.tsx`:
```ts
verification: {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs",
}
```
Isso gera automaticamente `<meta name="google-site-verification" content="...">` no `<head>`.

**Por quê:** API nativa do Next, sem hack de DOM. Fica próximo das outras meta tags SEO.

### 5. Variáveis de ambiente com fallback hardcoded

**Decisão:** Os três valores ficam hardcoded como default no código (`?? "878835207994765"` etc.), mas podem ser sobrescritos via env. Em produção setamos os valores corretos via env; em dev, se quiser desabilitar, basta setar env vazia (`NEXT_PUBLIC_META_PIXEL_ID=""`).

**Por quê:** O usuário pediu para "adicionar no site" — então o valor padrão deve funcionar sem configurar nada. Mas precisamos do escape hatch para que testes E2E em CI não enviem hits reais.

**Alternativas consideradas:**
- Sem fallback (só env): mais limpo, mas força setar três envs antes de o site funcionar — fricção desnecessária.
- Sem env (puro hardcoded): impossível desabilitar em dev/CI.

**Trade-off:** O ID do Pixel e do GA são públicos por natureza (vão pro browser), então hardcode não é vazamento de secret.

### 6. Carregar analytics apenas no route group `(frontend)`

**Decisão:** Os componentes ficam em `src/app/(frontend)/layout.tsx`. O admin Payload (`src/app/(payload)/`) tem layout próprio e não receberá analytics.

**Por quê:** Não faz sentido medir engajamento no admin — são editores logados, não visitantes. Também evita expor IDs de tracking em telas autenticadas.

## Risks / Trade-offs

- **Risco:** Sem consent banner, o site pode estar fora de conformidade com LGPD para visitantes brasileiros. → **Mitigação:** Atualizar `/privacidade` mencionando uso de Meta Pixel e GA, listando finalidades. Tratar consent banner em change separado quando necessário.
- **Risco:** Scripts terceiros impactam LCP/CLS. → **Mitigação:** `strategy="afterInteractive"` adia execução pós-hidratação; testes Lighthouse podem rodar localmente antes de merge.
- **Risco:** Disparo duplicado de PageView (o script inicial já dispara um, e o useEffect dispara de novo no mount). → **Mitigação:** O snippet do Meta Pixel chama `fbq('track', 'PageView')` no init; vamos remover essa chamada do snippet e deixar todo PageView fluir pelo hook do route tracker, garantindo um único disparo por navegação. Para GA, `gtag('config', id)` no init dispara um page_view; o hook só disparará para navegações subsequentes (skipa primeira render).
- **Risco:** `useSearchParams()` quebra renderização estática (force-dynamic). → **Mitigação:** Encapsular o componente Analytics em `<Suspense>` no layout — Next gera fallback estático e hidrata client-side.
- **Risco:** Bloqueadores de anúncios (uBlock, Brave) bloqueiam os scripts. → **Mitigação:** Aceitável; nenhuma funcionalidade do site depende deles.
- **Trade-off:** Hardcode dos IDs no repo. → Os IDs são publicamente expostos no HTML do site mesmo, então não há perda de segurança. A facilidade de uso vence.

## Migration Plan

1. Deploy em ambiente de preview (ou staging) com envs setadas → confirmar PageView aparece no GA Realtime e no Events Manager do Meta.
2. Promover para produção.
3. Verificar no Search Console que a meta tag está reconhecida (botão "Verificar" na console).
4. Rollback: setar `NEXT_PUBLIC_META_PIXEL_ID=""` e `NEXT_PUBLIC_GA_MEASUREMENT_ID=""` nas envs de produção e redeploy — scripts param de carregar sem código mudar.

## Open Questions

- A página `/privacidade` precisa de revisão de copy pelo autor antes do deploy — incluído em `tasks.md`. Se a igreja preferir contratar um banner de consentimento (e.g. Cookiebot, Iubenda) antes de ativar tracking, esse change deve ser pausado até o banner existir.
