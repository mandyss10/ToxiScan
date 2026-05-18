// docs/js/storage.js

const KEY_APIKEY  = 'toxi_apikey';
const KEY_HISTORY = 'toxi_history';
const HISTORY_MAX = 20;


/**
 * Devuelve la clave de API guardada.
 *
 * Primero comprueba si existe la variable global window.TOXISCAN_DEV_KEY
 * ,luego busca en localStorage y, si no hay nada,
 * devuelve una cadena vacía.
 *
 * @returns {string} La clave de API, o '' si no hay ninguna guardada.
 */
export function getApiKey() {
  return window.TOXISCAN_DEV_KEY || localStorage.getItem(KEY_APIKEY) || '';
}

/**
 * Guarda la clave de API en localStorage.
 *
 * @param {string} key - Clave de API que se quiere guardar.
 */
export function setApiKey(key) {
  localStorage.setItem(KEY_APIKEY, key);
}

/**
 * Carga el historial de escaneos guardado en localStorage.
 *
 * Si el valor almacenado no es JSON válido, devuelve un array vacío
 * en lugar de lanzar un error.
 *
 * @returns {Array} Lista de entradas del historial.
 */
export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(KEY_HISTORY) || '[]'); }
  catch { return []; }
}

/**
 * Añade un nuevo escaneo al inicio del historial y lo guarda en localStorage.
 *
 * Guarda la fecha, el nombre y emoji del alimento identificado, el alimento
 * detectado por Gemini, el nivel de confianza y una copia completa de los
 * datos del análisis. El historial se limita a los últimos HISTORY_MAX registros.
 *
 * @param {Object} foodInfo - Datos devueltos por Gemini sobre el alimento.
 * @param {Object} dbEntry  - Entrada de la base de datos de toxinas que coincidió.
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
