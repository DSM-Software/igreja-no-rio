## Purpose

Specifies the navigation and progressive-disclosure behavior within the downloads page: a sticky category nav bar for quick anchoring and a "Ver mais" expansion mechanism that limits each category section to 6 items initially.

## Requirements

### Requirement: Barra de navegação sticky entre categorias
O sistema SHALL exibir uma barra horizontal sticky com um link de âncora por categoria disponível, posicionada abaixo do hero e acima da lista de categorias.

#### Scenario: Links de categoria visíveis
- **WHEN** o usuário acessa `/downloads` com downloads de múltiplas categorias cadastradas
- **THEN** a barra de navegação exibe um item clicável por categoria existente, na mesma ordem que as seções

#### Scenario: Âncora leva até a seção correta
- **WHEN** o usuário clica em um link de categoria na barra de navegação
- **THEN** a página faz scroll suave até a seção correspondente, com o heading da seção visível (não coberto pelo header ou pela barra)

#### Scenario: Barra não exibida com zero categorias
- **WHEN** não há downloads cadastrados
- **THEN** a barra de navegação não é renderizada

### Requirement: Expansão progressiva de itens por categoria ("Ver mais")
O sistema SHALL exibir no máximo 6 itens inicialmente em cada seção de categoria. Quando a categoria tiver mais de 6 itens, SHALL exibir um botão "Ver mais" que revela os itens restantes inline, sem navegação ou recarregamento de página.

#### Scenario: Apenas 6 itens exibidos inicialmente quando categoria tem mais
- **WHEN** uma categoria tem mais de 6 itens e o usuário acessa a página
- **THEN** apenas os primeiros 6 itens daquela categoria são visíveis e o restante está oculto

#### Scenario: Botão "Ver mais" visível quando há itens ocultos
- **WHEN** uma categoria tem mais de 6 itens
- **THEN** um botão "Ver mais" é exibido abaixo dos itens visíveis, indicando a quantidade total de itens

#### Scenario: Expansão ao clicar em "Ver mais"
- **WHEN** o usuário clica no botão "Ver mais" de uma categoria
- **THEN** todos os itens daquela categoria são exibidos e o botão "Ver mais" desaparece (ou muda para "Ver menos")

#### Scenario: Sem botão quando categoria tem até 6 itens
- **WHEN** uma categoria tem 6 ou menos itens
- **THEN** todos os itens são exibidos e nenhum botão "Ver mais" é renderizado
