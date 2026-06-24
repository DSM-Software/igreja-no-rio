## ADDED Requirements

### Requirement: Imagem Open Graph padrão resolvível
O sistema SHALL definir um `og:image` padrão no metadata raiz apontando para um arquivo de imagem existente em `public/`, com dimensões 1200×630, para que toda rota pública exiba uma prévia visual ao ser compartilhada em redes sociais.

#### Scenario: og:image presente e apontando para arquivo existente
- **WHEN** o usuário (ou crawler) acessa `/`
- **THEN** `meta[property="og:image"]` existe com `content` não vazio
- **AND** a URL resolvida do `content` retorna HTTP 200 com `Content-Type` de imagem

#### Scenario: og:image padrão herdado por páginas internas
- **WHEN** o usuário acessa uma rota pública que não define imagem própria (ex.: `/contato`, `/cultos`, `/quem-somos`)
- **THEN** `meta[property="og:image"]` existe com o `content` da imagem padrão

#### Scenario: twitter:image acompanha o card summary_large_image
- **WHEN** o usuário acessa `/`
- **THEN** o HTML inclui `meta[name="twitter:card"]` com `content` `summary_large_image`
- **AND** existe uma imagem associada ao card (`og:image` ou `twitter:image`)

## MODIFIED Requirements

### Requirement: Cada página pública tem <title> descritivo
O sistema SHALL definir um `<title>` único e descritivo para cada rota pública, em português do Brasil e sem termos em inglês no copy institucional. O título da home SHALL usar o copy "Faça parte dessa família" (renderizado como "Faça parte dessa família — Igreja no Rio" pelo template), enquanto o rótulo "Início" permanece apenas no menu de navegação.

#### Scenario: Title da home contém nome da marca e o copy convidativo
- **WHEN** o usuário acessa `/`
- **THEN** `document.title` contém "Faça parte dessa família"
- **AND** `document.title` contém "Igreja no Rio"

#### Scenario: Title das páginas internas inclui nome da página e marca
- **WHEN** o usuário acessa `/quem-somos`, `/cultos`, `/blog`, `/downloads` ou `/contato`
- **THEN** `document.title` contém o nome da página em português (ex: "Quem Somos") E "Igreja no Rio"

#### Scenario: Title do post individual contém o título do post
- **WHEN** o usuário acessa `/blog/<slug>` de um post publicado
- **THEN** `document.title` contém o título do post
