## Purpose

Establishes content guidelines for public pages to ensure institutional Portuguese copy without personal references or English terms.

## Requirements

### Requirement: Conteúdo público sem referências pessoais
O sistema SHALL apresentar conteúdo institucional nas rotas públicas sem citar nomes de pastores, líderes ou outras pessoas específicas.

#### Scenario: Texto institucional sem nomes próprios de liderança
- **WHEN** o usuário acessa as páginas públicas institucionais
- **THEN** o conteúdo não exibe referências nominais a pessoas específicas de liderança

### Requirement: Conteúdo público em português do Brasil
O sistema SHALL manter headings, chamadas, rótulos e textos institucionais em português do Brasil, sem termos em inglês no copy público.

#### Scenario: Termos públicos sem palavras em inglês
- **WHEN** o usuário acessa qualquer rota pública
- **THEN** os textos institucionais visíveis não contêm palavras em inglês e mantêm clareza em português do Brasil
