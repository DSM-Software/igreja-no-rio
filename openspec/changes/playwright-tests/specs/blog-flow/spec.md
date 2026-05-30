## ADDED Requirements

### Requirement: Listagem de posts exibe cards publicados
O sistema SHALL exibir cards de posts publicados na página `/blog`, com título, categoria, autor e data.

#### Scenario: Cards visíveis quando há posts (com seed)
- **WHEN** o usuário acessa `/blog` e o banco tem posts publicados
- **THEN** pelo menos um `.post-card` é exibido com `.post-card-title` não vazio

#### Scenario: Estado vazio quando não há posts
- **WHEN** o usuário acessa `/blog` e não há posts publicados
- **THEN** a página exibe a mensagem "Nenhum post encontrado"

### Requirement: Filtro por categoria funciona
O sistema SHALL filtrar os posts ao clicar num botão de categoria na filter bar.

#### Scenario: Filtro Devocional aplicado
- **WHEN** o usuário clica no botão de filtro "Devocional"
- **THEN** a URL inclui o parâmetro `category=Devocional` e apenas cards com tag "Devocional" são exibidos

#### Scenario: Filtro removido ao clicar em "Todos"
- **WHEN** o usuário clica em "Devocional" e depois em "Todos"
- **THEN** a URL não contém parâmetro `category` e todos os posts são exibidos novamente

### Requirement: Filtro por série funciona
O sistema SHALL exibir a filter bar de séries quando existem posts com série cadastrada e permitir filtrar por ela.

#### Scenario: Filtro de série aplicado
- **WHEN** o usuário clica num botão de série (ex: "Somos a Igreja")
- **THEN** a URL inclui `serie=Somos+a+Igreja` e apenas posts daquela série são exibidos

### Requirement: Navegação para post individual funciona
O sistema SHALL navegar para a página do post ao clicar no título ou no link "Ler →".

#### Scenario: Clique no título navega para o post
- **WHEN** o usuário clica no título de um post card
- **THEN** a URL muda para `/blog/<slug>` e o `<h1>` da página contém o título do post

#### Scenario: Corpo do post renderizado
- **WHEN** o usuário acessa `/blog/<slug>` de um post publicado
- **THEN** o elemento `.post-body` está presente e contém texto (parágrafos gerados pelo Lexical)

### Requirement: Navegação de série exibida no post individual
O sistema SHALL exibir links "← Parte anterior" e "Parte seguinte →" quando o post faz parte de uma série com mais de um item.

#### Scenario: Navegação de série visível
- **WHEN** o usuário acessa o post "A casa antes do templo" (parte 1 da série "Somos a Igreja")
- **THEN** existe um link para a parte 2 com texto contendo "A mesa que forma família"

### Requirement: Metadados do post exibidos
O sistema SHALL exibir autor, data formatada em PT-BR e tempo de leitura no post individual.

#### Scenario: Metadados visíveis
- **WHEN** o usuário acessa `/blog/<slug>`
- **THEN** a página exibe o nome do autor, uma data no formato "DD de mês de AAAA" e texto contendo "min de leitura"
