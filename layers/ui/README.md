# UI Layer

## Overview

The UI layer provides the foundational design system for Virify: global SCSS architecture, CSS custom properties (colour tokens, typography, spacing), shared low-level components, the icon sprite system, and font configuration. All other layers build on top of this.

> Note: Tailwind CSS is only used in `layers/dashboard/`. The rest of the app uses the SCSS system defined here.

## Directory Structure

```
layers/ui/
├── app/
│   ├── app.config.ts              # App-level config (head, viewport)
│   ├── assets/
│   │   ├── sprites/               # SVG sprite sheets
│   │   └── styles/
│   │       ├── main.scss          # Entry point — imports all layers in order
│   │       ├── tailwind.css       # Tailwind CSS (dashboard only)
│   │       ├── _utils/            # SCSS mixins and functions
│   │       ├── 0-normalise/       # CSS reset
│   │       ├── 1-variables/       # CSS custom properties
│   │       │   ├── colours.scss   # Colour tokens (--colour-*)
│   │       │   ├── fonts.scss     # Typography scale variables
│   │       │   ├── animations.scss
│   │       │   ├── dividers.scss
│   │       │   ├── inputs.scss
│   │       │   ├── offsets.scss
│   │       │   └── sizes.scss
│   │       ├── 2-window/          # Media query breakpoints
│   │       ├── 3-elements/        # Base HTML element styles
│   │       ├── 4-utilities/       # Utility classes
│   │       └── 6-components/      # Component-scoped styles
│   ├── components/
│   │   └── atoms/
│   │       ├── AtomsIcon.vue      # SVG sprite icon renderer
│   │       ├── AtomsInfoModal.vue # Inline info modal (tooltip-style)
│   │       └── AtomsBottomBar.vue # Mobile bottom navigation bar
│   ├── composables/
│   │   └── useInfoModal.ts        # State for AtomsInfoModal open/close
│   ├── modules/                   # Nuxt modules used by the UI layer
│   └── utils/
├── tailwind.config.ts             # Tailwind config (scoped to dashboard)
└── nuxt.config.ts
```

## SCSS Architecture

Styles are loaded in a strict layered order via `main.scss`:

| Layer | Purpose |
|-------|---------|
| `0-normalise` | CSS reset (box-sizing, margin, padding) |
| `1-variables` | CSS custom properties — colour tokens, type scale, spacing, animation timings |
| `2-window` | Breakpoint definitions and responsive mixins |
| `3-elements` | Base HTML element resets and defaults (a, h1-h6, p, img, etc.) |
| `4-utilities` | Single-purpose utility classes (spacing, display, etc.) |
| `6-components` | Shared component styles consumed by multiple layers |

## Colour System

All colours are defined as CSS custom properties in `1-variables/colours.scss` and referenced throughout the app as `var(--colour-*)`. No hardcoded hex values should appear outside this file.

## Typography Scale

Typography tokens are defined in `1-variables/fonts.scss`:

| Token | Usage |
|-------|-------|
| `--title-lg` | Large page headings |
| `--title-md` | Section headings |
| `--title-sm` | Card/subsection headings |
| `--body-lg` | Larger body text |
| `--body-md` | Default body text |
| `--body-sm` | Secondary/caption text |
| `--body-xs` | Fine print |

Font family: `Be Vietnam Pro` — loaded via `@nuxtjs/fontaine` for zero-CLS font loading.

## Components

### `AtomsIcon`

Renders an SVG icon from the sprite sheet. Prop: `name` — the icon ID within the sprite.

```vue
<AtomsIcon name="heart" />
```

Icons are stored as SVG sprites in `app/assets/sprites/`. New icons are added to the sprite sheet, not as individual files.

### `AtomsInfoModal`

A small info/tooltip modal triggered inline. State managed by `useInfoModal()`.

### `AtomsBottomBar`

Mobile bottom navigation bar. Displayed on small screens as a fixed footer.

## `useInfoModal()`

```ts
const { isOpen, open, close, toggle } = useInfoModal()
```

Manages the open/close state for `AtomsInfoModal`. Used by molecules and organisms that need inline help tooltips.
