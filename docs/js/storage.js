// ═══════════════════════════════════════════════════
//  Persistencia en localStorage (clave API + historial)
// ═══════════════════════════════════════════════════

const KEY_APIKEY  = 'toxi_apikey';
const KEY_HISTORY = 'toxi_history';
const HISTORY_MAX = 20;

export function getApiKey() {
  return window.TOXISCAN_DEV_KEY || localStorage.getItem(KEY_APIKEY) || '';
}

export function setApiKey(key) {
  localStorage.setItem(KEY_APIKEY, key);
}

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(KEY_HISTORY) || '[]'); }
  catch { return []; }
}

export function pushHistory(foodInfo, dbEntry) {
  const h = loadHistory();
  h.unshift({
    id: Date.now(),
    date: new Date().toLocaleString('es-ES', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }),
    nombre: dbEntry.nombre,
    emoji: dbEntry.emoji,
    detected: foodInfo.alimento_detectado,
    confianza: foodInfo.confianza,
  });
  localStorage.setItem(KEY_HISTORY, JSON.stringify(h.slice(0, HISTORY_MAX)));
}
