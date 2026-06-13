## Why

O campo `body` (richText) foi adicionado recentemente em `src/collections/Posts.ts` mas alguns usuários autenticados que têm permissão para criar e/ou editar posts relatam que o campo não aparece no formulário do admin. Como autores e editores dependem desse campo para publicar o conteúdo principal do post, a invisibilidade intermitente bloqueia o fluxo editorial. O objetivo é garantir, de forma explícita e testada, que **todos** os papéis com permissão (`admin`, `editor`, `autor`) enxergam o campo `body` — e demais campos do post — tanto ao criar quanto ao editar.

## What Changes

- Tornar explícito que o campo `body` (e os demais campos editáveis de `Posts`) não tem restrição de leitura/atualização por papel: adicionar `access: { read, update, create }` retornando `true` para os papéis autorizados, evitando ambiguidade futura.
- Garantir que o bundle do admin servido em produção contém a versão com o campo `body` — documentar passo de deploy (rebuild do admin) e desativar respostas cacheadas do bundle quando aplicável.
- Adicionar cobertura E2E (Playwright) que faz login com cada papel (`admin`, `editor`, `autor`) e verifica que o campo `body` está visível no formulário de criação de posts em `/admin/collections/posts/create` e também no de edição (`/admin/collections/posts/<id>`).
- Atualizar o seed (`src/scripts/seed.ts`) para garantir que existe pelo menos um usuário de cada papel (`admin`, `editor`, `autor`) e ao menos um post de propriedade do `autor`, viabilizando os testes acima de forma determinística.

## Capabilities

### New Capabilities
<!-- Nenhuma capability nova: o comportamento desejado pertence ao admin-access existente. -->

### Modified Capabilities
- `admin-access`: estende a especificação para cobrir a visibilidade obrigatória de **todos** os campos do post (incluindo `body`) para os papéis com permissão de criar/editar conteúdo.

## Impact

- **Código afetado**:
  - `src/collections/Posts.ts` — adicionar `access` explícito por campo nos campos editáveis.
  - `src/access/contentAccess.ts` — possível helper `canEditPostsField` para reuso.
  - `src/scripts/seed.ts` — seed determinístico de usuários (`admin`, `editor`, `autor`) e de pelo menos um post atribuído ao `autor`.
  - `tests/e2e/admin-access.spec.ts` — novo bloco descrevendo a visibilidade do campo `body` por papel.
- **Especificações**: atualização do spec `admin-access` com novos requirements para visibilidade de campos do post por papel.
- **Banco/Migrações**: nenhum schema novo é necessário; o campo `body` já existe (`src/migrations/20260530_220505.ts`).
- **Deploy**: deploy padrão (Next + Payload no mesmo processo); reiterar `npm run build` em produção para garantir bundle atualizado do admin.
- **Risco**: baixo. Mudanças são aditivas (explicitar `access: true`) e cobertas por testes E2E.
