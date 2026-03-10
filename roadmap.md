# Project Roadmap: Audio Visualizer

This document outlines the development roadmap for the Audio Visualizer project. It is a living document that will evolve as the project grows.

## Version 1.x (Current Focus)

The immediate goals are to refine the existing features, improve performance, and enhance the core audio-reactive experience.

- **[x] Code Refactoring:**
  - [x] Modularize `script.js` into smaller, focused files (e.g., `ui.js`, `drawing.js`, `audio.js`, `state.js`).
  - [x] Optimize the animation loop to avoid unnecessary DOM reads on every frame and use `lerp` for smooth transitions. *(Discovered in `/2` prototype)*.
  - [x] Convert `styles.css` to use CSS variables for easier theming.

- **[x] Documentation:**
  - [x] Create `DEV_GUIDE.md` for architecture overview.
  - [x] Create `CONTRIBUTING.md` for contribution guidelines.

- **[ ] UI/UX Enhancements:**
  - [x] Add a "Start/Stop Audio" button to give users more explicit control over microphone access.
  - [x] Improve layout and responsiveness of the controls panel for smaller screens.
  - [x] Integrate advanced mobile touch controls (pinch-to-zoom, drag-to-rotate) from the `/2` prototype.
  - [x] Add tooltips to explain what each control does.
  - [x] Implement an idle "Screensaver Mode" that hides UI controls after inactivity to prevent screen burn-in and enhance the overlay experience.

- **[ ] Core Feature Improvements:**
  - [ ] Add more parameters for audio reactivity (e.g., *line width [x]*, number of nodes, layer ratio).
  - [ ] Create new presets specifically designed for audio visualization.

- **[x] User Documentation:**
  - [x] Create a user-friendly "How to Use" guide accessible from the main UI.
  - [x] Add an "About" page detailing the project's purpose, features, and technology.

## Version 2.0 (Enhanced Reactivity)

This version will focus on integrating more advanced audio analysis techniques, likely based on the prototypes in the `/2` and `/3` folders.

- **[x] Advanced Rendering:**
  - [x] Explore and implement WebGL for significantly improved performance. *(Discovered in `/3` prototype)*.
  - [x] Re-implement `curvedLines` functionality in the new WebGL engine.

- **[x] Multi-Layer Composition Architecture (The Framework):**
  - [x] Refactor state and rendering engine to support an array of generic visual layers.
  - [x] Implement a layer manager allowing users to add, stack, reorder, and blend multiple visual effects.
  - [x] Define a standard plugin interface for new visualizers (e.g., `init()`, `update()`, `draw()`, `ui()`).
  - [x] Refactor the existing "Original Spiral" to plug into this new system as the first visualizer type.

- **[ ] Advanced Audio Analysis (⭐️ Next Priority):**
  - [ ] Implement FFT (Fast Fourier Transform) to analyze audio frequency data, not just amplitude.
  - [ ] Allow different visual parameters to react to different frequency ranges (e.g., bass frequencies affect scale, treble affects color or rotation speed).


- **[ ] New Visual Modes (Plugins):**
  - [x] Build the "Fractal Visualizer" plugin (Mandelbrot/Julia sets) with its own dedicated UI settings.
  - [ ] Build a "Spectrum Analyzer" plugin (Frequency Bars/Waveforms).
  - [ ] Build a "VU Meter" visualizer plugin.
  - [ ] Build a "Wave Oscillator" visualizer plugin.
  - [ ] Introduce other visualizer types (circular waveforms, particle systems, tunnel effects) leveraging the WebGL engine.
  - [ ] Allow color to be reactive to audio frequency or amplitude.

- **[ ] Input Sources:**
  - [ ] Add support for playing and visualizing local audio files (MP3, WAV).
  - [ ] Add support for selecting a different microphone input device.
  - [ ] Integrate with the Radio Stream Player (Unified Architecture) to visualize the web audio stream directly.

## Version 3.0 (Future Vision)

- **[ ] User Customization & Saving:**
  - [ ] Allow users to save their own custom presets to their browser's local storage.
  - [ ] Implement a system for sharing presets via URLs.

- **[ ] Export Options:**
  - [ ] Add video recording/export functionality (e.g., export a 10-second WebM loop).