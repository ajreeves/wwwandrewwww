# Quarto Presentation

## Active source files

- `presentation/slides.qmd`: main presentation source.
- `presentation/slides.css`: single presentation stylesheet.
- `presentation/map_fullscreen.css`: shared fullscreen CSS for all map pages.
- `presentation/map1_food_insecurity_interactive.qmd`
- `presentation/map2_pantry_footprint_interactive.qmd`
- `presentation/map3_food_desert_index_interactive.qmd`
- `presentation/map4_source_compare_interactive.qmd`
- `code/build_presentation_leaflet_maps.R`: map build logic.
- `code/render_presentation_maps.R`: renders all four map `.qmd` files.

## Active outputs

- `presentation/slides.html`
- `presentation/map1_food_insecurity_interactive.html`
- `presentation/map2_pantry_footprint_interactive.html`
- `presentation/map3_food_desert_index_interactive.html`
- `presentation/map4_source_compare_interactive.html`

## Render workflow (from project root)

```bash
Rscript code/render_presentation_maps.R
quarto render presentation/slides.qmd
```
