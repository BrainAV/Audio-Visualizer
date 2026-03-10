const canvas = document.getElementById('spiralCanvas');
const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
if (!gl) throw new Error('WebGL not supported');

const { program, locations } = setupWebGL(gl);

// Canvas Setup
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  drawComposition();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawComposition(forceUpdate = false) {
  // Clear the screen once per frame based on active layer's bg color
  const activeLayer = getActiveLayer();
  if (activeLayer) {
    const bg = activeLayer.params.backgroundColor || '#111111';
    gl.clearColor(
      parseInt(bg.slice(1, 3), 16) / 255,
      parseInt(bg.slice(3, 5), 16) / 255,
      parseInt(bg.slice(5, 7), 16) / 255,
      1.0
    );
  } else {
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
  }
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.uniform2f(locations.resolution, canvas.width, canvas.height);
  gl.uniform2f(locations.center, canvas.width / 2, canvas.height / 2);

  // Note: For now, audio rotation and audio scale are global options
  // that we pass down to each visualizer.
  let globalRotationOffset = 0;
  let globalScaleMultiplier = 1;
  const audioOptions = { forceUpdate, program }; // <--- passing program here

  // Example placeholders (Will be animated in audio.js/animateRotation):
  // if (masterAudioParams.autoRotate) { ... calculate globalRotationOffset }

  appState.layers.forEach(layer => {
    if (layer.visualizer && layer.visualizer.render) {
      layer.visualizer.render(gl, layer.params, locations, audioOptions);
    }
  });
}

// Global Animation loop replacing animateRotation
function animateRotation() {
  if (masterAudioParams.autoRotate) {
    // Update the rotation for all layers to keep the visualizer dynamic
    appState.layers.forEach(layer => {
      if (layer.params.rotation !== undefined) {
        const speed = layer.params.autoRotateSpeed !== undefined ? layer.params.autoRotateSpeed : 1.0;
        layer.params.rotation = (layer.params.rotation + speed) % 360;
        if (layer.params.rotation < 0) layer.params.rotation += 360; // Keep it positive for consistency
      }
    });
    
    // Update the UI feedback for the active layer
    const activeLayer = getActiveLayer();
    if (activeLayer && activeLayer.params.rotation !== undefined) {
      const rotationInput = document.getElementById('rotation');
      if (rotationInput) rotationInput.value = activeLayer.params.rotation;
      const rotationValue = document.getElementById('rotationValue');
      if (rotationValue) rotationValue.textContent = Math.round(activeLayer.params.rotation);
    }
    
    drawComposition();
    requestAnimationFrame(animateRotation);
  }
}

function downloadCanvas() { 
  // Store original dimensions
  const oldWidth = canvas.width;
  const oldHeight = canvas.height;

  // Temporarily resize main canvas for high-res export
  canvas.width = 2160;
  canvas.height = 2160;
  gl.viewport(0, 0, 2160, 2160);

  // Force a synchronous redraw on the main context
  drawComposition(true);

  // Extract the image safely since we have preserveDrawingBuffer: true and haven't yielded
  const link = document.createElement('a');
  link.download = 'audio-visualizer.png';
  link.href = canvas.toDataURL('image/png');
  link.click();

  // Restore the original canvas size and redraw
  canvas.width = oldWidth;
  canvas.height = oldHeight;
  gl.viewport(0, 0, oldWidth, oldHeight);
  drawComposition(true);
}

// Initial initialization
reset(); // This sets up the first layer and triggers the first drawComposition()
