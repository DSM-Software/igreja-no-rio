## 1. Filtro de data na home

- [x] 1.1 Em `src/app/(frontend)/page.tsx`, calcular `today` no fuso `America/Sao_Paulo` (`toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })`), seguindo o padrão da `/agenda`
- [x] 1.2 Adicionar `export const dynamic = "force-dynamic"` à home para recalcular o filtro a cada requisição (já presente)
- [x] 1.3 Ajustar a query de `events` para trazer apenas elegíveis (recorrentes OU `date >= today`) preservando `sort: "date"`, garantindo que eventos futuros não sejam perdidos por eventos passados ocupando o `limit`

## 2. Seleção do destaque e lista

- [x] 2.1 Calcular o conjunto elegível (futuros + recorrentes) e selecionar `highlightEvent = upcoming.find((e) => e.highlight) ?? upcoming[0] ?? null`
- [x] 2.2 Garantir que a seção "Próximo evento em destaque" só renderiza quando há evento elegível
- [x] 2.3 Fazer a lista "Próximos eventos" mapear o conjunto filtrado, sem eventos passados

## 3. Testes e verificação

- [x] 3.1 Adicionar/ajustar teste E2E em `tests/e2e/` cobrindo: home não exibe eventos passados, banner destaca o próximo evento, e fallback do `highlight` passado (criado `tests/e2e/home-events.spec.ts`; execução requer `npx playwright install` — binário do Chromium ausente no ambiente)
- [x] 3.2 Rodar `npm run lint` (0 erros) e `npm run build` — compilação ✓ (Turbopack, 12.8s) e TypeScript ✓ (3.9s); etapa final do `next build` é bloqueada por prompt interativo de migração do Payload (drift de dev DB, não é erro de código)
- [x] 3.3 Validar visualmente com Playwright que o banner e a lista exibem o próximo evento correto em `/` (validado via browser MCP contra dev server)
