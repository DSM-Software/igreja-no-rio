## 1. Infraestrutura de busca no Postgres

- [x] 1.1 Criar `src/lib/lexical-to-text.ts` que extrai texto plano (concatena `text` de nodes, mantém quebras de parágrafo como espaço) a partir do JSON Lexical usado por Payload em `posts.body`.
- [x] 1.2 Adicionar hook `beforeChange` em `src/collections/Posts.ts` que popula o campo virtual `search_body` (texto plano) a partir de `data.body`, sem expor no admin.
- [x] 1.3 Declarar campo `search_body` (type `textarea`, `hidden: true`, `index: false`) em `Posts` para que Payload reconheça e crie a coluna; rodar `npm run generate:types` e confirmar mudança em `src/payload-types.ts`.
- [x] 1.4 Criar migração `src/migrations/<timestamp>_search_indexes.ts` que: cria extensões `pg_trgm` e `unaccent`; declara função `f_unaccent(text)` imutável; cria índice GIN `gin_trgm_ops` em expressão `lower(f_unaccent(coalesce(...)))` sobre `posts.title || excerpt || serie || author || search_body` e equivalente para `events.title || desc || location || recurring`.
- [x] 1.5 Adicionar passo de backfill na migração: itera `posts.body` (via SELECT) e `UPDATE` `search_body` em lote usando a mesma extração TypeScript que o hook (pode ser via script `tsx` chamado pela migração ou inline com `payload.find` num bootstrap separado — escolher o mais simples).
- [x] 1.6 Registrar a migração em `src/migrations/index.ts` e rodar `npm run migrate` localmente; verificar com `\d+ posts` que a coluna existe e que os índices foram criados (`\di posts*search*`, `\di events*search*`).

## 2. Lógica de busca compartilhada

- [x] 2.1 Criar `src/lib/search.ts` com constantes `SEARCH_EXPR_POSTS` e `SEARCH_EXPR_EVENTS` (SQL fragment) e o helper `runSearch({ q, type, limit, offset })` que executa as duas queries paralelas via `payload.db.drizzle`/raw SQL e retorna `{ posts, events, total }`.
- [x] 2.2 Implementar geração de snippet por substring em PT-BR (até 160 chars com `…` antes/depois quando aplicável) dentro de `src/lib/search.ts`, com fallback para `excerpt` (posts) ou primeiras linhas de `desc` (events) quando o match ocorre só no título.
- [x] 2.3 Garantir que o helper rejeita `q.trim().length < 2` retornando `{ posts: [], events: [], total: 0 }` sem tocar no banco.
- [x] 2.4 Adicionar ordenação por similaridade trigram (`similarity(...)`) como primary, com tie-break por `date desc` em posts e `recurring NULLS LAST, date asc` em eventos.
- [x] 2.5 Filtrar `posts.published = true` na query de posts (não confiar em `find` do Payload neste path).

## 3. Endpoint `GET /api/search`

- [x] 3.1 Criar rota Next App Router em `src/app/(payload)/api/search/route.ts` exportando `GET`, lendo `q`, `type` (`posts|events|all`, default `all`), `limit` (default 5, max 50) e `offset` (default 0).
- [x] 3.2 Chamar `runSearch(...)` e responder `Response.json({ posts, events, total })` com `Cache-Control: public, max-age=60, stale-while-revalidate=300`.
- [x] 3.3 Adicionar try/catch retornando `Response.json({ error: 'search_failed' }, { status: 500 })` em falhas, com log estruturado para diagnóstico.
- [x] 3.4 Validar manualmente via `curl http://localhost:3000/api/search?q=igreja | jq` que a resposta é bem-formada.

## 4. Componentes de UI da busca

- [x] 4.1 Criar `src/components/search/SearchTrigger.tsx` (client) com ícone `material-symbols:search-rounded`, suporta variantes `solid` e `transparent` recebidas via props (espelha o estado do header).
- [x] 4.2 Criar `src/components/search/SearchOverlay.tsx` (client) com `role="dialog"`, `aria-modal="true"`, foco automático no input, trap de foco básico (tab cycling), `Esc` para fechar, click-fora para fechar, e bloqueio de scroll do body.
- [x] 4.3 Criar hook `useSearch(query)` em `src/components/search/useSearch.ts` com debounce de 250ms via `setTimeout`, `AbortController` para cancelar requisição anterior, e estados `{ status, data, error }` (`idle | loading | success | error`).
- [x] 4.4 Criar `src/components/search/SearchResults.tsx` que renderiza dois `SearchResultGroup` (Posts e Eventos), cada um omitido quando vazio.
- [x] 4.5 Criar `SearchHit` para post (título, badge categoria, série opcional, snippet) e para evento (título, data formatada, local, snippet).
- [x] 4.6 Implementar navegação por teclado em `SearchOverlay`: setas ↑/↓ movem o destaque entre hits, Enter abre a URL, comportamento circular nos extremos; manter `aria-activedescendant` no input apontando para o `id` do hit destacado.
- [x] 4.7 Implementar `aria-live="polite"` para anúncios de mudança de estado (carregando, N resultados, sem resultados).
- [x] 4.8 Implementar atalho `/` global em `SearchOverlay` (listener em `window.keydown`), ignorando quando `document.activeElement` é `input|textarea|[contenteditable=true]`. Atalho fica ativo apenas em viewport ≥ 1024px.
- [x] 4.9 Estados visuais: dica "Digite ao menos 2 letras"; spinner sutil em "loading"; estado "Nada encontrado para '<termo>'" com links para `/blog` e `/agenda`; estado de erro com botão "Tentar novamente".
- [x] 4.10 Rodapé do overlay: link "Ver todos os resultados de '<termo>'" para `/busca?q=<termo>` (só quando `total > limit visível`).

## 5. Página `/busca`

- [x] 5.1 Criar `src/app/(frontend)/busca/page.tsx` (server component) lendo `searchParams.q`, `searchParams.page`, e chamando `runSearch` diretamente (não via fetch) com `limit=20`.
- [x] 5.2 Renderizar seções "Posts" e "Eventos" com mesmos cards usados na home (`PostCard`, `EventCard` quando aplicáveis) ou cards específicos de busca com snippet em destaque — decidir por consistência visual.
- [x] 5.3 Paginação simples reaproveitando padrão de `src/components/blog/Pagination.tsx`, mantendo `q` como query param.
- [x] 5.4 Estado "sem `q`": exibir campo de busca em destaque e copy "Digite o que você procura para começar".
- [x] 5.5 `generateMetadata` retornando `title: 'Buscar — Igreja no Rio'` e `robots: { index: false, follow: true }`.
- [x] 5.6 Não incluir `/busca` em `sitemap.xml`.

## 6. Integração no Header

- [x] 6.1 Adicionar `SearchTrigger` no `Header.tsx` em viewport desktop, posicionado entre o último link de navegação e o botão WhatsApp; passar prop indicando `solid` para que ele use cores corretas no estado transparente da home.
- [x] 6.2 Adicionar `SearchTrigger` no `Header.tsx` em viewport mobile, ao lado do botão de menu sanduíche (visível mesmo com o menu fechado).
- [x] 6.3 Garantir que abrir o menu mobile fecha um overlay de busca aberto e vice-versa (evita dois overlays sobrepostos).
- [x] 6.4 Validar visualmente no `npm run dev`: trigger no header em `/`, `/blog`, `/agenda` (desktop + mobile), e overlay abrindo com lupa e com `/`.

## 7. Testes E2E

- [x] 7.1 Criar `tests/e2e/site-search.spec.ts` com `seed` do banco rodado uma única vez (`test.beforeAll`) e setup de consent para evitar overlay do banner interferir.
- [x] 7.2 Teste: trigger visível no header em desktop (`/`, `/blog`, `/agenda`) e em mobile.
- [x] 7.3 Teste: atalho `/` em desktop abre overlay; `/` dentro de um `input` (campo de busca já aberto ou outro `input` da página de contato, se houver) NÃO reabre overlay.
- [x] 7.4 Teste: digitar 2+ letras dispara busca, exibe seções "Posts" e "Eventos", cada hit com título e contexto.
- [x] 7.5 Teste: navegação por setas + Enter abre a URL do hit destacado (`/blog/<slug>` para posts; `/agenda` para eventos).
- [x] 7.6 Teste: estado "Nada encontrado" para termo improvável (ex.: `zzzqxptv`) com links para `/blog` e `/agenda` presentes.
- [x] 7.7 Teste: post `published: false` no seed não aparece em resultados.
- [x] 7.8 Teste: `/busca?q=igreja` retorna 200, exibe contagem por seção, e `<meta name="robots" content="noindex, follow">` no `<head>`.
- [x] 7.9 Teste: `/busca?q=oração` e `/busca?q=oracao` retornam o mesmo conjunto de hits (acento-insensitive).
- [x] 7.10 Teste: `Esc` fecha overlay e devolve foco ao trigger.

## 8. Qualidade e deploy

- [x] 8.1 Rodar `npm run lint` e corrigir o que aparecer.
- [x] 8.2 Rodar `npx tsc --noEmit` e zerar erros de tipo.
- [x] 8.3 Rodar `npm run test:e2e -- tests/e2e/public-routes.spec.ts tests/e2e/site-search.spec.ts tests/e2e/admin-access.spec.ts` e garantir suítes verdes.
- [x] 8.4 Rodar `npm run build` localmente para garantir bundle ok.
- [x] 8.5 Atualizar `CLAUDE.md` apenas se aparecer instrução de runtime nova (ex.: variável de ambiente) — caso contrário não editar.
- [x] 8.6 Documentar no checklist de deploy (interno) a necessidade de `npm run migrate` antes do tráfego e invalidação de cache CDN para `/api/search`.
