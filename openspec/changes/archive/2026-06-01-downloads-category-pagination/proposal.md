## Why

A página de downloads exibe todos os itens de cada categoria de uma só vez, sem limite. Com o crescimento do conteúdo (pregações, estudos, etc.), algumas categorias podem ter dezenas de itens, tornando a página excessivamente longa e difícil de navegar — prejudicando a experiência de quem quer encontrar um material específico rapidamente.

## What Changes

- Adicionar uma barra de navegação horizontal fixada (sticky) com âncoras para cada categoria, permitindo que o usuário pule diretamente para a seção desejada.
- Limitar a exibição inicial de cada categoria a **6 itens**, com botão "Ver mais" para expandir o restante de forma inline (client-side, sem recarregar a página).
- A página permanece renderizada no servidor (SSR); apenas o comportamento de expansão requer JavaScript no cliente.

## Capabilities

### New Capabilities
- `downloads-category-browsing`: Navegação rápida entre categorias via barra sticky de âncoras + expansão progressiva de itens por categoria com "Ver mais".

### Modified Capabilities
- `downloads-page`: O requisito de exibição da lista passa a ser limitado a 6 itens iniciais por categoria (com opção de expandir), e a página passa a incluir a barra de navegação de categorias.

## Impact

- `src/app/(frontend)/downloads/page.tsx` — adicionar âncoras às seções e renderizar o componente de navegação.
- `src/components/ui/DownloadCard.tsx` — sem alterações.
- Novo componente client: `src/components/ui/DownloadCategoryNav.tsx` — barra sticky de âncoras.
- Novo componente client: `src/components/ui/DownloadCategorySection.tsx` — seção com lógica de "Ver mais".
- CSS global — estilos para a barra de navegação sticky e o estado colapsado/expandido.
