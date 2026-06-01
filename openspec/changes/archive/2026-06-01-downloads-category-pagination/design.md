## Context

A página `/downloads` é um Server Component do Next.js que busca todos os downloads do banco, os agrupa por categoria e renderiza a lista completa de uma vez. Com o crescimento do acervo, categorias populares (como "Pregações") podem acumular 30–50 itens, tornando a página impraticável sem paginação ou mecanismo de ocultação.

A solução deve ser:
- **Progressivamente aprimorada**: funcionar sem JS (âncoras de categoria) e ganhar interatividade com JS (expansão inline).
- **SSR-first**: o conteúdo completo é renderizado no servidor (SEO, acessibilidade, sem layout shift). A lógica de show/hide é apenas visual.

## Goals / Non-Goals

**Goals:**
- Barra de navegação sticky (âncoras) que lista as categorias disponíveis e permite scroll suave até elas.
- Exibição limitada a 6 itens iniciais por categoria com botão "Ver mais" que expande o restante sem navegação.
- Zero regressão nos requisitos existentes (ícones, botão de download, metadados).
- Totalmente acessível (ARIA, foco gerenciado).

**Non-Goals:**
- Paginação server-side ou infinite scroll (desnecessário para o volume atual).
- Filtragem por tipo de material dentro de uma categoria.
- Busca full-text na página de downloads.
- Alterações no schema do Payload CMS.

## Decisions

### 1. "Ver mais" como Client Component com estado local (`useState`)

**Escolha**: `DownloadCategorySection` é um `"use client"` component que controla `expanded: boolean` localmente.

**Alternativas consideradas**:
- URL search params (`?cat=pregacoes&page=2`): mais shareable, mas recarrega a página — má UX para expansão inline.
- Intersection Observer + infinite scroll: complexidade maior sem ganho real para listas de <50 itens.

**Rationale**: Estado local é suficiente, simples, e não polui a URL. O conteúdo todo já está no HTML (renderizado server-side), então a expansão é puramente CSS/JS de visibilidade.

### 2. Barra de navegação sticky com `position: sticky`

**Escolha**: `DownloadCategoryNav` como Server Component com links de âncora (`#pregacoes`). Usa CSS `position: sticky; top: <altura do header>`.

**Alternativas consideradas**:
- Tabs com Client Component: ocultaria conteúdo, prejudicando SEO e acessibilidade.
- Scroll horizontal com scrollspy JS: complexidade maior sem ganho claro.

**Rationale**: Âncoras funcionam sem JS, são acessíveis nativamente e são o padrão esperado para navegação em página longa.

### 3. Limite inicial de 6 itens

**Escolha**: 6 itens por categoria (≈ 3 linhas em desktop, lista compacta no mobile).

**Rationale**: Mostra conteúdo suficiente para o usuário avaliar a categoria sem precisar expandir; número pequeno o suficiente para evitar scroll infinito na landing inicial.

### 4. IDs de âncora derivados do nome da categoria

**Escolha**: `id={slugify(cat)}` nas seções — ex: "Pregações" → `id="pregacoes"`.

**Rationale**: Simples, sem dependência extra (slug puro com normalização básica). Evita colisões porque os nomes de categoria são únicos.

## Risks / Trade-offs

- **Risco**: O header fixo pode cobrir o heading da seção ao usar âncoras. → **Mitigação**: Usar `scroll-margin-top` no CSS das seções para compensar a altura do header + barra de navegação.
- **Risco**: Categorias com ≤6 itens renderizam um botão "Ver mais" desnecessário. → **Mitigação**: O botão só é exibido quando `items.length > INITIAL_LIMIT`.
- **Trade-off**: Todo o conteúdo é enviado no HTML inicial (sem lazy load). Aceitável para o volume esperado (<200 itens total); evita complexidade de streaming.
