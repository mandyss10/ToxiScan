# ToxiScan 🔬

Proyecto final de la asignatura **Bioinformática y Medicina** del Grado en Inteligencia Artificial de la **Universidade da Coruña (UDC)**.

## ¿Qué es?

ToxiScan es una aplicación web estática que usa **visión artificial (Google Gemini)** para identificar alimentos en fotografías y mostrar los perfiles de riesgo toxicológico asociados, basados en literatura científica de EFSA, FDA y OMS.

El usuario sube o captura una foto de un alimento → la IA identifica la categoría → la app muestra las toxinas potenciales conocidas con efectos, fuentes y recomendaciones.

## Demo

🌐 **[Ver aplicación en vivo](https://mandyss10.github.io/ToxiScan/frontend/)**

## Tecnologías

- HTML + CSS + JavaScript vanilla (sin frameworks, sin servidor)
- [Google Gemini Vision API](https://ai.google.dev/) — identificación visual de alimentos
- Desplegado en GitHub Pages

## Categorías soportadas

Pescado · Verduras · Carne · Lácteos · Arroz · Frutas · Mariscos · Cereales · Huevos · Legumbres · Alimentos procesados

## Cómo usar

1. Abre la app y añade tu [API Key gratuita de Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sube una foto o usa la cámara
3. Consulta el perfil toxicológico del alimento detectado

> ⚠️ Solo información educativa. No implica que el alimento analizado esté contaminado.

## Ejecutar en local

No requiere instalación. Abre `frontend/index.html` en el navegador o sirve la carpeta con cualquier servidor estático:

```bash
cd frontend
npx serve .
```

## Equipo

| Nombre | GitHub |
|--------|--------|
| Ivan   | [@mandyss10](https://github.com/mandyss10) |
| ...    | ... |

## DOI

[![DOI](https://zenodo.org/badge/DOI/PENDIENTE.svg)](https://doi.org/PENDIENTE)

---

*Universidade da Coruña · Grado en Inteligencia Artificial · Bioinformática y Medicina · 2025/2026*
