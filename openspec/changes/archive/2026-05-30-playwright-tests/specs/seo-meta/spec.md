## ADDED Requirements

### Requirement: Cada página pública tem <title> descritivo
O sistema SHALL definir um `<title>` único e descritivo para cada rota pública.

#### Scenario: Title da home contém nome da marca
- **WHEN** o usuário acessa `/`
- **THEN** `document.title` contém "Igreja no Rio"

#### Scenario: Title das páginas internas inclui nome da página e marca
- **WHEN** o usuário acessa `/quem-somos`, `/cultos`, `/blog`, `/downloads` ou `/contato`
- **THEN** `document.title` contém o nome da página (ex: "Quem Somos") E "Igreja no Rio"

#### Scenario: Title do post individual contém o título do post
- **WHEN** o usuário acessa `/blog/<slug>` de um post publicado
- **THEN** `document.title` contém o título do post

### Requirement: Cada página tem <meta name="description"> preenchido
O sistema SHALL incluir uma meta description não vazia em todas as rotas públicas.

#### Scenario: Meta description presente na home
- **WHEN** o usuário acessa `/`
- **THEN** `meta[name="description"]` existe com `content` não vazio contendo pelo menos 20 caracteres

#### Scenario: Meta description presente em páginas internas
- **WHEN** o usuário acessa qualquer rota pública (exceto 404)
- **THEN** `meta[name="description"]` existe e tem `content` com pelo menos 20 caracteres

### Requirement: Open Graph tags presentes nas páginas principais
O sistema SHALL incluir as meta tags Open Graph (`og:title`, `og:description`, `og:type`) nas páginas públicas para compartilhamento em redes sociais.

#### Scenario: OG title presente
- **WHEN** o usuário acessa qualquer rota pública
- **THEN** `meta[property="og:title"]` existe com conteúdo não vazio

#### Scenario: OG description presente
- **WHEN** o usuário acessa qualquer rota pública
- **THEN** `meta[property="og:description"]` existe com conteúdo não vazio

### Requirement: Sitemap XML acessível e válido
O sistema SHALL servir um sitemap XML em `/sitemap.xml` com as rotas estáticas do site.

#### Scenario: Sitemap retorna XML válido
- **WHEN** o usuário acessa `/sitemap.xml`
- **THEN** a resposta tem Content-Type `application/xml` (ou `text/xml`) e contém `<urlset` no corpo

#### Scenario: Sitemap inclui rotas estáticas
- **WHEN** o usuário acessa `/sitemap.xml`
- **THEN** o XML contém `<loc>` com as URLs de `/`, `/blog`, `/downloads` e `/contato`
