## Context

As rotas públicas compartilham header, footer, estilos globais e padrões visuais definidos principalmente em `src/app/(frontend)/layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx` e `src/app/(frontend)/globals.css`. O repositório já possui testes Playwright para smoke, presença de header/footer, troca de logo, estado do header em scroll e abertura do menu mobile, mas ainda não cobre alinhamento visual consistente, ausência de elementos duplicados e previsibilidade de navegação em diferentes viewports.

O pedido é transversal porque envolve composição de layout, comportamento responsivo e revisão de conteúdo renderizado nas páginas públicas. O desenho precisa preservar a identidade visual existente e aproveitar os componentes compartilhados em vez de corrigir cada página com ajustes isolados.

## Goals / Non-Goals

**Goals:**
- Centralizar a correção de inconsistências visuais nas primitivas compartilhadas do frontend público.
- Garantir que header, footer, CTAs e seções principais tenham alinhamento, espaçamento e hierarquia coerentes em mobile e desktop.
- Eliminar duplicações visuais e elementos incorretos nas páginas públicas sem criar uma segunda linguagem de layout.
- Expandir a cobertura de testes para regressões de navegação e integridade visual observável.

**Non-Goals:**
- Redesenhar a identidade visual da marca ou substituir a tipografia atual.
- Alterar fluxo editorial do blog, estrutura do CMS ou requisitos administrativos.
- Introduzir dependências novas de UI ou um framework de design system completo.

## Decisions

### Decisão: Corrigir a experiência pública a partir dos componentes compartilhados
O trabalho deve priorizar `Header`, `Footer`, `globals.css` e wrappers de layout/section antes de ajustes pontuais por página. Isso reduz divergência futura e evita corrigir o mesmo problema em vários arquivos.

Alternativas consideradas:
- Ajustar página por página: rejeitado porque tende a perpetuar desalinhamentos e estilos duplicados.
- Reescrever o frontend público inteiro: rejeitado porque é desproporcional ao problema atual.

### Decisão: Tratar duplicação visual como requisito observável
Elementos repetidos, concorrentes ou contraditórios nas páginas públicas serão tratados como defeitos de requisito e cobertos por spec/teste, não apenas como detalhes estéticos. Isso inclui navegação duplicada no mesmo viewport, CTAs redundantes em uma mesma superfície e blocos institucionais repetidos sem propósito.

Alternativas consideradas:
- Deixar duplicação visual apenas para revisão manual: rejeitado porque não protege contra regressão.

### Decisão: Expandir os testes Playwright existentes em vez de criar uma suíte paralela
Os testes em `tests/e2e/public-routes.spec.ts` já exercitam o caminho crítico das rotas públicas. A estratégia deve ampliar essa suíte com asserts de consistência responsiva, presença de uma navegação primária por viewport e ausência de duplicações observáveis.

Alternativas consideradas:
- Criar testes visuais snapshot-heavy para todas as páginas: rejeitado por custo alto de manutenção neste momento.

### Decisão: Manter o design reference como referência, não como fonte literal
O material em `design_reference/` deve orientar composição e intenção visual, mas a implementação precisa respeitar o código atual em Next.js/Payload e os requisitos já publicados em OpenSpec.

Alternativas consideradas:
- Copiar o design reference integralmente: rejeitado porque pode reintroduzir divergências com o conteúdo e a arquitetura atuais.

## Risks / Trade-offs

- [Risco] Correções globais em `globals.css` podem deslocar componentes de páginas que hoje dependem de estilos implícitos. → Mitigação: validar desktop e mobile nas rotas públicas críticas com Playwright.
- [Risco] Remover duplicações sem critério pode apagar conteúdo legítimo repetido por contexto. → Mitigação: restringir a remoção a elementos redundantes na mesma superfície ou viewport.
- [Risco] Aumentar asserts de UI pode introduzir flakiness se os seletores forem frágeis. → Mitigação: usar roles, headings e classes estruturais já estáveis no layout compartilhado.