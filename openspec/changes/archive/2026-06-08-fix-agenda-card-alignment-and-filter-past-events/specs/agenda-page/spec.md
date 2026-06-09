## ADDED Requirements

### Requirement: Eventos passados não exibidos na agenda
O sistema SHALL ocultar da página `/agenda` todos os eventos não-recorrentes cuja `date` seja anterior à data atual (hoje), exibindo apenas eventos do dia corrente ou datas futuras.

#### Scenario: Eventos passados omitidos
- **WHEN** o usuário acessa `/agenda` e há eventos com `date` anterior a hoje
- **THEN** esses eventos não aparecem na lista "Próximos eventos"

#### Scenario: Evento de hoje exibido
- **WHEN** o usuário acessa `/agenda` e há um evento com `date` igual a hoje
- **THEN** esse evento aparece na lista "Próximos eventos"

#### Scenario: Eventos recorrentes sempre exibidos
- **WHEN** o usuário acessa `/agenda` e há eventos com o campo `recurring` preenchido
- **THEN** esses eventos aparecem na seção "Encontros regulares" independentemente de data

## ADDED Requirements

### Requirement: Alinhamento correto entre ícone e texto no card de evento
O sistema SHALL exibir os ícones de horário e local no `EventCard` alinhados verticalmente ao centro do texto adjacente, sem deslocamento visual.

#### Scenario: Ícone de horário alinhado
- **WHEN** o usuário visualiza um card de evento na página `/agenda`
- **THEN** o ícone de relógio e o texto de horário estão alinhados ao centro na mesma linha

#### Scenario: Ícone de local alinhado
- **WHEN** o usuário visualiza um card de evento com campo `location` preenchido
- **THEN** o ícone de localização e o texto de local estão alinhados ao centro na mesma linha
