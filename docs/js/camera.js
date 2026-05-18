// camera.js


import { toast } from './ui.js';

// Variable global del módulo que guarda el stream activo.
// Es null cuando la cámara está cerrada, así podemos comprobar fácilmente
// si hay una sesión abierta antes de intentar cerrarla.
/** @type {MediaStream|null} */
let cameraStream = null;

/**
 * Abre la cámara trasera del dispositivo y muestra el modal de previsualización.
 *
 * Usamos `facingMode: 'environment'` para forzar la cámara trasera, que es la
 * relevante para fotografiar alimentos (la frontal es para selfies).
 * La resolución ideal 1280×960 es suficiente para que Gemini Vision identifique
 * ingredientes sin enviar imágenes demasiado pesadas a la API.
 *
 * @returns {Promise<void>}
 */
export async function openCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      // 'environment' = cámara trasera; 'user' = frontal
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
    });
    document.getElementById('camera-video').srcObject = cameraStream;
    document.getElementById('camera-modal').classList.remove('hidden');
  } catch {
    // El usuario denegó el permiso o el dispositivo no tiene cámara.
    // En móvil es el error más frecuente la primera vez que se usa la app.
    toast('No se pudo acceder a la cámara. Revisa los permisos del navegador.', 'rgba(244,63,94,0.4)');
  }
}

/**
 * Cierra la cámara liberando todas las pistas del stream activo.
 *
 * Es importante llamar a `track.stop()` explícitamente: si solo ocultamos el modal
 * sin detener el stream, el indicador de cámara activa del navegador (el punto rojo)
 * sigue encendido y la cámara sigue consumiendo recursos en segundo plano.
 */
export function closeCamera() {
  cameraStream?.getTracks().forEach(t => t.stop());
  cameraStream = null;
  document.getElementById('camera-modal').classList.add('hidden');
}

/**
 * Captura el fotograma actual del vídeo, lo convierte a JPEG y lo devuelve como File.
 *
 * El flujo es: vídeo → canvas (drawImage) → Blob JPEG → File.
 * Usamos canvas como intermediario porque es la forma estándar de exportar
 * un fotograma de vídeo a imagen en el navegador (no existe otra API directa).
 *
 * La calidad JPEG se fija en 0.88 (88%): por encima de 0.9 el tamaño crece mucho
 * sin mejora visual apreciable para análisis de alimentos; por debajo de 0.8
 * aparecen artefactos que podrían confundir al modelo de visión.
 *
 * @param {function(File): void} onCapture - Callback que recibe el archivo JPEG capturado.
 */
export function capturePhoto(onCapture) {
  const video  = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');

  // Ajustamos el canvas a la resolución real del stream para no escalar la imagen
  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  canvas.toBlob(blob => {
    if (!blob) return;
    closeCamera(); // liberamos la cámara antes de procesar
    onCapture(new File([blob], 'capture.jpg', { type: 'image/jpeg' }));
  }, 'image/jpeg', 0.88);
}
