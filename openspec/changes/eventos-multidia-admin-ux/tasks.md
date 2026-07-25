# Tasks — eventos-multidia-admin-ux

## 1. Schema e admin (Events)

- [x] 1.1 Adicionar em `src/collections/Events.ts` os campos `isMultiDay` (checkbox), `endDate` (date, dayOnly) e `endTime` (texto), com `admin.condition` exibindo término só quando `isMultiDay` está marcado; `endDate` obrigatório quando `isMultiDay`
- [x] 1.2 Validações: `endDate` ≥ `date`; quando mesmo dia, `endTime` > `time`; hook `beforeValidate` limpa `endDate`/`endTime` quando `isMultiDay` desmarcado
- [x] 1.3 Labels e descrições em português para todos os campos do formulário (Título, Data de início, Horário, Local, etc.)
- [x] 1.4 Validação `HH:MM` (regex 24h) em `time` e `endTime` com mensagem em português
- [x] 1.5 Agrupar `date`+`time` e `endDate`+`endTime` em campos `type: 'row'` (50%/50%)
- [x] 1.6 Adicionar `location` em `defaultColumns` e `admin.description` no campo `highlight` explicando o critério do destaque
- [x] 1.7 Rodar `npm run migrate:create` para as colunas novas e `npm run generate:types`; aplicar `npm run migrate` no ambiente local

## 2. Superfícies públicas

- [x] 2.1 Home (`src/app/(frontend)/page.tsx`): incluir `endDate >= hoje` no `or` da query e usar `dayPart(endDate ?? date) >= hoje` no filtro/elegibilidade do destaque
- [x] 2.2 Agenda (`src/app/(frontend)/agenda/page.tsx`): mesma regra de elegibilidade da home (query + filtro em memória)
- [x] 2.3 `EventCard`: exibir intervalo de datas (mesmo mês: "01–03 AGO"; meses diferentes: início no bloco + "até DD mês" na linha de informações) e horário de início → término quando `endTime` presente
- [x] 2.4 Banner de destaque da home: indicar término na linha `time · location` para eventos multi-dia

## 3. Testes e verificação

- [x] 3.1 E2E: evento multi-dia em andamento aparece na home e na `/agenda` (seed de teste com `date` ontem e `endDate` amanhã)
- [x] 3.2 E2E: card de evento multi-dia exibe o intervalo de datas; evento de um dia mantém exibição atual
- [x] 3.3 Atualizar o parser do teste de ordenação (`tests/e2e/agenda-page.spec.ts`) se o novo layout do bloco de data o afetar
- [x] 3.4 Rodar `npx tsc --noEmit`, `npm run lint` e as suítes `agenda-page`, `home-events`, `public-routes`, `event-registration`, `admin-access`
