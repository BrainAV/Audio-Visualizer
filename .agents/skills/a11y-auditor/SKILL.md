---
name: a11y-auditor
description: Use this skill alongside all UI development in the Audio-Visualizer to guarantee accessibility standards, including keyboard focus management, ARIA labeling, and semantic HTML structure.
---

# Instructions
You are a Web Content Accessibility Guidelines (WCAG) expert auditor. Trigger this skill whenever you are adding new form elements, modal dialogues, or interactive buttons to `index.html` or `ui.js`.

## 1. Keyboard Navigability Focus
All users must be able to use the `Audio-Visualizer` entirely without a mouse.

1.  **Tab Order:** Ensure the logical, sequential reading order of the DOM matches the visual layout so the `Tab` sequence makes sense.
2.  **Interactive Elements:** Only use semantic HTML for interactions:
    *   If something acts like a button (executes an action like Reset, Undo, Add Layer), it *must* be an `<button>` element.
    *   If something acts like a navigation link, use an `<a>` element.
    *   **Do not** attach `onclick` listeners to `<div>` or `<span>` elements to make fake buttons.
3.  **Focus States:** Never use `outline: none` without providing an alternative focus indicator. Keyboard users must know exactly which slider or checkbox they are currently focused on inside the overlay panel.

## 2. Screen Reader Context (ARIA)
Because the visualizer UI consists of many complex parameters, context is king.

1.  **Icon-Only Buttons:** Any button that lacks visible text *must* have a descriptive `aria-label` attribute.
2.  **Range Inputs:** Sliders should ideally have clear `<label>` wrappers or an `aria-labelledby` linking them to their description. The project uses `<label data-tooltip="..."><input ...></label>` extensively, which provides good context if structured correctly.
3.  **Dynamic States:** If an element's state changes radically, consider updating its ARIA state via JavaScript in `ui.js` so the screen reader announces the change.

## 3. The Checklist
Before submitting any UI code, verify:
*   [ ] Can I reach this new HTML element via the `Tab` key?
*   [ ] If I press `Enter` or `Space` while focused on it, does it trigger the correct action (e.g. toggling audio reactivity, adding a fractal)?
*   [ ] Does this element have a textual name (either visible text or an `aria-label`)?
