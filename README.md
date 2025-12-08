https://jasonbra1n.github.io/Audio-Visualizer/

# Audio Visualizer

Create stunning, customizable spiral visualizations with vibrant colored mirrors, multi-layered designs, and dynamic cosmic effects. This web-based tool lets you tweak scale, nodes, layers, and ratios, with options for logarithmic or linear growth, gradient strokes, dashed lines, and auto-rotation. Explore 12 presets—from the ethereal **Nebula** to the rippling **Cosmic Wave**—or craft your own visual masterpiece.

An interactive web-based visualizer that creates mesmerizing spiral patterns with customizable parameters and mirror effects. Built with HTML, CSS, and JavaScript, this project allows users to experiment with spirals, layers, mirroring, and colors, and download high-resolution images of their creations.

**[Live Demo](https://jasonbra1n.github.io/Audio-Visualizer/)** | **[Repository](https://github.com/jasonbra1n/Audio-Visualizer)**

## Features

- **Layered Spirals**: Stack up to 100 layers with adjustable scaling (shrink or grow).
- **Colored Mirroring**: Vertical, horizontal, or both, with distinct colors for each.
- **Audio-Reactive**: Watch the visualizer react to your microphone input, with options for scale, rotation, and opacity to respond to sound.
- **Dynamic Effects**: Auto-rotate, gradients, dashes, and multiple line end styles (boxed, tapered, rounded).
- **High-Performance Engine**: Powered by WebGL for smooth rendering of complex, multi-layered designs.
- **Presets**: 16 unique designs, optimized for cosmic and artistic impact.
- **Responsive**: Works on desktop and mobile with touch controls.
- **Export**: Download high-res PNGs (2160x2160).

## Topics

- canvas
- javascript
- spiral-generator
- visual-art
- web-app
- interactive
- cosmic-design
- geometry

## Usage

1. Open the [live demo](https://jasonbra1n.github.io/Audio-Visualizer/) in your browser.
2. Use the controls to customize your spiral:
   - **Core Parameters**: Adjust scale, nodes, rotation, and toggle auto-rotation.
   - **Layer Controls**: Set the number of layers (max 100) and layer ratio, or use the Golden/Silver Ratio buttons.
   - **Mirror Effects**: Enable mirroring and pick colors for vertical, horizontal, or both.
   - **Style Options**: Choose colors, line width, opacity, spiral type, gradient stroke, and dashed lines.
3. Click "Download Image (2160×2160)" to save your creation as a high-resolution PNG.

## Installation

To run this project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jasonbra1n/Audio-Visualizer.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd Audio-Visualizer
   ```
3. **Open `index.html`**:
   - Use a local server (recommended) for full functionality:
     ```bash
     npx http-server
     ```
     Then visit `http://localhost:8080` in your browser.
   - Alternatively, open `index.html` directly (some features, like downloads, may be limited due to browser security restrictions).

## Files

- `index.html`: The main HTML structure with controls and canvas.
- `styles.css`: CSS for responsive layout and styling.
- `script.js`: The main script that initializes the application and coordinates the other modules.
- `webgl-setup.js`: Handles low-level WebGL shader and program setup.
- `drawing.js`: Contains the core logic for calculating and rendering the spiral visuals.
- `audio.js`: Manages microphone input and audio-reactive animations.
- `ui.js`: Controls all user interface interactions and event listeners.
- `state.js`: Manages application state, including undo/reset functionality.
- `presets.js`: Stores all preset configurations.

## How It Works

- The spiral is drawn on an HTML5 canvas using JavaScript, updating instantly with user inputs.
- **WebGL Rendering**: The visualization is rendered using WebGL and shaders, leveraging the GPU for high performance. This allows for more layers, nodes, and effects while maintaining a smooth framerate.
- Mirror effects reflect the spiral path across vertical and/or horizontal axes with customizable colors.
- Logarithmic spirals use an exponential growth factor, while linear spirals increase radius proportionally.

## Presets

- **Golden Spiral**: A dense logarithmic spiral with 50 nodes, 50 layers, and a soft golden glow (ratio 4.8).
- **Dense Mirror**: A tightly packed, mirrored linear spiral with 50 nodes, 80 layers, and dashed lines (ratio 4.6).
- **Minimalist**: A subtle, three-layer spiral with 12 nodes and smooth curves (ratio 5).
- **Star Burst**: A vibrant, fully mirrored spiral with 50 nodes, 40 layers, and auto-rotation (ratio 5.2).
- **Double Helix**: A helical logarithmic spiral with 40 nodes, 20 layers, and vertical mirroring (ratio 5.5).
- **Nebula**: A cosmic, semi-transparent spiral with 50 nodes, 100 layers, and a space-cloud effect (ratio 4.7).
- **Kaleidoscope**: A mirrored, dashed spiral with 50 nodes, 60 layers, and auto-rotation (ratio 4.8).
- **Cosmic Wave**: A flowing, auto-rotating spiral with 45 nodes, 70 layers, and logarithmic curves (ratio 4.5).
- **Fractal Bloom**: A detailed, mirrored spiral with 50 nodes, 50 layers, and smooth curves (ratio 5.3).
- **Crystal Vortex**: A sharp, logarithmic spiral with 40 nodes, 40 layers, and vertical mirroring (ratio 4.9).
- **Galactic Pulse**: A bold, auto-rotating spiral with 50 nodes, 60 layers, and horizontal mirroring (ratio 5.1).
- **Ethereal Rings**: A soft, dashed spiral with 30 nodes, 80 layers, and full mirroring (ratio 4.6).
- **Violet Bloom**: A thick, mirrored spiral with 50 nodes and a vibrant violet color scheme.
- **Twilight Petals**: A mirrored, logarithmic spiral with purple and blue tones, resembling petals at dusk.
- **Solar Flare Blossom**: A very thick, low-opacity, dashed spiral with fiery yellow and orange colors.
- **Midnight Bloom**: A dark, logarithmic, and dashed spiral with deep blue and purple tones.

## Contributing

Feel free to fork this repository and submit pull requests with enhancements or bug fixes. Suggestions are welcome via GitHub Issues!

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by geometric art and audio-reactive visuals.
- Built with love for creative coding and interactive web experiences.
- Special thanks to collaborators for feedback and feature ideas!

---

Created by [jasonbra1n](https://github.com/jasonbra1n) | December 2025
