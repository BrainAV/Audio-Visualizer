let audioContext, analyser, dataArray, mediaStream;

async function initAudio() {
  if (audioContext) return; // Already initialized
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(mediaStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.3;
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    console.log('Audio initialized');
  } catch (err) {
    console.error('Error accessing microphone:', err);
    alert('Couldn’t access microphone. Please allow mic permissions.');
  }
}

function stopAudio() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  if (audioContext) {
    audioContext.close().then(() => {
      audioContext = null;
      analyser = null;
      console.log('Audio stopped and context closed.');
    });
  }
}

function getAudioAmplitude() {
  if (!analyser) return 0;
  analyser.getByteTimeDomainData(dataArray);
  let max = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const a = Math.abs(dataArray[i] / 128 - 1);
    max = Math.max(max, a);
  }
  return max;
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function animateAudioReactive() {
  if (currentParams.audioReactive) {
    const amplitude = getAudioAmplitude();
    const scaleInput = document.getElementById('scale');
    const rotationInput = document.getElementById('rotation');
    const opacityInput = document.getElementById('opacity');

    if (currentParams.audioRotate) {
      let baseRotation = parseFloat(rotationInput.value) || 0;
      const fluctuation = amplitude * 180;
      rotationInput.value = (baseRotation + fluctuation) % 360;
      document.getElementById('rotationValue').textContent = Math.round(rotationInput.value);
    }

    if (currentParams.audioScale) {
      const currentScale = parseFloat(scaleInput.value);
      let targetScale;
      if (amplitude > 0.05) {
        const adjustedAmplitude = amplitude * currentParams.scaleSensitivity;
        targetScale = baseScale + (adjustedAmplitude * currentParams.scaleGap);
        targetScale = Math.min(Math.max(targetScale, baseScale), baseScale + currentParams.scaleGap);
      } else {
        targetScale = baseScale;
      }
      const newScale = lerp(currentScale, targetScale, 0.1);
      scaleInput.value = newScale;
      document.getElementById('scaleValue').textContent = newScale.toFixed(1);
    }

    if (currentParams.audioOpacity) {
      const baseOpacity = parseFloat(opacityInput.value) || 1;
      const fluctuation = amplitude * 0.5;
      opacityInput.value = Math.min(Math.max(baseOpacity - fluctuation + 0.5, 0), 1);
      document.getElementById('opacityValue').textContent = opacityInput.value;
    }

    drawSpiral();
    requestAnimationFrame(animateAudioReactive);
  }
}