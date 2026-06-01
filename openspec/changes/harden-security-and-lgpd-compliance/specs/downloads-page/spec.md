## MODIFIED Requirements

### Requirement: Botão de download abre arquivo ou link externo
O sistema SHALL exibir botão "Baixar" apenas para itens que possuam arquivo enviado ou `externalUrl` validada com protocolo seguro permitido e SHALL omitir a ação quando o destino for inválido, vazio ou inseguro.

#### Scenario: Botão presente quando há URL segura
- **WHEN** um download tem `externalUrl` válida ou arquivo enviado
- **THEN** o card correspondente exibe um link com texto "Baixar" com atributo `href` não vazio

#### Scenario: Botão omitido para destino inseguro
- **WHEN** um download possui `externalUrl` com protocolo não permitido, valor malformado ou destino vazio
- **THEN** o card não exibe o botão "Baixar"

#### Scenario: Informações de metadados visíveis
- **WHEN** o usuário visualiza um card de download com pregador e tamanho cadastrados
- **THEN** o card exibe o nome do pregador e o tamanho/duração (ex: "38 min")