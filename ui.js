function initUI() {
  // -------------------------------
  // Presets, Undo, Reset
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
  });

  document.getElementById('presetSelector').addEventListener('change', function() {
    const preset = presets[this.value];
    if (preset) {
      Object.keys(preset).forEach(key => {
        const element = document.getElementById(key);
        if (element.type === 'checkbox') element.checked = preset[key];
        else element.value = preset[key];
        const valueSpan = document.getElementById(key + 'Value');
        if (valueSpan) valueSpan.textContent = preset[key];
        if (key === 'scale') {
          baseScale = parseFloat(preset[key]);
          document.getElementById('scale').value = baseScale;
          document.getElementById('scaleValue').textContent = baseScale.toFixed(1);
        }
      });
      saveState();
      drawSpiral();
    }
  });

  // -------------------------------
  // Input Handlers
  // -------------------------------
  document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', function() {
      saveState();
      if (this.type === 'range' || this.type === 'color' || this.type === 'checkbox' || this.tagName.toLowerCase() === 'select') {
        const valueSpan = document.getElementById(this.id + 'Value');
        if (valueSpan) {
          valueSpan.textContent = (this.type === 'range' && this.step.includes('.')) ? parseFloat(this.value).toFixed(1) : this.value;
        }
      }
      if (this.id === 'scale' && !currentParams.audioReactive) {
        baseScale = parseFloat(this.value);
      }
      drawSpiral();
    });
  });

  // -------------------------------
  // Auto-Rotate Animation
  // -------------------------------
  document.getElementById('autoRotate').addEventListener('change', function() {
    currentParams.autoRotate = this.checked;
    if (this.checked) animateRotation();
    else drawSpiral();
  });

  // -------------------------------
  // Audio Reactive Setup
  // -------------------------------
  document.getElementById('audioReactive').addEventListener('change', function() {
    currentParams.audioReactive = this.checked;
    document.getElementById('audioOptions').style.display = this.checked ? 'block' : 'none';
    if (this.checked && !audioContext) {
      baseScale = parseFloat(document.getElementById('scale').value);
      initAudio().then(() => {
        animateAudioReactive();
      });
    } else if (this.checked) {
      baseScale = parseFloat(document.getElementById('scale').value);
      animateAudioReactive();
    } else {
      document.getElementById('scale').value = baseScale;
      document.getElementById('scaleValue').textContent = baseScale.toFixed(1);
      drawSpiral();
    }
  });

  document.getElementById('audioScale').addEventListener('change', function() {
    currentParams.audioScale = this.checked;
    if (!this.checked) {
      document.getElementById('scale').value = baseScale;
      document.getElementById('scaleValue').textContent = baseScale.toFixed(1);
    }
    drawSpiral();
  });

  document.getElementById('audioRotate').addEventListener('change', function() {
    currentParams.audioRotate = this.checked;
    drawSpiral();
  });

  document.getElementById('audioOpacity').addEventListener('change', function() {
    currentParams.audioOpacity = this.checked;
    drawSpiral();
  });

  document.getElementById('scaleGap')?.addEventListener('input', function() {
    currentParams.scaleGap = parseFloat(this.value);
    document.getElementById('scaleGapValue').textContent = this.value;
    drawSpiral();
  });

  document.getElementById('scaleSensitivity')?.addEventListener('input', function() {
    currentParams.scaleSensitivity = parseFloat(this.value);
    document.getElementById('scaleSensitivityValue').textContent = this.value;
    drawSpiral();
  });

  // Allow manual adjustments during audio reactivity
  ['scale', 'opacity'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', function() {
      if (currentParams.audioReactive && id === 'scale' && !currentParams.audioScale) {
        baseScale = parseFloat(this.value);
      }
      document.getElementById(id + 'Value').textContent = id === 'opacity' ? this.value : parseFloat(this.value).toFixed(1);
      drawSpiral();
    });
  });

  // -------------------------------
  // Controls Toggle
  // -------------------------------
  const controlsOverlay = document.getElementById('controlsOverlay');
  const toggleButton = document.getElementById('toggleControls');
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
      initialScale = parseFloat(document.getElementById('scale').value);
    }
  }

  function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 2 && initialPinchDistance) {
      const currentDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const scaleInput = document.getElementById('scale');
      const newScale = initialScale * (currentDistance / initialPinchDistance);
      scaleInput.value = Math.min(Math.max(newScale, 1), 100);
      if (!currentParams.audioReactive || !currentParams.audioScale) {
        baseScale = parseFloat(scaleInput.value);
      }
      document.getElementById('scaleValue').textContent = parseFloat(scaleInput.value).toFixed(1);
      saveState();
      drawSpiral();
    } else if (e.touches.length === 1) {
      // This logic is from the /2/ prototype for drag-to-rotate
      const rotationInput = document.getElementById('rotation');
      const currentRotation = parseFloat(rotationInput.value) || 0;
      const deltaX = e.touches[0].movementX || 0; // Use movementX for change in position
      const newRotation = (currentRotation + deltaX * 0.5 + 360) % 360; // Add 360 to handle negative results
      rotationInput.value = newRotation;
      document.getElementById('rotationValue').textContent = Math.round(newRotation);
      saveState();
      drawSpiral();
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
}

initUI();