---
description: How to add a new visualizer mode or layer (e.g., Fractal Visualizer)
---

# Creating a New Visualizer

This workflow outlines the steps required to add a new standalone visualizer mode (like a Fractal Visualizer) to the Audio-Visualizer project. The project uses WebGL for high-performance rendering.

## Preliminary Steps
1. Review `.gemini/PROJECT_CONTEXT.md` and `.gemini/CODING_STANDARDS.md` to ensure your plan aligns with the project architecture.
2. Review the `ROADMAP.md` to ensure the new visualizer is a planned feature.

## Implementation Steps

### 1. State Management (`state.js`)
- Add a new visualizer type to the application state.
- Define any default properties specific to this new visualizer (e.g., `fractalIterations`, `fractalZoom`).

### 2. User Interface (`ui.js` and `index.html`)
- Update `index.html` to include new UI controls for the visualizer's specific settings.
- Update `ui.js` to handle switching between visualizer types. You'll need logic to show/hide specific control panels depending on the active visualizer (e.g., hide spiral-specific controls when in Fractal mode).
- Attach event listeners to the new UI controls to update `state.js` and trigger redraws.

### 3. WebGL Engine Setup (`webgl-setup.js`)
- If the new visualizer requires a fundamentally different rendering approach, you may need to introduce new vertex or fragment shaders.
- Alternatively, you can modify the existing shaders to support multiple modes via uniforms (e.g., passing a `uMode` uniform to switch rendering logic inside the GLSL code).
- Ensure any new uniforms or attributes are correctly linked in `webgl-setup.js`.

### 4. Rendering Logic (`drawing.js`)
- Create a dedicated function for the new visualizer (e.g., `drawFractal(gl, programInfo, state)`).
- Update the main `draw()` or render loop function to route the execution to the correct drawing function based on the active state.
- Ensure efficient buffer updates. Do not recreate buffers every frame; update existing buffers with new data utilizing `gl.bufferSubData` or similar if the vertex count is dynamic but bounded.

### 5. Audio Reactivity (`audio.js`)
- Map audio analysis data to the new visualizer's parameters (e.g., make fractal zoom pulsate with the beat).
- Ensure the interpolation logic (`lerp`) safely handles the new properties.

### 6. Presets (`presets.js`)
- Create at least one default preset for the new visualizer so users can easily test it.

## Verification
- Test switching back and forth between the new visualizer and the existing Spiral visualizer to ensure state does not leak.
- Verify performance holds at 60fps.
- Verify that resize events are handled correctly by the new visualizer.
- Verify audio reactivity functions as expected.
