## Purpose

Specifies the behavior of the `/agenda` public page, including event listing, recurring events section, and SEO metadata.

## Requirements

### Requirement: Página de agenda exibe próximos eventos
O sistema SHALL exibir a rota `/agenda` com a lista de próximos eventos da igreja em ordem cronológica crescente, reutilizando o componente `EventCard`.

#### Scenario: Página carrega com eventos
- **WHEN** o usuário acessa `/agenda` e há eventos cadastrados
- **THEN** a página retorna status 200, exibe o título "Agenda" e lista os eventos em ordem de data crescente

#### Scenario: Página exibe estado vazio com call-to-action
- **WHEN** o usuário acessa `/agenda` e não há eventos cadastrados
- **THEN** a página retorna status 200 e exibe uma mensagem amigável com link para `/contato`

### Requirement: Eventos recorrentes exibidos em seção separada
O sistema SHALL separar eventos com o campo `recurring` preenchido em uma seção "Encontros regulares", exibida acima dos eventos com data específica.

#### Scenario: Seção de encontros regulares aparece quando há eventos recorrentes
- **WHEN** o usuário acessa `/agenda` e há ao menos um evento com `recurring` preenchido
- **THEN** a seção "Encontros regulares" é exibida antes da lista de próximos eventos

#### Scenario: Seção de encontros regulares omitida quando não há eventos recorrentes
- **WHEN** o usuário acessa `/agenda` e nenhum evento possui `recurring` preenchido
- **THEN** a seção "Encontros regulares" não aparece na página

### Requirement: Metadados SEO corretos para a página de agenda
O sistema SHALL definir `<title>` e `<meta name="description">` específicos para a rota `/agenda`, comunicando claramente a finalidade da página.

#### Scenario: Título e descrição corretos
- **WHEN** o usuário (ou crawler) acessa `/agenda`
- **THEN** o `<title>` contém "Agenda" e a `<meta description>` menciona eventos da Igreja no Rio

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

### Requirement: Alinhamento correto entre ícone e texto no card de evento
O sistema SHALL exibir os ícones de horário e local no `EventCard` alinhados verticalmente ao centro do texto adjacente, sem deslocamento visual.

#### Scenario: Ícone de horário alinhado
- **WHEN** o usuário visualiza um card de evento na página `/agenda`
- **THEN** o ícone de relógio e o texto de horário estão alinhados ao centro na mesma linha

#### Scenario: Ícone de local alinhado
- **WHEN** o usuário visualiza um card de evento com campo `location` preenchido
- **THEN** o ícone de localização e o texto de local estão alinhados ao centro na mesma linha
