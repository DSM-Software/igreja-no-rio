# agenda-page

## Purpose

Definir a rota pública `/agenda`, que apresenta os próximos eventos da Igreja no Rio em ordem cronológica, separa encontros recorrentes dos eventos com data específica, e expõe metadados de SEO adequados.

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
