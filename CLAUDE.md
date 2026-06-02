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
npm run build
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

## Tailwind migration guardrails

The codebase is mid-migration from CSS variables to Tailwind. When editing a component:
- Remove redundant legacy CSS tied to old class names
- Do not introduce duplicate style responsibilities between utilities and legacy selectors
- After changes, run `npm run lint`, `npm run build`, and `npm run test:e2e -- tests/e2e/public-routes.spec.ts`

## Before deploying to production

- Set `PAYLOAD_SERVER_URL`, `PAYLOAD_TRUSTED_ORIGINS`, `PAYLOAD_CSRF_ORIGINS`, and `NEXT_PUBLIC_SERVER_URL` to real production domains
- Run `npm run migrate` before traffic hits the new image
- Run `npm run lint` and the critical Playwright suites: `admin-access`, `downloads`, `public-routes`
- Validate Nginx security headers including `Content-Security-Policy`
