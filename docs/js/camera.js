// ═══════════════════════════════════════════════════
//  Cámara: getUserMedia + captura a File
// ═══════════════════════════════════════════════════

import { toast } from './ui.js';

/** @type {MediaStream|null} Flujo de vídeo activo de la cámara del dispositivo. */
let cameraStream = null;

/**
 * Solicita acceso a la cámara trasera del dispositivo y muestra el modal de cámara.
 * Muestra un toast de error si el navegador deniega el permiso.
 * @returns {Promise<void>}
 */
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

/**
 * Detiene todas las pistas del flujo de vídeo activo y oculta el modal de cámara.
 */
export function closeCamera() {
  cameraStream?.getTracks().forEach(t => t.stop());
  cameraStream = null;
  document.getElementById('camera-modal').classList.add('hidden');
}

/**
 * Captura el fotograma actual del vídeo como JPEG, cierra la cámara
 * y llama al callback con el archivo resultante.
 * @param {function(File): void} onCapture - Callback que recibe el archivo JPEG capturado.
 */
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
