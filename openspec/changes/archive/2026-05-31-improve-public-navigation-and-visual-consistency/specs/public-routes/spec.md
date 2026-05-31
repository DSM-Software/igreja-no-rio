## MODIFIED Requirements

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