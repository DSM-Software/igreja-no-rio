# home-events

## Purpose

Definir o comportamento das superfícies de evento da página inicial (`/`) — o banner "Próximo evento em destaque" e a lista "Próximos eventos" — garantindo que exibam apenas eventos atuais/futuros (ou recorrentes) e elejam o próximo evento mais próximo como destaque.

## Requirements

### Requirement: Banner de destaque exibe o próximo evento mais próximo
O sistema SHALL exibir, na seção "Próximo evento em destaque" da home (`/`), o evento futuro mais próximo. O sistema SHALL respeitar o campo editorial `highlight` apenas quando ele aponta para um evento não-passado (data igual a hoje ou futura, ou evento recorrente); caso contrário SHALL exibir o evento elegível mais próximo por data.

#### Scenario: Destaque ignora evento passado e mostra o próximo
- **WHEN** o usuário acessa `/` e existe ao menos um evento com `date` igual a hoje ou futura
- **THEN** o banner de destaque exibe o evento elegível com a data mais próxima, e nunca um evento com `date` anterior a hoje

#### Scenario: Highlight editorial respeitado quando não-passado
- **WHEN** o usuário acessa `/` e o evento marcado com `highlight` possui `date` igual a hoje ou futura (ou é recorrente)
- **THEN** o banner de destaque exibe esse evento marcado

#### Scenario: Highlight passado cai para o próximo evento
- **WHEN** o usuário acessa `/` e o evento marcado com `highlight` possui `date` anterior a hoje
- **THEN** o banner de destaque NÃO exibe esse evento e exibe o próximo evento elegível mais próximo

#### Scenario: Sem eventos elegíveis o banner não aparece
- **WHEN** o usuário acessa `/` e não há eventos recorrentes nem eventos com `date` igual a hoje ou futura
- **THEN** a seção de destaque não é renderizada

### Requirement: Lista de próximos eventos da home omite eventos passados
O sistema SHALL exibir, na lista "Próximos eventos" da home, apenas eventos do dia corrente ou de datas futuras, além dos eventos recorrentes. O sistema SHALL ocultar eventos não-recorrentes com `date` anterior a hoje.

#### Scenario: Evento passado não listado
- **WHEN** o usuário acessa `/` e há eventos não-recorrentes com `date` anterior a hoje
- **THEN** esses eventos não aparecem na lista "Próximos eventos" da home

#### Scenario: Evento de hoje listado
- **WHEN** o usuário acessa `/` e há um evento com `date` igual a hoje
- **THEN** esse evento aparece na lista "Próximos eventos" da home

#### Scenario: Eventos recorrentes permanecem elegíveis
- **WHEN** o usuário acessa `/` e há eventos com o campo `recurring` preenchido
- **THEN** esses eventos permanecem elegíveis para a home independentemente de data

### Requirement: Filtro de data da home calculado no fuso de São Paulo a cada requisição
O sistema SHALL determinar "hoje" usando o fuso `America/Sao_Paulo` e SHALL avaliar o filtro de eventos da home a cada requisição, de modo que a virada do dia seja refletida sem depender do momento do build. O sistema SHALL garantir que eventos futuros sejam selecionados mesmo quando houver muitos eventos passados na collection.

#### Scenario: Cálculo de hoje no fuso correto
- **WHEN** a home é renderizada
- **THEN** o limite "hoje" usado para filtrar eventos corresponde à data corrente no fuso `America/Sao_Paulo`

#### Scenario: Eventos futuros não são perdidos por eventos passados
- **WHEN** a collection possui muitos eventos passados além de eventos futuros
- **THEN** a home ainda exibe os eventos futuros, sem que os passados ocupem o lugar deles
