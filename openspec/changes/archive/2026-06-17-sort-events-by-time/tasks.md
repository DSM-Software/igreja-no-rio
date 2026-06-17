## 1. Ordenação na página /agenda

- [x] 1.1 Em `src/app/(frontend)/agenda/page.tsx`, alterar `sort: "date"` para `sort: "date,time"` na chamada `payload.find({ collection: "events", ... })`

## 2. Ordenação na home

- [x] 2.1 Em `src/app/(frontend)/page.tsx`, alterar `sort: "date"` para `sort: "date,time"` na chamada `payload.find({ collection: "events", ... })`

## 3. Testes E2E

- [x] 3.1 No arquivo de testes da agenda (ou `tests/e2e/public-routes.spec.ts`), adicionar cenário que verifica a ordem de dois eventos com a mesma data: o de horário anterior deve aparecer antes
