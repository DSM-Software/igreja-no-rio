## Purpose

Specifies the behavior of the downloads page, including grouping of materials by category, correct icon display per material type, and the download button and metadata visibility.

## Requirements

### Requirement: Downloads listados e agrupados por categoria
O sistema SHALL exibir os materiais de download agrupados em seções por categoria (Pregações, Estudos, Grupos Caseiros, Devocionais).

#### Scenario: Seções de categoria visíveis (com seed)
- **WHEN** o usuário acessa `/downloads` e o banco tem downloads cadastrados
- **THEN** pelo menos um `.download-card` é exibido e existe um heading `<h2>` com o nome de uma categoria

#### Scenario: Estado vazio
- **WHEN** o usuário acessa `/downloads` sem downloads no banco
- **THEN** a página exibe "Nenhum material disponível ainda"

### Requirement: Ícone correto por tipo de material
O sistema SHALL exibir o ícone e cor corretos para cada tipo: `audio` (turquesa), `pdf` (vermelho), `slides` (azul).

#### Scenario: Ícone de áudio exibido
- **WHEN** existe um download do tipo `audio`
- **THEN** o `.download-card` correspondente contém o elemento `.download-icon-audio`

#### Scenario: Ícone de PDF exibido
- **WHEN** existe um download do tipo `pdf`
- **THEN** o `.download-card` correspondente contém o elemento `.download-icon-pdf`

### Requirement: Botão de download abre arquivo ou link externo
O sistema SHALL exibir botão "Baixar" nos itens que possuem `file` (upload) ou `externalUrl` e omitir o botão nos que não têm nenhum dos dois.

#### Scenario: Botão presente quando há URL
- **WHEN** um download tem `externalUrl` ou arquivo enviado
- **THEN** o card correspondente exibe um link com texto "Baixar" com atributo `href` não vazio

#### Scenario: Informações de metadados visíveis
- **WHEN** o usuário visualiza um card de download com pregador e tamanho cadastrados
- **THEN** o card exibe o nome do pregador e o tamanho/duração (ex: "38 min")
