# 🚀 Release v1.1.0: The Multi-Layer Update

Welcome to Audio Visualizer v1.1.0! This massive architectural update unlocks entirely new ways to mix and match visuals.

## ✨ What's New

*   **Multi-Layer Compositor:** You are no longer restricted to just one spiral! The new Layer Manager allows you to stack, remove, and independently control multiple visualizer plugins on a single canvas.
*   **Fractal Visualizer:** Dive deep into the Mandelbrot and Julia sets! We've added our first new visualizer plugin. It comes with its own dedicated UI controls, coloring palettes, and audio-reactive properties. 
*   **Per-Layer Properties:** Controls like `Spin Speed` and `Rotation` are now specific to each layer, allowing one layer to spin clockwise while the layer beneath it spins organically and counter-clockwise!
*   **Smart Layout UI:** 
    * The controls panel dynamically swaps its parameter sliders based on which layer you currently have selected.
    * The UI now features a **Screensaver Mode** - it smoothly fades out after 4 seconds of inactivity so you can enjoy the visuals distraction-free.
    * We added a helpful '?' Info Modal to explain the controls to new users.
*   **Audio-Reactive Polish:** Line Widths and Scales now react more naturally to microphone input.

## 🛠️ Under the Hood

*   **Plugin Architecture:** The entire WebGL engine was modularized. Visualizers like `spiral.js` and `fractal.js` are now distinct plugins following a standardized `appState` contract.
*   **GPU Optimizations:** Fixed critical WebGL state leakage issues and moved geometry caching entirely to the GPU, guaranteeing a buttery-smooth 60fps even with multiple reactive layers.

*Enjoy the updated visuals!*
— The BrainAV Team 🧠
