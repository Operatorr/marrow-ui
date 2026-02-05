# Marrow UI

A UI kit built with Tailwind CSS and Alpine.js. No React.

## Monorepo Structure

```
apps/docs/        Astro documentation site (deploys to Vercel)
packages/ui/      npm package — CSS, JS, CLI, component templates
scripts/          Build/conversion utilities
```

## Development

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start docs dev server
pnpm build                # Build everything
```

## Package (packages/ui)

The `marrow-ui` npm package provides:
- `src/css/marrow.css` — Component base styles
- `src/js/marrow.js` — Alpine.js data components
- `bin/cli.js` — CLI tool (init, add, build, list)
- `templates/` — Config template + 59 component HTML templates

## Component Conventions

- All CSS classes use `mw-` prefix: `mw-btn`, `mw-card`, `mw-input`, etc.
- Interactive components use Alpine.js: `x-data="mwDialog()"`, `x-data="mwTabs('tab1')"`
- State uses `data-state` attributes: `checked/unchecked`, `active`, `on`
- Variants follow the pattern: `mw-btn-primary`, `mw-btn-secondary`, `mw-badge-destructive`
- Sizes: `mw-btn-sm`, `mw-btn-lg`, `mw-btn-icon`, `mw-avatar-sm`, `mw-avatar-lg`

## Theme System

Everything is controlled by `marrow.config.js`:
- Colors: HSL format (`"220 90% 56%"`) for both light and dark modes
- Radius: `none | sm | md | lg | xl | 2xl | full`
- Compactness: `minimal | compact | normal | relaxed | spacious`
- Fonts: Dual system (heading + body)
- Shadows: `none | sm | md | lg | xl`
- Transitions: `none | fast | base | slow | lazy`

Config generates CSS custom properties (`--marrow-*`) via `npx marrow-ui build`.

## Docs Site (apps/docs)

Astro-based, deployed to Vercel. Pages are `.astro` files:
- `src/pages/index.astro` — Landing page
- `src/pages/docs/*.astro` — Documentation pages
- `src/pages/docs/components/*.astro` — 59 component pages

Layouts:
- `BaseLayout.astro` — HTML shell with head, fonts, Alpine.js
- `DocsLayout.astro` — Docs shell with sidebar navigation

## Key Files

- `packages/ui/src/css/marrow.css` — All component styles
- `packages/ui/src/js/marrow.js` — All Alpine.js data components
- `packages/ui/templates/marrow.config.js` — Default theme config
- `apps/docs/public/llms.txt` — AI documentation index
- `apps/docs/public/llms-full.txt` — Complete AI documentation
- `context7.json` — Context7 MCP server config
