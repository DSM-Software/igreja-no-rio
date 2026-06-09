## Context

A página `/blog` usa `payload.find({ limit: 50 })` e exibe todos os resultados de uma vez. Com 141 posts publicados, mais da metade nunca aparece. A solução mais simples para um site com App Router (Next.js) e renderização server-side é paginação baseada em URL (`?page=N`).

Infinite scroll foi descartado: exigiria Client Component com estado e fetch client-side, aumentando a complexidade sem benefício claro para um blog institucional onde SEO e compartilhamento de links importam.

## Goals / Non-Goals

**Goals:**
- Exibir todos os posts em subconjuntos paginados (12 por página)
- Manter filtros de categoria e série funcionando junto com a paginação
- URLs compartilháveis e indexáveis por buscadores (`?page=2&category=Devocional`)
- Controles de navegação acessíveis (anterior, próxima, números de página)

**Non-Goals:**
- Infinite scroll ou cursor-based pagination
- Mudar o número de colunas do grid
- Cache/ISR — a página já usa `force-dynamic`

## Decisions

### 1. Page-based pagination via URL query param `?page=N`

`page` é lido como `searchParam` no Server Component existente junto com `category` e `serie`. O Payload já suporta `page` nativamente em `find()`. Zero nova infra, zero Client Components.

**Alternativa descartada — infinite scroll**: exigiria `useIntersectionObserver` + `useState` + fetch no cliente. Mais código, pior SEO, links não compartilháveis.

### 2. 12 posts por página

Múltiplo de 2 e 3, encaixa perfeito no grid `md:grid-cols-2 xl:grid-cols-3`. Páginas carregam rápido, usuários veem ≥12 itens antes de precisar paginar.

### 3. Componente `Pagination` como Server Component puro

Recebe `page`, `totalPages` e mantém os query params existentes ao gerar os hrefs. Sem estado, sem JS no cliente. Acessível com `aria-label` e `aria-current`.

### 4. Reset de página ao mudar filtro

Ao clicar num filtro de categoria/série, `page` é removido da URL (volta à página 1). Já é o comportamento natural se `BlogFilters` gera links sem `page`.

## Risks / Trade-offs

- [Usuário em `?page=5` clica num filtro e perde a página] → Aceitável: filtrar implica recomeçar a listagem.
- [URL com `?page=1` é diferente de sem `page`] → Normalizar: se `page < 2`, omitir da URL (canonical sem param).
- [Teste E2E de paginação requer seed com > 12 posts] → O seed atual já tem 141; cenário de teste simples.
