## MODIFIED Requirements

### Requirement: Layout público mantém alinhamento e espaçamento consistentes
O sistema SHALL exibir as rotas públicas com alinhamento horizontal, espaçamento vertical e largura de conteúdo coerentes entre header, hero, seções principais e footer em mobile e desktop, inclusive durante e após a migração dos estilos para Tailwind.

#### Scenario: Estrutura principal usa o mesmo eixo de conteúdo
- **WHEN** o usuário acessa uma rota pública em desktop
- **THEN** header, conteúdo principal e footer compartilham a mesma largura útil de container e não apresentam blocos deslocados visualmente para fora desse eixo

#### Scenario: Seções permanecem legíveis em mobile
- **WHEN** o usuário acessa uma rota pública com viewport mobile
- **THEN** cards, grids, blocos de contato e seções institucionais se reorganizam sem sobreposição, corte horizontal ou desalinhamento perceptível

#### Scenario: Migração para utilitários não altera a hierarquia visual esperada
- **WHEN** uma página pública migrada para Tailwind é comparada ao comportamento visual definido da seção
- **THEN** títulos, espaçamentos entre blocos e áreas de destaque mantêm hierarquia e legibilidade equivalentes

### Requirement: Componentes recorrentes não aparecem duplicados ou conflitantes
O sistema SHALL evitar elementos recorrentes duplicados, contraditórios ou concorrentes na mesma superfície pública, incluindo casos em que estilos anteriores e classes utilitárias coexistem temporariamente durante a migração.

#### Scenario: Navegação primária não duplica no mesmo viewport
- **WHEN** o usuário acessa uma rota pública em desktop ou mobile
- **THEN** existe apenas uma superfície principal de navegação visível para aquele viewport, sem menus concorrentes exibidos simultaneamente

#### Scenario: Blocos institucionais não repetem a mesma informação sem propósito
- **WHEN** o usuário percorre uma página pública
- **THEN** headings, CTAs e blocos institucionais recorrentes aparecem uma única vez por seção, sem repetição visual que gere ambiguidade

#### Scenario: Conflitos de estilo legado e utilitário são evitados
- **WHEN** uma seção pública usa classes utilitárias novas junto a estilos remanescentes em fase de transição
- **THEN** não ocorre duplicação de estados visuais conflitantes que prejudiquem percepção de prioridade ou navegação