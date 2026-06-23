## Why

A página `/agenda` e a home exibem eventos ordenados apenas por data, ignorando o campo de horário (`time`). Quando dois ou mais eventos caem no mesmo dia, a ordem de exibição é indefinida, o que confunde o usuário sobre qual acontece primeiro.

## What Changes

- A ordenação de eventos nas superfícies públicas (`/agenda` e home) passará a considerar `date` **e** `time` como critério composto: primeiro por data crescente, depois por horário crescente dentro do mesmo dia.
- Eventos sem horário definido (`time` vazio) aparecem após os que têm horário no mesmo dia.

## Capabilities

### New Capabilities

_(nenhuma capacidade nova — a mudança refina comportamentos existentes)_

### Modified Capabilities

- `agenda-page`: a ordenação de eventos na página `/agenda` muda de "somente por data crescente" para "por data e horário crescentes".
- `home-events`: a ordenação dos eventos listados na home muda de "somente por data crescente" para "por data e horário crescentes".

## Impact

- `src/app/(frontend)/agenda/page.tsx` (ou similar) — ajuste na query/sort ao buscar eventos.
- `src/app/(frontend)/page.tsx` — ajuste na query/sort de eventos da home.
- Possíveis utilitários de ordenação reutilizáveis em `src/lib/`.
- Testes E2E em `tests/e2e/` que verificam ordenação de eventos.
