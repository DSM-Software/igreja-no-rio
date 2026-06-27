# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Institutional site for **Igreja no Rio** (Santíssimo, Rio de Janeiro). Next.js App Router + Payload CMS 3.x run in the same process — a single deploy. Public site at `/`, admin panel at `/admin`.

## Commands

```bash
# Development (requires DB + MinIO running first)
docker compose up db minio -d   # start supporting services only
npm run dev                      # Next.js with Turbopack at localhost:3000

# Or start everything via Docker
docker compose up                # db + minio + app

# Build & lint
npm run build                    # full Next.js build — SLOW locally (minutes); prefer the next line for quick checks
npx tsc --noEmit                 # fast typecheck only (no Next compile), use for verifying type fixes
npm run lint

# E2E tests (requires a running server at localhost:3000)
npm run test:e2e                 # all Playwright tests
npm run test:e2e -- tests/e2e/public-routes.spec.ts  # single suite

# Payload CMS
npm run generate:types           # regenerate src/payload-types.ts after schema changes
npm run migrate:create           # create a new migration
npm run migrate                  # apply pending migrations
npm run seed                     # seed initial admin user + sample data
```

## Local environment setup

Copy `.env.example` to `.env`. The Docker Compose stack provides:
- PostgreSQL at `localhost:5432` (db: `igreja_no_rio`, user/pass: `postgres`)
- MinIO (S3-compatible) at `localhost:9000`, console at `localhost:9001` (user: `minio` / pass: `minio123`)

Required env vars: `DATABASE_URI`, `PAYLOAD_SECRET`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT`, `NEXT_PUBLIC_SERVER_URL`, `PAYLOAD_SERVER_URL`, `PAYLOAD_TRUSTED_ORIGINS`, `PAYLOAD_CSRF_ORIGINS`.

Analytics envs (opcionais — string vazia desabilita o respectivo script):
- `NEXT_PUBLIC_META_PIXEL_ID` — ID do Meta Pixel (default em código: `878835207994765`)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Measurement ID do Google Analytics 4 (default em código: `G-EX9WZW1607`)
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — token do Google Search Console (default em código: `zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs`)

Para rodar testes E2E sem disparar hits reais para Meta/Google, sete os três como string vazia no `.env` de teste.

Os scripts de tracking são gated por consentimento via `localStorage` (chave `ir:consent:v1`):
- Meta Pixel só carrega quando `categories.marketing === true`.
- GA4 sempre carrega o `gtag.js` mas inicia em Google Consent Mode v2 `denied`; emite `consent update` quando `categories.analytics === true`.
- Sem decisão registrada, o `<ConsentBanner />` aparece no rodapé.
- Testes E2E que exigem Pixel/GA ativos devem pré-popular `localStorage.ir:consent:v1` antes do `page.goto`.

### Seed users

`npm run seed` cria/garante (upsert por email) três usuários — um por papel — para viabilizar testes E2E e o fluxo editorial completo:

| Papel | Email default | Envs para sobrescrever |
|---|---|---|
| `admin` | (env obrigatória) | `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME` |
| `editor` | `editor@igrejanorio.local` | `SEED_EDITOR_EMAIL`, `SEED_EDITOR_PASSWORD`, `SEED_EDITOR_NAME` |
| `autor` | `autor@igrejanorio.local` | `SEED_AUTOR_EMAIL`, `SEED_AUTOR_PASSWORD`, `SEED_AUTOR_NAME` |

Em desenvolvimento (`NODE_ENV != 'production'`), envs ausentes do `editor` e `autor` caem para defaults; a senha cai para `change-me-now` apenas em dev. Em produção, qualquer ausência aborta o seed. O seed também cria um post de propriedade do `autor` (`slug: rascunho-do-autor-para-testes`) para os testes de edição.

## Architecture

### Route groups

`src/app/(frontend)/` — public-facing pages (Next.js SSR/SSG):
- `/` home, `/blog`, `/blog/[slug]`, `/downloads`, `/contato`, `/agenda`, `/cultos`, `/quem-somos`, `/privacidade`

`src/app/(payload)/` — Payload CMS admin at `/admin`, API routes, and `next-sitemap` managed by `@payloadcms/next`.

### Data fetching

Server components call `getPayload()` from `src/lib/payload.ts` directly — this is an in-process call, not HTTP. Do not fetch `/api/...` from server components.

### Payload collections (`src/collections/`)

| Collection | Purpose |
|---|---|
| `Posts` | Blog posts — `Devocional` or `Estudo` category, optional series, Lexical rich text body, `published` flag |
| `Downloads` | Audio/PDF/slides — `kind` field determines icon/color, supports upload or external URL |
| `Events` | Church events — date, time, location, `highlight` flag for homepage feature |
| `Media` | Uploaded images/files — stored in S3/MinIO via `@payloadcms/storage-s3` |
| `Users` | Auth users with roles: `admin`, `editor`, `autor` |

### Access control (`src/access/contentAccess.ts`)

- `admin` and `editor` have elevated access (can mutate any content)
- `autor` can only mutate content they own (`owner` field, auto-set on create)
- Unauthenticated reads are restricted to `published: true` records

### Styling

Tailwind CSS is the primary styling system. Design tokens are extended in `tailwind.config.ts` — always use those instead of hardcoded values:

- `brand-{50..700}` — teal brand colors
- `navy-{600..900}` — dark navy palette
- `ink` / `ink-2` — text colors
- `muted` / `muted-2` — secondary text
- `bg` / `bg-2` — surface colors
- `font-display` — Poppins headings
- `font-body` — Mulish body text
- `max-w-content` — 1180px max container width
- `shadow-soft`, `shadow-glow` — standard shadows

**Do not add new CSS blocks to `globals.css`** — use Tailwind utilities in JSX. Inline styles are acceptable only for dynamic values that can't be represented with utilities.

### Icons

Use `@iconify/react` with the `material-symbols` set:
```tsx
import { Icon } from '@iconify/react'
<Icon icon="material-symbols:download-rounded" />
```

## Conteúdo e copy (português)

Todo texto voltado ao usuário — páginas públicas, descrições de campos no admin, mensagens, metadados (`title`/`description`), labels e conteúdo de seed — deve estar em **português correto**:

- **Acentuação completa**: nunca escreva palavras sem acento (ex.: `informações`, não `informacoes`; `você`, não `voce`; `política`, não `politica`).
- **Concordância nominal e verbal**: gênero, número e tempo verbal coerentes (ex.: "as informações digitadas", "os dados serão usados").
- **Ortografia e gramática**: pontuação, crase e uso de maiúsculas conforme a norma culta.
- **Aspas em texto** usam aspas tipográficas (`“ ”`); em atributos JSX (`className`, `href`) use **sempre** aspas retas (`"`) — aspas curvas em atributos quebram o build.
- **Exceção**: `slug`, identificadores e chaves técnicas permanecem sem acento e em kebab-case.

Antes de concluir qualquer alteração que crie ou edite texto, revise a acentuação e a concordância. Uma varredura útil: `grep -rnwE '(voce|nao|informacoes|...)' --include='*.tsx' --include='*.ts' src`.

## Testing rules

### Visual decisions — always run Playwright first

Before drawing any conclusion about the visual state of a page (layout, spacing, broken elements, responsive behavior, text visibility), run Playwright to observe the real browser output. Do not reason from code alone when the question is visual.

```bash
# Screenshot a specific route to inspect visually
npm run test:e2e -- tests/e2e/public-routes.spec.ts

# Run a specific test file with headed browser to observe
npx playwright test tests/e2e/public-routes.spec.ts --headed
```

Use `browser_take_screenshot` (MCP Playwright tool) or `--headed` mode whenever you need to confirm what a page actually looks like before deciding on a fix or reporting something as done.

### New features — always add a Playwright test

Every new public route, UI component, or user-visible behavior must have a corresponding E2E test in `tests/e2e/`. Place it in the most relevant existing spec file, or create a new one if the feature warrants it. Tests must:
- Verify the route renders without errors (`expect(response.ok()).toBeTruthy()`)
- Assert the key content or element is visible (`expect(page.locator(...)).toBeVisible()`)
- Cover the main interaction or data state (e.g., filtered list, empty state, form submission)

## OpenSpec workflow

Substantive changes are tracked under `openspec/`:
- `openspec/specs/<capability>/spec.md` — source of truth for each capability's requirements
- `openspec/changes/<name>/` — active changes (proposal, design, delta specs, tasks checklist)
- `openspec/changes/archive/YYYY-MM-DD-<name>/` — completed changes, kept as historical record

Slash commands (invoked inside Claude Code) drive the flow:
- `/opsx:propose <description>` — scaffold proposal, design, delta specs, and tasks for a new change
- `/opsx:apply [name]` — implement the change's tasks, ticking checkboxes as you go
- `/opsx:archive [name]` — sync the delta specs into `openspec/specs/` and move the change to archive

When work touches cross-cutting behavior (multiple files, user-visible changes, new capabilities), prefer this flow over ad-hoc edits — the archived changes form the codebase's institutional memory of *why* each behavior exists. For small bugfixes or refactors, edit directly without the ceremony.

## Tailwind migration guardrails

The codebase is mid-migration from CSS variables to Tailwind. When editing a component:
- Remove redundant legacy CSS tied to old class names
- Do not introduce duplicate style responsibilities between utilities and legacy selectors
- After changes, run `npm run lint`, `npm run build`, and `npm run test:e2e -- tests/e2e/public-routes.spec.ts`

## Before deploying to production

- Set `PAYLOAD_SERVER_URL`, `PAYLOAD_TRUSTED_ORIGINS`, `PAYLOAD_CSRF_ORIGINS`, and `NEXT_PUBLIC_SERVER_URL` to real production domains
- Run `npm run migrate` before traffic hits the new image
- Run `npm run build` para gerar o bundle atualizado do admin Payload e **invalidar o cache do bundle em CDN/Nginx** para os arquivos servidos sob `/admin` (especialmente `index.html`/HTML do admin, que não devem ser cacheados com TTL longo). Sem isso, usuários com bundle antigo podem deixar de enxergar campos novos no formulário (ex.: o campo `body` de Posts).
- Run `npm run lint` and the critical Playwright suites: `admin-access`, `downloads`, `public-routes`
- Validate Nginx security headers including `Content-Security-Policy`

### Runbook — "usuário não vê campo novo após deploy"

Quando um usuário relatar que um campo novo (ex.: `body` em Posts) não aparece no formulário do admin após um deploy:

1. Confirme com o usuário que ele fez **hard refresh** (`Cmd+Shift+R` no macOS / `Ctrl+Shift+R` no Windows/Linux) para descartar cache do navegador.
2. Verifique a tag/SHA da imagem em produção (`docker ps` ou painel do provedor) — confirme que o deploy promovido contém o commit do campo novo.
3. Verifique os headers `Cache-Control` do Nginx/CDN para arquivos servidos sob `/admin` — arquivos JS/CSS hashados podem ter cache longo, mas o HTML (`/admin`, `/admin/login`) deve responder `Cache-Control: no-store` ou `max-age=0`.
4. Rode `npm run test:e2e -- tests/e2e/admin-access.spec.ts` apontando para a URL de produção para reproduzir.
5. Se persistir, valide o acesso por papel: o campo declara `access` no nível de campo em `src/collections/Posts.ts`; mudanças recentes em `src/access/contentAccess.ts` podem ter restringido o papel afetado.
