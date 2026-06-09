## Context

A home (`src/app/(frontend)/page.tsx`) busca eventos com:

```ts
payload.find({ collection: "events", sort: "date", limit: 4 })
```

Sem cláusula `where` de data. A partir disso:

- `highlightEvent = events.find((e) => e.highlight) ?? events[0] ?? null` — pode eleger um evento passado.
- A lista "Próximos eventos" mapeia `events` diretamente — pode listar eventos passados.

A `/agenda` (`src/app/(frontend)/agenda/page.tsx`) já resolve o problema calculando `today` no fuso `America/Sao_Paulo` e filtrando `!e.recurring && (!e.date || e.date >= today)`, mantendo recorrentes separados. Esta mudança alinha a home a esse comportamento.

## Goals / Non-Goals

**Goals:**
- Home nunca exibe eventos não-recorrentes com `date` anterior a hoje.
- O banner de destaque exibe o evento futuro mais próximo, respeitando `highlight` apenas quando ele aponta para um evento não-passado.
- Reaproveitar a mesma regra de data da `/agenda` (fuso `America/Sao_Paulo`, comparação `date >= today` em formato `YYYY-MM-DD`).

**Non-Goals:**
- Não alterar o comportamento da `/agenda`.
- Não introduzir um helper compartilhado/refatoração ampla (pode ser feito depois); o foco é corrigir a home.
- Não mudar schema da collection `Events`.

## Decisions

**1. Filtrar na consulta, não só no cliente.**
Hoje a query usa `limit: 4` sem filtro de data. Se houver muitos eventos passados, os 4 primeiros (ordenados por `date` asc) podem ser todos passados, e um filtro apenas no cliente resultaria em lista vazia mesmo havendo eventos futuros. Decisão: aplicar `where` na query para trazer eventos elegíveis (recorrentes OU `date >= today`), preservando `sort: "date"`. Alternativa considerada: aumentar `limit` e filtrar no cliente — rejeitada por ser frágil e não garantir cobertura.

**2. Calcular `today` em `America/Sao_Paulo`.**
Idêntico à `/agenda`: `new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })` → `YYYY-MM-DD`, comparável lexicograficamente com o campo `date`.

**3. Seleção do destaque.**
Sobre o conjunto já filtrado (futuros + recorrentes, ordenado por data asc): `highlightEvent = upcoming.find((e) => e.highlight) ?? upcoming[0] ?? null`. Assim o flag editorial é respeitado quando aponta para um evento válido; senão, cai no mais próximo.

**4. `force-dynamic`.**
A `/agenda` usa `export const dynamic = "force-dynamic"` para que `today` seja recalculado a cada request (evita cache de build mostrando "hoje" desatualizado). A home deve adotar a mesma diretiva para que o filtro de data não congele no momento do build.

## Risks / Trade-offs

- [Eventos recorrentes sem `date`] → A regra `!e.date || e.date >= today` mantém recorrentes/sem-data visíveis, coerente com a `/agenda`.
- [`force-dynamic` na home remove SSG] → A home passa a renderizar dinamicamente; aceitável e já é o padrão adotado na `/agenda`. Mitigação: escopo limitado, dados vêm de chamada in-process ao Payload.
- [Divergência futura entre home e agenda] → Como a lógica é duplicada, mudanças de regra precisam ser aplicadas nos dois lugares. Mitigação: documentar e, se necessário, extrair helper em mudança posterior (fora de escopo).

## Migration Plan

Mudança puramente de comportamento de renderização, sem migração de dados. Deploy padrão; rollback = reverter o commit.
