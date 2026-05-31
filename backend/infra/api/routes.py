from fastapi import APIRouter, HTTPException
import joblib
import json
import os
from .schemas import TestInputSchema

import unicodedata

def normalize_text(text: str) -> str:
    """Removes accents and makes lowercase for robust string matching."""
    if not isinstance(text, str):
        return str(text)
    return unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8').lower()

router = APIRouter()

MODEL_PATH = "backend/infra/model_ia/rf_vocacional_escala_real.pkl"
DATA_PATH = "backend/infra/data/data_oferta_educativa.json"

@router.post("/predict")
def predict_vocational_cluster(data: TestInputSchema):
    # 1. Cargar el modelo IA
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=500, detail="El modelo de IA no se encuentra disponible (modelo.pkl no hallado).")
    
    try:
        modelo = joblib.load(MODEL_PATH)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al cargar el modelo: {str(e)}")

    # 2. Realizar la predicción
    try:
        # data.respuestas debe tener ahora 48 elementos
        if len(data.respuestas) != 48:
            raise ValueError(f"Se esperaban 48 respuestas, se recibieron {len(data.respuestas)}")
        prediccion = modelo.predict([data.respuestas])
        pred_val = str(prediccion[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error durante la predicción de IA: {str(e)}")

    # 3. Cargar la base de datos estática (JSON)
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=500, detail="La base de datos de oferta educativa no se encuentra.")
    
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        oferta_data = json.load(f)
    
    # 4. Buscar las carreras asociadas a la categoría predicha (por texto en vez de cluster_id)
    area_recomendada = None
    pred_val_norm = normalize_text(pred_val)

    for area in oferta_data.get("areas_vocacionales", []):
        area_nombre_norm = normalize_text(area["nombre"])
        if area_nombre_norm == pred_val_norm:
            area_recomendada = area
            break
            
    if not area_recomendada:
        raise HTTPException(status_code=404, detail=f"No se encontraron recomendaciones para la predicción ({pred_val}).")

    # 5. Retornar el formato de respuesta esperado
    return {
        "estudiante": data.nombre_estudiante,
        "cluster_predicho": area_recomendada["cluster_id"],
        "area_recomendada": area_recomendada["nombre"],
        "carreras_disponibles": area_recomendada["carreras"]
    }
