# CSS Refactor Notes (2026-02-08)

## 1) Inventory: CSS loaded by Quarto

From `_quarto.yml` + rendered HTML:

1. `site_libs/bootstrap/bootstrap-*.min.css` (Quarto theme bundle, light)
2. `site_libs/bootstrap/bootstrap-dark-*.min.css` (Quarto theme bundle, dark)
3. `styles-overrides.css` (custom post-theme override file, loaded last)
4. `site_libs/bootstrap/bootstrap-icons.css` (icon font)
5. Quarto library CSS (`quarto-syntax-highlighting-*.css`, `tippy.css`)

Theme entrypoints:

1. `styles-light.scss` imports `styles-shared.scss`
2. `styles-dark.scss` imports `styles-shared.scss`

Extension CSS:

1. None (no CSS in `_extensions/` is currently loaded)

## 2) Scope and ownership

1. `styles-shared.scss`: primary global design system (tokens, typography, shared components)
2. `styles-overrides.css`: narrow late-load stabilization fixes
3. `styles-light.scss` / `styles-dark.scss`: thin Quarto theme entrypoints only

## 3) Conflicts and redundancies found

1. Global background painting existed in both `styles-shared.scss` and `styles-overrides.css`
2. Redundant pseudo-element background shutdown (`body::before/::after`) appeared in multiple places
3. Legacy, unloaded CSS files remained in repo:
   - `styles.scss`
   - `styles copy.scss`

## 4) Consolidation actions taken

1. Kept one background authority in `styles-overrides.css` (late-load, deterministic)
2. Removed duplicate background painter rules from `styles-shared.scss`
3. Added transparent wrapper stabilization for Quarto layout containers in `styles-overrides.css`:
   - `#quarto-content`
   - `#quarto-document-content`
   - `.page-layout-full`
   - `.page-rows-contents`
   - `.page-row`
   - `.page-row-contents`
   - `.page-columns`
   - `main.content`
   - `.content`
4. Added purpose headers to:
   - `styles-shared.scss`
   - `styles-overrides.css`
   - `styles-light.scss`
   - `styles-dark.scss`
5. Deleted dead legacy files:
   - `styles.scss`
   - `styles copy.scss`

## 5) Verification checklist

1. `quarto render index.qmd` succeeds
2. Rendered HTML still loads expected CSS assets in correct order
3. Home page wrapper/background stabilization selectors are present in final CSS
4. No template or markup changes were required

## 6) Known risk / follow-up

1. Quarto Sass cache can leave stale bundles in `_site/site_libs/bootstrap`; always verify active hash from rendered page (`_site/index.html`) when testing style changes.
