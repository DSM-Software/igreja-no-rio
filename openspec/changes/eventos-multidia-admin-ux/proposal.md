# Eventos de múltiplos dias + UX do formulário de eventos

## Why

A igreja realiza eventos que duram mais de um dia (ex.: Acampa Teens, do dia 1º às 8h até o dia 3 às 12h), mas o modelo atual de Events só tem data e horário de início — o evento some da home e da agenda assim que a data de início passa, mesmo estando em andamento. Além disso, o formulário de criação de eventos no admin tem labels em inglês, horário sem validação de formato (o que pode quebrar a ordenação por horário da agenda) e listagem sem o local.

## What Changes

- Novos campos opcionais em `Events`: `isMultiDay` (checkbox), `endDate` e `endTime`, exibidos condicionalmente no admin quando o checkbox é marcado, com validação de término ≥ início.
- Eventos em andamento (começaram, mas ainda não terminaram) continuam visíveis na home (banner de destaque e lista) e na `/agenda` até a data/hora de término.
- `EventCard` e o banner de destaque da home exibem o intervalo de datas de eventos multi-dia (ex.: "01–03 AGO", incluindo intervalos que cruzam meses).
- Formulário do admin: labels e descrições em português, validação `HH:MM` no horário, data e horário lado a lado, coluna `location` na listagem, dica no campo `highlight` explicando o critério de escolha do destaque.
- Migration do Postgres para os novos campos e regeneração de `payload-types.ts`.

## Capabilities

### New Capabilities
- `multi-day-events`: modelagem de eventos com data/hora de término (campos, validações) e exibição do intervalo de datas nas superfícies públicas (EventCard e banner de destaque).
- `events-admin-form`: experiência do formulário de criação/edição de eventos no admin Payload — idioma, layout, validações e listagem.

### Modified Capabilities
- `agenda-page`: o requisito "Eventos passados não exibidos na agenda" passa a considerar a data de término — evento multi-dia em andamento permanece visível até terminar.
- `home-events`: os requisitos de elegibilidade (banner de destaque e lista "Próximos eventos") passam a considerar a data de término — evento multi-dia em andamento permanece elegível.

## Impact

- `src/collections/Events.ts` — novos campos, labels, validações, `defaultColumns`.
- Migration nova em `src/migrations/` (via `npm run migrate:create`) + `src/payload-types.ts` regenerado.
- `src/app/(frontend)/page.tsx` e `src/app/(frontend)/agenda/page.tsx` — filtro de elegibilidade inclui `endDate >= hoje`.
- `src/components/ui/EventCard.tsx` — exibição de intervalo de datas.
- `tests/e2e/` — novos cenários (evento em andamento visível; intervalo exibido) e cobertura do admin quando aplicável.
- Nenhuma mudança de API pública; campos novos são opcionais (sem breaking change para eventos existentes).
