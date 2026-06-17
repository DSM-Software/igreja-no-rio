## 1. Hero da home

- [x] 1.1 Em `src/components/home/HeroV1.tsx`, substituir o `<h1>` "Você já foi<br />encontrado." por "Seja bem-vindo." (uma linha, sem `<br />`), mantendo as classes Tailwind atuais
- [x] 1.2 Em `tests/e2e/community-imagery.spec.ts`, atualizar a asserção `getByRole('heading', { name: /encontrado/i })` para `/bem-vindo/i`

## 2. Seção "Missão" em /quem-somos

- [x] 2.1 Em `src/app/(frontend)/quem-somos/page.tsx`, substituir os dois parágrafos atuais sob o heading "Para que todos conheçam e amem Jesus" pelos novos: (1) afirmação de pertencimento "Somos parte da igreja na cidade do Rio de Janeiro. Não vamos à igreja — somos a igreja. E você também pode fazer parte dessa família.", (2) propósito eterno "Cremos que Deus como nosso Pai tem um propósito eterno: uma família, de muitos filhos, conformes à imagem de Jesus, para o louvor da Sua glória."
- [x] 2.2 Adicionar um `<blockquote>` com a citação de Romanos 8:29 e atribuição em `<footer>` (classes Tailwind conforme design.md — barra lateral teal, itálico, atribuição "Romanos 8:29" não-itálica em tamanho menor)

## 3. Testes E2E

- [x] 3.1 Adicionar cenário em `tests/e2e/public-routes.spec.ts` (ou um novo `tests/e2e/welcome-and-mission-copy.spec.ts`) verificando: (a) home contém "Seja bem-vindo" no `<h1>` e NÃO contém "encontrado" no heading do hero; (b) `/quem-somos` contém "Não vamos à igreja — somos a igreja" e "Romanos 8:29" na seção Missão
