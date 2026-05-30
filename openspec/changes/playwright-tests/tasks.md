## 1. Instalação e configuração

- [x] 1.1 Instalar `@playwright/test` e `@playwright/mcp` como devDependencies no `package.json`
- [x] 1.2 Rodar `npx playwright install chromium` para baixar o browser
- [x] 1.3 Criar `playwright.config.ts` na raiz com: `baseURL` via `BASE_URL` env, timeout 15s/30s, projeto Chromium, reporter HTML
- [x] 1.4 Adicionar scripts ao `package.json`: `"test:e2e": "playwright test"` e `"test:e2e:ui": "playwright test --ui"`
- [x] 1.5 Adicionar `mcpServers.playwright` ao `.claude/settings.json` do projeto com `npx @playwright/mcp@latest`
- [x] 1.6 Adicionar `playwright-report/` e `test-results/` ao `.gitignore`

## 2. Testes de rotas públicas (`public-routes.spec.ts`)

- [ ] 2.1 Criar `tests/e2e/public-routes.spec.ts` com fixture de baseURL
- [ ] 2.2 Implementar teste: cada uma das 7 rotas retorna 200 e exibe header + footer
- [ ] 2.3 Implementar teste: header transparente no topo da home (classe `transparent`)
- [ ] 2.4 Implementar teste: header sólido após scroll de 100px na home (classe `solid`)
- [ ] 2.5 Implementar teste: logo branco em header transparente (`logo-IR-white.svg`)
- [ ] 2.6 Implementar teste: logo escuro em páginas internas (`logo-IR-dark.svg`)

## 3. Testes de fluxo do blog (`blog-flow.spec.ts`)

- [ ] 3.1 Criar `tests/e2e/blog-flow.spec.ts`
- [ ] 3.2 Implementar teste: cards `.post-card` exibidos quando há posts (assume seed rodado)
- [ ] 3.3 Implementar teste: estado vazio com mensagem "Nenhum post encontrado" (usando mock de URL sem seed ou verificação condicional)
- [ ] 3.4 Implementar teste: filtro por categoria aplica `?category=Devocional` na URL
- [ ] 3.5 Implementar teste: filtro "Todos" remove parâmetro `category` da URL
- [ ] 3.6 Implementar teste: clique no título do card navega para `/blog/<slug>`
- [ ] 3.7 Implementar teste: `.post-body` presente e não vazio no post individual
- [ ] 3.8 Implementar teste: metadados do post (autor, data PT-BR, "min de leitura") visíveis
- [ ] 3.9 Implementar teste: navegação de série exibe link para próxima parte

## 4. Testes de downloads (`downloads.spec.ts`)

- [ ] 4.1 Criar `tests/e2e/downloads.spec.ts`
- [ ] 4.2 Implementar teste: cards `.download-card` e headings de categoria exibidos (com seed)
- [ ] 4.3 Implementar teste: `.download-icon-audio` presente para tipo `audio`
- [ ] 4.4 Implementar teste: `.download-icon-pdf` presente para tipo `pdf`
- [ ] 4.5 Implementar teste: botão "Baixar" tem `href` não vazio quando há arquivo/link

## 5. Testes de acesso ao admin (`admin-access.spec.ts`)

- [ ] 5.1 Criar `tests/e2e/admin-access.spec.ts`
- [ ] 5.2 Implementar teste: `/admin` sem auth redireciona para URL contendo `login`
- [ ] 5.3 Implementar teste: campos `email` e `password` presentes em `/admin/login`
- [ ] 5.4 Implementar teste: login com credenciais válidas (via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` do `.env`) redireciona para dashboard
- [ ] 5.5 Implementar teste: login com credenciais inválidas exibe mensagem de erro

## 6. Testes de SEO (`seo-meta.spec.ts`)

- [ ] 6.1 Criar `tests/e2e/seo-meta.spec.ts`
- [ ] 6.2 Implementar teste: `document.title` contém "Igreja no Rio" na home
- [ ] 6.3 Implementar loop sobre todas as 7 rotas: `<title>` inclui nome da página E "Igreja no Rio"
- [ ] 6.4 Implementar loop sobre todas as 7 rotas: `meta[name="description"]` com ≥20 chars
- [ ] 6.5 Implementar loop sobre todas as 7 rotas: `meta[property="og:title"]` não vazio
- [ ] 6.6 Implementar teste: `/sitemap.xml` retorna `Content-Type` xml e contém `<urlset`
- [ ] 6.7 Implementar teste: sitemap contém `<loc>` para `/`, `/blog`, `/downloads`, `/contato`

## 7. Validação final

- [ ] 7.1 Rodar `docker compose up -d && npm run seed` para garantir dados de teste
- [ ] 7.2 Rodar `npm run test:e2e` e confirmar que todos os testes passam
- [ ] 7.3 Abrir `playwright-report/index.html` e revisar o relatório HTML
- [ ] 7.4 Verificar que o MCP Playwright aparece disponível no Claude Code (reiniciar sessão se necessário)
