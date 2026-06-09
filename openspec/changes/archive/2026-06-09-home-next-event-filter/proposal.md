## Why

Na home (`/`), a seção "Próximo evento em destaque" (banner com o botão "Ver agenda") e a lista "Próximos eventos" buscam eventos sem nenhum filtro de data. Por isso podem exibir eventos que já passaram e eleger como "destaque" um evento antigo, em vez do próximo evento mais próximo. A `/agenda` já trata isso corretamente; a home precisa do mesmo comportamento.

## What Changes

- Filtrar os eventos exibidos na home para incluir apenas eventos do dia corrente ou futuros (mesma regra da `/agenda`: `today` calculado em `America/Sao_Paulo`).
- O banner "Próximo evento em destaque" passa a exibir o evento futuro mais próximo. O campo editorial `highlight` continua respeitado, mas só quando aponta para um evento não-passado; caso contrário cai no próximo evento mais próximo.
- A lista "Próximos eventos" da home deixa de exibir eventos passados (mesma origem de dados, mesma correção).
- Garantir que o filtro ocorra na consulta (e/ou seleção) de modo que eventos futuros não sejam perdidos quando houver muitos eventos passados ocupando o `limit` da query.
- Eventos recorrentes (`recurring`) continuam elegíveis para destaque independentemente de data, coerente com a `/agenda`.

## Capabilities

### New Capabilities
- `home-events`: Comportamento das superfícies de evento da página inicial — banner de "próximo evento em destaque" e lista "Próximos eventos" — exibindo apenas eventos atuais/futuros e elegendo o próximo evento mais próximo como destaque.

### Modified Capabilities
<!-- Nenhuma capability existente tem requisitos sobre as superfícies de evento da home. -->

## Impact

- Código: `src/app/(frontend)/page.tsx` (consulta de eventos, cálculo de `today`, seleção do `highlightEvent` e filtro da lista).
- Sem mudanças de schema, API ou dependências.
- Testes: `tests/e2e/` — adicionar cobertura para a home não exibir eventos passados e destacar o próximo evento.
