## Context

A Igreja no Rio publica conteúdo cumulativo (devocionais, estudos, séries, agenda recorrente e eventos pontuais) e visitantes chegam por referências externas ("o post tal", "aquele evento de batismo"). Hoje a única forma de localizar é navegar manualmente: `/blog` com filtros por categoria/série paginados de 12 em 12, e `/agenda` separada em recorrentes vs. próximas. Não há campo de busca em lugar algum.

Stack relevante:
- Next.js App Router (RSC) com Payload CMS 3 in-process (`getPayload()` direto, sem HTTP).
- Postgres como backend Payload, com migrações declaradas em `src/migrations/*` via `@payloadcms/db-postgres`.
- Tailwind + Iconify; sem libs de componentes UI extras.
- Header é client component (`Header.tsx`), já tem padrão de overlay (menu mobile com `body.style.overflow`).
- Coleções relevantes: `Posts` (campos: `title`, `excerpt`, `body` Lexical, `category`, `serie`, `author`, `tags[]`, `slug`, `published`, `date`, `coverColor`/`coverImage`) e `Events` (campos: `title`, `date`, `time`, `location`, `recurring`, `desc`, `registrationUrl`, `highlight`).
- Body do post é Lexical (JSON estruturado), não texto puro — relevante para indexação.
- Acesso de leitura para usuários não autenticados já limita a `published: true` (Posts) e mostra todos os eventos (Events não tem `published`).

Constraints:
- Mantemos single-deploy (Next + Payload no mesmo processo). Nada de Algolia/Meilisearch/Elastic neste change — custo e operação adicional não se justificam no volume atual (dezenas a baixas centenas de posts/eventos).
- LGPD/Consent: nada de novo tracker; respeitar `[[cookie-consent]]` existente.
- A11y: a busca precisa ser totalmente operável por teclado e leitor de tela.
- Performance: latência alvo <250ms p95 para `/api/search?q=...` com dataset atual; consulta deve continuar viável até ~5k posts.

Stakeholders: Diego (dev/proprietário), visitantes do site, equipe editorial (admins/autores) que precisa achar conteúdo próprio publicado.

## Goals / Non-Goals

**Goals:**
- Busca global descoberta sem fricção, a partir do header em qualquer rota pública.
- Resultados rápidos (debounce + cancelamento de requisições obsoletas), agrupados por tipo (Posts, Eventos), com snippet do trecho que casa.
- Página dedicada `/busca?q=...` para resultados paginados, compartilhável via URL.
- Acessibilidade: foco automático no input ao abrir overlay, navegação por setas/Enter, `Esc` fecha, ARIA `combobox`/`listbox` correto.
- Suporte a acentuação ("oração" casa "oracao") e case-insensitive.
- Cobertura E2E.

**Non-Goals:**
- Busca em Downloads (fora deste change; estrutura permite adicionar depois sem mudança de contrato).
- Busca facetada complexa (filtros combinados, ordenação por relevância ML, sinônimos, stemming PT-BR avançado).
- Autocomplete por histórico/sugestões pré-digitadas.
- Indexação em serviço externo (Algolia/Meilisearch); avaliamos só se o volume crescer e a busca SQL degradar.
- Busca em conteúdo de páginas estáticas (`/quem-somos`, `/cultos`, `/contato`) — esses textos são institucionais e raramente alvo de busca.
- Tracking de queries / analytics de busca neste change (pode virar follow-up).

## Decisions

### Decisão 1: Busca executa no Postgres com `pg_trgm`, sem serviço externo

Usaremos a extensão `pg_trgm` do Postgres com índice GIN para busca por similaridade (`ILIKE` + `%` operator) sobre colunas textuais relevantes. Acentos serão normalizados via `unaccent` (também extensão Postgres).

**Por quê**: dataset pequeno (dezenas–baixas centenas), single-deploy, zero custo operacional adicional, comportamento previsível. Trigram cobre matches parciais ("orac" → "oração") sem precisar de stemming/dicionário PT-BR. `unaccent` resolve acentuação para um conjunto de texto institucional/devocional simples.

**Alternativas consideradas**:
- `tsvector` + `to_tsquery('portuguese', ...)`: melhor para grandes volumes e stemming, mas mais frágil para matches parciais ("orac" não casa "oração" sem `:*` no termo, e UX de "digite e vá vendo" fica menos natural). Reavaliamos se o volume crescer.
- Algolia / Meilisearch: overkill — custo, operação, e sincronização.
- LIKE sem índice trigram: degrada com volume; queremos não voltar aqui em 6 meses.

### Decisão 2: Corpo do post indexado como texto puro derivado do Lexical

Adicionamos uma coluna virtual `posts.search_body` (`text`) populada por um hook `beforeChange` do Payload que extrai texto plano do JSON Lexical. Indexamos `title`, `excerpt`, `serie`, `category`, `author`, `tags` (agregadas em string) e `search_body` num único índice GIN.

**Por quê**: Lexical guarda JSON estruturado — não dá pra rodar trigram direto no JSONB sem perder qualidade. Materializar texto plano evita parse a cada query e mantém o índice eficiente. O hook roda no save (custo de write desprezível) e o backfill cobre conteúdo antigo via migração.

**Alternativas consideradas**:
- Parsear Lexical em runtime na query: lento e impossível de indexar.
- `jsonb_path_query_array` + trigram: complexo, com qualidade pior que materialização.

### Decisão 3: Endpoint `GET /api/search` Payload-routed, single round-trip

O endpoint roda em uma rota Next App Router em `src/app/(payload)/api/search/route.ts` (mesmo grupo do admin/API, mas pública) e executa duas queries paralelas (Posts publicados + Events) compondo um JSON `{ posts: [...], events: [...], total }`. Trecho destacado (`snippet`) é gerado em PT-BR servidor-side via `ts_headline` (compatível com `unaccent` aplicado na fonte) OU substring manual em torno do match — escolha em implementação, com fallback substring.

**Por quê**: single round-trip evita waterfall no overlay; rota Next dá controle de cache/headers; mantém in-process Payload (`getPayload()`).

**Limites do contrato**:
- Query mínima: 2 caracteres não-espaço. Abaixo disso, 200 com `{ posts: [], events: [], total: 0 }` — protege DB e evita resultados ruidosos.
- Top-N por tipo no overlay (5 posts + 5 eventos). Página `/busca` recebe `?limit=20&offset=0`.
- Cache HTTP `Cache-Control: public, max-age=60, stale-while-revalidate=300` (queries são públicas e a UX tolera 1 min de defasagem).

**Alternativas consideradas**:
- Endpoint custom no Payload (`endpoints` da config): funciona, mas rotas Next App Router seguem o padrão de `/sitemap.xml` no projeto.
- GraphQL Payload: overkill para dois `find` triviais.

### Decisão 4: UX — overlay no header (`Cmd+K`/`/`) + página dedicada `/busca`

- **Trigger no header**: ícone de lupa entre o último link do menu e o botão "Fale conosco" no desktop; no mobile, ao lado do botão de menu sanduíche (não dentro dele — descoberta importa). Trigger tem `aria-label="Buscar"`, abre overlay com `aria-modal="true"`, `role="dialog"`.
- **Atalho**: `/` foca o trigger e abre overlay (padrão GitHub/Algolia); `Esc` fecha; trap de foco enquanto aberto.
- **Input**: aparece em destaque no topo do overlay, com placeholder "Buscar posts e eventos…", debounce de 250ms, indicador de carregamento sutil (spinner inline).
- **Resultados**: agrupados por título de seção ("Posts" / "Eventos"), cada hit com título em negrito, contexto (categoria/série | data/local) e snippet de 1–2 linhas. Setas ↑/↓ navegam, Enter abre.
- **Rodapé do overlay**: link "Ver todos os resultados de '...'" leva a `/busca?q=...` e fecha overlay.
- **Página `/busca?q=...`**: lista paginada com mesmos hits e prévias, ordenada por relevância (similaridade trigram) com tie-break por data desc para posts e data asc (futuros primeiro) para eventos. `noindex` via `<meta robots>` para não poluir Google.
- **Estados**: vazio (q < 2 chars) → call-to-action "Digite ao menos 2 letras"; sem resultados → "Nada encontrado. Veja [todos os posts](/blog) ou [a agenda](/agenda)"; erro → mensagem amigável e botão "Tentar novamente".

**Por quê**: Overlay reduz a fricção do "abandonar a página atual"; URL compartilhável vive na `/busca`. Padrão amplamente reconhecível.

**Alternativas consideradas**:
- Só barra inline em cada página: descoberta ruim e duplica componentes.
- Só página dedicada sem overlay: 2 cliques a mais para cada busca, UX inferior.

### Decisão 5: Acessibilidade segue padrão ARIA `combobox`

Input é um `combobox` (`aria-expanded`, `aria-controls`, `aria-activedescendant`) listando opções com `role="option"` dentro de um `listbox`. Resultados ganham IDs estáveis (`search-hit-{type}-{id}`) e cada movimento das setas atualiza `aria-activedescendant`. Anúncios via `aria-live="polite"` quando o estado muda (carregando → N resultados / nada encontrado).

**Por quê**: padrão WAI-ARIA APG; já validado por leitores de tela; não exige dependência extra.

### Decisão 6: Migração com `pg_trgm`, `unaccent`, coluna `search_body` e índices GIN

Uma única migração:
1. `CREATE EXTENSION IF NOT EXISTS pg_trgm;`
2. `CREATE EXTENSION IF NOT EXISTS unaccent;`
3. `ALTER TABLE posts ADD COLUMN search_body text;`
4. Backfill `search_body` para posts existentes (script lê Lexical e popula via SQL multi-stage; ver tasks.md).
5. Função imutável `f_unaccent(text)` envelopando `unaccent(...)` para uso em índices.
6. Índices GIN com `gin_trgm_ops` em expressões: `f_unaccent(lower(posts.title || ' ' || coalesce(posts.excerpt,'') || ' ' || coalesce(posts.search_body,'') || ' ' || coalesce(posts.serie,'') || ' ' || coalesce(posts.author,'')))` e equivalente para events (`title`, `desc`, `location`, `recurring`).
7. Down migration remove índices, função, coluna e (opcional) extensões — mantemos extensões para evitar pegadinha em outros usos.

Hook Payload `beforeChange` em `Posts` recalcula `search_body` na criação/edição (parser Lexical → texto plano em `src/lib/lexical-to-text.ts`).

**Por quê**: a expressão indexada centraliza os campos pesquisáveis e mantém uma única query simples (`WHERE expr ILIKE %q%`). `unaccent` imutável permite usá-lo em índice expression. Backfill em migração garante busca utilizável no dia 1.

**Trade-off**: a expressão precisa ser reproduzida exatamente igual na query — encapsulamos em uma constante TypeScript compartilhada (`SEARCH_EXPR_POSTS`, `SEARCH_EXPR_EVENTS`) e em comentário SQL na migração.

## Risks / Trade-offs

- **[Risco] Lexical → texto perde formatação que poderia dar contexto ao snippet.** → Aceitável: snippet exibe trecho em texto puro com `…` antes/depois; foco é "achou o post". Mitigação extra: snippet também tenta `excerpt` quando o match não é no body.
- **[Risco] Volume cresce e trigram fica lento (>500ms).** → Mitigação: indicadores em logs (latência por request); plano B é migrar para `tsvector` + `to_tsquery('portuguese', ... :*)`. Contrato do endpoint não muda.
- **[Risco] Backfill da `search_body` em produção é demorado.** → Posts atuais são poucas dezenas; rodaríamos no janela de deploy padrão. Se passar de 10s, fazer em lote (`UPDATE ... WHERE id IN (...)`).
- **[Risco] Atalho `/` conflita com inputs em páginas internas.** → Ignorar quando `document.activeElement` é `input/textarea/contenteditable`.
- **[Risco] SEO da página `/busca`.** → `noindex, follow`; não incluir no sitemap. Cuidado para `robots.txt` não listar a URL com `Disallow` (queremos crawl seguir links, só não indexar). Validar em E2E.
- **[Risco] Acesso aos posts não publicados/rascunhos via API search.** → A query restringe `published = true` para Posts antes de qualquer filtro; cobertura em teste E2E com seed de post draft.
- **[Risco] Acentos em maiúsculas/minúsculas + emoji.** → Normalização `lower(unaccent(...))` na fonte E na query; emojis ignorados (não interferem em similarity).
- **[Trade-off] `Cache-Control: 60s` significa que um post recém-publicado leva até 1 min para aparecer em cache CDN.** → Aceitável; publicar conteúdo institucional não é tempo-real.

## Migration Plan

1. Adicionar `src/lib/lexical-to-text.ts` (puro, com testes unitários leves se houver framework — caso contrário, validado por E2E indireto).
2. Adicionar hook `beforeChange` em `Posts` que popula `search_body`.
3. Criar migração `srcmigrations/<timestamp>_search_indexes.ts` (extensões, coluna, função, índices, backfill).
4. Adicionar constantes `SEARCH_EXPR_POSTS`/`SEARCH_EXPR_EVENTS` em `src/lib/search.ts` com função `runSearch(query, opts)` que executa SQL via Payload DB (`payload.db.drizzle` / raw SQL).
5. Adicionar rota `src/app/(payload)/api/search/route.ts` (GET) e página `src/app/(frontend)/busca/page.tsx`.
6. Adicionar componentes `SearchTrigger`, `SearchOverlay`, `SearchResultGroup`, `SearchHit` em `src/components/search/`.
7. Plugar `SearchTrigger` no `Header.tsx` (desktop + mobile).
8. Adicionar `tests/e2e/site-search.spec.ts` cobrindo: trigger visível, atalho `/`, debounce, agrupamento, navegação por teclado, snippet, estado vazio, estado sem resultados, página `/busca` com `q`, ordenação, `noindex`.
9. Regenerar tipos (`npm run generate:types`), rodar `npm run lint`, `npx tsc --noEmit`, build, suíte E2E.
10. Deploy: rodar `npm run migrate` antes do tráfego. Sem feature flag (a busca é aditiva, baixa superfície de risco).

**Rollback**: reverter o deploy + rodar `down` da migração. A coluna `search_body` cai junto. Header volta sem o ícone de lupa.

## Open Questions

- Vale destacar trecho no snippet com `<mark>` ou só negrito? Decisão durante implementação após testar visualmente em PT-BR — guideline em `frontend-design`.
- Snippet com `ts_headline` (que exige `tsvector`) ou substring manual? Implementação começa por substring (mais simples e suficiente para PT-BR com Trigram); revisitar se feedback editorial pedir realce melhor.
- Devemos adicionar evento de telemetria `search:query` (anônimo) atrás do consent? Fora deste change — abrir um follow-up.
