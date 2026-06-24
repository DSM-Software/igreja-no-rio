## 1. Reproduzir e diagnosticar

- [ ] 1.1 Subir o ambiente local (`docker compose up db minio -d` + `npm run dev`) e rodar `npm run seed`.
- [ ] 1.2 Logar com cada papel (`admin`, `editor`, `autor`) em `/admin` e abrir `/admin/collections/posts/create`; capturar screenshot do estado atual do campo `body`.
- [ ] 1.3 Confirmar via Playwright (`browser_take_screenshot`) o estado visual e anotar se o campo está renderizado para cada papel.

## 2. Helper de acesso a campos

- [x] 2.1 Em `src/access/contentAccess.ts`, adicionar e exportar `canEditPostsField`, retornando `true` para usuários com papel `admin`, `editor` ou `autor`.
- [x] 2.2 Adicionar testes de tipo/uso simples (TypeScript) garantindo a assinatura compatível com `FieldAccess` do Payload.

## 3. Aplicar acesso explícito por campo em Posts

- [x] 3.1 Em `src/collections/Posts.ts`, declarar `access: { read, update, create }` usando `canEditPostsField` no campo `body`.
- [x] 3.2 Estender o mesmo `access` aos demais campos editáveis (`title`, `slug`, `category`, `serie`, `serieParte`, `author`, `date`, `coverImage`, `coverColor`, `excerpt`, `tags`, `published`).
- [x] 3.3 Manter o campo `owner` (sidebar, `readOnly`) sem alteração.
- [ ] 3.4 Rodar `npm run generate:types` para atualizar `src/payload-types.ts`.

## 4. Seed determinístico para os três papéis

- [x] 4.1 Em `src/scripts/seed.ts`, garantir upsert por e-mail de `admin@igrejanorio.local`, `editor@igrejanorio.local` e `autor@igrejanorio.local` com os papéis correspondentes.
- [x] 4.2 Garantir criação (idempotente) de pelo menos um post com `owner = autor` para viabilizar testes de edição.
- [x] 4.3 Ler senhas a partir de envs `SEED_*_PASSWORD` (com fallback `change-me-now` em dev) e abortar se `NODE_ENV=production` sem envs definidas.
- [x] 4.4 Documentar em `CLAUDE.md` (seção de seed) os novos usuários e como sobrescrever senhas via env.

## 5. Cobertura E2E por papel

- [x] 5.1 Em `tests/e2e/admin-access.spec.ts`, criar um helper `loginAs(role)` que faz login com o usuário do papel respectivo.
- [x] 5.2 Adicionar `describe('Visibilidade do campo body por papel', ...)` parametrizado para `admin`, `editor`, `autor`.
- [x] 5.3 Em cada cenário: navegar para `/admin/collections/posts/create`, asserir que o label "Corpo do post" está visível e que o editor Lexical é editável (typing test simples).
- [x] 5.4 Em cada cenário: localizar o post do `autor` seedado, navegar para `/admin/collections/posts/<id>` (para o papel `autor` apenas esse post), e repetir as asserções.
- [x] 5.5 Adicionar asserção secundária: verificar visibilidade dos campos `title`, `category`, `author`, `date`, `excerpt`, `published` para os três papéis no create.

## 6. Documentar deploy/cache

- [x] 6.1 Em `CLAUDE.md`, na seção "Before deploying to production", adicionar passo "rebuildar o admin (`npm run build`) e invalidar cache do bundle em CDN/Nginx para os arquivos de `/admin`".
- [x] 6.2 Acrescentar no `README.md` (ou em `openspec/changes/ensure-post-body-visible-to-all-editors/`) um runbook curto para o caso "usuário não vê campo novo após deploy" (passos: `Cmd+Shift+R`, verificar `Cache-Control` do Nginx, conferir tag da imagem em produção).

## 7. Validação

- [ ] 7.1 Rodar `npm run lint`.
- [ ] 7.2 Rodar `npm run build`.
- [ ] 7.3 Rodar `npm run test:e2e -- tests/e2e/admin-access.spec.ts`.
- [ ] 7.4 Rodar `npm run test:e2e -- tests/e2e/public-routes.spec.ts` para confirmar que não há regressão na renderização pública dos posts.
- [ ] 7.5 Smoke test manual no ambiente local: login com cada papel, criar um post de teste, editar um post existente, verificar que o `body` salva corretamente.

## 8. Encerramento

- [ ] 8.1 Atualizar `openspec/specs/admin-access/spec.md` aplicando o delta (via `/opsx:sync` ou `openspec archive`) após merge.
- [ ] 8.2 Abrir follow-up para avaliar a mesma cobertura em `Downloads` e `Events`.
