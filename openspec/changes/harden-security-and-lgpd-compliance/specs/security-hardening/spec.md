## ADDED Requirements

### Requirement: Provisionamento administrativo exige credenciais explícitas
O sistema SHALL recusar o provisionamento de usuário administrativo quando credenciais obrigatórias estiverem ausentes, vazias ou em valores-placeholder inseguros.

#### Scenario: Seed falha sem credenciais obrigatórias
- **WHEN** o operador executa o seed sem definir as variáveis obrigatórias do admin
- **THEN** o processo termina com erro explícito e nenhum usuário privilegiado novo é criado

#### Scenario: Seed falha com placeholder inseguro
- **WHEN** o operador executa o seed com senha ou e-mail administrativo ainda em valor-placeholder conhecido
- **THEN** o processo recusa o bootstrap e informa que credenciais reais devem ser fornecidas

### Requirement: Mutações editoriais respeitam ownership e papel
O sistema SHALL aplicar mutações de conteúdo com base em `owner` para autores e SHALL reservar acesso irrestrito de conteúdo apenas para usuários com papel `admin` ou `editor`.

#### Scenario: Autor atualiza o próprio conteúdo
- **WHEN** um usuário com papel `autor` atualiza um registro cujo `owner` corresponde ao seu usuário autenticado
- **THEN** a operação é aceita

#### Scenario: Autor não atualiza conteúdo de outro usuário
- **WHEN** um usuário com papel `autor` tenta atualizar ou excluir um registro cujo `owner` pertence a outro usuário
- **THEN** a operação é negada

#### Scenario: Editor ou admin gerencia conteúdo compartilhado
- **WHEN** um usuário com papel `editor` ou `admin` atualiza ou exclui conteúdo editorial
- **THEN** a operação é aceita independentemente do `owner`

### Requirement: Produção usa origens confiáveis explícitas
O sistema SHALL obter `serverURL`, `cors` e `csrf` de configuração explícita de servidor em produção e MUST NOT depender de fallback implícito para `localhost`.

#### Scenario: Produção sem origem explícita é rejeitada
- **WHEN** a aplicação inicia em modo de produção sem configuração explícita de origem confiável
- **THEN** o bootstrap falha ou registra erro bloqueante em vez de assumir `localhost`

#### Scenario: Desenvolvimento local mantém fallback controlado
- **WHEN** a aplicação inicia fora de produção sem configuração explícita de origem
- **THEN** o ambiente local pode usar fallback de desenvolvimento documentado

### Requirement: Runtime público aplica baseline mínimo de segurança
O sistema SHALL publicar respostas HTTPS com headers mínimos de segurança e SHALL ser liberado com dependências de produção em patch baseline revisado para vulnerabilidades conhecidas com correção disponível.

#### Scenario: Respostas públicas incluem headers obrigatórios
- **WHEN** um usuário acessa uma rota pública via HTTPS
- **THEN** a resposta inclui HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e `Content-Security-Policy`

#### Scenario: Release revisa advisories corrigíveis de produção
- **WHEN** o time prepara uma release do site
- **THEN** dependências de produção com correção disponível em advisories críticos ou altos são atualizadas ou tratadas com justificativa explícita antes da publicação