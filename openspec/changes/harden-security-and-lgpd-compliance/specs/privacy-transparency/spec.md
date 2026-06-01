## ADDED Requirements

### Requirement: Política de privacidade pública é acessível
O sistema SHALL publicar uma política de privacidade em rota pública e SHALL torná-la acessível a partir da navegação recorrente do site.

#### Scenario: Link de privacidade aparece na navegação recorrente
- **WHEN** o usuário visualiza o footer ou outra navegação institucional recorrente
- **THEN** existe um link visível para a política de privacidade

#### Scenario: Página de privacidade identifica tratamento de dados
- **WHEN** o usuário acessa a política de privacidade
- **THEN** a página informa controlador, canal de contato, categorias de dados tratadas, finalidade, base legal ou fundamento aplicável, retenção e direitos do titular em linguagem clara

### Requirement: Superfícies de contato informam o tratamento de dados de forma honesta
O sistema SHALL informar claramente se dados pessoais submetidos em superfícies de contato são enviados, armazenados ou apenas exibidos como interface sem processamento ativo.

#### Scenario: Formulário sem backend não induz coleta implícita
- **WHEN** uma página pública exibe campos de contato sem envio real para backend ou e-mail
- **THEN** a interface informa explicitamente que a submissão não está ativa ou substitui a ação por um canal funcional de contato

#### Scenario: Formulário ativo explica finalidade e canal de privacidade
- **WHEN** uma superfície pública envia dados pessoais para processamento
- **THEN** a interface informa finalidade do contato, canal para exercício de direitos e referência para a política de privacidade antes da submissão

### Requirement: Navegação jurídica mínima é previsível
O sistema SHALL disponibilizar documentação jurídica mínima compatível com a operação atual do site sem exigir que o usuário adivinhe onde encontrar essas informações.

#### Scenario: Usuário encontra informações legais sem sair do fluxo principal
- **WHEN** o usuário percorre as rotas públicas principais
- **THEN** ele encontra acesso previsível à política de privacidade e às informações institucionais de contato sem precisar recorrer ao painel admin ou documentação externa