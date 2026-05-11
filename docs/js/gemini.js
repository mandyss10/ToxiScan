// ═══════════════════════════════════════════════════
//  Cliente de Gemini Vision (REST API)
// ═══════════════════════════════════════════════════

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const PROMPT = `Eres un experto en seguridad alimentaria. Analiza la imagen.
Responde ÚNICAMENTE con un JSON válido, sin texto extra ni bloques markdown.
{
  "alimento_detectado": "nombre específico en español",
  "categoria": "UNA de estas EXACTAS: pescado|arroz|verduras|carne|lacteos|frutas|mariscos|cereales|huevos|legumbres|procesado|desconocido",
  "confianza": entero_0_a_100,
  "descripcion": "descripción breve de 1 frase"
}
Si la imagen no contiene alimento usa categoria "desconocido" y confianza 0.`;

function parseGeminiText(text) {
  text = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();

  try { return JSON.parse(text); } catch { /* sigue */ }

  // JSON truncado por límite de tokens
  try { return JSON.parse(text.replace(/,\s*$/, '') + '}'); } catch { /* sigue */ }

  // Buscar primer objeto JSON completo
  const m = text.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch { /* sigue */ }
  }

  // Extracción manual campo a campo
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

export async function callGemini(apiKey, base64, mimeType) {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [
        { text: PROMPT },
        { inline_data: { mime_type: mimeType || 'image/jpeg', data: base64 } },
      ]}],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.error?.message || '';
    if (res.status === 400 && msg.includes('API_KEY')) {
      throw new Error('API Key inválida. Revísala en Configuración.');
    }
    throw new Error(msg || `Error ${res.status} de la API Gemini`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) throw new Error('Gemini no devolvió ningún resultado.');
  return parseGeminiText(text);
}
