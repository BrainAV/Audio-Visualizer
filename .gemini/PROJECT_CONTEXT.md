# Project Context for AI

## Architecture Overview
This is a high-performance audio visualizer running in the browser.

- **Core Engine**: WebGL (via `webgl-setup.js` and isolated layers in `visualizers/`). We use a multi-layer composition system instead of a monolithic render loop.
- **State Management**: `state.js` holds the application state, managing an array of active layers (`appState.layers`).
- **Audio**: `audio.js` handles the Web Audio API (Microphone input, AnalyserNode).
- **UI**: `ui.js` manages DOM interactions. `styles.css` uses CSS variables.

## Key Constraints
- **Performance**: The render loop must stay efficient (60fps). Avoid DOM manipulation inside the `draw()` loop.
- **Shaders**: Visual effects (gradients, fractals, shapes) are handled in GLSL fragment/vertex shaders, not JavaScript CPU loops.
- **Responsiveness**: The canvas is full-screen; controls are in an overlay.

## File Responsibilities
- `script.js`: Orchestrator and global animation loop handling rotation/scaling.
- `presets.js`: Configuration data only for the main UI.
- `visualizers/`: Contains isolated WebGL plugins (e.g., `spiral.js`, `fractal.js`).
- `webgl-setup.js`: Shared shader compilation and WebGL boilerplate.

## Common Tasks
- **Adding a Preset**: Add to `presets.js`.
- **New Visual Effect**: Create a new file in `visualizers/` following the plugin contract and link it to the state.