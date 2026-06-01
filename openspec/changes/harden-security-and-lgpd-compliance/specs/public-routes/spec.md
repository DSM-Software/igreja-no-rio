## ADDED Requirements

### Requirement: Documentação de privacidade é acessível nas rotas públicas
O sistema SHALL expor a política de privacidade como rota pública navegável e SHALL disponibilizar acesso recorrente a ela nas superfícies institucionais do site.

#### Scenario: Footer aponta para a política de privacidade
- **WHEN** o usuário visualiza o footer em uma rota pública
- **THEN** existe um link institucional visível para a política de privacidade

#### Scenario: Política de privacidade carrega como página pública
- **WHEN** o usuário acessa a rota pública da política de privacidade
- **THEN** a página retorna status 200 e exibe heading e conteúdo institucional legível sobre tratamento de dados

### Requirement: Página de contato comunica o estado real do canal de dados
O sistema SHALL evitar que a página de contato induza o usuário a acreditar em coleta ativa de dados quando não houver processamento real e SHALL apontar um canal funcional de contato.

#### Scenario: Contato sem backend não simula envio funcional
- **WHEN** o usuário acessa `/contato` e a submissão dos campos não está conectada a processamento real
- **THEN** a página informa esse estado de forma explícita ou substitui a ação principal por um canal funcional como e-mail ou outro contato oficial

#### Scenario: Contato com tratamento ativo aponta política de privacidade
- **WHEN** a página `/contato` processa dados pessoais enviados pelo visitante
- **THEN** a página exibe aviso resumido sobre finalidade do contato e link para a política de privacidade próximo da ação principal