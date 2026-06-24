## 1. Correção de empilhamento

- [x] 1.1 Elevar o `z-index` do backdrop/painel do `SearchOverlay` de `z-[60]` para `z-[100]` em `src/components/search/SearchOverlay.tsx`
- [x] 1.2 Rebaixar `.downloads-category-nav` de `z-index: 90` para `z-index: 40` (acima do conteúdo de fluxo, abaixo do header `z-50`/overlay) em `src/app/(frontend)/globals.css`

## 2. Verificação visual

- [x] 2.1 Rodar Playwright na rota `/downloads` em desktop e mobile, abrir a busca e capturar screenshot confirmando que a nav de categorias não aparece sobre o backdrop
- [x] 2.2 Confirmar que a nav de categorias continua `sticky` e funcional ao rolar a página com o overlay fechado

## 3. Cobertura E2E

- [x] 3.1 Adicionar cenário E2E que abre o overlay de busca em `/downloads` e verifica que a nav de categorias não está visível sobre o backdrop (posicionar no spec de busca existente em `tests/e2e/`)
- [x] 3.2 Rodar a suíte de busca + o novo cenário e garantir verde

## 4. Validação final

- [x] 4.1 Rodar `npm run lint` e `npx tsc --noEmit`
- [x] 4.2 Rodar `npm run test:e2e -- tests/e2e/public-routes.spec.ts` e o spec de busca
