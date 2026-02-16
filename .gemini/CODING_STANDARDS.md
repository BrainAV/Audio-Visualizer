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