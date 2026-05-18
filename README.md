# ToxiScan

Proyecto final de la asignatura **Bioinformática y Medicina** — Grado en Inteligencia Artificial, **Universidade da Coruña (UDC)**, curso 2025/2026.

---

## ¿Qué es ToxiScan?

ToxiScan es una aplicación web estática que combina **visión artificial** con una base de datos toxicológica para ayudar a entender los riesgos asociados a distintos grupos de alimentos.

El flujo es sencillo:
1. El usuario sube o captura una fotografía de un alimento.
2. La IA (Google Gemini Vision) identifica la categoría del alimento.
3. La aplicación muestra el perfil de riesgo toxicológico: toxinas potenciales, efectos documentados, fuentes científicas y recomendaciones.

> **Aviso:** ToxiScan es una herramienta educativa. El análisis no implica que el alimento fotografiado esté contaminado; refleja riesgos conocidos a nivel poblacional según la literatura científica.

---

## Demo

**[Ver aplicación en vivo →](https://mandyss10.github.io/ToxiScan/)**

---

## Arquitectura técnica

ToxiScan es una **SPA estática** sin backend ni servidor. Todo el procesamiento ocurre en el navegador del usuario.

```
docs/
├── index.html          # Punto de entrada — UI principal y modales
├── style.css           # Estilos
└── js/
    ├── main.js         # Orquestador: inicialización, eventos y flujo de análisis
    ├── gemini.js       # Integración con Google Gemini Vision API
    ├── data.js         # Base de datos de toxinas y resolución de categorías
    ├── ui.js           # Renderizado de resultados, modales y notificaciones
    ├── camera.js       # Captura de imagen desde cámara del dispositivo
    ├── storage.js      # Persistencia de API key e historial (localStorage)
    └── particles.js    # Efecto visual de partículas en la pantalla de inicio
```

### Flujo de análisis

```
Imagen (upload / cámara)
        │
        ▼
  fileToBase64()          ← main.js
        │
        ▼
  callGemini()            ← gemini.js   →  Google Gemini Vision API
        │
   { categoría, confianza, descripción }
        │
        ▼
  resolveCategory()       ← data.js     →  base de datos toxicológica
        │
   { toxinas[], fuentes, recomendaciones }
        │
        ▼
  renderResults()         ← ui.js       →  pantalla de resultados
```

### Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5 + CSS3 + JavaScript ES Modules (vanilla) |
| IA / Visión | [Google Gemini Vision API](https://ai.google.dev/) |
| Persistencia | `localStorage` (sin cuenta de usuario) |
| Despliegue | GitHub Pages |

---

## Categorías soportadas

| Grupo | Ejemplos |
|-------|----------|
| Pescado | Atún, salmón, merluza |
| Verduras | Espinacas, lechuga, patata |
| Carne | Pollo, cerdo, ternera |
| Lácteos | Leche, queso, yogur |
| Arroz | Arroz blanco, integral |
| Frutas | Manzana, fresa, naranja |
| Mariscos | Mejillones, gambas, almejas |
| Cereales | Trigo, maíz, avena |
| Huevos | Huevo de gallina |
| Legumbres | Lentejas, garbanzos, soja |
| Frutos secos | Almendras, nueces, cacahuetes |
| Alimentos procesados | Embutidos, snacks, conservas |

---

## Cómo usar la aplicación

### Requisitos previos

Necesitas una **API Key gratuita de Google AI Studio**:

1. Ve a [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Inicia sesión con tu cuenta de Google.
3. Crea una nueva API Key y cópiala.

### Pasos

1. Abre la [aplicación](https://mandyss10.github.io/ToxiScan/).
2. Pega tu API Key en el campo que aparece al entrar (se guarda en tu navegador; no se envía a ningún servidor externo).
3. Sube una foto de un alimento (botón **Subir imagen**) o usa la cámara de tu dispositivo (botón **Usar cámara**).
4. Espera unos segundos mientras Gemini analiza la imagen.
5. Consulta el perfil toxicológico: nombre del alimento detectado, nivel de confianza, toxinas potenciales, efectos, fuentes y recomendaciones.
6. Usa el botón **Historial** para consultar análisis previos almacenados en tu navegador.

---

## Ejecutar en local

No se necesita backend. Sirve la carpeta `docs/` con cualquier servidor estático:

**Con Node.js `serve`:**

```bash
cd docs
npx serve .
```

La aplicación estará disponible en `http://localhost:<puerto>`.

---

## Equipo

| Nombre | GitHub |
|--------|--------|
| Ivan | [@mandyss10](https://github.com/mandyss10) |
| Aroa | [@aroaneira](https://github.com/aroaneira) |
| Lucía | [@luciaesperonn](https://github.com/luciaesperonn) |

---

## DOI / Cita

Este repositorio está archivado en [Zenodo](https://zenodo.org).

[![DOI](https://zenodo.org/badge/DOI/PENDIENTE.svg)](https://doi.org/PENDIENTE)

```
Ivan, Aroa & Lucía. (2026). ToxiScan: aplicación web de análisis toxicológico de alimentos mediante visión artificial (v1.0.0). Zenodo. https://doi.org/PENDIENTE
```

---

*Universidade da Coruña · Grado en Inteligencia Artificial · Bioinformática y Medicina · 2025/2026*
