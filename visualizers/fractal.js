const FractalVisualizer = {
  name: 'Fractal',
  
  // Return the default state for a layer using this visualizer
  getDefaultParams: () => ({
    fractalType: 'mandelbrot', // or 'julia'
    zoom: 1.0,
    offsetX: 0.0,
    offsetY: 0.0,
    rotation: 0, // Added rotation for Auto-Rotate
    autoRotateSpeed: 1.0, // Controls auto rotate speed and direction for this layer
    iterations: 100,
    colorPalette: 'ocean', // Different color mapping schemes
    fractalOpacity: 1.0,
    juliaCx: -0.4,
    juliaCy: 0.6
  }),

  _program: null,
  _locations: null,
  _buffer: null,

  _initWebGL: function(gl) {
    if (this._program) return;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;

      uniform vec2 u_resolution;
      uniform int u_fractalType; // 0 = mandelbrot, 1 = julia
      uniform float u_zoom;
      uniform vec2 u_offset;
      uniform int u_iterations;
      uniform float u_opacity;
      uniform vec2 u_juliaC;
      uniform int u_colorPalette; 
      uniform float u_rotation; // Rotation angle in radians

      vec3 getPalette(float t, int index) {
        // Simple palettes based on iteration ratio
        if (index == 0) { // Ocean
          return vec3(0.0, t * 0.5, t);
        } else if (index == 1) { // Fire
          return vec3(t, t * 0.4, 0.0);
        } else if (index == 2) { // Psychedelic
          return 0.5 + 0.5 * cos(6.28318 * (vec3(1.0, 1.0, 1.0) * t + vec3(0.0, 0.33, 0.67)));
        }
        return vec3(t);
      }

      void main() {
        // Normalize coordinates and account for aspect ratio
        vec2 c = (v_uv * u_resolution) / min(u_resolution.x, u_resolution.y);
        
        // Apply 2D Rotation (Literal spinning)
        float sa = sin(u_rotation);
        float ca = cos(u_rotation);
        mat2 rot = mat2(ca, -sa, sa, ca);
        c = rot * c;

        // Apply zoom and offset
        c = c / u_zoom + u_offset;

        vec2 z = c;
        vec2 startC = c;
        if (u_fractalType == 1) {
            // Organic morphing for Julia sets
            // Use the rotation angle to slowly morph the C parameters
            vec2 morphC = vec2(
                u_juliaC.x + sin(u_rotation * 0.5) * 0.1,
                u_juliaC.y + cos(u_rotation * 0.5) * 0.1
            );
            startC = morphC;
        } else {
            z = vec2(0.0);
        }

        int iter = 0;
        for (int i = 0; i < 1000; i++) {
          if (i >= u_iterations) break;
          float x = (z.x * z.x - z.y * z.y) + startC.x;
          float y = (z.y * z.x + z.x * z.y) + startC.y;
          
          if ((x * x + y * y) > 4.0) break;
          z.x = x;
          z.y = y;
          iter++;
        }

        if (iter == u_iterations) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black center
        } else {
          float t = float(iter) / float(u_iterations);
          vec3 color = getPalette(t, u_colorPalette);
          gl_FragColor = vec4(color, u_opacity);
        }
      }
    `;

    const vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    this._program = gl.createProgram();
    gl.attachShader(this._program, vertexShader);
    gl.attachShader(this._program, fragmentShader);
    gl.linkProgram(this._program);

    if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this._program));
      return null;
    }

    this._locations = {
      position: gl.getAttribLocation(this._program, 'a_position'),
      resolution: gl.getUniformLocation(this._program, 'u_resolution'),
      fractalType: gl.getUniformLocation(this._program, 'u_fractalType'),
      zoom: gl.getUniformLocation(this._program, 'u_zoom'),
      offset: gl.getUniformLocation(this._program, 'u_offset'),
      iterations: gl.getUniformLocation(this._program, 'u_iterations'),
      opacity: gl.getUniformLocation(this._program, 'u_opacity'),
      juliaC: gl.getUniformLocation(this._program, 'u_juliaC'),
      colorPalette: gl.getUniformLocation(this._program, 'u_colorPalette'),
      rotation: gl.getUniformLocation(this._program, 'u_rotation') // New rotation uniform
    };

    // Full screen quad
    this._buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    const positions = [
      -1,  1,
      -1, -1,
       1,  1,
       1, -1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  },

  _loadShader: function(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  },

  render: function(gl, params, _locations, options = {}) {
    this._initWebGL(gl);

    // Switch to this specific shader program
    gl.useProgram(this._program);

    // Enable blending for multi-layer composition
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    for (let i = 0; i < 8; ++i) gl.disableVertexAttribArray(i); // Prevent attribute leaks

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    gl.enableVertexAttribArray(this._locations.position);
    gl.vertexAttribPointer(this._locations.position, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(this._locations.resolution, gl.canvas.width, gl.canvas.height);
    
    // Pass uniforms
    let typeInt = params.fractalType === 'julia' ? 1 : 0;
    gl.uniform1i(this._locations.fractalType, typeInt);
    
    let zoomVal = params.zoom;
    
    gl.uniform1f(this._locations.zoom, zoomVal);
    gl.uniform2f(this._locations.offset, params.offsetX, params.offsetY);
    gl.uniform1i(this._locations.iterations, params.iterations);
    gl.uniform1f(this._locations.opacity, params.fractalOpacity);
    gl.uniform2f(this._locations.juliaC, params.juliaCx, params.juliaCy);
    
    // Handle rotation with options fallback
    const layerAngleDeg = (params.rotation || 0) + (options.globalRotation || 0);
    const layerAngleRad = layerAngleDeg * (Math.PI / 180);
    gl.uniform1f(this._locations.rotation, layerAngleRad);
    
    let paletteInt = 0;
    if (params.colorPalette === 'fire') paletteInt = 1;
    if (params.colorPalette === 'psychedelic') paletteInt = 2;
    gl.uniform1i(this._locations.colorPalette, paletteInt);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // After drawing, we should probably reset state or the central compositor will switch back to its program.
    // The main script.js draws all layers, so the next layer will call gl.useProgram() anyway.
  }
};

window.Visualizers = window.Visualizers || {};
window.Visualizers.Fractal = FractalVisualizer;
