# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added user documentation and new visual styles to the `roadmap.md`.
- `roadmap.md` for planning future development.
- `dev_guide.md` for contributor guidelines.
- `changelog.md` to track project changes.

### Changed
- Updated `dev_guide.md` with current instructions for adding presets and maintaining `README.md`.
- Updated `README.md` to reflect the current number of presets (16) and features.
- Updated project title in `index.html` and `README.md` to "Audio Visualizer".
- Integrated advanced mobile touch controls (pinch-to-zoom and drag-to-rotate) from prototype.
- **Major Refactor**: Modularized the monolithic `script.js` into smaller, focused files (`webgl-setup.js`, `drawing.js`, `audio.js`, `ui.js`, `state.js`) for improved maintainability.
- **Major Upgrade**: Replaced 2D Canvas renderer with a high-performance WebGL engine from the `/3/` prototype.

### Fixed
- Simplified the `layerRatio` UI control by removing the redundant and less responsive number input.

## [1.0.0] - 2025-12-08

### Added
- Initial release of the Audio Visualizer.
- Core features: spiral generation, layering, mirroring, and color customization.
- 12 initial presets for different visual styles.
- Audio-reactivity for scale, rotation, and opacity based on microphone input.
- High-resolution PNG export.