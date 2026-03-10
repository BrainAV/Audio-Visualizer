# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-03-10

### Added
- **Multi-Layer Composition System**: Introduced a new architecture allowing multiple visualizer layers to be stacked and managed independently.
- **Fractal Visualizer Plugin**: Added a new WebGL fragment shader visualizer (`visualizers/fractal.js`) capable of rendering high-performance Mandelbrot and Julia set fractals.
- **Per-Layer Spin Speed**: Added independent `Spin Speed` controls to layer transforms, allowing nested layers to rotate at different speeds and directions simultaneously.
- **Organic Julia Morphing**: The `Auto-Rotate` feature now drives organic mathematical morphing for Julia set fractals alongside 2D spinning.
- **Layer Manager UI**: Added a new UI section to add, remove, and select active layers, seamlessly swapping controls based on the selected layer type.
- **Screensaver Mode**: UI controls panel fades out when idle for 4 seconds to prevent screen burn-in.
- **Info/About Modal**: Added an informational modal, accessible via a `?` button, containing a "How To Use" guide and project details.
- **Angle Step Parameter**: Added an "Angle Step" parameter to allow dynamic polygonal/geometric spiral shapes (e.g., squares, Golden Ratio/Fibonacci spirals) beyond the hard-coded hexagon.
- **Audio-Reactive Line Width**: Line width can now dynamically react to audio amplitude.
- **AI Agent Skills**: Imported and created a suite of specialized agent skills (`visualizer-architect`, `ui-manager`, `ui-consistency`, `a11y-auditor`, `release-manager`, `documentation-sentinel`) and updated workflows (`create-new-visualizer.md`) to standardize future AI-assisted development.
- Created `.github` directory containing `CONTRIBUTING.md` and `ISSUE_TEMPLATE` configurations.
- Created `.gemini` directory with `PROJECT_CONTEXT.md` and `CODING_STANDARDS.md` to assist AI development.

### Changed
- **Plugin Architecture**: Modularized the monolithic WebGL engine. Extracted the original spiral logic into a standalone plugin (`visualizers/spiral.js`), acting as the foundation for the new composition compositor.
- **State Management**: Refactored `state.js` to support an array of layer configurations (`appState.layers`), moving away from a single global state object.
- **Global Audio Routing**: Updated `audio.js` to broadcast audio-reactive effects to all active layers simultaneously.
- **WebGL Performance Optimization**: Refactored the core rendering engine (`drawing.js` and `webgl-setup.js`) to cache geometry and perform transformations (rotation, scaling, mirroring) entirely on the GPU, greatly improving performance (smooth 60 fps) for auto-rotation and audio reactivity.
- Updated repository references in `README.md` to the new `BrainAV` organization.
- Standardized documentation filenames to uppercase (`CHANGELOG.md`, `ROADMAP.md`, `DEV_GUIDE.md`).
- Updated `DEV_GUIDE.md` to reflect the new folder structure and contribution workflow.

### Fixed
- Fixed an `autoRotate` bug where a single global rotation variable was overwriting independent layer orientations.
- Fixed a script loading race condition in `index.html` where `script.js` was referencing `state.js` functions before initialization.
- Fixed WebGL state leakage (`INVALID_OPERATION` errors) preventing multiple shaders from co-existing by explicitly unbinding vertex attribute arrays safely between draws.

## [1.0.0] - 2025-12-08

### Added
- Added a "Start/Stop Audio" button for explicit user control over microphone access.
- Added user documentation and new visual styles to the `ROADMAP.md`.
- `ROADMAP.md` for planning future development.
- `DEV_GUIDE.md` for contributor guidelines.
- `CHANGELOG.md` to track project changes.
- **Major Upgrade**: Replaced 2D Canvas renderer with a high-performance WebGL engine from the `/3/` prototype.

### Changed
- Updated `DEV_GUIDE.md` with current instructions for adding presets and maintaining `README.md`.
- Updated `README.md` to reflect the current number of presets (16) and features.
- Updated project title in `index.html` and `README.md` to "Audio Visualizer".
- Refactored `styles.css` to use CSS variables for easier theming and maintenance.
- Integrated advanced mobile touch controls (pinch-to-zoom and drag-to-rotate) from prototype.
- **Major Refactor**: Modularized the monolithic `script.js` into smaller, focused files (`webgl-setup.js`, `drawing.js`, `audio.js`, `ui.js`, `state.js`) for improved maintainability.

### Fixed
- Fixed an issue where tooltips would render partially off-screen or be clipped by the controls panel.
- Fixed a bug where curved lines would disappear or render incorrectly.
- Simplified the `layerRatio` UI control by removing the redundant and less responsive number input.