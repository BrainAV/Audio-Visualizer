# Implementation Scratchpad

## Feature: Multi-Layer Composition System (Priority 1)

### Overview
Transition from a single-visualizer architecture to a compositing engine. This allows users to stack multiple effects (e.g., a background spiral, a foreground spectrum analyzer, and a particle overlay) with independent controls and transparency.

### Implementation Plan

#### Phase 1: State Refactoring (`state.js`)
- [ ] **Define Layer Structure**: Create a standard data structure for a "Layer" (id, type, visible, opacity, blendMode, params).
- [ ] **Global vs. Layer State**: Separate global settings (Canvas Background Color, Resolution) from Layer settings (Stroke Color, Rotation, Scale).
- [ ] **Update State Management**: Refactor `currentParams` to be a `CompositionState` object containing an array of `layers`.

#### Phase 2: Rendering Engine (`drawing.js`, `script.js`)
- [ ] **Enable Blending**: Configure WebGL for transparency (`gl.enable(gl.BLEND)`, `gl.blendFunc`).
- [ ] **Render Loop Refactor**:
  - Rename `drawSpiral` to `renderLayer`.
  - Create `renderComposition`:
    1. Clear Canvas (using global background color).
    2. Loop through `layers`.
    3. If layer is visible, call `renderLayer` with that layer's params.

#### Phase 3: UI Architecture (`ui.js`)
- [ ] **Layer Manager UI**: Create a new panel to list active layers.
  - Controls: Add, Remove, Duplicate, Visibility Toggle.
- [ ] **Context-Aware Controls**: When a layer is selected in the list, update the main control panel inputs to reflect *that* layer's parameters.
- [ ] **Global Controls**: Move "Background Color" to a global settings area.

---

## Feature: Spectrum Analyzer (Priority 2)

### Overview
Implement a real-time frequency spectrum analyzer using WebGL. The visualization will consist of vertical bars that react to audio frequency data.

### Implementation Plan

#### Phase 1: Audio Data (`audio.js`)
- [ ] **Update `initAudio`**: Increase `fftSize` (currently 64) to 256 or 512 to get higher resolution frequency data (128 or 256 bars).
- [ ] **Add `getAudioSpectrum`**: Create a function to expose `analyser.getByteFrequencyData`.

#### Phase 2: WebGL Shader Support (`webgl-setup.js`)
- [ ] **Refactor `setupWebGL`**: The current function returns a single program. It needs to be refactored to support/return multiple programs (Spiral Program vs. Spectrum Program).
- [ ] **Define Spectrum Shaders**:
  - **Vertex Shader**: Needs a new attribute `a_barIndex` and a uniform array `u_audioData[]`. It will calculate vertex Y-positions based on the audio value for that bar index.
  - **Fragment Shader**: Simple color handling, potentially with gradients based on bar height.

#### Phase 3: Rendering Logic (`drawing.js`)
- [ ] **`initSpectrumMesh`**: Create a function to generate static geometry (quads) for the bars. This runs once (or on resize), not every frame.
  - *Optimization*: Store `barIndex` as a vertex attribute so the shader knows which audio value applies to which vertex.
- [ ] **`drawSpectrum`**: The render function that:
  1. Binds the spectrum shader program.
  2. Uploads the audio data array to the `u_audioData` uniform.
  3. Draws the static mesh.

#### Phase 4: UI & Integration (`ui.js`, `script.js`, `state.js`)
- [ ] **State**: Add `visualizerMode` ('spiral' | 'spectrum') to `currentParams` and `state.js`.
- [ ] **UI**: Add a control (dropdown or toggle) to switch between modes.
- [ ] **Loop**: Update the main animation loop in `script.js` (or `ui.js` where the loop lives) to conditionally call `drawSpiral` or `drawSpectrum`.

### Technical Notes
- **Uniform Limits**: We need to check `MAX_VERTEX_UNIFORM_VECTORS`. A float array of size 64 or 128 is usually safe on modern devices.
- **Performance**: The "Vertex Displacement" method is chosen here. We upload geometry once, and only upload a small array of floats (audio data) per frame. This is significantly faster than rebuilding the mesh on the CPU every frame.

### Next Steps
1. Execute **Phase 1** (Audio updates).
2. Execute **Phase 2** (Shader creation).