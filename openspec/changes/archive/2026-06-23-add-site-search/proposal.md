## Why

Hoje o visitante não tem como localizar um post específico (devocional, estudo, série) ou um evento da agenda sem percorrer páginas e filtros — o catálogo de blog cresce com paginação de 12 itens e a agenda mistura recorrentes com pontuais, então procurar por palavra-chave (ex.: "batismo", "casa antes do templo", "grupo caseiro Méier") é lento e frustrante. Uma busca global resolve o "preciso achar aquele post/encontro" e melhora a descoberta de conteúdo para novos visitantes.

## What Changes

- Adicionar um novo recurso de busca global no site público, com cobertura de posts publicados (Devocional e Estudo) e eventos.
- Adicionar um botão/ícone de busca no header (desktop e mobile), próximo ao menu principal, que abre uma sobreposição (overlay) de busca acessível a partir de qualquer rota pública.
- Permitir disparar a busca pelo atalho de teclado `/` em desktop e exibir o atalho como dica visual no campo, seguindo padrões reconhecíveis (Algolia/DocSearch, GitHub).
- Buscar com debounce conforme o usuário digita; resultados retornam agrupados por tipo (Posts, Eventos) com prévia de título, contexto (categoria/série para posts; data/local para eventos) e trecho destacado quando casa no corpo/descrição.
- Adicionar uma página dedicada `/busca?q=...` para resultados completos com paginação, acessível por "Ver todos os resultados" no overlay e por compartilhamento de URL.
- Expor um endpoint `GET /api/search?q=...&type=...` para alimentar overlay e página, executando consulta case/diacrítica-insensitiva em Postgres sobre campos textuais relevantes (título, excerto, corpo, categoria, série, autor, tags em posts; título, descrição, local, recorrência em eventos).
- Garantir estados vazios, de carregamento, de erro e mensagem "nada encontrado" com sugestões de navegação (ir para `/blog` ou `/agenda`).
- Cobrir a busca com testes E2E (overlay, página, atalho `/`, estado vazio, navegação por teclado).

Sem mudanças neste escopo: downloads não entram na busca neste change (podem ser adicionados depois sem quebrar o contrato).

## Capabilities

### New Capabilities
- `site-search`: busca global pública sobre posts e eventos, com overlay no header, página dedicada `/busca` e endpoint `GET /api/search`. Define UX (gatilho no header, atalho de teclado, agrupamento de resultados, estados vazios/erro), contrato de dados (campos pesquisáveis, ordenação, paginação) e comportamento de acessibilidade (foco, ARIA, navegação por teclado).

### Modified Capabilities
<!-- Nenhum spec existente tem requisitos alterados; a busca é puramente aditiva. -->

## Impact

- **Código novo**:
  - `src/app/(frontend)/busca/page.tsx` — página dedicada de resultados com SSR.
  - `src/app/(frontend)/api/search/route.ts` (ou rota equivalente em Payload) — endpoint JSON com query parametrizada.
  - `src/components/search/SearchTrigger.tsx`, `SearchOverlay.tsx`, `SearchResults.tsx`, `useSearch.ts` (hook com debounce + abort), e um `SearchHit` por tipo.
  - Helper de query em `src/lib/search.ts` que normaliza acentos, executa consultas paralelas em Posts/Events e formata trechos destacados.
- **Código modificado**:
  - `src/components/layout/Header.tsx` — adicionar `SearchTrigger` antes do botão WhatsApp em desktop e ao lado do menu mobile.
  - `src/payload-types.ts` — regenerar após qualquer índice/coluna nova.
- **Banco / Payload**:
  - Adicionar índice GIN/trigram (`pg_trgm`) ou `tsvector` para Posts (`title`, `excerpt`, `body_text`) e Events (`title`, `desc`, `location`) via migração — definido em design.md.
- **Testes**: novo `tests/e2e/site-search.spec.ts`.
- **SEO**: `/busca` `noindex` (rota dinâmica de utilidade); incluir no `robots.txt` se necessário.
- **Analytics**: respeitar consent atual; nenhum tracker novo neste change.
- **Dependências**: nenhuma nova dependência npm prevista; usar Payload `find` com `where` por enquanto. Caso o desempenho exija, avaliamos `pg` direto em uma rota Payload custom (decisão em design.md).
