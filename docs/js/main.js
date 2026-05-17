// ═══════════════════════════════════════════════════
//  TOXISCAN — Entry point
//  Orquesta init, eventos y flujo principal de análisis.
// ═══════════════════════════════════════════════════

import { resolveCategories, buildEntryForCategories } from './data.js';
import { callGemini } from './gemini.js';
import { getApiKey, setApiKey, pushHistory } from './storage.js';
import {
  showView, startLoadCycle, stopLoadCycle,
  renderResults, renderNotFound, toast,
  openApiModal, closeApiModal, openDrawer, closeDrawer,
} from './ui.js';
import { openCamera, closeCamera, capturePhoto } from './camera.js';
import { initParticles } from './particles.js';

let apiKey = getApiKey();

// ── PROCESS IMAGE ────────────────────────────────────
/**
 * Orquesta el flujo completo de análisis: muestra la vista de carga, llama a Gemini,
 * resuelve las categorías toxicológicas y renderiza los resultados.
 * Si no hay API key configurada, abre el modal de configuración en su lugar.
 * @param {File} file - Archivo de imagen seleccionado o capturado por el usuario.
 * @returns {Promise<void>}
 */
async function processImage(file) {
  if (!apiKey) { openApiModal(apiKey); return; }

  document.getElementById('scan-preview').src = URL.createObjectURL(file);
  showView('view-loading');
  startLoadCycle();

  try {
    const base64 = await fileToBase64(file);
    const foodInfo = await callGemini(apiKey, base64, file.type || 'image/jpeg');
    foodInfo.confianza = Math.max(0, Math.min(100, parseInt(foodInfo.confianza) || 0));

    // Detecta todas las categorías presentes (avena + frutos secos + manzana
    // → ['cereales','frutos_secos','frutas']) y fusiona sus toxinas relevantes
    // en una única vista para la UI.
    const categories = resolveCategories(foodInfo);
    stopLoadCycle();

    // El filtro por toxina necesita tanto el nombre como la descripción
    // para captar ingredientes que solo aparecen en la descripción
    // (p. ej. patulina/manzana en "puré de manzana" cuando el nombre es
    // "mezcla de avena y frutos secos").
    const foodHaystack = `${foodInfo.alimento_detectado || ''} ${foodInfo.descripcion || ''}`;
    const entry = buildEntryForCategories(categories, foodHaystack);
    if (entry) {
      pushHistory(foodInfo, entry);
      renderResults(foodInfo, entry);
    } else {
      renderNotFound(foodInfo);
    }
    showView('view-results');
  } catch (err) {
    stopLoadCycle();
    showView('view-upload');
    toast(`⚠ ${err.message}`, 'rgba(244,63,94,0.4)');
  }
}

/**
 * Lee un archivo y lo convierte a una cadena base64 (sin prefijo data URL).
 * @param {File} file - Archivo de imagen a convertir.
 * @returns {Promise<string>} Cadena base64 del contenido del archivo.
 */
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result.split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ── EVENT WIRING ─────────────────────────────────────
/**
 * Registra los listeners del modal de configuración de API key:
 * habilita el botón al escribir, guarda al hacer clic o pulsar Enter,
 * y alterna la visibilidad de la contraseña.
 */
function bindApiModal() {
  const keyInput = document.getElementById('api-key-input');
  const saveBtn  = document.getElementById('save-key-btn');

  keyInput.addEventListener('input', () => {
    saveBtn.disabled = keyInput.value.trim().length < 10;
  });
  keyInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !saveBtn.disabled) saveBtn.click();
  });
  saveBtn.addEventListener('click', () => {
    const val = keyInput.value.trim();
    if (val.length < 10) return;
    apiKey = val;
    setApiKey(apiKey);
    closeApiModal();
  });
  document.getElementById('toggle-visibility').addEventListener('click', () => {
    keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
  });
}

/**
 * Registra los listeners de navegación global: ajustes, historial, cierre
 * del drawer y botón de retroceso.
 */
function bindNav() {
  document.getElementById('settings-btn').addEventListener('click', () => openApiModal(apiKey));
  document.getElementById('history-btn').addEventListener('click', openDrawer);
  document.getElementById('close-drawer').addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);
  document.getElementById('back-btn').addEventListener('click', () => showView('view-upload'));
}

/**
 * Registra los listeners del input de archivo y la zona de arrastrar-y-soltar,
 * disparando el análisis al recibir una imagen válida.
 */
function bindUpload() {
  const fileInput = document.getElementById('file-upload');
  fileInput.addEventListener('change', e => {
    const f = e.target.files?.[0];
    if (f) processImage(f);
    e.target.value = '';
  });

  const dz = document.getElementById('drop-zone');
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', e => {
    if (!dz.contains(e.relatedTarget)) dz.classList.remove('drag-over');
  });
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('drag-over');
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith('image/')) processImage(f);
  });
}

/**
 * Registra los listeners del modal de cámara: abrir, cerrar, disparador
 * y cierre al pulsar fuera del vídeo.
 */
function bindCamera() {
  document.getElementById('open-camera-btn').addEventListener('click', openCamera);
  document.getElementById('close-camera').addEventListener('click', closeCamera);
  document.getElementById('shutter-btn').addEventListener('click', () => capturePhoto(processImage));
  document.getElementById('camera-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCamera();
  });
}

/**
 * Registra un listener global de teclado que cierra cámara, drawer y modal
 * de API al pulsar Escape.
 */
function bindEscape() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeCamera();
    closeDrawer();
    if (apiKey) closeApiModal();
  });
}

// ── INIT ─────────────────────────────────────────────
/**
 * Punto de entrada de la aplicación. Inicializa el estado del modal de API
 * y registra todos los listeners de eventos.
 */
function init() {
  if (apiKey) closeApiModal(); else openApiModal(apiKey);
  bindApiModal();
  bindNav();
  bindUpload();
  bindCamera();
  bindEscape();
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('DOMContentLoaded', initParticles);
