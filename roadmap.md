# Project Roadmap: Audio Visualizer

This document outlines the development roadmap for the Audio Visualizer project. It is a living document that will evolve as the project grows.

## Version 1.x (Current Focus)

The immediate goals are to refine the existing features, improve performance, and enhance the core audio-reactive experience.

- **[ ] Code Refactoring:**
  - [x] Modularize `script.js` into smaller, focused files (e.g., `ui.js`, `drawing.js`, `audio.js`, `state.js`).
  - [x] Optimize the animation loop to avoid unnecessary DOM reads on every frame and use `lerp` for smooth transitions. *(Discovered in `/2` prototype)*.
  - [ ] Convert `styles.css` to use CSS variables for easier theming.

- **[ ] UI/UX Enhancements:**
  - [ ] Add a "Start/Stop Audio" button to give users more explicit control over microphone access.
  - [ ] Improve layout and responsiveness of the controls panel for smaller screens.
  - [x] Integrate advanced mobile touch controls (pinch-to-zoom, drag-to-rotate) from the `/2` prototype.
  - [ ] Add tooltips to explain what each control does.

- **[ ] Core Feature Improvements:**
  - [ ] Add more parameters for audio reactivity (e.g., line width, number of nodes, layer ratio).
  - [ ] Create new presets specifically designed for audio visualization.

- **[ ] User Documentation:**
  - [ ] Create a user-friendly "How to Use" guide accessible from the main UI.
  - [ ] Add an "About" page detailing the project's purpose, features, and technology.

## Version 2.0 (Enhanced Reactivity)

This version will focus on integrating more advanced audio analysis techniques, likely based on the prototypes in the `/2` and `/3` folders.

- **[x] Advanced Rendering:**
  - [x] Explore and implement WebGL for significantly improved performance. *(Discovered in `/3` prototype)*.
  - [x] Re-implement `curvedLines` functionality in the new WebGL engine.

- **[ ] Advanced Audio Analysis:**
  - [ ] Implement FFT (Fast Fourier Transform) to analyze audio frequency data, not just amplitude.
  - [ ] Allow different visual parameters to react to different frequency ranges (e.g., bass frequencies affect scale, treble affects color or rotation speed).

- **[ ] New Visual Modes:**
  - [ ] Introduce new visualizer types beyond spirals (e.g., frequency bars, circular waveforms, particle systems, tunnel effects) leveraging the WebGL engine.
  - [ ] Allow color to be reactive to audio frequency or amplitude.

- **[ ] Input Sources:**
  - [ ] Add support for playing and visualizing local audio files (MP3, WAV).
  - [ ] Add support for selecting a different microphone input device.

## Version 3.0 (Future Vision)

- **[ ] User Customization & Saving:**
  - [ ] Allow users to save their own custom presets to their browser's local storage.
  - [ ] Implement a system for sharing presets via URLs.

- **[ ] Export Options:**
  - [ ] Add video recording/export functionality (e.g., export a 10-second WebM loop).