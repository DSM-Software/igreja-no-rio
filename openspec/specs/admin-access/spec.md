## Purpose

Specifies the authentication and access control behavior for the Payload CMS admin panel, ensuring unauthenticated users are redirected to login and that the login form works correctly with valid and invalid credentials.

## Requirements

### Requirement: Acesso ao admin sem autenticação redireciona para login
O sistema SHALL redirecionar usuários não autenticados que tentam acessar `/admin` para a tela de login do Payload.

#### Scenario: Redirect para login
- **WHEN** o usuário acessa `/admin` sem estar autenticado
- **THEN** a URL final é `/admin/login` (ou contém `login`) e o formulário de login é exibido

### Requirement: Formulário de login do Payload está funcional
O sistema SHALL exibir o formulário de login com campos de e-mail e senha e botão de submit.

#### Scenario: Campos de login presentes
- **WHEN** o usuário acessa `/admin/login`
- **THEN** existem um `input[name="email"]` ou `input[type="email"]` e um `input[type="password"]` na página

#### Scenario: Botão de submit presente
- **WHEN** o usuário acessa `/admin/login`
- **THEN** existe um `button[type="submit"]` ou botão com texto "Entrar" / "Login"

### Requirement: Login com credenciais válidas autentica o usuário
O sistema SHALL aceitar e-mail e senha do usuário admin e redirecionar para o dashboard do Payload.

#### Scenario: Login bem-sucedido
- **WHEN** o usuário preenche e-mail e senha corretos e submete o formulário
- **THEN** a URL muda para `/admin` (dashboard) e o título da página contém "Dashboard" ou "Payload"

### Requirement: Login com credenciais inválidas exibe erro
O sistema SHALL exibir mensagem de erro quando as credenciais fornecidas são incorretas.

#### Scenario: Credenciais inválidas exibem erro
- **WHEN** o usuário preenche e-mail e senha incorretos e submete o formulário
- **THEN** uma mensagem de erro é exibida na página (texto contendo "inválid" ou "incorret" ou "não encontr")
