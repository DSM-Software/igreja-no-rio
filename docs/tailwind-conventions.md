# Tailwind Conventions

## Objective

Use Tailwind as the primary styling system for public pages and shared components, while keeping legacy CSS only for not-yet-migrated sections.

## Source of truth

- Design tokens are centralized in tailwind theme extension in tailwind.config.ts.
- Component and page styling should be expressed with utility classes in JSX.
- globals.css keeps only base styles and temporary legacy classes during migration.

## Implementation rules

- Prefer utility classes directly in component markup.
- Reuse shared utility patterns across recurring surfaces (header, cards, section wrappers).
- Avoid new large CSS blocks in globals.css.
- Avoid inline style objects unless dynamic values cannot be represented with utilities.

## Responsive rules

- Validate visual behavior at mobile (390x844), tablet (768x900), and desktop (1280x900).
- Ensure no horizontal overflow on public routes.
- Keep navigation behavior consistent: desktop nav visible on large screens, compact menu on small screens.

## Migration guardrails

- Migrate incrementally by shared components first, then route pages by priority.
- When a component is migrated, remove redundant legacy CSS tied to the old class structure.
- Preserve visual hierarchy (spacing, typography, contrast) during refactors.

## Quality checklist

- npm run lint
- npm run build
- npm run test:e2e -- tests/e2e/public-routes.spec.ts

## Anti-regression

- Do not introduce duplicate style responsibilities between utility classes and legacy selectors.
- Do not reintroduce hardcoded colors already represented by tokens.
- Keep CTA and navigation states accessible and visible in all breakpoints.
