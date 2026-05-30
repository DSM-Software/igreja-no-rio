## ADDED Requirements

### Requirement: Todas as rotas públicas carregam sem erro
O sistema SHALL carregar cada rota pública retornando HTTP 200 e renderizando o header e footer da Igreja no Rio.

#### Scenario: Home page carrega
- **WHEN** o usuário acessa `http://localhost:3000/`
- **THEN** a página retorna status 200, o `<title>` contém "Igreja no Rio" e o logo está visível no header

#### Scenario: Quem Somos carrega
- **WHEN** o usuário acessa `/quem-somos`
- **THEN** a página retorna status 200 e exibe o heading "Somos uma família plantada em Santíssimo"

#### Scenario: Cultos carrega
- **WHEN** o usuário acessa `/cultos`
- **THEN** a página retorna status 200 e exibe horários dos cultos (texto "10h00" ou "Domingo")

#### Scenario: Blog carrega
- **WHEN** o usuário acessa `/blog`
- **THEN** a página retorna status 200 e exibe o heading "Devocionais e Estudos"

#### Scenario: Downloads carrega
- **WHEN** o usuário acessa `/downloads`
- **THEN** a página retorna status 200 e exibe o heading "Downloads"

#### Scenario: Contato carrega
- **WHEN** o usuário acessa `/contato`
- **THEN** a página retorna status 200 e exibe o endereço "Rua Ivan Pessoa, 341"

### Requirement: Header e footer presentes em todas as páginas
O sistema SHALL exibir o header de navegação e o footer em todas as rotas públicas.

#### Scenario: Header está presente
- **WHEN** o usuário carrega qualquer rota pública
- **THEN** o elemento `header[role="banner"]` existe no DOM e contém links de navegação (Início, Blog, Contato)

#### Scenario: Footer está presente
- **WHEN** o usuário carrega qualquer rota pública
- **THEN** o elemento `footer[role="contentinfo"]` existe no DOM e contém o texto "Igreja no Rio"

### Requirement: Header se torna sólido ao rolar na home
O sistema SHALL exibir o header transparente no topo da home e sólido após o usuário rolar a página.

#### Scenario: Header transparente no topo
- **WHEN** o usuário acessa `/` sem rolar
- **THEN** o header possui a classe `transparent`

#### Scenario: Header sólido após scroll
- **WHEN** o usuário rola 100px para baixo na home
- **THEN** o header possui a classe `solid`

### Requirement: Logo correto exibido conforme contexto
O sistema SHALL exibir `logo-IR-white.svg` no hero escuro e `logo-IR-dark.svg` no header sólido.

#### Scenario: Logo branco no hero da home (antes de rolar)
- **WHEN** o usuário acessa `/` e o header está transparente
- **THEN** a imagem do logo tem `src` contendo `logo-IR-white.svg`

#### Scenario: Logo escuro em página interna
- **WHEN** o usuário acessa `/blog`
- **THEN** a imagem do logo tem `src` contendo `logo-IR-dark.svg`
