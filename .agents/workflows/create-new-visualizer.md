---
description: How to add a new visualizer mode or layer (e.g., Fractal Visualizer, VU Meter)
---

# Creating a New Visualizer

This workflow outlines the steps required to add a new standalone visualizer mode (like a VU Meter or Wave Oscillator) to the Audio-Visualizer project. The project uses a multi-layer WebGL rendering architecture.

## Implementation Steps

### 1. Visualizer Plugin Definition (e.g., `visualizers/vumeter.js`)
- Create a new file for the visualizer under `visualizers/`.
- Export an object (e.g., `VuMeterVisualizer`) with the following structure:
  - `name`: String name of the visualizer.
  - `getDefaultParams()`: Returns an object with the default state and UI parameters for this layer (e.g., `scale`, `color`, `opacity`).
  - `render(gl, params, locations, options)`: The main WebGL draw function.
- Register the visualizer onto the global object: `window.Visualizers = window.Visualizers || {}; window.Visualizers.VuMeter = VuMeterVisualizer;`

### 2. State Management (`state.js`)
- Update `addLayer(type)` in `state.js` to instantiate the new visualizer if `type === 'VU Meter'`. Look for the `appState.layers.push(...)` pattern.

### 3. WebGL Engine Setup (`webgl-setup.js` & specific render function)
- The main `script.js` loop passes an active WebGL context (`gl`) to your `render` function.
- If your visualizer requires custom shaders (like `fractal.js`), define, compile, and link them locally inside your visualizer's initialization or `render` block. Switch to your `_program` using `gl.useProgram(this._program)`.
- Enable blending `gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);` so it composites properly over previous layers.

### 4. User Interface (`index.html` & `ui.js`)
- **index.html**: Add an "Add VU Meter" button to the `layerManager` controls. Create a new `div` block for your specific controls (e.g., `<div id="vumeterControlsContainer" style="display: none;">...</div>`). Add sliders `input type="range"` and map them to your layer parameters.
- **ui.js**:
  - Attach an event listener to your new "Add" button to call `addLayer('VU Meter')`.
  - Update `updateUIFromState()` to detect if `activeLayer.type === 'VU Meter'` and toggle `display: block` for your container (while hiding others).
  - The generic `handleInput` function in `ui.js` automatically maps input `id`s to the `activeLayer.params[id]`, so as long as your HTML element IDs match your `getDefaultParams` keys, they will stay in sync automatically!

### 5. Audio Reactivity (`audio.js`)
- Only variables shared across layers should be in `masterAudioParams`. Standard audio reactivity happens in `animateAudioReactive()`. You can either bake audio reaction into your WebGL shader natively using an audio texture, or modify properties frame-by-frame inside `animateAudioReactive` if toggles are active.

### 6. Presets (`presets.js` & `index.html`)
- Include the new script `<script src="visualizers/vumeter.js"></script>` in `index.html`.
- Add a new aesthetic preset showcasing the visualizer to `presets.js`!

