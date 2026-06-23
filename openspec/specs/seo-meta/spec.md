## Purpose

Specifies the SEO metadata requirements for all public pages, including descriptive page titles, meta descriptions, Open Graph tags for social sharing, and a valid sitemap XML.

## Requirements

### Requirement: Cada página pública tem <title> descritivo
O sistema SHALL definir um `<title>` único e descritivo para cada rota pública, em português do Brasil e sem termos em inglês no copy institucional.

#### Scenario: Title da home contém nome da marca
- **WHEN** o usuário acessa `/`
- **THEN** `document.title` contém "Igreja no Rio"

#### Scenario: Title das páginas internas inclui nome da página e marca
- **WHEN** o usuário acessa `/quem-somos`, `/cultos`, `/blog`, `/downloads` ou `/contato`
- **THEN** `document.title` contém o nome da página em português (ex: "Quem Somos") E "Igreja no Rio"

#### Scenario: Title do post individual contém o título do post
- **WHEN** o usuário acessa `/blog/<slug>` de um post publicado
- **THEN** `document.title` contém o título do post

### Requirement: Cada página tem <meta name="description"> preenchido
O sistema SHALL incluir uma meta description não vazia em todas as rotas públicas, escrita em português do Brasil e coerente com o texto institucional da página.

#### Scenario: Meta description presente na home
- **WHEN** o usuário acessa `/`
- **THEN** `meta[name="description"]` existe com `content` não vazio contendo pelo menos 20 caracteres

#### Scenario: Meta description presente em páginas internas
- **WHEN** o usuário acessa qualquer rota pública (exceto 404)
- **THEN** `meta[name="description"]` existe e tem `content` com pelo menos 20 caracteres em português do Brasil

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

### Requirement: Verificação do Google Search Console no <head>
O sistema SHALL incluir a meta tag `<meta name="google-site-verification" content="<token>">` no `<head>` de todas as rotas públicas, usando o valor de `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` com fallback para `zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs`, para que o domínio possa ser verificado no Google Search Console.

#### Scenario: Meta tag de verificação presente na home
- **WHEN** o usuário (ou crawler) acessa `/`
- **THEN** o HTML inclui `<meta name="google-site-verification" content="zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs">` no `<head>`

#### Scenario: Meta tag de verificação presente em páginas internas
- **WHEN** o usuário acessa `/blog`, `/downloads`, `/contato`, `/agenda`, `/cultos`, `/quem-somos` ou `/privacidade`
- **THEN** o HTML inclui a mesma meta tag `google-site-verification` no `<head>`

#### Scenario: Override via variável de ambiente
- **WHEN** `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` é setada para um valor diferente do default
- **THEN** o `content` da meta tag reflete o valor da variável de ambiente
