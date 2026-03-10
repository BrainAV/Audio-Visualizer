const appState = {
  layers: [],
  activeLayerIndex: -1
};

let history = [];

function saveState() {
  // Deep copy the current state for undo
  history.push(JSON.parse(JSON.stringify(appState)));
  if (history.length > 20) history.shift();
}

function undo() {
  if (history.length > 1) {
    history.pop();
    const lastState = history[history.length - 1];
    appState.layers = JSON.parse(JSON.stringify(lastState.layers));
    appState.activeLayerIndex = lastState.activeLayerIndex;
    updateUIFromState();
    drawComposition();
  }
}

function reset() {
  appState.layers = [
    {
      id: Date.now().toString(),
      type: 'Original Spiral',
      visualizer: window.Visualizers.Spiral,
      params: window.Visualizers.Spiral.getDefaultParams()
    }
  ];
  appState.activeLayerIndex = 0;
  
  // Reset Master settings
  document.getElementById('autoRotate').checked = false;
  document.getElementById('audioReactive').checked = false;
  document.getElementById('audioRotate').checked = false;
  document.getElementById('audioScale').checked = false;
  document.getElementById('audioOpacity').checked = false;
  document.getElementById('audioLineWidth').checked = false;
  
  history = [];
  
  updateLayerListUI();
  updateUIFromState();
  drawComposition();
}

function getActiveLayer() {
  if (appState.activeLayerIndex >= 0 && appState.activeLayerIndex < appState.layers.length) {
    return appState.layers[appState.activeLayerIndex];
  }
  return null;
}

function addLayer(type) {
  saveState();
  let visualizer = null;
  if (type === 'Original Spiral') {
    visualizer = window.Visualizers.Spiral;
  } else if (type === 'Fractal') {
    visualizer = window.Visualizers.Fractal;
  }
  
  if (visualizer) {
    appState.layers.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      type: type,
      visualizer: visualizer,
      params: visualizer.getDefaultParams()
    });
    appState.activeLayerIndex = appState.layers.length - 1;
    updateLayerListUI();
    updateUIFromState();
    drawComposition();
  }
}

function removeActiveLayer() {
  if (appState.layers.length > 1 && appState.activeLayerIndex >= 0) {
    saveState();
    appState.layers.splice(appState.activeLayerIndex, 1);
    appState.activeLayerIndex = Math.max(0, appState.activeLayerIndex - 1);
    updateLayerListUI();
    updateUIFromState();
    drawComposition();
  }
}

function updateLayerListUI() {
  const layerList = document.getElementById('layerList');
  if(!layerList) return;
  layerList.innerHTML = '';
  appState.layers.forEach((layer, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `[Layer ${index + 1}] ${layer.type}`;
    if (index === appState.activeLayerIndex) {
      option.selected = true;
    }
    layerList.appendChild(option);
  });
}

function updateUIFromState() {
  const activeLayer = getActiveLayer();
  if (!activeLayer) return;

  const spiralControls = document.getElementById('spiralControlsContainer');
  const fractalControls = document.getElementById('fractalControlsContainer');
  if (spiralControls && fractalControls) {
    if (activeLayer.type === 'Fractal') {
      spiralControls.style.display = 'none';
      fractalControls.style.display = 'block';
    } else {
      spiralControls.style.display = 'block';
      fractalControls.style.display = 'none';
    }
  }

  const params = activeLayer.params;
  Object.keys(params).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (el.type === 'checkbox') el.checked = params[key];
      else el.value = params[key];
      const valueSpan = document.getElementById(key + 'Value');
      if (valueSpan) {
        valueSpan.textContent = (el.type === 'range' && el.step.includes('.')) ? parseFloat(params[key]).toFixed(1) : params[key];
      }
    }
  });

  // Base values for audio fallback are now layer-specific, we'll store them back to the UI globally for simplicity
  window.baseScale = params.scale;
  window.baseLineWidth = params.lineWidth;
}

// Global master audio settings (not layer specific for now)
let masterAudioParams = {
  autoRotate: false,
  audioReactive: false,
  audioRotate: false,
  audioScale: false,
  audioLineWidth: false,
  audioOpacity: false,
  scaleGap: 10,
  scaleSensitivity: 1
};