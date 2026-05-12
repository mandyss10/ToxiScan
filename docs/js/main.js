// ═══════════════════════════════════════════════════
//  TOXISCAN — Entry point
//  Orquesta init, eventos y flujo principal de análisis.
// ═══════════════════════════════════════════════════

import { TOXIN_DB, resolveCategory, filterToxinasForFood } from './data.js';
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
async function processImage(file) {
  if (!apiKey) { openApiModal(apiKey); return; }

  document.getElementById('scan-preview').src = URL.createObjectURL(file);
  showView('view-loading');
  startLoadCycle();

  try {
    const base64 = await fileToBase64(file);
    const foodInfo = await callGemini(apiKey, base64, file.type || 'image/jpeg');
    foodInfo.confianza = Math.max(0, Math.min(100, parseInt(foodInfo.confianza) || 0));

    const category = resolveCategory(foodInfo);
    stopLoadCycle();

    if (category) {
      const baseEntry = TOXIN_DB[category];
      // Filtra las toxinas que solo aplican a alimentos concretos del grupo.
      // Ej.: para "plátano" descarta patulina (manzana/pera/uva).
      const f = filterToxinasForFood(baseEntry.toxinas, foodInfo.alimento_detectado);
      // Fallback de seguridad: si el filtro deja 0 toxinas (alimento detectado
      // demasiado genérico), mostramos la lista completa del grupo.
      const toxinasFinal = f.mostradas > 0 ? f.toxinas : baseEntry.toxinas;
      const filtrado = f.mostradas > 0 ? f.filtrado : false;
      const entry = {
        ...baseEntry,
        toxinas: toxinasFinal,
        meta: { total: f.total, mostradas: toxinasFinal.length, filtrado },
      };
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

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result.split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ── EVENT WIRING ─────────────────────────────────────
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

function bindNav() {
  document.getElementById('settings-btn').addEventListener('click', () => openApiModal(apiKey));
  document.getElementById('history-btn').addEventListener('click', openDrawer);
  document.getElementById('close-drawer').addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);
  document.getElementById('back-btn').addEventListener('click', () => showView('view-upload'));
}

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

function bindCamera() {
  document.getElementById('open-camera-btn').addEventListener('click', openCamera);
  document.getElementById('close-camera').addEventListener('click', closeCamera);
  document.getElementById('shutter-btn').addEventListener('click', () => capturePhoto(processImage));
  document.getElementById('camera-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCamera();
  });
}

function bindEscape() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeCamera();
    closeDrawer();
    if (apiKey) closeApiModal();
  });
}

// ── INIT ─────────────────────────────────────────────
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
