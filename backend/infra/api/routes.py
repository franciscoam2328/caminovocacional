from fastapi import APIRouter, HTTPException
import joblib
import json
import os
from .schemas import TestInputSchema

router = APIRouter()

MODEL_PATH = "backend/infra/model_ia/modelo_vocacional_rbf_final.pkl"
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
    # Se asume que el modelo espera un arreglo 2D como [[resp1, resp2, ...]]
    try:
        prediccion = modelo.predict([data.respuestas])
        pred_val = str(prediccion[0])
        # Extraer el número inicial si la respuesta viene con texto como "1. Ciencias..."
        cluster_id = int(pred_val.split(".")[0]) if "." in pred_val else int(pred_val)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error durante la predicción de IA: {str(e)}")

    # 3. Cargar la base de datos estática (JSON)
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=500, detail="La base de datos de oferta educativa no se encuentra.")
    
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        oferta_data = json.load(f)
    
    # 4. Buscar las carreras asociadas al cluster predicho
    area_recomendada = None
    for area in oferta_data.get("areas_vocacionales", []):
        if area["cluster_id"] == cluster_id:
            area_recomendada = area
            break
            
    if not area_recomendada:
        raise HTTPException(status_code=404, detail=f"No se encontraron recomendaciones para el cluster predicho ({cluster_id}).")

    # 5. Retornar el formato de respuesta esperado
    return {
        "estudiante": data.nombre_estudiante,
        "cluster_predicho": cluster_id,
        "area_recomendada": area_recomendada["nombre"],
        "carreras_disponibles": area_recomendada["carreras"]
    }
