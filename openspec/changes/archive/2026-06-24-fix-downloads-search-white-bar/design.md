## Context

O `SearchOverlay` já foi corrigido anteriormente para portar via `createPortal` para `document.body`, evitando que o `backdrop-filter` do header criasse um containing block que prendia o `position: fixed` do backdrop. O backdrop usa `fixed inset-0 z-[60]` e o header usa `z-50` — então o overlay cobre o header corretamente.

O que ficou descoberto: a página `/downloads` renderiza a `DownloadCategoryNav`, uma barra `position: sticky` com `z-index: 90` (`globals.css:449-456`). Como `90 > 60`, essa barra branca sólida pinta acima do backdrop do overlay, aparecendo como uma faixa persistente que o blur não cobre — em desktop e mobile.

As camadas de empilhamento atuais na frontend:
- Header: `z-50`
- SearchOverlay backdrop/painel: `z-[60]`
- DownloadCategoryNav (sticky): `z-index: 90`

## Goals / Non-Goals

**Goals:**
- Quando o overlay de busca está aberto, seu backdrop cobre toda a viewport e fica acima de qualquer chrome de página elevado (incluindo a nav de categorias sticky).
- Estabelecer uma ordem de empilhamento coerente e documentada para que chrome de página futuro não reintroduza o bug.
- Cobrir o cenário com teste E2E na rota `/downloads`.

**Non-Goals:**
- Não reescrever a estratégia de portal já existente (continua portando para `document.body`).
- Não alterar o comportamento funcional da busca (atalhos, foco, resultados).
- Não redesenhar a `DownloadCategoryNav` além do ajuste de camada.

## Decisions

### Decisão 1: Elevar o `z-index` do SearchOverlay acima de todo o chrome de página

Mudar o backdrop/painel do overlay de `z-[60]` para uma camada claramente acima de qualquer chrome de página — `z-[100]`.

**Por quê:** o overlay é a camada modal mais alta da aplicação; ele deve dominar visualmente por design, independentemente de qualquer página específica. Rebaixar a `DownloadCategoryNav` resolveria o caso atual, mas qualquer página futura com chrome elevado (toolbars, barras de filtro sticky) reintroduziria o bug. Centralizar a garantia no overlay é a correção robusta.

**Alternativa considerada:** rebaixar `.downloads-category-nav` de `z-index: 90` para algo `< 60` (ex.: `z-index: 40`). Funciona para o sintoma atual, mas é frágil (corrige um caso, não a classe do problema) e a nav precisa continuar acima do conteúdo da página ao rolar. Descartada como correção única.

### Decisão 2: Normalizar a `z-index` da `.downloads-category-nav` para abaixo do overlay

Em conjunto com a Decisão 1, reduzir `.downloads-category-nav` de `z-index: 90` para um valor que continue acima do conteúdo rolável da página mas abaixo do header/overlay — alinhando-a à escala usada nas utilities Tailwind (ex.: `z-index: 40`, abaixo do header `z-50`). A nav sticky fica em `top: var(--nav-h)`, logo abaixo do header, e não compete com ele.

**Por quê:** o `90` original não tinha justificativa frente à escala de camadas do header (`z-50`) e do overlay. Normalizar evita futuras colisões e documenta a hierarquia. As duas decisões juntas são defensivas: mesmo que uma página esqueça de respeitar a escala, o overlay em `z-[100]` ainda vence.

## Risks / Trade-offs

- [Elevar o overlay para `z-[100]` poderia cobrir algum elemento que deveria ficar por cima] → Não há na frontend nenhuma camada acima de `90` hoje; o overlay modal é, por definição, a camada mais alta. Risco baixo.
- [Rebaixar a nav de categorias poderia deixá-la atrás de conteúdo ao rolar] → A nav permanece `sticky` com `z-index` ainda acima do conteúdo de fluxo normal (`z-index: 0/auto`); apenas abaixo de header/overlay. Validar visualmente com Playwright na rota `/downloads`.

## Migration Plan

Mudança puramente de CSS/classes, sem migração de dados. Deploy padrão. Rollback = reverter o commit. Validar com a suíte E2E (`site-search` + novo cenário em `/downloads`) e inspeção visual via Playwright antes de concluir.
