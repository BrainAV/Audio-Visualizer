# Project Context for AI

## Architecture Overview
This is a high-performance audio visualizer running in the browser.

- **Core Engine**: WebGL (via `webgl-setup.js` and `drawing.js`). We moved away from 2D Canvas for performance.
- **State Management**: `state.js` holds the application state.
- **Audio**: `audio.js` handles the Web Audio API (Microphone input, AnalyserNode).
- **UI**: `ui.js` manages DOM interactions. `styles.css` uses CSS variables.

## Key Constraints
- **Performance**: The render loop must stay efficient (60fps). Avoid DOM manipulation inside the `draw()` loop.
- **Shaders**: Visual effects (gradients, dashes, tapering) are handled in GLSL fragment shaders, not JavaScript.
- **Responsiveness**: The canvas is full-screen; controls are in an overlay.

## File Responsibilities
- `script.js`: Orchestrator (init only).
- `presets.js`: Configuration data only.
- `drawing.js`: Vertex calculation and buffer data.
- `webgl-setup.js`: Shader compilation and uniform locations.

## Common Tasks
- **Adding a Preset**: Add to `presets.js`.
- **New Visual Effect**: Likely requires changes to `fragmentShaderSource` in `webgl-setup.js` and attribute handling in `drawing.js`.