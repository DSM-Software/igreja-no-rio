## MODIFIED Requirements

### Requirement: Login com credenciais válidas autentica o usuário
O sistema SHALL aceitar e-mail e senha de um usuário previamente provisionado no Payload por fluxo administrativo seguro e redirecionar para o dashboard do Payload conforme suas permissões.

#### Scenario: Login bem-sucedido
- **WHEN** o usuário preenche e-mail e senha corretos de uma conta existente e submete o formulário
- **THEN** a URL muda para `/admin` (dashboard) e o título da página contém "Dashboard" ou "Payload"

## ADDED Requirements

### Requirement: Bootstrap administrativo não usa credenciais implícitas
O sistema SHALL exigir credenciais administrativas explícitas para provisionamento inicial e MUST NOT criar contas privilegiadas com defaults previsíveis.

#### Scenario: Ambiente sem credenciais explícitas bloqueia bootstrap privilegiado
- **WHEN** o ambiente não define as credenciais administrativas obrigatórias para bootstrap
- **THEN** nenhuma conta privilegiada é criada automaticamente

#### Scenario: Valores-placeholder não são aceitos como senha administrativa
- **WHEN** o bootstrap recebe uma senha administrativa correspondente a placeholder inseguro conhecido
- **THEN** o processo falha com erro explícito

### Requirement: Papéis administrativos restringem operações sensíveis
O sistema SHALL reservar a gestão de usuários para `admin` e SHALL aplicar restrições coerentes de mutação de conteúdo para `editor` e `autor`.

#### Scenario: Editor não gerencia usuários
- **WHEN** um usuário com papel `editor` tenta criar, alterar papel ou excluir usuários
- **THEN** a operação é negada

#### Scenario: Autor não altera conteúdo de outro usuário
- **WHEN** um usuário com papel `autor` tenta alterar ou excluir conteúdo cujo proprietário é outro usuário
- **THEN** a operação é negada