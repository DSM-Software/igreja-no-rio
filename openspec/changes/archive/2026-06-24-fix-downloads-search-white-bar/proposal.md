## Why

Ao abrir o overlay de busca na página `/downloads` (desktop e mobile), a barra de navegação de categorias permanece visível como uma faixa branca sólida sobre o backdrop escurecido/desfocado, em vez de ser coberta por ele. Isso quebra a sensação de modalidade do overlay e deixa a UI com aparência defeituosa.

A causa raiz é um conflito de empilhamento (`z-index`): a `DownloadCategoryNav` é `position: sticky` com `z-index: 90`, enquanto o backdrop do `SearchOverlay` usa `z-[60]`. Como `90 > 60`, a barra sticky pinta acima do backdrop. Embora hoje só a página de downloads tenha esse chrome elevado, qualquer elemento de página com `z-index` ≥ 60 reproduziria o problema.

## What Changes

- Garantir que o backdrop e o painel do `SearchOverlay` fiquem acima de **todo** o chrome de página, incluindo elementos `sticky`/elevados como a navegação de categorias de downloads — corrigindo a faixa branca persistente.
- Ajustar a camada de empilhamento da busca (e/ou a da `DownloadCategoryNav`) de modo que o overlay sempre domine visualmente quando aberto, sem reintroduzir o problema de containing-block já resolvido pelo portal para `document.body`.
- Adicionar cobertura E2E que abre a busca na rota `/downloads` e verifica que a navegação de categorias não permanece visível sobre o backdrop.

## Capabilities

### New Capabilities
<!-- Nenhuma capability nova. -->

### Modified Capabilities
- `site-search`: o overlay de busca passa a ter requisito explícito de que seu backdrop cobre toda a viewport e fica acima de qualquer chrome de página elevado (elementos `sticky`/posicionados), não apenas do header.

## Impact

- `src/components/search/SearchOverlay.tsx` — camada de `z-index` do backdrop/painel.
- `src/app/(frontend)/globals.css` — `z-index` da `.downloads-category-nav` (se a correção optar por rebaixar o chrome de página).
- `tests/e2e/` — novo cenário cobrindo a busca aberta sobre `/downloads`.
- Sem mudança de API, dados ou dependências.
