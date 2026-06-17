## ADDED Requirements

### Requirement: Hero da home usa saudação "Seja bem-vindo"
O sistema SHALL exibir, como `<h1>` do hero da home (`/`), a saudação "Seja bem-vindo." em substituição a qualquer redação anterior baseada em "encontrado". O sistema SHALL preservar a hierarquia visual original do hero (tipografia display, peso extrabold, contraste alto sobre o fundo escuro).

#### Scenario: Heading do hero exibe "Seja bem-vindo"
- **WHEN** o usuário acessa `/`
- **THEN** o `<h1>` visível do hero contém a frase "Seja bem-vindo" e não contém a palavra "encontrado"

#### Scenario: Hierarquia visual preservada
- **WHEN** o hero da home é renderizado em mobile e desktop
- **THEN** o `<h1>` mantém aparência de heading principal (display, peso forte, contraste legível sobre o fundo da foto/overlay)

### Requirement: Seção "Missão" em /quem-somos comunica identidade de família com referência a Romanos 8:29
O sistema SHALL exibir, sob o heading "Para que todos conheçam e amem Jesus" da rota `/quem-somos`, um corpo textual composto por (a) uma afirmação de pertencimento à igreja na cidade do Rio de Janeiro com a frase "Não vamos à igreja — somos a igreja", (b) uma declaração sobre o propósito eterno de Deus de formar uma família de muitos filhos conforme à imagem de Jesus, e (c) uma citação de Romanos 8:29 visualmente identificável como citação bíblica e atribuída ao versículo.

#### Scenario: Corpo da Missão contém a afirmação de pertencimento
- **WHEN** o usuário acessa `/quem-somos`
- **THEN** o corpo da seção Missão contém a frase "Não vamos à igreja — somos a igreja"

#### Scenario: Corpo da Missão menciona família e propósito eterno
- **WHEN** o usuário acessa `/quem-somos`
- **THEN** o corpo da seção Missão contém referência ao propósito eterno de Deus e à formação de uma família de muitos filhos conformes à imagem de Jesus

#### Scenario: Citação de Romanos 8:29 visível e atribuída
- **WHEN** o usuário acessa `/quem-somos`
- **THEN** a seção Missão exibe a citação de Romanos 8:29 com formatação de citação (elemento `<blockquote>`) e atribuição visível "Romanos 8:29"
