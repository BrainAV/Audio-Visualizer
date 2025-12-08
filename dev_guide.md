# Developer Guide: Audio Visualizer

Welcome to the developer guide for the Audio Visualizer. This document provides an overview of the project structure and instructions for contributing.

## Project Structure

- **`index.html`**: The main entry point of the application. It contains the canvas element and the HTML structure for all UI controls.
- **`styles.css`**: Contains all the styles for the application, including the layout of the controls panel and canvas.
- **`script.js`**: The core logic of the application. It handles:
  - WebGL setup, shader compilation, and rendering.
  - All user input from the controls.
  - State management (undo/reset).
  - Animation loops (auto-rotate and audio-reactive).
  - Audio analysis via the Web Audio API.
  - Image exporting.
- **`presets.js`**: A JavaScript file containing a single `presets` object. This object stores the parameter configurations for all available presets.

## How to Contribute

### Running Locally

1.  Clone the repository.
2.  Navigate into the project directory.
3.  For the best experience, run a local web server. The simplest way is using `npx`:
    ```bash
    npx http-server
    ```
4.  Open your browser to the provided `localhost` address.

### Adding a New Preset

1.  Open `presets.js`.
2.  Add a new key-value pair to the `presets` object. The key is a camelCase name (e.g., `myNewPreset`), and the value is an object containing all parameters.
3.  Add a corresponding entry to the `presetOptions` array at the bottom of the file. This will automatically add it to the dropdown menu.
    - `value`: Must match the key from the `presets` object.
    - `label`: The user-friendly name that will appear in the UI.

### Modifying Drawing Logic

The drawing logic is now based on WebGL shaders defined at the top of `script.js`.

- **`vertexShaderSource`**: Determines the position of each vertex on the screen.
- **`fragmentShaderSource`**: Determines the color and style of each pixel (e.g., gradients, dashes, line ends).
- **`drawSpiralPath(...)`**: This function no longer draws directly. Instead, it calculates all the vertex positions for the spiral segments and uploads them to the GPU via buffers.

To change the fundamental appearance of the lines, you will need to modify the GLSL code in the fragment shader. To change the shape of the spiral, you will modify the vertex generation loop inside `drawSpiralPath`.

### Maintaining Project Documentation

To keep the project organized and track its progress, it's important to maintain the following files:

- **`changelog.md`**: When you add a feature, fix a bug, or make any notable change, add a line item to the `[Unreleased]` section of the changelog. This helps everyone see what's new in upcoming releases.

- **`roadmap.md`**: This file tracks planned features. If you start working on a planned feature, please update its status (e.g., mark the checkbox `[x]`). If you have ideas for major new features, add them to the appropriate section of the roadmap for discussion.

### Coding Style

- Use Prettier for consistent code formatting (or follow the existing style).
- Write clear and descriptive variable and function names.
- Comment on complex or non-obvious sections of code.