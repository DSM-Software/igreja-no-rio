## 1. Bootstrap e configuração confiável

- [x] 1.1 Remover credenciais default inseguras do seed e exigir variáveis explícitas para bootstrap administrativo
- [x] 1.2 Introduzir configuração explícita de `serverURL`, `cors` e `csrf` por ambiente sem fallback implícito para `localhost` em produção
- [x] 1.3 Atualizar documentação operacional e exemplos de ambiente para refletir o bootstrap seguro e as origens confiáveis obrigatórias

## 2. Governança de acesso no CMS

- [x] 2.1 Adicionar `owner` e hooks de preenchimento nas coleções mutáveis por autor com estratégia de backfill para conteúdo existente
- [x] 2.2 Ajustar regras de acesso de posts, downloads, events e users para alinhar mutação com papel e ownership
- [x] 2.3 Cobrir com testes o bloqueio de operações sensíveis para `editor` e `autor` e o fluxo de login/admin provisionado

## 3. Endurecimento de links públicos e runtime

- [x] 3.1 Validar `externalUrl` no schema de downloads para aceitar apenas destinos absolutos com protocolo permitido
- [x] 3.2 Adicionar proteção de renderização no card de download para omitir destinos inválidos ou inseguros
- [x] 3.3 Atualizar dependências de produção e completar o baseline de headers de segurança compatível com Next.js e Payload

## 4. Transparência pública e LGPD

- [x] 4.1 Criar a rota pública da política de privacidade com conteúdo institucional mínimo sobre tratamento de dados e exercício de direitos
- [x] 4.2 Expor links recorrentes para a política de privacidade em footer e demais superfícies públicas adequadas
- [x] 4.3 Ajustar a página de contato para comunicar de forma honesta se há processamento real de dados ou redirecionar o usuário para um canal funcional

## 5. Regressão e readiness de release

- [x] 5.1 Expandir os testes E2E para cobrir política de privacidade, transparência em contato e segurança dos botões de download
- [x] 5.2 Executar validação focada de lint, audit e fluxos Playwright críticos após o endurecimento
- [x] 5.3 Registrar checklist de deploy e rollback para upgrade de dependências, headers e configuração de origens