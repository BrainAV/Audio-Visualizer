const SpiralVisualizer = {
  name: 'Original Spiral',
  
  // Return the default state for a layer using this visualizer
  getDefaultParams: () => ({
    scale: 30, nodes: 12, angleStep: 60, rotation: 0, autoRotateSpeed: 1.0,
    verticalMirror: false, horizontalMirror: false, strokeColor: '#00FFFF',
    lineWidth: 2, opacity: 1, spiralType: 'linear',
    verticalColor: '#FF00FF', horizontalColor: '#FFFF00', bothColor: '#FFFFFF',
    gradientStroke: true, dashEffect: false, curvedLines: false, lineEndStyle: 'boxed'
  }),

  // Used to manage caching for this specific layer
  _cachedGeometryState: null,
  _cachedVertexCount: 0,
  _cachedTotalDistance: 0,
  _buffers: null, // Will hold the gl buffers for this layer

  _geometryNeedsUpdate: function(p1, p2) {
    if (!p1) return true;
    return p1.nodes !== p2.nodes ||
           p1.angleStep !== p2.angleStep ||
           p1.spiralType !== p2.spiralType ||
           p1.curvedLines !== p2.curvedLines ||
           p1.lineEndStyle !== p2.lineEndStyle ||
           p1.lineWidth !== p2.lineWidth;
  },

  _quadraticBezier: function(t, p0, p1, p2) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const x = uu * p0[0] + 2 * u * t * p1[0] + tt * p2[0];
    const y = uu * p0[1] + 2 * u * t * p1[1] + tt * p2[1];
    return [x, y];
  },

  _generateThickLineData: function(startX, startY, endX, endY, width, isFirst, isLast, lineEndStyle) {
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = dy / len * width / 2;
    const ny = -dx / len * width / 2;

    const vertices = [
      startX, startY,
      startX, startY,
      endX, endY,
      endX, endY
    ];
    
    let normals;
    if (lineEndStyle === 'tapered' && isLast) {
      normals = [nx, ny, -nx, -ny, 0, 0, 0, 0];
    } else {
      normals = [nx, ny, -nx, -ny, nx, ny, -nx, -ny];
    }

    return { vertices, normals };
  },

  _updateGeometryBuffers: function(gl, params, locations) {
    if (!this._buffers) {
      this._buffers = {
        position: gl.createBuffer(),
        distance: gl.createBuffer(),
        width: gl.createBuffer(),
        normal: gl.createBuffer()
      };
    }

    const positions = [];
    const distances = [];
    const widths = [];
    const normals = [];
    let angle = 0;
    let totalDistance = 0;
    const baseWidth = params.lineWidth;

    const points = [{ x: 0, y: 0 }];
    for (let i = 1; i < params.nodes; i++) {
      let r = params.spiralType === 'linear' ? i : Math.exp(0.1 * i);
      let x = Math.cos(angle) * r;
      let y = Math.sin(angle) * r;
      points.push({ x, y });
      angle += params.angleStep * (Math.PI / 180);
    }

    for (let i = 0; i < points.length - 1; i++) {
      let p0 = points[i];
      let p1 = points[i + 1];
      let p2 = (i < points.length - 2) ? points[i + 2] : p1;

      if (params.curvedLines) {
        const startPoint = p0;
        const controlPoint = p1;
        const endPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

        if (i === points.length - 2) {
          endPoint.x = p2.x;
          endPoint.y = p2.y;
        }

        const segments = 10;
        let curvePrevX = startPoint.x;
        let curvePrevY = startPoint.y;

        for (let j = 1; j <= segments; j++) {
          const t = j / segments;
          const [curveX, curveY] = this._quadraticBezier(t, [startPoint.x, startPoint.y], [controlPoint.x, controlPoint.y], [endPoint.x, endPoint.y]);
          totalDistance = this._addSegmentToBuffers(curvePrevX, curvePrevY, curveX, curveY, totalDistance, baseWidth, params, positions, distances, widths, normals, i === 0 && j === 1, i >= points.length - 2 && j === segments);
          curvePrevX = curveX;
          curvePrevY = curveY;
        }
      } else {
        totalDistance = this._addSegmentToBuffers(p0.x, p0.y, p1.x, p1.y, totalDistance, baseWidth, params, positions, distances, widths, normals, i === 0, i === points.length - 2);
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.distance);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(distances), gl.STATIC_DRAW);
    gl.vertexAttribPointer(locations.distance, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.width);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(widths), gl.STATIC_DRAW);
    gl.vertexAttribPointer(locations.width, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.normal);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(locations.normal, 2, gl.FLOAT, false, 0, 0);

    this._cachedVertexCount = params.lineWidth > 1 ? positions.length / 2 : params.nodes;
    this._cachedTotalDistance = totalDistance;
  },

  _addSegmentToBuffers: function(x1, y1, x2, y2, currentTotalDistance, width, params, positions, distances, widths, normals, isFirst, isLast) {
    const segmentLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const d_start = currentTotalDistance;
    const d_end = currentTotalDistance + segmentLength;

    if (width > 1) {
      const { vertices, normals: segmentNormals } = this._generateThickLineData(x1, y1, x2, y2, width, isFirst, isLast, params.lineEndStyle);
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
  },

  _drawCachedGeometry: function(gl, params, scale, rotation, mirrorX, mirrorY, color, locations) {
    for (let i = 0; i < 8; ++i) gl.disableVertexAttribArray(i); // Prevent attribute leaks

    // Re-bind buffers just in case another visualizer was using the locations
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.position);
    gl.enableVertexAttribArray(locations.position);
    gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.distance);
    gl.enableVertexAttribArray(locations.distance);
    gl.vertexAttribPointer(locations.distance, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.width);
    gl.enableVertexAttribArray(locations.width);
    gl.vertexAttribPointer(locations.width, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.normal);
    gl.enableVertexAttribArray(locations.normal);
    gl.vertexAttribPointer(locations.normal, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(locations.scale, scale);
    gl.uniform1f(locations.rotation, rotation);
    gl.uniform2f(locations.mirror, mirrorX, mirrorY);

    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    gl.uniform4f(locations.color, r, g, b, params.opacity);
    
    gl.uniform1f(locations.dashSize, 5.0);
    gl.uniform1f(locations.gapSize, 5.0);
    gl.uniform1i(locations.dashEnabled, params.dashEffect ? 1 : 0);
    gl.uniform1i(locations.gradientEnabled, params.gradientStroke ? 1 : 0);
    gl.uniform1i(locations.lineEndStyle, params.lineEndStyle === 'boxed' ? 0 : params.lineEndStyle === 'tapered' ? 1 : 2);
    gl.uniform1f(locations.lineWidth, params.lineWidth);
    gl.uniform1f(locations.maxDistance, this._cachedTotalDistance * scale);

    if (params.lineWidth > 1) {
      gl.drawArrays(gl.TRIANGLES, 0, this._cachedVertexCount);
    } else {
      gl.drawArrays(gl.LINE_STRIP, 0, this._cachedVertexCount);
    }
  },

  render: function(gl, params, locations, options = {}) {
    if (options.program) {
      gl.useProgram(options.program);
    }

    // Allows us to share global rotation if needed, otherwise uses layer params
    const globalScale = options.globalScale || 1.0;
    const globalRotation = options.globalRotation || 0.0;
    const forceUpdate = options.forceUpdate || false;

    if (forceUpdate || this._geometryNeedsUpdate(this._cachedGeometryState, params)) {
      this._updateGeometryBuffers(gl, params, locations);
      if (!forceUpdate) this._cachedGeometryState = { ...params };
    }

    const layerScale = params.scale * globalScale;
    const layerAngle = params.rotation * (Math.PI / 180) + globalRotation;

    // Primary
    this._drawCachedGeometry(gl, params, layerScale, layerAngle, 1.0, 1.0, params.strokeColor, locations);

    // Mirrors
    if (params.verticalMirror || params.horizontalMirror) {
      if (params.verticalMirror && params.horizontalMirror) {
        this._drawCachedGeometry(gl, params, layerScale, layerAngle, -1.0, -1.0, params.bothColor, locations);
      }
      if (params.verticalMirror) {
        this._drawCachedGeometry(gl, params, layerScale, layerAngle, -1.0, 1.0, params.verticalColor, locations);
      }
      if (params.horizontalMirror) {
        this._drawCachedGeometry(gl, params, layerScale, layerAngle, 1.0, -1.0, params.horizontalColor, locations);
      }
    }
  }
};

window.Visualizers = window.Visualizers || {};
window.Visualizers.Spiral = SpiralVisualizer;
