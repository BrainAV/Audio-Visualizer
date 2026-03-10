const canvas = document.getElementById('spiralCanvas');
const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
if (!gl) throw new Error('WebGL not supported');

const { program, locations } = setupWebGL(gl);

let currentParams = {};
const defaultParams = {
  scale: 30, nodes: 12, angleStep: 60, rotation: 0, layers: 3, layerRatio: 2,
  verticalMirror: false, horizontalMirror: false, strokeColor: '#00FFFF',
  lineWidth: 2, opacity: 1, spiralType: 'linear', backgroundColor: '#111111',
  verticalColor: '#FF00FF', horizontalColor: '#FFFF00', bothColor: '#FFFFFF',
  gradientStroke: true, dashEffect: false, curvedLines: false,
  lineEndStyle: 'boxed', // New parameter: 'boxed', 'tapered', or 'rounded'
  scaleGap: 10, scaleSensitivity: 1, audioLineWidth: false
};
let baseScale = defaultParams.scale;
let baseLineWidth = defaultParams.lineWidth;

// -------------------------------
// Canvas Setup
// -------------------------------
const positionBuffer = gl.createBuffer();
const distanceBuffer = gl.createBuffer();
const widthBuffer = gl.createBuffer();
const normalBuffer = gl.createBuffer();
const buffers = {
  position: positionBuffer,
  distance: distanceBuffer,
  width: widthBuffer,
  normal: normalBuffer
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  drawSpiral();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// -------------------------------
// Removed Legacy Spiral Drawing Functions
// (See drawing.js for the new WebGL engine)
// -------------------------------

function updateParams() {
  currentParams = {
    scale: parseFloat(document.getElementById('scale').value),
    nodes: parseInt(document.getElementById('nodes').value),
    angleStep: parseFloat(document.getElementById('angleStep').value),
    rotation: parseFloat(document.getElementById('rotation').value),
    layers: parseInt(document.getElementById('layers').value),
    layerRatio: parseFloat(document.getElementById('layerRatio').value),
    verticalMirror: document.getElementById('verticalMirror').checked,
    horizontalMirror: document.getElementById('horizontalMirror').checked,
    strokeColor: document.getElementById('strokeColor').value,
    lineWidth: parseFloat(document.getElementById('lineWidth').value),
    opacity: parseFloat(document.getElementById('opacity').value),
    spiralType: document.getElementById('spiralType').value,
    backgroundColor: document.getElementById('backgroundColor').value,
    verticalColor: document.getElementById('verticalColor').value,
    horizontalColor: document.getElementById('horizontalColor').value,
    bothColor: document.getElementById('bothColor').value,
    gradientStroke: document.getElementById('gradientStroke').checked,
    dashEffect: document.getElementById('dashEffect').checked,
    curvedLines: document.getElementById('curvedLines').checked,
    lineEndStyle: document.getElementById('lineEndStyle').value,
    autoRotate: document.getElementById('autoRotate').checked,
    audioReactive: document.getElementById('audioReactive').checked,
    audioRotate: document.getElementById('audioRotate').checked,
    audioScale: document.getElementById('audioScale').checked,
    audioLineWidth: document.getElementById('audioLineWidth')?.checked || false,
    audioOpacity: document.getElementById('audioOpacity').checked,
    scaleGap: parseFloat(document.getElementById('scaleGap')?.value || defaultParams.scaleGap),
    scaleSensitivity: parseFloat(document.getElementById('scaleSensitivity')?.value || defaultParams.scaleSensitivity)
  };
}

function drawSpiral() {
  updateParams();
  drawSpiralOnContext(gl, canvas.width, canvas.height, currentParams, locations, buffers);
}

// -------------------------------
// Auto-Rotate Animation
// -------------------------------
function animateRotation() {
  if (currentParams.autoRotate) {
    let rotationInput = document.getElementById('rotation');
    let currentRotation = parseFloat(rotationInput.value);
    currentRotation = (currentRotation + 1) % 360;
    rotationInput.value = currentRotation;
    document.getElementById('rotationValue').textContent = Math.round(currentRotation);
    drawSpiral();
    requestAnimationFrame(animateRotation);
  }
}

// -------------------------------
// Download Function
// -------------------------------
function downloadCanvas() { // This function is complex due to WebGL context recreation
  const downloadCanvas = document.createElement('canvas');
  downloadCanvas.width = 2160;
  downloadCanvas.height = 2160;
  const downloadGl = downloadCanvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!downloadGl) throw new Error('WebGL not supported for download');

  // Re-create shaders and program for the download context
  const { program: downloadProgram } = setupWebGL(downloadGl);
  /*
  const downloadProgram = downloadGl.createProgram();
  downloadGl.attachShader(downloadProgram, downloadVertexShader);
  downloadGl.attachShader(downloadProgram, downloadFragmentShader);
  downloadGl.linkProgram(downloadProgram);
  if (!downloadGl.getProgramParameter(downloadProgram, downloadGl.LINK_STATUS)) {
    console.error(downloadGl.getProgramInfoLog(downloadProgram));
  }
  */

  // Redraw the entire scene on the new, high-resolution canvas
  const newBuffers = { position: downloadGl.createBuffer(), distance: downloadGl.createBuffer(), width: downloadGl.createBuffer(), normal: downloadGl.createBuffer() };
  drawSpiralOnContext(downloadGl, downloadCanvas.width, downloadCanvas.height, currentParams, downloadLocations, newBuffers, true);

  downloadGl.finish(); // Ensure drawing is complete

  const link = document.createElement('a');
  link.download = 'audio-visualizer.png';
  link.href = downloadCanvas.toDataURL('image/png');
  link.click();
}

// -------------------------------
// Ratio Buttons
// -------------------------------
function setRatio(ratio) {
  const ratioInput = document.getElementById('layerRatio');
  ratioInput.value = ratio;
  document.getElementById('layerRatioValue').textContent = ratio.toFixed(1);
  saveState();
  drawSpiral();
}

// -------------------------------
// Fullscreen Handling
// -------------------------------

// Initial draw
drawSpiral();
