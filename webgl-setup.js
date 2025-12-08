function setupWebGL(gl) {
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute float a_distance;
    attribute float a_width;
    attribute vec2 a_normal;
    uniform vec2 u_resolution;
    varying float v_distance;
    varying float v_width;
    varying vec2 v_normal;
    void main() {
      vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
      gl_Position = vec4(clipSpace.x, -clipSpace.y, 0.0, 1.0);
      v_distance = a_distance;
      v_width = a_width;
      v_normal = a_normal;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    uniform float u_dashSize;
    uniform float u_gapSize;
    uniform int u_dashEnabled;
    uniform int u_gradientEnabled;
    uniform int u_lineEndStyle; // 0: boxed, 1: tapered, 2: rounded
    uniform float u_maxDistance;
    uniform float u_lineWidth;
    varying float v_distance;
    varying float v_width;
    varying vec2 v_normal;
    void main() {
      vec4 color = u_color;
      if (u_gradientEnabled == 1) {
        float t = v_distance / u_maxDistance;
        color.rgb = mix(color.rgb, vec3(0.0), t);
      }
      if (u_lineEndStyle == 1) { // Tapered
        float t = v_distance / u_maxDistance;
        float taperFactor = 1.0 - t;
        if (length(v_normal) > taperFactor * u_lineWidth / 2.0) discard;
      }
      if (u_lineEndStyle == 2) { // Rounded
        float distFromCenter = length(v_normal);
        if (distFromCenter > u_lineWidth / 2.0) discard;
      }
      if (u_dashEnabled == 1 && mod(v_distance, u_dashSize + u_gapSize) > u_dashSize) discard;
      gl_FragColor = color;
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  const locations = {
    position: gl.getAttribLocation(program, 'a_position'),
    distance: gl.getAttribLocation(program, 'a_distance'),
    width: gl.getAttribLocation(program, 'a_width'),
    normal: gl.getAttribLocation(program, 'a_normal'),
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    color: gl.getUniformLocation(program, 'u_color'),
    dashSize: gl.getUniformLocation(program, 'u_dashSize'),
    gapSize: gl.getUniformLocation(program, 'u_gapSize'),
    dashEnabled: gl.getUniformLocation(program, 'u_dashEnabled'),
    gradientEnabled: gl.getUniformLocation(program, 'u_gradientEnabled'),
    lineEndStyle: gl.getUniformLocation(program, 'u_lineEndStyle'),
    maxDistance: gl.getUniformLocation(program, 'u_maxDistance'),
    lineWidth: gl.getUniformLocation(program, 'u_lineWidth'),
  };

  gl.enableVertexAttribArray(locations.position);
  gl.enableVertexAttribArray(locations.distance);
  gl.enableVertexAttribArray(locations.width);
  gl.enableVertexAttribArray(locations.normal);

  return {
    program,
    locations,
  };
}