## Context

O projeto é um site Next.js 15 + Payload CMS rodando em Docker Compose (dev). Todas as páginas públicas usam `force-dynamic` (sem pré-renderização no build). O banco é Postgres e o storage é MinIO.

Dois pacotes Playwright relevantes:
- **`@playwright/test`** — framework de testes E2E (asserções, fixtures, relatórios)
- **`@playwright/mcp`** — servidor MCP que expõe um navegador Playwright para o Claude Code usar interativamente durante o desenvolvimento dos testes (navegação, screenshot, clique, etc.)

Hoje não há nenhum dos dois configurado no projeto.

## Goals / Non-Goals

**Goals:**
- Instalar e configurar `@playwright/test` para rodar os testes E2E
- Configurar `@playwright/mcp` como MCP server no `.claude/settings.json` do projeto para uso do Claude Code durante desenvolvimento dos testes
- Cobrir todas as 7 rotas públicas + `/admin` com testes de smoke, SEO meta e fluxos críticos
- Testes rodam contra `http://localhost:3000` (Docker Compose de pé)
- Relatório HTML gerado em `playwright-report/`

**Non-Goals:**
- Testes de carga / performance
- Testes de acessibilidade WCAG automatizados (escopo futuro)
- Mock do banco ou da API — testes sempre contra stack real
- Testes unitários (escopo de outro change)

## Decisions

### D1 — `@playwright/test` como runner (não Cypress ou outro)

**Decisão:** `@playwright/test`
**Rationale:** Já é o padrão do ecossistema Next.js; tem suporte nativo a múltiplos browsers, modo UI interativo e integração direta com o MCP `@playwright/mcp`. Cypress exigiria setup separado e não tem MCP oficial.

### D2 — MCP `@playwright/mcp` configurado por projeto

**Decisão:** Adicionar em `.claude/settings.json` do projeto (não global).
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```
**Rationale:** Escopo de projeto evita poluir o ambiente global. O Claude Code usa o MCP para navegar no site durante o desenvolvimento dos testes, tirando screenshots e validando seletores interativamente antes de escrever asserções.

### D3 — Estrutura de arquivos em `tests/e2e/`

```
tests/e2e/
  public-routes.spec.ts     → smoke em todas as 7 rotas
  blog-flow.spec.ts         → listagem, filtro, post individual
  downloads.spec.ts         → listagem agrupada, botão download
  admin-access.spec.ts      → redirect login, form de autenticação
  seo-meta.spec.ts          → <title> e <meta description> por página
```

**Rationale:** Um arquivo por capability da proposal. Facilita rodar subconjuntos com `--grep` ou por arquivo.

### D4 — baseURL configurada via `process.env.BASE_URL`

**Decisão:** `playwright.config.ts` lê `process.env.BASE_URL ?? 'http://localhost:3000'`.
**Rationale:** Permite apontar para staging ou produção sem mudar código. Em CI, basta setar `BASE_URL=http://app:3000` quando rodando dentro do Docker Compose.

### D5 — Apenas Chromium no CI; todos os browsers localmente opcional

**Decisão:** `projects` do Playwright configurados com Chromium por padrão; os outros (Firefox, WebKit) comentados e ativáveis.
**Rationale:** Reduz tempo de CI sem perder cobertura significativa para um site estático/SSR.

## Risks / Trade-offs

- **Testes dependem do Docker Compose de pé** → Mitigação: `webServer` no `playwright.config.ts` pode subir o server automaticamente, mas para este projeto assumimos que o compose já está rodando (mais simples).
- **Páginas `force-dynamic` podem ter latência** → Mitigação: `timeout` configurado em 15s por ação; `navigationTimeout` em 30s.
- **Banco sem dados = testes de blog/downloads falham silenciosamente** → Mitigação: testes verificam estado "sem posts" graciosamente; documentar que seed deve ser rodado antes.
- **`@playwright/mcp` usa versão `@latest`** → Mitigação: fixar versão no `package.json` após validar.

## Migration Plan

1. Instalar dependências
2. Criar `playwright.config.ts`
3. Criar arquivos de teste em `tests/e2e/`
4. Adicionar MCP ao `.claude/settings.json` do projeto
5. Adicionar scripts ao `package.json`
6. Rodar `npx playwright install chromium`
7. `docker compose up -d && npm run seed && npm run test:e2e`

Rollback: remover `@playwright/test` das devDeps e deletar `tests/e2e/` e `playwright.config.ts`.
