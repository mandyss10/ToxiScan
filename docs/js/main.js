// docs/js/main.js

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


/**
 * Procesa una imagen de alimento y muestra los resultados en la interfaz.
 *
 * Envía la imagen a Gemini, recibe la información del alimento detectado,
 * busca toxinas relacionadas en la base de datos y navega a la vista de
 * resultados. Si no hay clave de API guardada, abre primero el modal para pedirla.
 * En caso de error muestra un aviso y vuelve a la vista de subida de imagen.
 *
 * @param {File} file - Imagen seleccionada por el usuario.
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

    // Detecta todas las categorías presentes y junta sus toxinas relevantes
    // en una única vista para la UI.
    const categories = resolveCategories(foodInfo);
    stopLoadCycle();

    // El filtro por toxina necesita tanto el nombre como la descripción
    // para captar ingredientes que solo aparecen en la descripción
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
 * Convierte un archivo de imagen a una cadena base64 para su envío a la API.
 *
 * @param {File} file - Archivo de imagen a convertir.
 * @returns {Promise<string>} La cadena base64 sin el prefijo del data URL.
 */
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result.split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}


/**
 * Registra los eventos del modal de clave de API.
 *
 * Habilita el botón de guardar solo cuando el campo tiene al menos 10 caracteres (longitud mínima para una clave válida),
 * permite confirmar con Enter, guarda la clave al hacer clic en el botón
 * y alterna la visibilidad del campo entre texto y contraseña.
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
 * Registra los eventos de navegación de la barra superior.
 *
 * Conecta los botones de ajustes, historial, cierre del historial y
 * volver a la pantalla de subida.
 */
function bindNav() {
  document.getElementById('settings-btn').addEventListener('click', () => openApiModal(apiKey));
  document.getElementById('history-btn').addEventListener('click', openDrawer);
  document.getElementById('close-drawer').addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);
  document.getElementById('back-btn').addEventListener('click', () => showView('view-upload'));
}


/**
 * Registra los eventos de subida de imagen por archivo y arrastrar y soltar.
 *
 * Escucha el selector de archivos y la zona de drop. En ambos casos llama a
 * processImage con el archivo recibido. Solo acepta archivos de tipo imagen
 * en el drop.
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
 * Registra los eventos del modal de cámara.
 *
 * Conecta los botones de abrir, cerrar y capturar la foto. También cierra
 * la cámara si el usuario hace clic fuera del contenido del modal.
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
 * Registra el atajo de teclado Escape para cerrar paneles abiertos.
 *
 * Al pulsar Escape cierra la cámara, el historial y, si ya hay una clave
 * de API guardada, el modal de clave.
 */
function bindEscape() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeCamera();
    closeDrawer();
    if (apiKey) closeApiModal();
  });
}


/**
 * Inicializa la aplicación al cargar el DOM.
 *
 * Decide si mostrar u ocultar el modal de clave de API según si ya hay una
 * guardada, y registra todos los eventos de la interfaz.
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
