## 1. Layout compartilhado e navegação

- [x] 1.1 Revisar `src/components/layout/Header.tsx` para garantir uma única navegação primária visível por viewport e comportamento consistente de menu mobile
- [x] 1.2 Ajustar `src/components/layout/Footer.tsx` e `src/app/(frontend)/layout.tsx` para manter alinhamento, hierarquia visual e largura útil consistentes entre header, conteúdo e footer
- [x] 1.3 Consolidar em `src/app/(frontend)/globals.css` os estilos compartilhados de espaçamento, grids e responsividade usados pelas rotas públicas

## 2. Correções visuais nas páginas públicas

- [x] 2.1 Revisar as rotas públicas em `src/app/(frontend)` para remover elementos duplicados, incorretos ou visualmente conflitantes
- [x] 2.2 Corrigir alinhamentos e quebras responsivas em seções com cards, blocos institucionais, contato e downloads para evitar sobreposição, corte horizontal ou desalinhamento perceptível
- [x] 2.3 Padronizar headings, rótulos de navegação e CTAs públicos para manter copy institucional coerente e sem redundância

## 3. Regressão e validação

- [x] 3.1 Expandir `tests/e2e/public-routes.spec.ts` com cenários de consistência visual responsiva, ausência de navegação duplicada e integridade dos elementos recorrentes
- [x] 3.2 Executar a suíte Playwright focada em rotas públicas e corrigir regressões encontradas nas viewports desktop e mobile