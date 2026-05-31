## MODIFIED Requirements

### Requirement: Conteúdo público em português do Brasil
O sistema SHALL manter headings, chamadas, rótulos e textos institucionais em português do Brasil, sem termos em inglês, sem blocos duplicados e sem mensagens públicas contraditórias.

#### Scenario: Termos públicos sem palavras em inglês
- **WHEN** o usuário acessa qualquer rota pública
- **THEN** os textos institucionais visíveis não contêm palavras em inglês e mantêm clareza em português do Brasil

#### Scenario: Copy institucional não se repete de forma redundante
- **WHEN** o usuário acessa uma página pública institucional
- **THEN** headings, descrições e chamadas visíveis não repetem a mesma mensagem de forma redundante na mesma seção ou faixa visual

#### Scenario: Copy institucional não conflita com a navegação exibida
- **WHEN** o usuário acessa qualquer rota pública
- **THEN** os rótulos de navegação, CTAs e headings usam nomenclatura coerente entre si e não apresentam termos incorretos ou divergentes para o mesmo destino