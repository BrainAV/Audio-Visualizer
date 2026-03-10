---
name: ui-manager
description: Expertise in managing HTML/CSS/JS user interfaces and controls for the Audio-Visualizer project. Use this skill when adding sliders, checkboxes, or restructuring the control layout.
---

# UI Manager Skill

You ensure robust, organized, and synced user interface controls for the Audio-Visualizer.

## UI Data Binding Architecture

1. **Automatic Param Sync (`handleInput` in `ui.js`):**
   - The UI runs on a naive-but-powerful binding system.
   - ANY `<input>` or `<select>` element added to `index.html` must have an `id` that exactly matches the property name in `appState.layers[active].params`.
   - Example: A slider with `id="zoom"` will automatically update `activeLayer.params.zoom` when slid.
   - If an `id` matches a key in `masterAudioParams` (e.g., `audioRotate`), it updates the global variable instead of the active layer.

2. **UI Updates from State (`updateUIFromState`):**
   - When the active layer changes or a preset is loaded, `updateUIFromState()` is invoked.
   - This function loops through all `activeLayer.params`. For each key, it looks for an HTML element with the same `id` and updates its value/checked state.
   - It also looks for a span with `id + 'Value'` and updates its text content. Ensure sliders have an adjacent `<span id="myParamValue"></span>` for numerical feedback.

3. **UI Layout and Toggling:**
   - Different visualizers require different controls. Group controls for a specific visualizer inside a master container (e.g., `<div id="fractalControlsContainer">`).
   - In `updateUIFromState()`, implement logic to `display: block` the container corresponding to the `activeLayer.type`, while hiding all others (`display: none`).

4. **CSS and Styling (Vanilla Glassmorphism):**
   - Ensure new controls fit the existing CSS variable system (`styles.css`).
   - Rely on HTML `<label data-tooltip="...">` wrapper patterns around inputs to maintain tooltips.
   - Maintain mobile responsiveness. Test new UI groupings on narrow screen widths to ensure they don't break the overlay.
