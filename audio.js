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
  if (masterAudioParams.audioReactive) {
    const amplitude = getAudioAmplitude();

    appState.layers.forEach(layer => {
      if (masterAudioParams.audioRotate && layer.params.rotation !== undefined) {
        let baseRotation = layer.params.rotation || 0;
        const fluctuation = amplitude * 180;
        layer.params.rotation = (baseRotation + fluctuation) % 360;
      }

      if (masterAudioParams.audioLineWidth && layer.params.lineWidth !== undefined) {
        const currentWidth = layer.params.lineWidth;
        let targetWidth;
        if (amplitude > 0.05) {
          const fluctuation = amplitude * 5 * masterAudioParams.scaleSensitivity;
          targetWidth = window.baseLineWidth + fluctuation;
          targetWidth = Math.min(Math.max(targetWidth, 1), 10);
        } else {
          targetWidth = window.baseLineWidth;
        }
        layer.params.lineWidth = lerp(currentWidth, targetWidth, 0.2);
      }

      if (masterAudioParams.audioScale && layer.params.scale !== undefined) {
        const currentScale = layer.params.scale;
        let targetScale;
        if (amplitude > 0.05) {
          const adjustedAmplitude = amplitude * masterAudioParams.scaleSensitivity;
          targetScale = window.baseScale + (adjustedAmplitude * masterAudioParams.scaleGap);
          targetScale = Math.min(Math.max(targetScale, window.baseScale), window.baseScale + masterAudioParams.scaleGap);
        } else {
          targetScale = window.baseScale;
        }
        layer.params.scale = lerp(currentScale, targetScale, 0.1);
      }

      if (masterAudioParams.audioOpacity && layer.params.opacity !== undefined) {
        const baseOpacity = layer.params.opacity || 1;
        const fluctuation = amplitude * 0.5;
        layer.params.opacity = Math.min(Math.max(baseOpacity - fluctuation + 0.5, 0), 1);
      }
    });

    updateUIFromState();
    drawComposition(true);
    requestAnimationFrame(animateAudioReactive);
  }
}