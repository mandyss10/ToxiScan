// docs/js/gemini.js


// Usamos gemini-2.5-flash porque es el modelo multimodal más rápido y barato
// de Google. Para analizar si un alimento tiene toxinas no necesitamos
// el modelo más potente, con flash es suficiente y la respuesta es casi inmediata.
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Pedimos JSON estructurado para poder parsearlo de forma fiable.
// La categoría es un valor cerrado que coincide con las claves de TOXIN_DB.
// Si no hay alimento en la imagen, el modelo devuelve 'desconocido' en vez de inventarse algo.
const PROMPT = `Eres un analizador de seguridad alimentaria. Identifica con precisión todos los alimentos e ingredientes visibles en la imagen para evaluar sus riesgos toxicológicos.

Responde ÚNICAMENTE con un JSON válido, sin texto extra ni bloques markdown.
{
  "alimento_detectado": "todos los ingredientes principales visibles en español, unidos por 'con' e indicando preparación cuando sea relevante (ej: 'tostada con huevo frito', 'salmón ahumado con arroz', 'yogur con nueces y miel', 'ensalada con lechuga y tomate crudo')",
  "categoria": "UNA de estas EXACTAS: pescado|arroz|verduras|carne|lacteos|frutas|mariscos|cereales|huevos|legumbres|procesado|frutos secos|desconocido",
  "confianza": entero_0_a_100,
  "descripcion": "1 frase indicando ingredientes presentes, estado de cocción (crudo/cocinado/frito/ahumado/fermentado/marinado) y grado de procesado (fresco/procesado/ultraprocessado)"
}
Si la imagen no contiene alimento usa categoria "desconocido" y confianza 0.`;

/**
 * Parsea la respuesta en texto de Gemini y la convierte en un objeto estructurado.
 *
 * Aunque pedimos JSON explícitamente en el prompt, los LLMs no siempre respetan
 * el formato al 100%. Por eso implementamos varios niveles de fallback:
 *   1. JSON.parse directo (caso ideal)
 *   2. JSON truncado por límite de tokens → intentamos cerrarlo con '}'
 *   3. Regex para extraer el primer objeto JSON del texto
 *   4. Extracción campo a campo con regex (último recurso)
 *
 * Este tipo de parsing defensivo es habitual cuando se trabaja con APIs de LLMs
 * en producción, donde la salida nunca está 100% garantizada.
 *
 * @param {string} text - Texto bruto devuelto por la API de Gemini.
 * @returns {{ alimento_detectado: string, categoria: string, confianza: number, descripcion: string }}
 * @throws {Error} Si no se puede interpretar el texto en ningún formato conocido.
 */
function parseGeminiText(text) {
  // A veces Gemini envuelve el JSON en bloques markdown ```json ... ``` aunque
  // se lo prohibamos explícitamente en el prompt. Los quitamos antes de parsear.
  text = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();

  // Intento 1: JSON perfecto
  try { return JSON.parse(text); } catch { /* sigue */ }

  // Intento 2: JSON truncado por límite de tokens (maxOutputTokens: 512)
  // Si la respuesta se cortó a mitad, probamos a cerrarla con '}'
  try { return JSON.parse(text.replace(/,\s*$/, '') + '}'); } catch { /* sigue */ }

  // Intento 3: buscar el primer bloque {...} completo dentro del texto
  const m = text.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch { /* sigue */ }
  }

  // Intento 4 (último recurso): extraer cada campo con regex individual.
  // Menos fiable pero cubre casos donde el JSON está muy malformado.
  const get = (key) => {
    const r = text.match(new RegExp(`"${key}"\\s*:\\s*"?([^",}\\n]+)"?`));
    return r?.[1]?.trim() ?? '';
  };
  if (get('alimento_detectado')) {
    return {
      alimento_detectado: get('alimento_detectado'),
      categoria: get('categoria') || 'desconocido',
      confianza: Math.max(0, Math.min(100, parseInt(get('confianza')) || 0)),
      descripcion: get('descripcion') || '',
    };
  }

  console.error('[ToxiScan] Texto sin parsear:', text);
  throw new Error('No se pudo interpretar la respuesta de Gemini. Revisa la consola (F12).');
}

/**
 * Envía una imagen a la API REST de Gemini Vision y devuelve la información
 * alimentaria detectada.
 *
 * @param {string} apiKey  - Clave de la API obtenida en Google AI Studio.
 * @param {string} base64  - Imagen codificada en base64.
 * @param {string} [mimeType='image/jpeg'] - Tipo MIME de la imagen.
 * @returns {Promise<{ alimento_detectado: string, categoria: string, confianza: number, descripcion: string }>}
 * @throws {Error} Si la petición falla o la API devuelve un error.
 */
export async function callGemini(apiKey, base64, mimeType) {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [
        { text: PROMPT },
        // La imagen se pasa como segundo "part" junto al prompt de texto.
        // Gemini Vision los lee juntos y puede relacionar la instrucción con la imagen.
        { inline_data: { mime_type: mimeType || 'image/jpeg', data: base64 } },
      ]}],
      generationConfig: {
        temperature: 0.1,        // casi determinista: queremos clasificación, no creatividad
        maxOutputTokens: 512,    // un JSON con 4 campos no necesita más
        responseMimeType: 'application/json', // fuerza JSON nativo en modelos que lo soportan
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.error?.message || '';
    // Error 400 con 'API_KEY' en el mensaje → clave inválida o no activada
    if (res.status === 400 && msg.includes('API_KEY')) {
      throw new Error('API Key inválida. Revísala en Configuración.');
    }
    throw new Error(msg || `Error ${res.status} de la API Gemini`);
  }

  // La respuesta de Gemini sigue la estructura: candidates[0].content.parts[0].text
  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) throw new Error('Gemini no devolvió ningún resultado.');
  return parseGeminiText(text);
}
