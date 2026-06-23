## ADDED Requirements

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
