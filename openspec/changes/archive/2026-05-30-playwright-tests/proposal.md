## Why

O site da Igreja no Rio não tem cobertura de testes automatizados. Antes de fazer deploy em produção é necessário garantir que as rotas públicas carregam corretamente, o painel Payload está acessível e os fluxos críticos (blog, downloads, admin) funcionam de ponta a ponta — especialmente depois de updates de dependências ou mudanças de layout.

## What Changes

- Adiciona Playwright como framework de testes E2E
- Configura o MCP `@playwright/mcp` para execução e introspecção via servidor MCP
- Cria suíte de testes cobrindo todas as rotas públicas e o painel `/admin`
- Adiciona scripts `test:e2e` e `test:e2e:ui` ao `package.json`
- Adiciona `playwright.config.ts` com configuração para desenvolvimento local (Docker Compose) e CI

## Capabilities

### New Capabilities

- `public-routes`: Testa que cada rota pública (`/`, `/quem-somos`, `/cultos`, `/blog`, `/downloads`, `/contato`) carrega sem erro, tem título correto e elementos visuais esperados (header, footer, logo).
- `blog-flow`: Testa listagem de posts, filtro por categoria/série e navegação para post individual com corpo renderizado.
- `downloads-page`: Testa a listagem de materiais agrupados por categoria e o botão de download.
- `admin-access`: Testa que `/admin` redireciona para login quando não autenticado, e que o formulário de login existe e é funcional.
- `seo-meta`: Verifica que cada página tem `<title>` e `<meta name="description">` preenchidos corretamente.

### Modified Capabilities

## Impact

- Novas devDependencies: `@playwright/test`, `@playwright/mcp` (MCP server para integração com Claude Code)
- Novo arquivo: `playwright.config.ts` na raiz
- Novo diretório: `tests/e2e/`
- Os testes rodam contra o servidor local (`http://localhost:3000`) — Docker Compose deve estar de pé
- CI: pode ser integrado com `docker compose up -d` + `npm run test:e2e` no pipeline
