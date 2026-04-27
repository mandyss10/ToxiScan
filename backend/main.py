import os
import json
import re
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from PIL import Image
import io
from dotenv import load_dotenv
from toxin_database import TOXIN_DB, get_food_category

# Forzar lectura estricta del archivo superior, cada vez que este módulo reinicia
load_dotenv(dotenv_path="../.env", override=True)

app = FastAPI(title="ToxiScan API")

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GEMINI_API_KEY", "")
if not api_key:
    # We will log it, but wait for request to fail if it's missing.
    print("WARNING: GEMINI_API_KEY not set in .env")
else:
    genai.configure(api_key=api_key)


def _identify_food_sync(image_bytes: bytes) -> dict:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    model = genai.GenerativeModel("gemini-3-flash-preview")

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

    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
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

    data["confianza"] = max(0, min(100, int(data.get("confianza", 0))))
    return data


@app.post("/api/scan")
async def scan_food(file: UploadFile = File(...)):
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key no configurada en el backend.")
        
    try:
        contents = await file.read()
        # You shouldn't block the async loop in prod for heavy image models, but for this SaaS MVP it's perfect.
        food_info = _identify_food_sync(contents)
        
        category = food_info.get("categoria", "desconocido")

        if category == "desconocido" or category not in TOXIN_DB:
            category = get_food_category(food_info.get("alimento_detectado", ""))

        if category and category in TOXIN_DB:
            db_entry = TOXIN_DB[category]
            return {
                "success": True,
                "food_info": food_info,
                "db_entry": db_entry,
                "message": "Alimento y toxinas identificadas correctamente."
            }
        else:
            return {
                "success": False,
                "food_info": food_info,
                "message": "Alimento detectado pero no se encontraron toxinas asociadas en la base de datos."
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "ToxiScan API is running"}
