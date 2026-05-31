## ADDED Requirements

### Requirement: Conteudo publico sem referencias pessoais
O sistema SHALL apresentar conteudo institucional nas rotas publicas sem citar nomes de pastores, lideres ou outras pessoas especificas.

#### Scenario: Texto institucional sem nomes proprios de lideranca
- **WHEN** o usuario acessa as paginas publicas institucionais
- **THEN** o conteudo nao exibe referencias nominais a pessoas especificas de lideranca

### Requirement: Conteudo publico em portugues do Brasil
O sistema SHALL manter headings, chamadas, rotulos e textos institucionais em portugues do Brasil, sem termos em ingles no copy publico.

#### Scenario: Termos publicos sem palavras em ingles
- **WHEN** o usuario acessa qualquer rota publica
- **THEN** os textos institucionais visiveis nao contem palavras em ingles e mantem clareza em portugues do Brasil
