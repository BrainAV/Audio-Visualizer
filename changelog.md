# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Created `.github` directory containing `CONTRIBUTING.md` and `ISSUE_TEMPLATE` configurations.
- Created `.gemini` directory with `PROJECT_CONTEXT.md` and `CODING_STANDARDS.md` to assist AI development.

### Changed
- Updated repository references in `README.md` to the new `BrainAV` organization.
- Standardized documentation filenames to uppercase (`CHANGELOG.md`, `ROADMAP.md`, `DEV_GUIDE.md`).
- Updated `DEV_GUIDE.md` to reflect the new folder structure and contribution workflow.

### Fixed

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