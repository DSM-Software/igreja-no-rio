## Context

O frontend atual usa uma combinação de estilos globais e regras locais, o que aumenta acoplamento e dificulta manutenção. A mudança propõe consolidar o estilo em Tailwind CSS na versão estável mais recente, preservando a experiência visual existente nas rotas públicas e reduzindo regressões em futuras alterações.

## Goals / Non-Goals

**Goals:**
- Adotar Tailwind CSS como sistema principal de estilos no frontend público.
- Preservar layout, responsividade e hierarquia visual já percebidos pelos usuários.
- Centralizar tokens de design (cores, espaçamentos, tipografia, raios e sombras) na configuração do tema.
- Reduzir CSS legado para uma base mínima e previsível.

**Non-Goals:**
- Redesenhar identidade visual, branding ou conteúdo textual.
- Alterar fluxo funcional das páginas públicas.
- Migrar telas administrativas do Payload no mesmo ciclo inicial.

## Decisions

### 1. Migração incremental por rota e componentes compartilhados
A migração será feita por fatias pequenas (layout/base, componentes compartilhados, páginas), com validação contínua de paridade visual.

Alternativa considerada: Big-bang em todo frontend de uma vez. Rejeitada por alto risco de regressão e rollback mais difícil.

### 2. Tokenização no tema Tailwind como fonte única de verdade
As decisões de cor, espaçamento, tipografia e efeitos visuais ficarão no tema Tailwind para reduzir divergência entre páginas.

Alternativa considerada: manter tokens distribuídos em CSS + utilitários. Rejeitada por manter inconsistência estrutural.

### 3. CSS global mínimo e utilitários como padrão
`globals.css` será mantido apenas para reset/base e casos realmente não representáveis por utilitários.

Alternativa considerada: manter blocos extensos de CSS customizado coexistindo com Tailwind. Rejeitada por perpetuar dívida técnica.

### 4. Critérios explícitos de paridade visual e responsiva
A migração seguirá checklist de validação em páginas públicas-chave para garantir alinhamento de containers, espaçamento entre seções, legibilidade e navegação sem conflitos.

Alternativa considerada: validação apenas manual ad-hoc. Rejeitada por baixa repetibilidade.

## Risks / Trade-offs

- [Risco] Divergência visual em breakpoints intermediários -> Mitigação: validação por viewport (mobile, tablet, desktop) nas rotas públicas prioritárias.
- [Risco] Crescimento de classes utilitárias duplicadas -> Mitigação: padronizar padrões de composição e extrair componentes utilitários recorrentes.
- [Trade-off] Investimento inicial de refatoração de estilos -> Mitigação: redução de custo de manutenção no médio prazo.
- [Risco] Dependência de versão em atualização futura do Tailwind -> Mitigação: travar versão estável atual no lockfile e documentar estratégia de upgrade.

## Migration Plan

1. Configurar Tailwind CSS na versão estável mais recente compatível com o stack atual.
2. Definir tokens de design no tema e mapear equivalências com estilos existentes.
3. Migrar layout base e componentes compartilhados de navegação/estrutura.
4. Migrar páginas públicas por prioridade, removendo CSS legado equivalente.
5. Executar validações visuais e responsivas, ajustando regressões.
6. Limpar estilos não utilizados e documentar convenções para novas entregas.

Rollback:
- Reversão por commits/fatias de migração, mantendo funcionalidade atual em caso de regressão visual crítica.

## Open Questions

- Quais páginas públicas terão cobertura automatizada de regressão visual no primeiro ciclo?
- A migração da área administrativa para o mesmo padrão de tokens será tratada em change separada?