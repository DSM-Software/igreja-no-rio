## Why

The current styling layer mixes global CSS and component-specific rules, which slows down UI changes and makes consistency harder to maintain. Migrating to the latest stable Tailwind CSS now reduces styling complexity, speeds delivery, and creates a scalable design foundation for upcoming site updates.

## What Changes

- Introduce Tailwind CSS in its latest stable version and configure it as the primary styling system for the frontend.
- Migrate existing public-facing pages and shared UI components from legacy CSS rules to utility classes, preserving current visual behavior.
- Define reusable design tokens (colors, spacing, typography, radii, shadows) in Tailwind theme configuration.
- Keep global CSS only for minimal base styles that cannot be represented cleanly in utilities.
- Add migration guardrails and validation criteria to prevent visual regressions in responsive layouts.

## Capabilities

### New Capabilities
- `tailwind-styling-foundation`: Establishes Tailwind as the primary styling foundation with shared design tokens and utility-driven component styling.

### Modified Capabilities
- `public-visual-consistency`: Updates requirements so existing public routes preserve visual consistency and responsive behavior while styles are migrated to Tailwind.

## Impact

- Affected code: frontend layouts, route pages, shared UI components, and styling configuration files.
- Dependencies: add or update Tailwind CSS tooling and related PostCSS pipeline configuration.
- QA/testing: require visual and responsive regression checks for key public pages.
- Operational risk: medium, due to broad style refactor scope; mitigated by incremental migration and parity checks.