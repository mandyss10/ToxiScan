// ═══════════════════════════════════════════════════
//  Cámara: getUserMedia + captura a File
// ═══════════════════════════════════════════════════

import { toast } from './ui.js';

let cameraStream = null;

export async function openCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
    });
    document.getElementById('camera-video').srcObject = cameraStream;
    document.getElementById('camera-modal').classList.remove('hidden');
  } catch {
    toast('⚠ No se pudo acceder a la cámara. Revisa los permisos del navegador.', 'rgba(244,63,94,0.4)');
  }
}

export function closeCamera() {
  cameraStream?.getTracks().forEach(t => t.stop());
  cameraStream = null;
  document.getElementById('camera-modal').classList.add('hidden');
}

export function capturePhoto(onCapture) {
  const video  = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  canvas.toBlob(blob => {
    if (!blob) return;
    closeCamera();
    onCapture(new File([blob], 'capture.jpg', { type: 'image/jpeg' }));
  }, 'image/jpeg', 0.88);
}
