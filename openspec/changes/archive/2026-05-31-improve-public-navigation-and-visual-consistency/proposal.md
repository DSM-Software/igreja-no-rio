## Why

Algumas páginas públicas ainda apresentam desalinhamentos, elementos duplicados, variações visuais incoerentes e problemas de navegação entre mobile e desktop. Isso compromete a percepção de qualidade do site institucional e dificulta encontrar conteúdo com previsibilidade em qualquer viewport.

## What Changes

- Padronizar o comportamento visual dos componentes compartilhados das rotas públicas para eliminar desalinhamentos, duplicações e variações inconsistentes entre páginas.
- Garantir que header, navegação principal, seções de conteúdo e footer mantenham hierarquia visual, espaçamento e alinhamento coerentes em mobile e desktop.
- Corrigir elementos públicos incorretos, redundantes ou visualmente conflitantes para que cada página institucional tenha conteúdo e navegação claros.
- Adicionar cobertura de requisitos para consistência visual responsiva e integridade dos elementos recorrentes das páginas públicas.

## Capabilities

### New Capabilities
- `public-visual-consistency`: Define requisitos para alinhamento, responsividade, ausência de duplicações visuais e consistência de componentes compartilhados nas rotas públicas.

### Modified Capabilities
- `public-routes`: Ajustar requisitos das rotas públicas para incluir navegação mais previsível, elementos compartilhados corretos e apresentação consistente entre páginas.
- `site-copy-guidelines`: Ajustar requisitos para impedir conteúdo público redundante, contraditório ou visualmente duplicado em páginas institucionais.

## Impact

- Código das rotas públicas em `src/app` e componentes compartilhados em `src/components`.
- Testes de interface e regressão visual em `tests/e2e`.
- Conteúdo institucional e composição de seções consumidas pelas páginas públicas.