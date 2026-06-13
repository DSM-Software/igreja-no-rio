## Context

O Payload CMS 3.x suporta dois níveis de controle de acesso:
1. **Coleção** (`access.read`, `access.create`, `access.update`, `access.delete`).
2. **Campo** (`field.access.read`, `field.access.update`, `field.access.create`).

Hoje, em `src/collections/Posts.ts`, o acesso é definido apenas no nível de coleção (`canReadPublishedOrOwn`, `canMutateOwnOrElevated`, `Boolean(req.user)`). O campo `body` (richText/Lexical) foi adicionado recentemente (commit `2e0e615`, refinado em cima do commit `0cb2535`) **sem** `access` no nível de campo — o que significa que o Payload aplica o default (visível e editável conforme acesso da coleção).

Mesmo assim, há relatos de que **alguns** usuários autenticados não veem o campo no formulário. As causas plausíveis são:
- **Cache do bundle do admin** servido por CDN/Nginx — usuários com o JS antigo não enxergam o campo novo.
- **Build de produção desatualizado** após a migração — `npm run build` não foi re-executado, ou a imagem Docker não foi promovida.
- **Possível ambiguidade futura**: ao depender apenas do default, qualquer mudança em acesso de coleção (ou introdução de um wrapper) pode silenciosamente ocultar o campo de um papel.

A solução combina **garantia explícita por campo** (defensiva) + **cobertura E2E por papel** (regressão) + **documentação de deploy** (cache busting do bundle).

## Goals / Non-Goals

**Goals:**
- Tornar a visibilidade do campo `body` (e dos demais campos editáveis) **explicitamente** verdadeira para `admin`, `editor` e `autor` no nível de campo.
- Cobrir, via Playwright, o formulário de criação e o de edição de posts para **cada** papel, confirmando que `body` está presente e é editável.
- Atualizar o seed para que exista pelo menos um usuário de cada papel + um post de propriedade do `autor`, viabilizando testes determinísticos.
- Documentar (no README/CLAUDE.md ou na pasta da change) o procedimento de rebuild/limpeza de cache do bundle do admin em produção.

**Non-Goals:**
- Mudar o modelo de papéis ou o esquema de propriedade (`owner`).
- Mudar o editor Lexical, suas features ou o schema do `body`.
- Tornar campos atualmente restritos (ex.: `owner` somente leitura no sidebar) visíveis para mais papéis.
- Migração de dados.

## Decisions

### Decision 1: Adicionar `access` explícito no nível de campo, não só na coleção

**Escolha**: nos campos editáveis de `Posts` (`title`, `slug`, `category`, `serie`, `serieParte`, `author`, `date`, `coverImage`, `coverColor`, `excerpt`, `body`, `tags`, `published`), declarar:

```ts
access: {
  read: ({ req }) => Boolean(req.user),
  update: ({ req }) => Boolean(req.user),
  create: ({ req }) => Boolean(req.user),
}
```

Encapsular em um helper compartilhado em `src/access/contentAccess.ts` (`canEditPostsField`) para evitar duplicação.

**Por que não confiar só no default?** O default herda do acesso de coleção, mas o problema relatado mostra que confiar no implícito gera dúvida operacional. Tornar explícito documenta a intenção e impede regressões silenciosas em refatorações futuras.

**Alternativa considerada**: deixar como está e atacar apenas cache de bundle. Rejeitada — não previne reincidência quando alguém alterar o acesso da coleção sem perceber o efeito em campos.

### Decision 2: Cobrir cada papel com teste E2E separado em `tests/e2e/admin-access.spec.ts`

**Escolha**: estender o spec já existente (`admin-access.spec.ts`) com três cenários parametrizados por papel (`admin`, `editor`, `autor`). Cada cenário:
1. Faz login com o usuário do papel.
2. Navega para `/admin/collections/posts/create`.
3. Verifica que existe o input do campo `body` (label “Corpo do post”) e que o campo é editável.
4. Navega para `/admin/collections/posts/<id>` (post seedado) e repete a verificação.

**Por que parametrizar e não criar um arquivo novo?** Já existe `admin-access.spec.ts` com testes de login. Manter coesão por capability.

**Alternativa considerada**: usar testes unitários do Payload para verificar `field.access`. Rejeitada — não cobre o cenário visual real (cache do admin, render do Lexical), que é o sintoma reportado.

### Decision 3: Seed determinístico para os três papéis + post do `autor`

**Escolha**: garantir em `src/scripts/seed.ts` que após `npm run seed` existem:
- `admin@igrejanorio.local` (role `admin`)
- `editor@igrejanorio.local` (role `editor`)
- `autor@igrejanorio.local` (role `autor`)
- Pelo menos um post com `owner = autor`.

Senhas via env (`SEED_ADMIN_PASSWORD`, etc.) com fallback para `change-me-now` em desenvolvimento, **falhando** se `NODE_ENV=production`.

**Por que precisa do post do `autor`?** Para o cenário de edição: o `autor` só pode editar posts que possui (`canMutateOwnOrElevated`). Sem isso o teste falha por 403.

### Decision 4: Documentar limpeza de cache do bundle do admin

**Escolha**: adicionar uma seção curta em `openspec/changes/ensure-post-body-visible-to-all-editors/` (e referenciar em `CLAUDE.md` na seção de deploy) listando:
1. Rodar `npm run build` antes de promover a imagem.
2. Garantir que o servidor (Nginx) não serve `index.html` do admin com `Cache-Control` agressivo.
3. Forçar reload do navegador (`Cmd+Shift+R`) após o deploy quando relatos surgirem.

**Por que não automatizar?** A causa-raiz visual (cache de bundle) é operacional; documentar e cobrir com E2E em CI é o melhor custo-benefício para esta change.

## Risks / Trade-offs

- **[Risco] Acoplamento crescente**: declarar `access` em cada campo aumenta a verbosidade do collection config.  
  **Mitigação**: extrair helper `canEditPostsField` em `contentAccess.ts`.

- **[Risco] Teste E2E flake**: o admin do Payload usa render do Lexical, que pode demorar.  
  **Mitigação**: usar `expect(locator).toBeVisible({ timeout: 10_000 })` e aguardar o seletor estável do label `Corpo do post`.

- **[Risco] Seed sobrescrevendo usuários reais em dev**: se o desenvolvedor já tem usuários com esses e-mails.  
  **Mitigação**: o seed deve usar `findOrCreate` (upsert por e-mail) e nunca alterar senha de usuário existente.

- **[Trade-off] Cobertura E2E aumenta tempo de CI**: ~3x os fluxos de admin.  
  **Trade-off aceito**: a feature é central ao fluxo editorial; vale o custo.

## Migration Plan

1. **Schema**: nenhum (o campo `body` já existe via `20260530_220505.ts`).
2. **Código**: PR único contendo:
   - Helper `canEditPostsField` em `src/access/contentAccess.ts`.
   - Atribuir `access` por campo em `src/collections/Posts.ts`.
   - Atualização de `src/scripts/seed.ts`.
   - Novos cenários em `tests/e2e/admin-access.spec.ts`.
3. **Tests**: rodar `npm run lint`, `npm run build`, `npm run test:e2e -- tests/e2e/admin-access.spec.ts`.
4. **Deploy**: `npm run migrate` (no-op para schema), publicar a nova imagem.
5. **Pós-deploy**: validar manualmente com um usuário `autor` em produção (cache hard-refresh).
6. **Rollback**: reverter o commit; o schema do banco não muda, então rollback é seguro e instantâneo.

## Open Questions

- Existe CDN/Cloudflare na frente do `/admin`? Se sim, configurar `Cache-Control` para arquivos hashed (`.js`, `.css`) versus `index.html`.
- Precisamos adicionar testes equivalentes para `Downloads` e `Events` (mesmos papéis)? Fora do escopo desta change, mas registrar como follow-up.
