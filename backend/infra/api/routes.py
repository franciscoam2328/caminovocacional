from fastapi import APIRouter, HTTPException
import json
import os
import math
from .schemas import TestInputSchema
import unicodedata

def normalize_text(text: str) -> str:
    """Removes accents and makes lowercase for robust string matching."""
    if not isinstance(text, text.__class__):
        return str(text)
    return unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8').lower()

def euclidean_distance(v1, v2):
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(v1, v2)))

def cosine_similarity(v1, v2):
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_v1 = math.sqrt(sum(a ** 2 for a in v1))
    norm_v2 = math.sqrt(sum(b ** 2 for b in v2))
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return dot_product / (norm_v1 * norm_v2)

router = APIRouter()
DATA_PATH = "backend/infra/data/data_oferta_educativa.json"

@router.post("/predict")
def predict_vocational_cluster(data: TestInputSchema):
    resp = data.respuestas
    if len(resp) != 60:
        raise ValueError(f"Se esperaban 60 respuestas, se recibieron {len(resp)}")
        
    # Calcular sumas (R, I, A, S, E, C)
    r_sum = sum(resp[0:10])
    i_sum = sum(resp[10:20])
    a_sum = sum(resp[20:30])
    s_sum = sum(resp[30:40])
    e_sum = sum(resp[40:50])
    c_sum = sum(resp[50:60])
    
    puntajes = {
        "Realista": r_sum,
        "Investigador": i_sum,
        "Artístico": a_sum,
        "Social": s_sum,
        "Emprendedor": e_sum,
        "Convencional": c_sum
    }
    
    # Obtener el Código Holland de 3 letras
    sorted_puntajes = sorted(puntajes.items(), key=lambda item: item[1], reverse=True)
    holland_code = "".join([k[0] for k, v in sorted_puntajes[:3]])
    
    estudiante_vector = [r_sum, i_sum, a_sum, s_sum, e_sum, c_sum]
    
    # Cargar la BD
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=500, detail="La base de datos de oferta educativa no se encuentra.")
    
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        oferta_data = json.load(f)
        
    carreras_bd = oferta_data.get("carreras", [])
    
    # Aplicar KNN sobre todas las carreras
    distancias = []
    for carrera in carreras_bd:
        vector_carrera = carrera.get("vector_ideal_riasec", [25,25,25,25,25,25])
        
        # --- VERSION ANTIGUA (EUCLIDIANA CLASICA) ---
        # dist = euclidean_distance(estudiante_vector, vector_carrera)
        # afinidad = max(0, 100 - (dist * 1.5))
        
        # --- NUEVA VERSION (SIMILITUD DE COSENOS) ---
        similitud = cosine_similarity(estudiante_vector, vector_carrera)
        afinidad = similitud * 100 # Directo a porcentaje (0% a 100%)
        
        # Invertimos la similitud para que el sort() siga ordenando de menor a mayor
        dist_calculada = 1.0 - similitud 
        
        distancias.append({
            "id_modelo": carrera["id_modelo"],
            "nombre_mostrar": carrera["nombre_mostrar"],
            "descripcion": carrera.get("descripcion", ""),
            "afinidad": round(afinidad, 1),
            "universidades": carrera.get("universidades", []),
            "distancia": dist_calculada
        })
        
    # Ordenar por menor distancia
    distancias.sort(key=lambda x: x["distancia"])
    
    # Tomar el top 3
    carreras_recomendadas = distancias[:3]
    
    # Eliminar campo distancia de la respuesta
    for c in carreras_recomendadas:
        del c["distancia"]

    return {
        "estudiante": data.nombre_estudiante,
        "codigo_holland": holland_code,
        "puntajes_riasec": puntajes,
        "carreras_recomendadas": carreras_recomendadas
    }
