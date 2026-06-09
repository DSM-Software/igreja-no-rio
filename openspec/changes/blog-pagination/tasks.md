## 1. Componente de Paginação

- [x] 1.1 Criar `src/components/blog/Pagination.tsx` — Server Component que recebe `page`, `totalPages`, `category?` e `serie?`, gera hrefs preservando filtros ativos
- [x] 1.2 Estilizar o componente com Tailwind usando tokens do projeto (`brand-*`, `ink`, `muted`)
- [x] 1.3 Adicionar `aria-label="Paginação"` no nav e `aria-current="page"` na página ativa
- [x] 1.4 Desabilitar/ocultar botão "Anterior" na página 1 e "Próxima" na última página

## 2. Atualizar Página do Blog

- [x] 2.1 Adicionar `page` ao destructure de `searchParams` em `src/app/(frontend)/blog/page.tsx`
- [x] 2.2 Trocar `limit: 50` por `limit: 12, page: pageNumber` na query de posts
- [x] 2.3 Extrair `totalPages` do resultado do Payload (`postsResult.value.totalPages`)
- [x] 2.4 Passar `page`, `totalPages`, `category` e `serie` para o componente `<Pagination>`
- [x] 2.5 Garantir que `page < 2` omite `?page=N` da URL (normalização do canonical)

## 3. Atualizar Filtros

- [x] 3.1 Verificar que `BlogFilters.tsx` não inclui `page` nos hrefs dos filtros (garante reset para página 1 ao filtrar)

## 4. Testes E2E

- [x] 4.1 Adicionar cenário em `tests/e2e/` verificando que `/blog` exibe no máximo 12 `.post-card`
- [x] 4.2 Adicionar cenário verificando que o componente de paginação está visível em `/blog` (seed tem 141 posts)
- [x] 4.3 Adicionar cenário verificando que `/blog?page=2` exibe posts diferentes dos da primeira página
- [x] 4.4 Adicionar cenário verificando que navegar para próxima página em `/blog?category=Devocional` preserva o filtro na URL

## 5. Verificação Final

- [x] 5.1 Rodar `npm run lint` sem erros
- [x] 5.2 Rodar `npm run build` sem erros
- [ ] 5.3 Rodar `npm run test:e2e -- tests/e2e/public-routes.spec.ts` sem regressões
- [ ] 5.4 Navegar visualmente em `/blog` no browser e confirmar paginação funcionando
