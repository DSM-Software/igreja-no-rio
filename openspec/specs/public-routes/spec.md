## Purpose

Specifies that all public-facing routes load without errors, that header and footer are consistently present, and that the header responds correctly to scroll state and displays the appropriate logo variant.

## Requirements

### Requirement: Todas as rotas públicas carregam sem erro
O sistema SHALL carregar cada rota pública retornando HTTP 200 e renderizando o header e footer da Igreja no Rio com copy institucional em portugues do Brasil.

#### Scenario: Home page carrega
- **WHEN** o usuário acessa `http://localhost:3000/`
- **THEN** a página retorna status 200, o `<title>` contém "Igreja no Rio" e o logo está visível no header

#### Scenario: Quem Somos carrega
- **WHEN** o usuário acessa `/quem-somos`
- **THEN** a página retorna status 200 e exibe conteúdo institucional sem referências nominais a pessoas específicas

#### Scenario: Cultos carrega com reunião geral explícita
- **WHEN** o usuário acessa `/cultos`
- **THEN** a página retorna status 200 e informa que a única reunião geral ocorre no domingo às 10h

#### Scenario: Grupos caseiros com descrição correta
- **WHEN** o usuário acessa a seção de grupos caseiros nas rotas públicas
- **THEN** o texto informa que são reuniões em casas, espalhadas pela cidade, sem data e hora rígidas em local único

#### Scenario: Blog carrega
- **WHEN** o usuário acessa `/blog`
- **THEN** a página retorna status 200 e exibe o heading "Devocionais e Estudos"

#### Scenario: Downloads carrega
- **WHEN** o usuário acessa `/downloads`
- **THEN** a página retorna status 200 e exibe o heading "Downloads"

#### Scenario: Contato carrega
- **WHEN** o usuário acessa `/contato`
- **THEN** a página retorna status 200, exibe informações de endereço, e-mail e canais de contato, e NÃO exibe a seção "Próximos eventos"

### Requirement: Header e footer presentes em todas as páginas
O sistema SHALL exibir o header de navegação e o footer em todas as rotas públicas, com navegação previsível e composição consistente em desktop e mobile.

#### Scenario: Header está presente
- **WHEN** o usuário carrega qualquer rota pública
- **THEN** o elemento `header[role="banner"]` existe no DOM e contém links de navegação institucional visíveis e acionáveis

#### Scenario: Footer está presente
- **WHEN** o usuário carrega qualquer rota pública
- **THEN** o elemento `footer[role="contentinfo"]` existe no DOM e contém o texto "Igreja no Rio"

#### Scenario: Navegação desktop não disputa espaço com menu mobile
- **WHEN** o usuário acessa uma rota pública em viewport desktop
- **THEN** os links principais de navegação ficam visíveis no header e o menu mobile não aparece aberto nem sobreposto

#### Scenario: Navegação mobile abre e fecha sem duplicação visual
- **WHEN** o usuário acessa uma rota pública em viewport mobile e interage com o botão de menu
- **THEN** a navegação mobile abre como superfície única de navegação, exibe os links institucionais e volta a fechar após a navegação

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

### Requirement: Rota /agenda acessível como rota pública
O sistema SHALL incluir `/agenda` no conjunto de rotas públicas do site, com header e footer presentes, e o item "Agenda" ativo no menu de navegação.

#### Scenario: /agenda carrega sem erro
- **WHEN** o usuário acessa `/agenda`
- **THEN** a página retorna status 200, o header e o footer estão presentes

#### Scenario: Item "Agenda" ativo no menu ao acessar /agenda
- **WHEN** o usuário está na rota `/agenda`
- **THEN** o link "Agenda" no header possui a classe `active`

#### Scenario: /agenda incluída no sitemap
- **WHEN** o crawler acessa `/sitemap.xml`
- **THEN** a URL `/agenda` está presente no sitemap
