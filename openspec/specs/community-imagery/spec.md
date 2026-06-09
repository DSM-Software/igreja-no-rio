# community-imagery

## Purpose

Definir como fotografias reais da comunidade são exibidas nas superfícies públicas (home e Quem Somos), garantindo legibilidade do texto sobre as imagens, fallbacks robustos, otimização de carregamento e acessibilidade.

## Requirements

### Requirement: Hero da home exibe fotografia da comunidade com texto legível
O sistema SHALL exibir o hero da página inicial com uma fotografia da comunidade como fundo full-bleed, sobreposta por um overlay (gradiente navy/teal) que garante contraste suficiente para que o título e o texto de chamada permaneçam legíveis em mobile e desktop.

#### Scenario: Hero renderiza com foto de fundo na home
- **WHEN** o usuário acessa a rota `/`
- **THEN** o hero apresenta uma imagem de fundo da comunidade renderizada via `next/image`, sem deslocar o eixo de conteúdo nem causar scroll horizontal

#### Scenario: Texto do hero permanece legível sobre a foto
- **WHEN** o hero da home é exibido em mobile e desktop
- **THEN** o título e o subtítulo aparecem sobre um overlay escuro/teal e mantêm contraste de leitura, sem que a foto reduza a legibilidade do texto

#### Scenario: Fallback quando a imagem não carrega
- **WHEN** a imagem de fundo do hero falha ao carregar
- **THEN** o hero exibe o fundo de degradê navy existente como fallback, mantendo o texto visível e a seção íntegra

### Requirement: Banda de CTA final da home usa foto de comunhão com overlay
O sistema SHALL exibir a banda de CTA final da home com uma fotografia de comunhão como fundo sob overlay escuro, espelhando a referência "Conte conosco!", preservando contraste dos textos e dos botões de ação.

#### Scenario: CTA final renderiza com foto e ações visíveis
- **WHEN** o usuário visualiza a banda de CTA ao final da home
- **THEN** a foto de fundo é exibida sob overlay e os botões/CTAs permanecem visíveis e clicáveis com contraste adequado

#### Scenario: CTA final mantém layout em mobile
- **WHEN** a banda de CTA é exibida em viewport mobile
- **THEN** texto e botões se reorganizam sem sobreposição, corte horizontal ou perda de legibilidade sobre a foto

### Requirement: Seção institucional de Quem Somos exibe foto real da comunidade
O sistema SHALL substituir o placeholder de degradê da seção "Missão" em `/quem-somos` por uma fotografia real de adoração/comunidade, mantendo a proporção e o alinhamento do grid existente.

#### Scenario: Placeholder de Quem Somos é substituído por foto
- **WHEN** o usuário acessa a rota `/quem-somos`
- **THEN** a coluna visual da seção Missão exibe uma fotografia da comunidade no lugar do bloco de degradê, sem quebrar o alinhamento do grid de duas colunas

### Requirement: Imagens da comunidade são otimizadas e acessíveis
O sistema SHALL servir as fotografias da comunidade de forma otimizada (dimensionamento responsivo e carregamento adequado) e SHALL fornecer texto alternativo descritivo para cada imagem de conteúdo.

#### Scenario: Imagens possuem texto alternativo
- **WHEN** uma fotografia da comunidade é renderizada em uma superfície pública
- **THEN** ela possui atributo `alt` descritivo, exceto quando puramente decorativa (fundo), caso em que é marcada como decorativa

#### Scenario: Imagens não degradam o desempenho perceptível da página
- **WHEN** uma página pública com fotografia é carregada
- **THEN** as imagens usam `next/image` com `sizes` responsivos e não causam regressão visível de layout (CLS) durante o carregamento
