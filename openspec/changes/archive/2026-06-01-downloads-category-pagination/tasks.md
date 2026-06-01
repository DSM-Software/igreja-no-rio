## 1. Utilitários e CSS

- [x] 1.1 Adicionar função `slugify(text: string): string` em `src/lib/utils.ts` para gerar IDs de âncora a partir do nome da categoria (ex: "Pregações" → "pregacoes")
- [x] 1.2 Adicionar estilos CSS para a barra de navegação sticky (`.downloads-category-nav`) e para o estado oculto dos itens extras (`.downloads-list--collapsed`) em `src/app/globals.css`
- [x] 1.3 Adicionar `scroll-margin-top` às seções de categoria para compensar a altura do header + barra sticky

## 2. Componente de Navegação de Categorias

- [x] 2.1 Criar `src/components/ui/DownloadCategoryNav.tsx` como Server Component que recebe `categories: string[]` e renderiza links de âncora `href={#slugify(cat)}`
- [x] 2.2 Aplicar `position: sticky` e `top` adequado (altura do header) ao componente de navegação

## 3. Componente de Seção com "Ver mais"

- [x] 3.1 Criar `src/components/ui/DownloadCategorySection.tsx` como Client Component (`"use client"`) com `useState(false)` para controlar expansão
- [x] 3.2 Receber props: `title: string`, `items: Download[]`, `id: string` (slug da categoria)
- [x] 3.3 Exibir os primeiros 6 itens sempre; exibir os demais apenas quando `expanded === true`
- [x] 3.4 Renderizar botão "Ver mais (N)" apenas quando `items.length > 6` e `!expanded`; ao clicar, setar `expanded = true`

## 4. Integração na Página de Downloads

- [x] 4.1 Atualizar `src/app/(frontend)/downloads/page.tsx` para importar e renderizar `<DownloadCategoryNav>` com a lista de categorias disponíveis, logo após o hero e antes da lista de seções
- [x] 4.2 Substituir o bloco de renderização de seções por `<DownloadCategorySection>` para cada categoria, passando `id={slugify(cat)}`
- [x] 4.3 Garantir que `<DownloadCategoryNav>` não é renderizado quando não há downloads

## 5. Verificação

- [x] 5.1 Testar no browser: clicar em cada link da barra leva à seção correta sem o heading ser coberto pelo header
- [x] 5.2 Testar "Ver mais": categorias com >6 itens mostram botão; clicar expande todos os itens
- [x] 5.3 Testar categorias com ≤6 itens: nenhum botão é exibido
- [x] 5.4 Testar estado vazio: barra de navegação não aparece quando não há downloads
- [x] 5.5 Verificar que os requisitos pré-existentes continuam funcionando: ícones por tipo, botão "Baixar", metadados do card
