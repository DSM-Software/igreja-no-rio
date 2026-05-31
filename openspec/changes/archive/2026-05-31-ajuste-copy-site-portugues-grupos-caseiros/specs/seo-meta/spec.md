## MODIFIED Requirements

### Requirement: Cada pagina publica tem <title> descritivo
O sistema SHALL definir um `<title>` unico e descritivo para cada rota publica, em portugues do Brasil e sem termos em ingles no copy institucional.

#### Scenario: Title da home contem nome da marca
- **WHEN** o usuario acessa `/`
- **THEN** `document.title` contem "Igreja no Rio"

#### Scenario: Title das paginas internas inclui nome da pagina e marca
- **WHEN** o usuario acessa `/quem-somos`, `/cultos`, `/blog`, `/downloads` ou `/contato`
- **THEN** `document.title` contem o nome da pagina em portugues (ex: "Quem Somos") E "Igreja no Rio"

#### Scenario: Title do post individual contem o titulo do post
- **WHEN** o usuario acessa `/blog/<slug>` de um post publicado
- **THEN** `document.title` contem o titulo do post

### Requirement: Cada pagina tem <meta name="description"> preenchido
O sistema SHALL incluir uma meta description nao vazia em todas as rotas publicas, escrita em portugues do Brasil e coerente com o texto institucional da pagina.

#### Scenario: Meta description presente na home
- **WHEN** o usuario acessa `/`
- **THEN** `meta[name="description"]` existe com `content` nao vazio contendo pelo menos 20 caracteres

#### Scenario: Meta description presente em paginas internas
- **WHEN** o usuario acessa qualquer rota publica (exceto 404)
- **THEN** `meta[name="description"]` existe e tem `content` com pelo menos 20 caracteres em portugues do Brasil
