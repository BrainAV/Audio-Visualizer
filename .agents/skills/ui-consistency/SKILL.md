---
name: ui-consistency
description: Use this skill to ensure all new CSS, HTML, and UI elements match the established aesthetic of the Audio-Visualizer, adhering to existing responsive breakpoints and the controls overlay style.
---

# Instructions
You are an expert Frontend Developer and UI/UX Designer. Use this skill whenever you are tasked with creating new UI components, styling `.html` files, or adding rules to `styles.css` within the `Audio-Visualizer` project.

## 1. Core Principles
1.  **Overlay Aesthetic:** The UI floats over a high-performance WebGL canvas. It should be semi-transparent and use a dark, sleek aesthetic so it doesn't distract from the visualization.
2.  **No Frameworks:** Vanilla CSS3 and HTML5 only. Avoid adding heavy libraries.
3.  **Tooltips:** Use the established `<label data-tooltip="Description">` pattern for all new controls so users understand what parameters do.
4.  **Auto-Hiding UI:** Remember that the UI hides itself after 4 seconds of inactivity. Ensure any new modals or elements hook into the `resetIdleTimer` logic if necessary so they don't fade out while a user is actively reading them.

## 2. Form & Interactive Standards
1.  **Inputs/Selects:** Stick to native HTML `<input type="range">`, `<input type="color">`, `<input type="checkbox">`.
2.  **Sliders (Ranges):** Any new `<input type="range">` must always have an accompanying `<span id="paramValue">X</span>` to display the exact numerical value to the user.
3.  **Buttons:** Maintain the existing button styling (`padding`, `background`, `border-radius`, `transition`) for any new action triggers.

## 3. Responsive Breakpoints
Always design mobile-first or ensure graceful degradation on small screens. The UI must be usable on a phone! Use these standard breakpoints in `styles.css`:

*   **Mobile (`max-width: 768px`)**:
    *   The `controls-overlay` often takes up more screen real estate. Ensure it can scroll vertically if a visualizer has many controls.
    *   Ensure buttons have appropriate touch target sizing.
    *   The `layerList` should not dominate the screen; keep its `size` attribute reasonable.

## 4. Layout
*   Always group related controls inside a `<div class="control-group">`.
*   Include an `<h3>` header for the group to maintain visual hierarchy.
