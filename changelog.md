# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `roadmap.md` for planning future development.
- `dev_guide.md` for contributor guidelines.
- `changelog.md` to track project changes.

### Changed
- Updated project title in `index.html` and `README.md` to "Audio Visualizer".
- Integrated advanced mobile touch controls (pinch-to-zoom and drag-to-rotate) from prototype.
- **Major Upgrade**: Replaced 2D Canvas renderer with a high-performance WebGL engine from the `/3/` prototype.

## [1.0.0] - 2025-12-08

### Added
- Initial release of the Audio Visualizer.
- Core features: spiral generation, layering, mirroring, and color customization.
- 12 initial presets for different visual styles.
- Audio-reactivity for scale, rotation, and opacity based on microphone input.
- High-resolution PNG export.