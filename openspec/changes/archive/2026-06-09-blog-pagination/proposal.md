## Why

A página `/blog` usa `limit: 50` no Payload, deixando de exibir mais de 90 posts já publicados (141 devocionais no total). Usuários que acessam o blog não conseguem ver a maioria do conteúdo.

## What Changes

- Remover o limite fixo de 50 posts na listagem do blog
- Adicionar paginação baseada em páginas (`?page=N`) à listagem de posts
- Exibir controles de navegação entre páginas (anterior / próxima / números)
- Manter compatibilidade com os filtros existentes de categoria e série

## Capabilities

### New Capabilities
- `blog-pagination`: Paginação da listagem de posts do blog com suporte a filtros simultâneos

### Modified Capabilities
- `blog-flow`: Listagem de posts passa a exibir subconjunto paginado com controles de navegação

## Impact

- `src/app/(frontend)/blog/page.tsx` — adicionar parâmetro `page`, trocar `limit: 50` por `limit: 12` com `page`
- `src/components/blog/` — novo componente `Pagination.tsx`
- `openspec/specs/blog-flow/` — delta spec para requisito de paginação
- Nenhuma mudança no schema do Payload ou banco de dados
