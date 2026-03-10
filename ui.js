function initUI() {
  // -------------------------------
  // Presets
  // -------------------------------
  function populatePresetSelector() {
    const presetSelector = document.getElementById('presetSelector');
    presetOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.value;
      opt.textContent = option.label;
      presetSelector.appendChild(opt);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    populatePresetSelector();
    updateLayerListUI();
  });

  document.getElementById('presetSelector').addEventListener('change', function() {
    const preset = presets[this.value];
    if (preset) {
      const activeLayer = getActiveLayer();
      if(!activeLayer) return;
      Object.keys(preset).forEach(key => {
        activeLayer.params[key] = preset[key];
      });
      saveState();
      updateUIFromState();
      drawComposition();
    }
  });

  // -------------------------------
  // Input Handlers
  // -------------------------------
  const handleInput = function() {
    if (this.id === 'layerList') return; // Handled separately
    
    const activeLayer = getActiveLayer();
      if (!activeLayer) return;

      saveState();

      if (this.type === 'checkbox') {
        if (masterAudioParams.hasOwnProperty(this.id) || this.id === 'autoRotate') {
            masterAudioParams[this.id] = this.checked;
        } else {
            activeLayer.params[this.id] = this.checked;
        }
      } else {
        const val = this.type === 'number' || this.type === 'range' ? parseFloat(this.value) : this.value;
        if (masterAudioParams.hasOwnProperty(this.id)) {
            masterAudioParams[this.id] = val;
        } else {
            activeLayer.params[this.id] = val;
        }
      }
      
      if (this.type === 'range' || this.type === 'color' || this.tagName.toLowerCase() === 'select') {
        const valueSpan = document.getElementById(this.id + 'Value');
        if (valueSpan) {
            valueSpan.textContent = (this.type === 'range' && this.step.includes('.')) ? parseFloat(this.value).toFixed(1) : this.value;
        }
      }

      if (this.id === 'scale' && !masterAudioParams.audioReactive) {
        window.baseScale = parseFloat(this.value);
      }
      if (this.id === 'lineWidth' && !masterAudioParams.audioReactive) {
        window.baseLineWidth = parseFloat(this.value);
      }
      
      // Auto-Rotate handling
      if (this.id === 'autoRotate') {
        if (this.checked) animateRotation();
      }

      drawComposition();
  };

  document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', handleInput);
    input.addEventListener('change', handleInput);
  });

  // Layer Management UI
  document.getElementById('addSpiralLayerBtn').addEventListener('click', () => addLayer('Original Spiral'));
  document.getElementById('addFractalLayerBtn').addEventListener('click', () => addLayer('Fractal'));
  document.getElementById('removeLayerBtn').addEventListener('click', () => removeActiveLayer());
  document.getElementById('layerList').addEventListener('change', (e) => {
    appState.activeLayerIndex = parseInt(e.target.value);
    updateUIFromState();
  });


  // -------------------------------
  // Audio Reactive Setup
  // -------------------------------
  const audioToggleButton = document.getElementById('audioToggleButton');

  document.getElementById('audioReactive').addEventListener('change', function() {
    masterAudioParams.audioReactive = this.checked;
    document.getElementById('audioOptions').style.display = this.checked ? 'block' : 'none';
    audioToggleButton.style.display = this.checked ? 'inline-block' : 'none';

    if (this.checked && audioContext) {
      animateAudioReactive();
    } else {
      drawComposition();
    }
  });

  audioToggleButton.addEventListener('click', function() {
    if (!audioContext) {
      // Start Audio
      const activeLayer = getActiveLayer();
      if(activeLayer) {
        window.baseScale = activeLayer.params.scale;
      }
      initAudio().then(() => {
        if (audioContext) {
          this.textContent = 'Stop Audio';
          if (masterAudioParams.audioReactive) {
            animateAudioReactive();
          }
        }
      });
    } else {
      // Stop Audio
      stopAudio();
      this.textContent = 'Start Audio';
    }
  });


  // -------------------------------
  // Controls Toggle & Info Modal
  // -------------------------------
  const controlsOverlay = document.getElementById('controlsOverlay');
  const toggleButton = document.getElementById('toggleControls');
  const infoButton = document.getElementById('infoButton');
  const infoModal = document.getElementById('infoModal');
  const closeModal = document.querySelector('.close-modal');
  
  infoButton.addEventListener('click', () => {
    infoModal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    infoModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == infoModal) {
      infoModal.style.display = 'none';
    }
  });
  const controlsNotice = document.createElement('div');
  controlsNotice.id = 'controlsNotice';
  controlsNotice.className = 'controls-notice';
  document.body.appendChild(controlsNotice);

  toggleButton.addEventListener('click', function() {
    if (controlsOverlay.style.display === 'none') {
      controlsOverlay.style.display = 'block';
      this.textContent = 'Hide Controls';
    } else {
      controlsOverlay.style.display = 'none';
      this.textContent = 'Show Controls';
      showControlsNotice();
    }
  });

  canvas.addEventListener('click', function(e) {
    if (controlsOverlay.style.display === 'none' && !document.fullscreenElement) {
      controlsOverlay.style.display = 'block';
      toggleButton.textContent = 'Hide Controls';
    }
  });

  function showControlsNotice() {
    controlsNotice.textContent = 'Click anywhere to show controls';
    controlsNotice.style.display = 'block';
    setTimeout(() => {
      controlsNotice.style.display = 'none';
    }, 3000);
  }

  // -------------------------------
  // Mobile Touch Controls
  // -------------------------------
  let initialPinchDistance = null;
  let initialScale = null;
  let touchStartTime = null;
  const TAP_THRESHOLD = 200;

  canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

  function handleTouchStart(e) {
    if (document.fullscreenElement && isMobile) {
      touchStartTime = Date.now();
    }
    if (e.touches.length === 2) {
      initialPinchDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const activeLayer = getActiveLayer();
      initialScale = activeLayer ? activeLayer.params.scale : 30;
    }
  }

  function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 2 && initialPinchDistance) {
      const currentDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      
      const newScale = initialScale * (currentDistance / initialPinchDistance);
      const activeLayer = getActiveLayer();
      if (activeLayer) {
        activeLayer.params.scale = Math.min(Math.max(newScale, 1), 100);
        if (!masterAudioParams.audioReactive || !masterAudioParams.audioScale) {
          window.baseScale = activeLayer.params.scale;
        }
        updateUIFromState();
        saveState();
        drawComposition();
      }
    } else if (e.touches.length === 1) {
      const deltaX = e.touches[0].movementX || 0;
      const activeLayer = getActiveLayer();
      if(activeLayer) {
          const currentRotation = activeLayer.params.rotation || 0;
          activeLayer.params.rotation = (currentRotation + deltaX * 0.5 + 360) % 360;
          updateUIFromState();
          saveState();
          drawComposition();
      }
    }
  }

  function handleTouchEnd(e) {
    if (document.fullscreenElement && isMobile && e.touches.length === 0) {
      const touchDuration = Date.now() - touchStartTime;
      if (touchDuration < TAP_THRESHOLD && initialPinchDistance === null) {
        document.exitFullscreen();
      }
    }
    initialPinchDistance = null;
  }

  // -------------------------------
  // Fullscreen Handling
  // -------------------------------
  const fullscreenButton = document.getElementById('fullscreenButton');
  const fullscreenOverlay = document.getElementById('fullscreenOverlay');
  const isMobile = 'ontouchstart' in window || window.innerWidth < 768;

  fullscreenButton.addEventListener('click', () => {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
      showFullscreenOverlay();
      controlsOverlay.style.display = 'none';
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      fullscreenOverlay.style.display = 'none';
      controlsOverlay.style.display = 'block';
      toggleButton.textContent = 'Hide Controls';
    }
  });

  function showFullscreenOverlay() {
    fullscreenOverlay.textContent = isMobile ? 'Tap to exit full screen' : 'Press ESC to exit full screen';
    fullscreenOverlay.style.display = 'block';
    setTimeout(() => {
      fullscreenOverlay.style.display = 'none';
    }, 3000);
  }

  // -------------------------------
  // Screensaver (Idle Timer)
  // -------------------------------
  let idleTimer;
  const IDLE_TIMEOUT = 4000; // 4 seconds
  const uiElements = [controlsOverlay, toggleButton, infoButton];

  function resetIdleTimer() {
    uiElements.forEach(el => el.classList.remove('idle'));
    clearTimeout(idleTimer);
    if (controlsOverlay.style.display !== 'none') {
      idleTimer = setTimeout(() => {
        uiElements.forEach(el => el.classList.add('idle'));
      }, IDLE_TIMEOUT);
    }
  }

  ['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, resetIdleTimer, true);
  });
  
  resetIdleTimer();
}

function setRatio(ratio) {
  const activeLayer = getActiveLayer();
  if(activeLayer && activeLayer.params.layerRatio !== undefined) {
      activeLayer.params.layerRatio = ratio;
      updateUIFromState();
      saveState();
      drawComposition();
  }
}

initUI();