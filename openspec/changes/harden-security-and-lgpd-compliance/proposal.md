## Why

O site e o CMS já cobrem o fluxo institucional principal, mas ainda operam com lacunas relevantes de segurança e conformidade: seed administrativo com fallback previsível, links externos públicos sem validação, modelo de permissão incompleto para autores e ausência de transparência pública sobre tratamento de dados pessoais. Esses pontos combinam risco operacional, risco reputacional e exposição jurídica desnecessária para um site institucional que já publica conteúdo e incentiva contato direto.

## What Changes

- Endurecer o bootstrap e o acesso administrativo para impedir credenciais default, alinhar permissões por papel e reduzir dependência de configuração frágil em produção.
- Definir um baseline de segurança para superfícies públicas e operacionais, incluindo validação de destinos externos, revisão de dependências críticas e reforço de headers/origens da aplicação.
- Tornar a experiência pública juridicamente mais defensável com política de privacidade, transparência sobre dados de contato e navegação clara para documentos legais.
- Ajustar requisitos testáveis para que segurança operacional, segurança de links públicos e transparência de tratamento de dados passem a ser cobertos por specs e regressão automatizada.

## Capabilities

### New Capabilities
- `security-hardening`: Define o baseline de endurecimento operacional do site e do CMS, incluindo bootstrap seguro, validação de superfícies públicas e controles mínimos de runtime.
- `privacy-transparency`: Define como o site informa tratamento de dados, identifica documentos legais públicos e comunica de forma transparente qualquer coleta de dados pessoais.

### Modified Capabilities
- `admin-access`: Ajustar requisitos de acesso administrativo para proibir credenciais seed implícitas e exigir comportamento consistente de autenticação e autorização.
- `downloads-page`: Ajustar requisitos para que botões públicos de download só exponham destinos válidos e seguros.
- `public-routes`: Ajustar requisitos das rotas públicas para incluir acesso previsível a documentos legais e comunicação honesta sobre contato e coleta de dados.

## Impact

- Configuração do Payload e coleções em `src/payload.config.ts`, `src/collections`, `src/access` e `src/scripts/seed.ts`.
- Rotas e componentes públicos em `src/app/(frontend)` e `src/components`, especialmente contato, footer, header e downloads.
- Dependências e configuração operacional em `package.json`, `next.config.ts`, `nginx/nginx.conf`, Docker e ambiente de produção.
- Testes E2E voltados para admin, rotas públicas, downloads e novos requisitos de transparência/compliance.