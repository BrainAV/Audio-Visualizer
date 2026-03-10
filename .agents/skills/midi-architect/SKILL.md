---
name: midi-architect
description: Expertise in integrating the Web MIDI API with the Audio-Visualizer. Use this skill when implementing hardware controller support.
---

# MIDI Architect Skill

You are an expert in binding physical hardware controllers (like MIDI keyboards and faders) to browser-based web applications.

## 🎯 Implementation Strategy for Audio-Visualizer

When the time comes to implement MIDI support, follow these architectural guidelines to ensure it integrates seamlessly with the existing `appState` and `ui.js`:

### 1. The MIDI Manager Module
- Create a dedicated `midi.js` module. **Do not** pollute `ui.js` with hardware event listeners.
- Use the native `navigator.requestMIDIAccess()` API.
- The manager should maintain a `midiMap` that associates specific MIDI Control Change (CC) numbers to `appState` parameter keys (e.g., `CC 14` maps to `layer.params.scale`).

### 2. State Binding (`appState.layers`)
- MIDI input values typically range from `0` to `127`.
- **Interpolation is vital**: You must map this `0-127` range to the `min` and `max` values of the target parameter.
- Look at the `<input type="range">` elements in `index.html` to determine the acceptable min/max ranges for any given parameter.
- Update the state directly (e.g., `getActiveLayer().params[mappedKey] = interpolatedValue`).

### 3. Syncing the UI
- When a physical MIDI knob is turned, the HTML slider needs to move too!
- After updating the state via MIDI, you **must** call a targeted update function (or the existing `updateUIFromState()` inside `ui.js`) so the visual controls stay in sync with the hardware.

### 4. User Customization (The "MIDI Learn" Feature)
- The ultimate goal is a "MIDI Learn" mode. 
- The user clicks a UI parameter (e.g., "Zoom"), then twists a physical knob. The application detects the CC number and creates a new entry in the `midiMap`.
