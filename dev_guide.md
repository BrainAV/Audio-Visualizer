# Developer Guide: Audio Visualizer

Welcome to the developer guide for the Audio Visualizer. This document provides an overview of the project structure and instructions for contributing.

## Project Structure

- **`index.html`**: The main entry point of the application. It contains the canvas element and the HTML structure for all UI controls.
- **`styles.css`**: Contains all the styles for the application, including the layout of the controls panel and canvas.
- **`presets.js`**: A JavaScript file containing a single `presets` object. This object stores the parameter configurations for all available presets.
- **`script.js`**: The main script that coordinates the application. It initializes the canvas, manages global parameters, and orchestrates calls to other modules.
- **`webgl-setup.js`**: Handles the low-level WebGL boilerplate, including shader compilation, program linking, and getting attribute/uniform locations.
- **`drawing.js`**: Contains all logic for calculating vertices and rendering the spiral visuals onto the canvas.
- **`audio.js`**: Manages the Web Audio API setup, analyzes microphone input, and runs the audio-reactive animation loop.
- **`ui.js`**: Contains all event listeners and DOM manipulation logic for the control panel, presets, and other user interface elements.
- **`state.js`**: Manages the application's state, including the undo history and the reset functionality.

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
3.  That's it! The `presetOptions` array is now generated automatically from the `presets` object, so the new preset will appear in the dropdown with a formatted name (e.g., `myNewPreset` becomes "My New Preset").

### Modifying Drawing Logic

The drawing logic is now based on WebGL shaders defined in `webgl-setup.js`.

- **`vertexShaderSource`**: Determines the position of each vertex on the screen.
- **`fragmentShaderSource`**: Determines the color and style of each pixel (e.g., gradients, dashes, line ends).
- **`drawSpiralPath(...)`** (in `drawing.js`): This function calculates all the vertex positions for the spiral segments and uploads them to the GPU via buffers.

To change the fundamental appearance of the lines, you will need to modify the GLSL code in the fragment shader within `webgl-setup.js`. To change the shape of the spiral, you will modify the vertex generation loop inside `drawSpiralPath` within `drawing.js`.

### Maintaining Project Documentation

To keep the project organized and track its progress, it's important to maintain the following files:

- **`changelog.md`**: When you add a feature, fix a bug, or make any notable change, add a line item to the `[Unreleased]` section of the changelog. This helps everyone see what's new in upcoming releases.

- **`README.md`**: As the project's front page, the README should always reflect the current state of the application. When adding significant user-facing features (e.g., new audio options) or content (e.g., new presets), make sure the "Features" and "Presets" sections are updated accordingly.

- **`roadmap.md`**: This file tracks planned features. If you start working on a planned feature, please update its status (e.g., mark the checkbox `[x]`). If you have ideas for major new features, add them to the appropriate section of the roadmap for discussion.

### Coding Style

- Use Prettier for consistent code formatting (or follow the existing style).
- Write clear and descriptive variable and function names.
- Comment on complex or non-obvious sections of code.