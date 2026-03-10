# Coding Standards

## JavaScript
- Use `const` and `let`, avoid `var`.
- Use arrow functions for callbacks.
- Prefer `document.getElementById` or `querySelector` cached in variables, not called repeatedly in loops.
- **Formatting**: Prettier default settings (2 space indent, semicolons).

## WebGL / GLSL
- Keep shader strings readable (use template literals).
- Uniforms should be camelCase (e.g., `uTime`, `uResolution`).
- Attributes should be prefixed with `a_` (e.g., `a_position`).
- Varyings should be prefixed with `v_` (e.g., `v_color`).

## CSS
- Use CSS variables (defined in `:root`) for colors and dimensions.

## Commit Messages
Follow the Conventional Commits specification to help automate changelog generation.
**Examples:**
- `feat: add fractal visualizer layer`
- `fix: resolve WebGL texture binding state leak`
- `docs: update ROADMAP with new audio reactivity goals`
- `refactor: extract drawing logic into spiral.js plugin`
- `chore(release): prepare v1.1.0`