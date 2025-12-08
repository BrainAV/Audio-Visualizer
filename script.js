const canvas = document.getElementById('spiralCanvas');
const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
if (!gl) throw new Error('WebGL not supported');

const { program, locations } = setupWebGL(gl);

let currentParams = {};
const defaultParams = {
  scale: 30, nodes: 12, rotation: 0, layers: 3, layerRatio: 2,
  verticalMirror: false, horizontalMirror: false, strokeColor: '#00FFFF',
  lineWidth: 2, opacity: 1, spiralType: 'linear', backgroundColor: '#111111',
  verticalColor: '#FF00FF', horizontalColor: '#FFFF00', bothColor: '#FFFFFF',
  gradientStroke: true, dashEffect: false, curvedLines: false,
  lineEndStyle: 'boxed', // New parameter: 'boxed', 'tapered', or 'rounded'
  scaleGap: 10, scaleSensitivity: 1
};
let baseScale = defaultParams.scale;

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
// Spiral Drawing Functions
// -------------------------------
function drawSpiralOnContext(gl, width, height, params) {
  const bg = params.backgroundColor;
  gl.clearColor(
    parseInt(bg.slice(1, 3), 16) / 255,
    parseInt(bg.slice(3, 5), 16) / 255,
    parseInt(bg.slice(5, 7), 16) / 255,
    1.0
  );
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform2f(locations.resolution, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  for (let l = 0; l < params.layers; l++) {
    const currentScale = params.scale * Math.pow(params.layerRatio / 5, l);
    const initialAngle = (params.rotation + (l * 10)) * (Math.PI / 180);

    drawSpiralPath(gl, centerX, centerY, params, initialAngle, currentScale, false, false, params.strokeColor);
    if (params.verticalMirror || params.horizontalMirror) {
      if (params.verticalMirror && params.horizontalMirror) {
        drawSpiralPath(gl, centerX, centerY, params, initialAngle, currentScale, true, true, params.bothColor);
      }
      if (params.verticalMirror) {
        drawSpiralPath(gl, centerX, centerY, params, initialAngle, currentScale, true, false, params.verticalColor);
      }
      if (params.horizontalMirror) {
        drawSpiralPath(gl, centerX, centerY, params, initialAngle, currentScale, false, true, params.horizontalColor);
      }
    }
  }
}

function quadraticBezier(t, p0, p1, p2) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const x = uu * p0[0] + 2 * u * t * p1[0] + tt * p2[0];
  const y = uu * p0[1] + 2 * u * t * p1[1] + tt * p2[1];
  return [x, y];
}

function generateThickLineVertices(startX, startY, endX, endY, width, isFirst, isLast, lineEndStyle) {
  const dx = endX - startX;
  const dy = endY - startY;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = dy / len * width / 2;
  const ny = -dx / len * width / 2;

  let vertices = [];
  let normals = [];

  if (lineEndStyle === 'tapered' && isLast) {
    // Tapered end: width reduces to 0 at the end
    vertices = [
      startX + nx, startY + ny,
      startX - nx, startY - ny,
      endX, endY,
      endX, endY
    ];
    normals = [
      nx, ny,
      -nx, -ny,
      0, 0,
      0, 0
    ];
  } else {
    // Boxed or rounded: consistent width
    vertices = [
      startX + nx, startY + ny,
      startX - nx, startY - ny,
      endX + nx, endY + ny,
      endX - nx, endY - ny
    ];
    normals = [
      nx, ny,
      -nx, -ny,
      nx, ny,
      -nx, -ny
    ];
  }

  return { vertices, normals };
}

function drawSpiralPath(gl, centerX, centerY, params, initialAngle, currentScale, mirrorX, mirrorY, color) {
  const positions = [];
  const distances = [];
  const widths = [];
  const normals = [];
  let angle = initialAngle;
  let prevX = centerX;
  let prevY = centerY;
  let totalDistance = 0;
  const baseWidth = params.lineWidth;

  // Generate vertices for each segment
  const points = [{ x: centerX, y: centerY }];
  for (let i = 1; i < params.nodes; i++) {
    let r = params.spiralType === 'linear' ? currentScale * i : currentScale * Math.exp(0.1 * i);
    let x = centerX + Math.cos(angle) * r;
    let y = centerY + Math.sin(angle) * r;

    if (mirrorX) x = centerX * 2 - x;
    if (mirrorY) y = centerY * 2 - y;
    points.push({ x, y });
    angle += Math.PI / 3; // Adjust angle increment based on shape (e.g., heptagon: 2π/7)
  }

  for (let i = 0; i < points.length - 1; i++) {
    let p0 = points[i];
    let p1 = points[i + 1];
    let p2 = (i < points.length - 2) ? points[i + 2] : p1;

    if (params.curvedLines) {
      const startPoint = p0;
      const controlPoint = p1;
      const endPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      // For the very last segment, draw a straight line to the final point to complete the shape.
      if (i === points.length - 2) {
        endPoint.x = p2.x;
        endPoint.y = p2.y;
      }

      const segments = 10; // Subdivisions for the curve
      let curvePrevX = startPoint.x;
      let curvePrevY = startPoint.y;

      for (let j = 1; j <= segments; j++) {
        const t = j / segments;
        const [curveX, curveY] = quadraticBezier(t, [startPoint.x, startPoint.y], [controlPoint.x, controlPoint.y], [endPoint.x, endPoint.y]);
        totalDistance = addSegmentToBuffers(curvePrevX, curvePrevY, curveX, curveY, totalDistance, baseWidth, params, positions, distances, widths, normals, i === 0 && j === 1, i >= points.length - 2 && j === segments);
        curvePrevX = curveX;
        curvePrevY = curveY;
      }
    } else {
      totalDistance = addSegmentToBuffers(p0.x, p0.y, p1.x, p1.y, totalDistance, baseWidth, params, positions, distances, widths, normals, i === 0, i === points.length - 2);
    }
  }

  function addSegmentToBuffers(x1, y1, x2, y2, currentTotalDistance, width, params, positions, distances, widths, normals, isFirst, isLast) {
    const segmentLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const d_start = currentTotalDistance;
    const d_end = currentTotalDistance + segmentLength;

    if (width > 1) {
      const { vertices, normals: segmentNormals } = generateThickLineVertices(x1, y1, x2, y2, width, isFirst, isLast, params.lineEndStyle);
      const v0 = [vertices[0], vertices[1]], v1 = [vertices[2], vertices[3]], v2 = [vertices[4], vertices[5]], v3 = [vertices[6], vertices[7]];
      const n0 = [segmentNormals[0], segmentNormals[1]], n1 = [segmentNormals[2], segmentNormals[3]], n2 = [segmentNormals[4], segmentNormals[5]], n3 = [segmentNormals[6], segmentNormals[7]];

      positions.push(v0[0], v0[1], v1[0], v1[1], v2[0], v2[1]);
      distances.push(d_start, d_start, d_end);
      widths.push(width, width, width);
      normals.push(n0[0], n0[1], n1[0], n1[1], n2[0], n2[1]);

      positions.push(v2[0], v2[1], v1[0], v1[1], v3[0], v3[1]);
      distances.push(d_end, d_start, d_end);
      widths.push(width, width, width);
      normals.push(n2[0], n2[1], n1[0], n1[1], n3[0], n3[1]);
    } else {
      positions.push(x2, y2);
      distances.push(d_end);
      widths.push(width);
      normals.push(0, 0);
    }
    return d_end;
  }

  // Set up buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, distanceBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(distances), gl.STATIC_DRAW);
  gl.vertexAttribPointer(locations.distance, 1, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, widthBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(widths), gl.STATIC_DRAW);
  gl.vertexAttribPointer(locations.width, 1, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(locations.normal, 2, gl.FLOAT, false, 0, 0);

  // Set uniforms
  const r = parseInt(color.slice(1, 3), 16) / 255;
  const g = parseInt(color.slice(3, 5), 16) / 255;
  const b = parseInt(color.slice(5, 7), 16) / 255;
  gl.uniform4f(locations.color, r, g, b, params.opacity);
  gl.uniform1f(locations.dashSize, 5.0);
  gl.uniform1f(locations.gapSize, 5.0);
  gl.uniform1i(locations.dashEnabled, params.dashEffect ? 1 : 0);
  gl.uniform1i(locations.gradientEnabled, params.gradientStroke ? 1 : 0);
  gl.uniform1i(locations.lineEndStyle, params.lineEndStyle === 'boxed' ? 0 : params.lineEndStyle === 'tapered' ? 1 : 2);
  gl.uniform1f(locations.maxDistance, totalDistance);
  gl.uniform1f(locations.lineWidth, baseWidth);

  // Draw
  if (params.lineWidth > 1) {
    const vertexCount = positions.length / 2;
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  } else {
    gl.drawArrays(gl.LINE_STRIP, 0, params.nodes);
  }
}

function updateParams() {
  currentParams = {
    scale: parseFloat(document.getElementById('scale').value),
    nodes: parseInt(document.getElementById('nodes').value),
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
  drawSpiralOnContext(downloadGl, downloadCanvas.width, downloadCanvas.height, currentParams, downloadProgram.locations, { position: downloadGl.createBuffer(), distance: downloadGl.createBuffer(), width: downloadGl.createBuffer(), normal: downloadGl.createBuffer() });

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
