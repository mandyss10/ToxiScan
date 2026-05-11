// ═══════════════════════════════════════════════════
//  UI: vistas, render, toast, modal API, drawer historial
// ═══════════════════════════════════════════════════

import { loadHistory } from './storage.js';

const RISK_COLORS = { alto: '#f43f5e', medio: '#f59e0b', bajo: '#10b981' };
const RISK_LABELS = { alto: 'RIESGO ALTO', medio: 'RIESGO MEDIO', bajo: 'RIESGO BAJO' };

// ── VIEWS ────────────────────────────────────────────
export function showView(id) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active', 'hidden');
    v.style.display = v.id === id ? '' : 'none';
  });
  requestAnimationFrame(() => document.getElementById(id).classList.add('active'));
}

// ── LOADING STATUS CYCLE ─────────────────────────────
const LOADING_MSGS = [
  'Enviando imagen a Gemini Vision...',
  'Identificando familia alimentaria...',
  'Consultando base de datos toxicológica...',
  'Buscando registros EFSA y OMS...',
  'Compilando perfil de riesgo...',
];
let loadCycleId;

export function startLoadCycle() {
  let i = 0;
  const el = document.getElementById('load-status');
  el.textContent = LOADING_MSGS[0];
  loadCycleId = setInterval(() => {
    i = (i + 1) % LOADING_MSGS.length;
    el.textContent = LOADING_MSGS[i];
  }, 1800);
}

export function stopLoadCycle() {
  clearInterval(loadCycleId);
}

// ── RENDER RESULTS ───────────────────────────────────
export function renderResults(foodInfo, dbEntry) {
  document.getElementById('result-hero').innerHTML = `
    <div class="rh-top">
      <div class="rh-emoji">${dbEntry.emoji}</div>
      <div>
        <div class="rh-category">${dbEntry.nombre.toUpperCase()}</div>
        <div class="rh-detected">${foodInfo.alimento_detectado} · ${foodInfo.descripcion}</div>
      </div>
    </div>
    <div class="conf-row">
      <span class="conf-label">Precisión IA</span>
      <div class="conf-track"><div class="conf-fill" id="conf-fill"></div></div>
      <span class="conf-pct" id="conf-pct">0%</span>
    </div>
  `;
  setTimeout(() => {
    const fill = document.getElementById('conf-fill');
    const pct  = document.getElementById('conf-pct');
    if (fill) fill.style.width = `${foodInfo.confianza}%`;
    if (pct)  pct.textContent  = `${foodInfo.confianza}%`;
  }, 80);

  const list = document.getElementById('toxins-list');
  list.innerHTML = '';
  dbEntry.toxinas.forEach((t, i) => {
    const color = RISK_COLORS[t.riesgo] || '#64748b';
    const label = RISK_LABELS[t.riesgo] || 'DESCONOCIDO';
    const card = document.createElement('div');
    card.className = 'toxin-card';
    card.style.cssText = `--ind-color:${color}; animation-delay:${i * 0.1}s`;
    card.innerHTML = `
      <div class="tc-head">
        <div>
          <div class="tc-name">${t.nombre}</div>
          <div class="tc-type">${t.tipo}</div>
        </div>
        <span class="risk-badge" style="background:${color}1a;color:${color};border:1px solid ${color}33">${label}</span>
      </div>
      <p class="tc-detail"><strong>Efecto:</strong> ${t.efecto}</p>
      <p class="tc-detail"><strong>Fuente:</strong> ${t.fuente}</p>
      <div class="tc-rec">${t.recomendacion}</div>
    `;
    list.appendChild(card);
  });
}

export function renderNotFound(foodInfo) {
  document.getElementById('result-hero').innerHTML = `
    <div class="not-found">
      <div style="font-size:3rem;margin-bottom:1rem">🤔</div>
      <div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:.5rem">No identificado</div>
      <div style="font-size:.875rem;color:var(--text-muted)">
        Gemini detectó: <em>"${foodInfo.alimento_detectado || 'sin resultado'}"</em><br>
        Prueba con otra imagen más clara o de otro ángulo.
      </div>
    </div>
  `;
  document.getElementById('toxins-list').innerHTML = '';
}

// ── TOAST ────────────────────────────────────────────
export function toast(msg, color = 'rgba(0,198,255,0.3)') {
  document.getElementById('toast')?.remove();
  const el = document.createElement('div');
  el.id = 'toast';
  el.style.borderColor = color;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el?.remove(), 4500);
}

// ── API MODAL ────────────────────────────────────────
export function openApiModal(currentKey = '') {
  const modal = document.getElementById('api-modal');
  modal.classList.remove('hidden');
  document.getElementById('api-key-input').value = currentKey;
  document.getElementById('save-key-btn').disabled = currentKey.length < 10;
}

export function closeApiModal() {
  document.getElementById('api-modal').classList.add('hidden');
}

// ── HISTORY DRAWER ───────────────────────────────────
export function openDrawer() {
  document.getElementById('history-drawer')
    .classList.replace('drawer-closed', 'drawer-open');
  document.getElementById('drawer-overlay').classList.add('open');
  renderHistoryList();
}

export function closeDrawer() {
  document.getElementById('history-drawer')
    .classList.replace('drawer-open', 'drawer-closed');
  document.getElementById('drawer-overlay').classList.remove('open');
}

function renderHistoryList() {
  const h = loadHistory();
  const el = document.getElementById('history-list');
  if (!h.length) {
    el.innerHTML = `<div class="history-empty"><span class="history-empty-icon">🔬</span>Aún no hay análisis guardados.<br>Escanea tu primer alimento.</div>`;
    return;
  }
  el.innerHTML = h.map(item => `
    <div class="history-item">
      <div class="h-emoji">${item.emoji}</div>
      <div class="h-info">
        <div class="h-name">${item.nombre} <span style="color:var(--text-muted);font-weight:400">(${item.confianza}%)</span></div>
        <div class="h-meta">${item.date} · ${item.detected}</div>
      </div>
    </div>
  `).join('');
}
