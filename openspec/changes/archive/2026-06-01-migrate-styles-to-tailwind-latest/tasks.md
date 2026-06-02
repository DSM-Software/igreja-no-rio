## 1. Configuração da base Tailwind

- [x] 1.1 Adicionar/atualizar dependências do Tailwind CSS para a versão estável mais recente compatível no projeto
- [x] 1.2 Configurar integração Tailwind no pipeline atual (incluindo arquivos de configuração e importação global)
- [x] 1.3 Definir tokens de design iniciais (cores, espaçamento, tipografia, raios e sombras) no tema Tailwind

## 2. Migração de layout e componentes compartilhados

- [x] 2.1 Migrar estilos de layout global para utilitários Tailwind, mantendo `globals.css` apenas para base/reset necessário
- [x] 2.2 Migrar componentes recorrentes de navegação e estrutura para classes utilitárias orientadas por tokens
- [x] 2.3 Remover estilos legados redundantes dos componentes já migrados

## 3. Migração das rotas públicas

- [x] 3.1 Migrar por prioridade as páginas públicas em `src/app/(frontend)` para Tailwind mantendo paridade visual
- [x] 3.2 Validar comportamento responsivo (mobile, tablet, desktop) em cada rota migrada e corrigir regressões
- [x] 3.3 Garantir ausência de conflitos entre classes utilitárias novas e estilos legados remanescentes

## 4. Validação e estabilização

- [x] 4.1 Executar checagens de lint/typecheck/build após a migração incremental
- [x] 4.2 Atualizar ou criar testes de regressão visual/responsiva para páginas públicas críticas
- [x] 4.3 Documentar convenções de uso de Tailwind e critérios para evitar reintrodução de CSS legado