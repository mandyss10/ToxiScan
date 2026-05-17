// ═══════════════════════════════════════════════════
//  Persistencia en localStorage (clave API + historial)
// ═══════════════════════════════════════════════════

const KEY_APIKEY  = 'toxi_apikey';
const KEY_HISTORY = 'toxi_history';
const HISTORY_MAX = 20;

/**
 * Devuelve la API key almacenada. Da prioridad a la variable de desarrollo
 * `window.TOXISCAN_DEV_KEY` sobre el valor guardado en localStorage.
 * @returns {string} La API key, o cadena vacía si no hay ninguna guardada.
 */
export function getApiKey() {
  return window.TOXISCAN_DEV_KEY || localStorage.getItem(KEY_APIKEY) || '';
}

/**
 * Persiste la API key en localStorage.
 * @param {string} key - La API key a guardar.
 */
export function setApiKey(key) {
  localStorage.setItem(KEY_APIKEY, key);
}

/**
 * Carga el historial de análisis desde localStorage.
 * Devuelve un array vacío si no hay datos o si el JSON está corrupto.
 * @returns {Array<Object>} Array de entradas del historial ordenadas de más reciente a más antigua.
 */
export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(KEY_HISTORY) || '[]'); }
  catch { return []; }
}

/**
 * Añade una nueva entrada al historial y lo persiste en localStorage,
 * manteniendo un máximo de HISTORY_MAX entradas (las más recientes).
 * @param {{ alimento_detectado: string, confianza: number }} foodInfo - Datos devueltos por Gemini.
 * @param {{ nombre: string, emoji: string }} dbEntry - Entrada de la base de datos toxicológica asociada.
 */
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
    foodInfo: { ...foodInfo },
    dbEntry:  { ...dbEntry },
  });
  localStorage.setItem(KEY_HISTORY, JSON.stringify(h.slice(0, HISTORY_MAX)));
}
