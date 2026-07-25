# Design — eventos-multidia-admin-ux

## Context

`Events` hoje modela apenas início (`date` + `time` texto livre). As superfícies públicas (home: banner de destaque + lista "Próximos eventos"; `/agenda`) filtram elegibilidade com `recorrente OU date >= hoje` (hoje calculado em `America/Sao_Paulo`) e ordenam por data+horário com tie-break em memória. O admin Payload gera o formulário a partir da config da collection — sem labels PT, sem validação de horário, listagem sem local.

## Goals / Non-Goals

**Goals:**
- Cadastrar eventos com término em outro dia e mantê-los visíveis enquanto em andamento.
- Exibir o intervalo de datas nas superfícies públicas sem quebrar o layout do card.
- Melhorar o formulário do admin (idioma, validação, layout, listagem).

**Non-Goals:**
- Recorrência estruturada (RRULE etc.) — `recurring` continua texto livre.
- Precisão de término por hora no filtro público (ver Decisão 3).
- Alterar a busca (`/busca`) além do que ela já herda dos dados.

## Decisions

### 1. Modelagem: checkbox `isMultiDay` + campos condicionais `endDate`/`endTime`
Campos novos em `Events`, todos opcionais no banco (colunas nullable, sem backfill):
- `isMultiDay` (checkbox, default `false`) — "Evento de mais de um dia?"
- `endDate` (date, dayOnly) e `endTime` (texto `HH:MM`) — visíveis só quando `isMultiDay` (via `admin.condition`); `endDate` obrigatório quando `isMultiDay`.

Validações: `endDate` ≥ `date` (dia); quando iguais, exigir `endTime` > `time` ou orientar a desmarcar o checkbox. Um hook `beforeValidate` limpa `endDate`/`endTime` quando `isMultiDay` é desmarcado, evitando término órfão.

*Alternativa considerada:* campos de término sempre visíveis sem checkbox — descartada (decisão do usuário; formulário fica mais limpo no caso comum).

### 2. Elegibilidade: evento em andamento conta como "próximo"
Query nas duas páginas passa a: `or: [recurring exists, date >= hoje, endDate >= hoje]`. O filtro em memória de "próximos" usa `dayPart(endDate ?? date) >= hoje`. Ordenação inalterada (por início).

### 3. Granularidade do término é o dia, não a hora
Um evento que termina às 12h continua visível até o fim do dia de término. Evita conversão de fuso por horário no servidor e casos-limite; o custo (evento aparece algumas horas "a mais" no último dia) é aceitável para o domínio.

### 4. Exibição do intervalo no `EventCard` e no banner
- Mesmo mês: bloco de data vira "01–03" + "AGO".
- Meses diferentes: bloco mantém o início e a linha de informações ganha "até 02 ago".
- Linha de horário: "08:00 → 12:00 (dia 03)" para multi-dia; inalterada para dia único.
- Banner de destaque da home ganha o mesmo tratamento na linha `time · location`.
Helper de formatação fica no próprio `EventCard` (único consumidor compartilhado); o banner usa formatação inline como hoje.

### 5. Admin UX
- `label` PT em todos os campos (`Título`, `Data de início`, `Horário`, `Local`, ...).
- `date` + `time` agrupados num campo `type: 'row'` (50%/50%); `endDate` + `endTime` idem.
- `time`/`endTime` validam `/^([01]\d|2[0-3]):[0-5]\d$/` com mensagem em PT — protege a ordenação por horário.
- `defaultColumns` ganha `location`.
- `highlight` ganha `admin.description` explicando que, entre marcados, vale o primeiro por data, e que destaque passado é ignorado.

### 6. Migração e tipos
`npm run migrate:create` para as colunas novas + `npm run generate:types`. Campos opcionais ⇒ deploy sem downtime e rollback trivial (colunas ficam ociosas se o código voltar).

## Risks / Trade-offs

- [Teste E2E de ordenação parseia o DOM do card] → atualizar parser junto com o novo layout de intervalo; testes novos cobrem multi-dia.
- [Editor marca `isMultiDay` e esquece `endTime`] → `endTime` opcional de propósito; exibição cai para só o intervalo de datas.
- [String livre em `time` legado fora do formato] → validação só bloqueia novos saves; dados existentes seguem exibidos como estão (não é migração de dados).

## Migration Plan

1. Migration + tipos + collection (deploy seguro: colunas novas nullable).
2. Frontend (filtros + exibição) no mesmo deploy — sem janela em que dados novos existam sem exibição.
3. Rollback: reverter código; colunas permanecem sem uso.
