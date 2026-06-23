## Why

Atualmente o site não envia dados para nenhuma plataforma de analytics nem está verificado no Google Search Console. Sem isso a igreja não consegue medir alcance das publicações, audiência das campanhas, conversões de campanhas pagas do Meta, nem acompanhar performance orgânica de busca. Adicionar Meta Pixel, Google Analytics 4 e a verificação do Search Console destrava esse acompanhamento sem mudanças visíveis para o visitante.

## What Changes

- Adicionar **Meta Pixel** (`id 878835207994765`) carregado em todas as páginas públicas com disparo de `PageView` no load inicial e em navegações client-side do App Router.
- Adicionar **Google Analytics 4 / gtag.js** (`G-EX9WZW1607`) carregado em todas as páginas públicas, com `gtag('config', ...)` e disparo automático de `page_view` em mudanças de rota do App Router.
- Adicionar a meta tag `<meta name="google-site-verification" content="zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs">` no `<head>` global do frontend para verificação no Google Search Console.
- Manter os IDs em variáveis de ambiente públicas (`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) com fallback para os valores fornecidos, para que ambientes de preview/dev possam desabilitar facilmente setando string vazia.
- Não carregar scripts de Pixel/GA quando os respectivos IDs estiverem ausentes (ambiente de dev/CI sem credenciais), evitando ruído nas métricas e nos testes.
- Adicionar fallback `<noscript>` com a pixel image do Meta para usuários sem JavaScript.
- Cobertura E2E garantindo: (a) presença das tags em produção, (b) ausência quando ID vazio em dev, (c) verificação do Search Console presente.

## Capabilities

### New Capabilities

- `analytics-tracking`: Carregamento dos scripts de Meta Pixel e Google Analytics 4 em todas as rotas públicas, disparo de PageView em navegações do App Router, e controle por variáveis de ambiente.

### Modified Capabilities

- `seo-meta`: Inclusão da meta tag `google-site-verification` no `<head>` global para verificação do Google Search Console.

## Impact

- **Código afetado**: `src/app/(frontend)/layout.tsx` (head/scripts globais), novos componentes em `src/components/analytics/` (MetaPixel e GoogleAnalytics com lógica de PageView em mudança de rota), `.env.example`.
- **Dependências**: nenhuma nova dep. Usa `next/script` (já disponível) e `next/navigation` (já em uso).
- **Variáveis de ambiente**: novas — `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- **Testes**: novo arquivo `tests/e2e/analytics.spec.ts` cobrindo as três tags + a verificação do Search Console (que pode ser coberta também em `tests/e2e/seo-meta.spec.ts` se já existir).
- **Privacidade / LGPD**: o site passa a enviar dados de navegação para Meta e Google. A página `/privacidade` deve mencionar o uso dessas ferramentas — incluído como tarefa do change.
- **Deploy**: as três variáveis precisam estar setadas no ambiente de produção antes do deploy. Sem elas os scripts simplesmente não carregam.
