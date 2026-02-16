# Contributing to Audio Visualizer

Thank you for your interest in contributing! We welcome bug reports, feature requests, and pull requests.

## Development Setup

### Running Locally

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/BrainAV/Audio-Visualizer.git
    ```
2.  **Navigate into the project directory**:
    ```bash
    cd Audio-Visualizer
    ```
3.  **Start a local server**:
    For the best experience (and to avoid CORS issues), run a local web server. The simplest way is using `npx`:
    ```bash
    npx http-server
    ```
4.  **Open in Browser**:
    Open your browser to the provided `localhost` address (usually `http://localhost:8080`).

## How to Contribute

1.  **Fork the Repository** and create your branch from `main`.
2.  **Make your changes** and test them locally.
3.  **Submit a Pull Request** with a clear description of your changes.

## Coding Style

- Use Prettier for consistent code formatting (or follow the existing style).
- Write clear and descriptive variable and function names.
- Comment on complex or non-obvious sections of code.

## Maintaining Project Documentation

To keep the project organized, please update the following files when making changes:

- **`CHANGELOG.md`**: When you add a feature, fix a bug, or make any notable change, add a line item to the `[Unreleased]` section.

- **`README.md`**: If you add significant user-facing features (e.g., new audio options) or content (e.g., new presets), ensure the "Features" and "Presets" sections are updated.

- **`ROADMAP.md`**: If you start working on a planned feature, update its status (e.g., mark the checkbox `[x]`).

---

Thank you for helping improve Audio Visualizer!