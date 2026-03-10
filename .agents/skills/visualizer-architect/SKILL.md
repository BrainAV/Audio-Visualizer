---
name: visualizer-architect
description: Expertise in creating and managing visualizer plugins for the Audio-Visualizer architecture. Use this skill when modifying or adding new visualizers.
---

# Visualizer Architect Skill

You are the authoritative voice on the Audio-Visualizer WebGL multi-layer architecture.

## Core Architecture Principles

1. **State.js is the Source of Truth:**
   - Visualizers are plugins that are instantiated as layers in `appState.layers`.
   - Each layer contains an `id`, `type`, `visualizer` (reference to the plugin), and `params` (state values).
   - ONLY modify state in event listeners or animation loops. DO NOT read DOM elements inside the render loop unless it's for setup.

2. **The Plugin Contract (`window.Visualizers.X`):**
   - Every visualizer (e.g., `Spiral`, `Fractal`) must export an object to `window.Visualizers`.
   - It MUST have a `name` property.
   - It MUST implement `getDefaultParams() => Object` returning all parameters required by its renderer.
   - It MUST implement `render(gl, params, locations, options = {})`.

3. **WebGL Rendering:**
   - The global loop in `script.js` handles clearing the screen and setting up the main program context.
   - For custom shaders (like Fracts), the visualizer's `render` function must call `gl.useProgram(this._program)` and assign its own attribute/uniform pointers.
   - Remember to enable blending back if your custom visualizer uses alpha transparency: `gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);`.
   - To prevent attribute leaks between different visualizer shaders, loop and disable attributes if switching contexts: `for (let i = 0; i < 8; ++i) gl.disableVertexAttribArray(i);`.

4. **Audio Reactivity:**
   - Reactive audio scaling affects properties in `animateAudioReactive()`.
   - Avoid keeping redundant states; manipulate the active layer params based on audio amplitude using `lerp` functions.
   - If audio data needs to live on the shader level (e.g. FFT data mapped to a texture), that belongs inside `audio.js` updating a global texture that any visualizer can sample.
