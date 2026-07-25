# agenda-page (delta)

## MODIFIED Requirements

### Requirement: Eventos passados não exibidos na agenda
O sistema SHALL ocultar da página `/agenda` todos os eventos não-recorrentes já encerrados — ou seja, cujo dia de término (`endDate` quando preenchido, senão `date`) seja anterior à data atual (hoje) — exibindo eventos do dia corrente, de datas futuras e eventos multi-dia em andamento.

#### Scenario: Eventos passados omitidos
- **WHEN** o usuário acessa `/agenda` e há eventos com dia de término (`endDate` ou, na ausência, `date`) anterior a hoje
- **THEN** esses eventos não aparecem na lista "Próximos eventos"

#### Scenario: Evento de hoje exibido
- **WHEN** o usuário acessa `/agenda` e há um evento com `date` igual a hoje
- **THEN** esse evento aparece na lista "Próximos eventos"

#### Scenario: Evento multi-dia em andamento exibido
- **WHEN** o usuário acessa `/agenda` durante um evento multi-dia (`date` anterior a hoje, `endDate` igual a hoje ou futura)
- **THEN** esse evento aparece na lista "Próximos eventos" até o dia de término, inclusive

#### Scenario: Eventos recorrentes sempre exibidos
- **WHEN** o usuário acessa `/agenda` e há eventos com o campo `recurring` preenchido
- **THEN** esses eventos aparecem na seção "Encontros regulares" independentemente de data
