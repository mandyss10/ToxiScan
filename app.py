"""
ToxiScan - Escáner de Toxinas Alimentarias
Identifica alimentos con visión por IA (Gemini) y muestra toxinas conocidas.

Uso: streamlit run app.py
"""

import streamlit as st
import google.generativeai as genai
from PIL import Image
import json
import os
import re
from dotenv import load_dotenv
from toxin_database import TOXIN_DB, get_food_category, get_risk_color, get_risk_label

load_dotenv()

# ---------------------------------------------------------------------------
# Configuración de página
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="ToxiScan",
    page_icon="icon",
    layout="centered",
    initial_sidebar_state="collapsed",
)

# ---------------------------------------------------------------------------
# CSS personalizado
# ---------------------------------------------------------------------------
st.markdown("""
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  /* App Global Variables & Font */
  .stApp { 
    background-color: #0d1117; 
    color: #c9d1d9; 
  }
  
  * { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; 
  }

  /* Hide raw streamit UI pieces */
  #MainMenu, footer, header { visibility: hidden; }

  /* Main Title Wrapper */
  .app-header {
    text-align: center;
    padding: 2.5rem 0 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid #30363d;
    margin-bottom: 2rem;
  }

  /* Professional Title */
  .app-title {
    font-size: 2.5rem !important;
    font-weight: 700 !important;
    letter-spacing: -0.5px;
    color: #f0f6fc;
    margin: 0;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .app-subtitle {
    color: #8b949e;
    font-size: 1rem;
    font-weight: 400;
    margin-top: 0.75rem;
    max-width: 90%;
    line-height: 1.5;
  }

  /* Clean Professional Card */
  .food-card {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    padding: 2rem;
    margin: 1rem 0;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .food-emoji { 
    font-size: 3rem; 
    line-height: 1; 
    margin-bottom: 1rem;
  }

  .food-name { 
    font-size: 1.5rem; 
    font-weight: 600; 
    color: #ffffff;
    margin: 0.5rem 0; 
  }
  .food-detected { 
    color: #8b949e; 
    font-size: 0.95rem; 
    font-weight: 400; 
  }

  /* Confidence Bar */
  .confidence-bar-wrap { margin-top: 1.5rem; }
  .confidence-label { 
    font-size: 0.85rem; 
    font-weight: 500; 
    color: #8b949e; 
    margin-bottom: 0.5rem; 
    text-transform: uppercase; 
    letter-spacing: 0.5px; 
  }
  .confidence-bar-bg {
    background: #0d1117;
    border-radius: 4px;
    height: 6px;
    border: 1px solid #30363d;
    overflow: hidden;
  }
  .confidence-bar-fill {
    height: 100%;
    border-radius: 4px;
    background: #2f81f7;
    transition: width 1s ease-in-out;
  }
  .confidence-pct { 
    font-size: 1rem; 
    font-weight: 600; 
    color: #58a6ff; 
    margin-top: 0.5rem; 
  }

  /* Section Title */
  .section-title {
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #8b949e;
    margin: 2.5rem 0 1rem;
    border-bottom: 1px solid #30363d;
    padding-bottom: 0.5rem;
  }

  /* Professional Toxin Cards */
  .toxin-card {
    background: #161b22;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border: 1px solid #30363d;
    border-left: 4px solid #f85149;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .toxin-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.8rem;
    flex-wrap: wrap;
    margin-bottom: 0.8rem;
  }
  .toxin-name { font-weight: 600; font-size: 1.1rem; color: #f0f6fc; }
  .toxin-type { font-size: 0.85rem; color: #8b949e; font-weight: 400; margin-top: 2px; }
  
  .risk-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 4px;
    color: #ffffff;
    background: #21262d;
    border: 1px solid #30363d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .toxin-detail { font-size: 0.9rem; color: #c9d1d9; margin-top: 0.5rem; line-height: 1.5; font-weight: 400; }
  .toxin-detail strong { color: #f0f6fc; font-weight: 500; }
  .toxin-recommendation {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: #0d1117;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #58a6ff;
    border: 1px solid #30363d;
    font-weight: 500;
  }

  /* Educational Disclaimer */
  .disclaimer {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    padding: 1.25rem;
    margin-top: 2.5rem;
    font-size: 0.85rem;
    color: #8b949e;
    text-align: left;
    line-height: 1.6;
  }

  /* Standard Professional Buttons */
  .stButton > button {
    width: 100%;
    background: #238636;
    color: #ffffff !important;
    font-weight: 500 !important;
    font-size: 1rem !important;
    border: 1px solid rgba(240, 246, 252, 0.1);
    border-radius: 6px;
    padding: 0.6rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .stButton > button:hover { 
    background: #2ea043;
    border-color: rgba(240, 246, 252, 0.1);
  }

  /* Refined Inputs / Uploaders */
  .stFileUploader > div, .stCameraInput > div {
    background: #161b22 !important;
    border: 1px solid #30363d !important;
    border-radius: 8px !important;
    transition: all 0.2s ease;
  }
  .stFileUploader > div:hover, .stCameraInput > div:hover {
    border-color: #8b949e !important;
  }

  /* Custom Radios for Source Selection */
  div[role="radiogroup"] > label {
    background: #161b22;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: 1px solid #30363d;
  }

  /* Not Found Alert */
  .not-found {
    background: #161b22;
    border: 1px solid #30363d;
    border-left: 4px solid #f85149;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    color: #c9d1d9;
    margin-top: 1.5rem;
  }

  /* Modern Spinner */
  .stSpinner > div > div { 
    border-color: #30363d !important;
    border-top-color: #58a6ff !important; 
  }

  /* Home Screen Welcome Grid */
  .welcome-container {
    text-align: center; 
    padding: 3rem 2rem; 
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .welcome-icon { 
    font-size: 3rem; 
    margin-bottom: 1rem; 
  }
  .icon-grid {
    display: flex; justify-content: center; gap: 1.5rem; margin-top: 2.5rem; flex-wrap: wrap;
  }
  .grid-item {
    text-align: center;
    padding: 1rem;
    border-radius: 8px;
    background: #0d1117;
    border: 1px solid #30363d;
    width: 100px;
    transition: border-color 0.2s;
  }
  .grid-item:hover {
    border-color: #8b949e;
  }
  .grid-item-emoji { font-size: 2rem; margin-bottom: 0.5rem; }
  .grid-item-text { font-size: 0.85rem; color: #8b949e; font-weight: 500; }
  
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------------------------
# Header
# ---------------------------------------------------------------------------
st.markdown("""
<div class="app-header">
  <div class="app-title">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
    ToxiScan
  </div>
  <div class="app-subtitle">Plataforma de Identificación de Riesgos Toxicológicos Alimentarios</div>
</div>
""", unsafe_allow_html=True)

# ---------------------------------------------------------------------------
# Configuración de la API Key de Gemini
# ---------------------------------------------------------------------------
def get_api_key() -> str:
    """Obtiene la API key de Gemini desde distintas fuentes."""
    # 1. Variable de entorno (.env)
    key = os.getenv("GEMINI_API_KEY", "")
    if key:
        return key
    # 2. Streamlit secrets (despliegue en Streamlit Cloud)
    try:
        key = st.secrets.get("GEMINI_API_KEY", "")
        if key:
            return key
    except Exception:
        pass
    return ""


api_key = get_api_key()

if not api_key:
    st.markdown("---")
    with st.expander("Configuración de API Key", expanded=True):
        st.markdown(
            "Para usar ToxiScan necesitas una **API Key de Google Gemini** (gratuita). "
            "[Obtener aquí →](https://aistudio.google.com/app/apikey)"
        )
        input_key = st.text_input(
            "Pega tu API Key:", type="password", placeholder="AIza..."
        )
        if input_key:
            st.session_state["manual_api_key"] = input_key
            st.rerun()

    if "manual_api_key" in st.session_state:
        api_key = st.session_state["manual_api_key"]
    else:
        st.stop()

genai.configure(api_key=api_key)

# ---------------------------------------------------------------------------
# Función de identificación con Gemini
# ---------------------------------------------------------------------------
def identify_food(image: Image.Image) -> dict:
    """
    Envía la imagen a Gemini Vision y devuelve un diccionario con:
    {
        "alimento_detectado": str,
        "categoria": str,
        "confianza": int (0-100),
        "descripcion": str
    }
    """
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = (
        "Eres un experto en seguridad alimentaria. Analiza esta imagen de alimento.\n"
        "Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional ni bloques de código.\n"
        "Formato requerido:\n"
        "{\n"
        '  "alimento_detectado": "nombre específico del alimento en español",\n'
        '  "categoria": "una de estas opciones EXACTAS: pescado | arroz | verduras | carne | '
        'lacteos | frutas | mariscos | cereales | huevos | legumbres | procesado | desconocido",\n'
        '  "confianza": numero entero entre 0 y 100,\n'
        '  "descripcion": "descripción breve de 1 frase del alimento"\n'
        "}\n"
        "Si la imagen no contiene alimento, usa categoria 'desconocido' y confianza 0."
    )

    response = model.generate_content([prompt, image])
    raw = response.text.strip()

    # Eliminar posibles bloques de código Markdown
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        # Intento de extracción con regex si el modelo añade texto extra
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            data = json.loads(match.group())
        else:
            data = {
                "alimento_detectado": "No identificado",
                "categoria": "desconocido",
                "confianza": 0,
                "descripcion": "No se pudo analizar la imagen"
            }

    # Normalizar confianza
    data["confianza"] = max(0, min(100, int(data.get("confianza", 0))))
    return data


# ---------------------------------------------------------------------------
# Función de renderizado de resultados
# ---------------------------------------------------------------------------
def render_toxin_card(toxin: dict):
    """Renderiza una tarjeta HTML para una toxina."""
    riesgo = toxin.get("riesgo", "bajo")
    color = get_risk_color(riesgo)
    badge_label = get_risk_label(riesgo)

    html = f"""
    <div class="toxin-card" style="border-left-color: {color};">
      <div class="toxin-header">
        <div>
          <div class="toxin-name">{toxin['nombre']}</div>
          <div class="toxin-type">{toxin['tipo']}</div>
        </div>
        <span class="risk-badge" style="background-color: {color};">{badge_label}</span>
      </div>
      <div class="toxin-detail">
        <strong>Efecto:</strong> {toxin['efecto']}
      </div>
      <div class="toxin-detail">
        <strong>Fuente:</strong> {toxin['fuente']}
      </div>
      <div class="toxin-recommendation">
        {toxin['recomendacion']}
      </div>
    </div>
    """
    st.markdown(html, unsafe_allow_html=True)


def render_results(food_info: dict, db_entry: dict):
    """Renderiza la tarjeta de alimento identificado y sus toxinas."""
    confianza = food_info["confianza"]
    bar_color_class = ""  # ya está en CSS con gradiente fijo

    # Tarjeta principal
    st.markdown(f"""
    <div class="food-card">
      <div class="food-emoji">{db_entry['emoji']}</div>
      <div class="food-name">{db_entry['nombre'].upper()} Detectado</div>
      <div class="food-detected">Clasificación: {food_info['alimento_detectado']} - {food_info['descripcion']}</div>
      <div class="confidence-bar-wrap">
        <div class="confidence-label">Precisión del Modelo AI</div>
        <div class="confidence-bar-bg">
          <div class="confidence-bar-fill" style="width:{confianza}%;"></div>
        </div>
        <div class="confidence-pct">{confianza}%</div>
      </div>
    </div>
    """, unsafe_allow_html=True)

    # Toxinas
    st.markdown('<div class="section-title">Análisis de Compuestos y Riesgos Reportados</div>', unsafe_allow_html=True)
    for toxin in db_entry["toxinas"]:
        render_toxin_card(toxin)

    # Disclaimer
    st.markdown("""
    <div class="disclaimer">
      <strong>Información educativa</strong><br>
      Esta aplicación muestra riesgos <em>potenciales</em> basados en evidencia científica publicada
      (EFSA, FDA, OMS). No implica que el alimento de la imagen esté contaminado.
      Los niveles de exposición reales dependen del origen, procesado y cantidad consumida.
      Ante dudas de seguridad alimentaria, consulta a un especialista.
    </div>
    """, unsafe_allow_html=True)


# ---------------------------------------------------------------------------
# Interfaz principal
# ---------------------------------------------------------------------------
st.markdown("---")

# Selector de fuente de imagen
source = st.radio(
    "¿Cómo quieres analizar el alimento?",
    options=["Subir imagen", "Usar cámara"],
    horizontal=True,
    label_visibility="collapsed"
)

image: Image.Image | None = None

if source == "Subir imagen":
    uploaded = st.file_uploader(
        "Sube una foto del alimento",
        type=["jpg", "jpeg", "png", "webp"],
        label_visibility="visible"
    )
    if uploaded:
        image = Image.open(uploaded).convert("RGB")
else:
    captured = st.camera_input("Apunta la cámara al alimento")
    if captured:
        image = Image.open(captured).convert("RGB")

# Mostrar preview
if image:
    col1, col2, col3 = st.columns([1, 3, 1])
    with col2:
        st.image(image, caption="Imagen a analizar", use_container_width=True)

    # Botón de análisis
    if st.button("Analizar toxinas"):
        with st.spinner("Analizando con Gemini Vision..."):
            try:
                food_info = identify_food(image)
            except Exception as e:
                st.error(f"Error al conectar con Gemini: {e}")
                st.stop()

        category = food_info.get("categoria", "desconocido")

        # Intentar resolución alternativa si Gemini devuelve desconocido
        if category == "desconocido" or category not in TOXIN_DB:
            category = get_food_category(food_info.get("alimento_detectado", ""))

        if category and category in TOXIN_DB:
            render_results(food_info, TOXIN_DB[category])
        else:
            alimento = food_info.get("alimento_detectado", "No identificado")
            st.markdown(f"""
            <div class="not-found">
              <p><strong style="color:#f1f5f9; font-size:1.2rem;">Atención: No se pudo identificar el alimento</strong></p>
              <p>Gemini detectó: <em>"{alimento}"</em></p>
              <p>Prueba con una imagen más clara o de otro ángulo.</p>
            </div>
            """, unsafe_allow_html=True)

else:
    # Pantalla de bienvenida / instrucciones
    st.markdown("""
    <div class="welcome-container">
      <div class="welcome-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8b949e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      <p style="font-size: 1.1rem; color: #c9d1d9; font-weight: 400; line-height: 1.6; margin: 0 auto; max-width: 500px;">
        Sube o captura una fotografía para realizar el análisis.<br>El sistema identificará la categoría alimentaria y listará los perfiles toxicológicos reportados en la literatura científica.
      </p>
      <div class="icon-grid">
        <div class="grid-item">
          <div class="grid-item-text">Pescado</div>
        </div>
        <div class="grid-item">
          <div class="grid-item-text">Verduras</div>
        </div>
        <div class="grid-item">
          <div class="grid-item-text">Carne</div>
        </div>
        <div class="grid-item">
          <div class="grid-item-text">Lácteos</div>
        </div>
        <div class="grid-item">
          <div class="grid-item-text">Arroz</div>
        </div>
      </div>
    </div>
    """, unsafe_allow_html=True)

