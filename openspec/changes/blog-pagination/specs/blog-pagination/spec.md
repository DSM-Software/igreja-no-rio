## ADDED Requirements

### Requirement: Listagem de posts é paginada
O sistema SHALL dividir a listagem de posts em páginas de 12 itens, controladas pelo parâmetro de URL `page`.

#### Scenario: Primeira página exibe até 12 posts
- **WHEN** o usuário acessa `/blog` sem parâmetro `page`
- **THEN** no máximo 12 `.post-card` são exibidos

#### Scenario: Segunda página exibe próximos posts
- **WHEN** o usuário acessa `/blog?page=2`
- **THEN** são exibidos posts diferentes dos da primeira página (deslocamento correto)

#### Scenario: Parâmetro page inválido cai na página 1
- **WHEN** o usuário acessa `/blog?page=abc` ou `/blog?page=0`
- **THEN** a página exibe os mesmos posts de `/blog` (página 1)

### Requirement: Controles de paginação são exibidos
O sistema SHALL exibir controles de navegação entre páginas quando há mais de uma página de resultados.

#### Scenario: Controles visíveis quando há múltiplas páginas
- **WHEN** o usuário acessa `/blog` e o total de posts publicados excede 12
- **THEN** um elemento de paginação (`[aria-label="Paginação"]` ou `.pagination`) é visível na página

#### Scenario: Controles ocultos quando há uma única página
- **WHEN** o banco tem 12 ou menos posts publicados
- **THEN** nenhum controle de paginação é exibido

#### Scenario: Botão "Anterior" está desabilitado na primeira página
- **WHEN** o usuário está na página 1 (`/blog` ou `/blog?page=1`)
- **THEN** o link/botão "Anterior" está ausente ou marcado como `aria-disabled="true"`

#### Scenario: Botão "Próxima" está desabilitado na última página
- **WHEN** o usuário está na última página
- **THEN** o link/botão "Próxima" está ausente ou marcado como `aria-disabled="true"`

### Requirement: Paginação preserva filtros ativos
O sistema SHALL manter os parâmetros de filtro (`category`, `serie`) ao navegar entre páginas.

#### Scenario: Navegar para próxima página mantém filtro de categoria
- **WHEN** o usuário está em `/blog?category=Devocional` e clica em "Próxima"
- **THEN** a URL resultante contém tanto `category=Devocional` quanto `page=2`

#### Scenario: Mudar filtro reseta para página 1
- **WHEN** o usuário está em `/blog?page=3` e clica no filtro "Devocional"
- **THEN** a URL resultante contém `category=Devocional` mas não contém `page`
