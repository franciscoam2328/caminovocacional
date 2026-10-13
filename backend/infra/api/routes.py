from fastapi import APIRouter, HTTPException
import json
import os
import math
import sqlite3
import unicodedata
from datetime import datetime
from .schemas import (
    TestInputSchema, 
    LoginInputSchema, 
    CreateStudentSchema, 
    UpdateStudentSchema,
    UpdateOfferSchema, 
    CreateCareerSchema,
    UpdateCareerSchema,
    CreateUniversitySchema
)
from backend.infra.db.database import (
    get_db_connection, 
    verify_password, 
    hash_password,
    DBIntegrityError
)

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

# Centroides psicométricos oficiales RIASEC [R, I, A, S, E, C] por Clúster / Área Vocacional
CLUSTER_CENTROIDS = {
    1: [28, 46, 22, 42, 25, 28], # Ciencias de la Salud (Dominante: Investigador + Social)
    2: [44, 46, 22, 20, 33, 35], # Ingeniería y Tecnología (Dominante: Realista + Investigador)
    3: [20, 27, 25, 35, 48, 43], # Negocios y Gestión (Dominante: Emprendedor + Convencional)
    4: [20, 28, 45, 44, 32, 26], # Humanidades, Artes y Educación (Dominante: Artístico + Social)
}
DEFAULT_CENTROID = [25, 25, 25, 25, 25, 25]

# ==============================================================================
# AUTENTICACIÓN (ESTUDIANTES Y ADMINISTRADORES)
# ==============================================================================
@router.post("/auth/login")
def login(data: LoginInputSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, codigo_estudiante, nombre_completo, password_hash, rol, institucion
        FROM usuarios
        WHERE codigo_estudiante = ?
    """, (data.codigo.strip(),))
    user = cursor.fetchone()
    conn.close()

    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas (Código o contraseña inválidos)")

    return {
        "status": "success",
        "user": {
            "id": user["id"],
            "codigo_estudiante": user["codigo_estudiante"],
            "nombre_completo": user["nombre_completo"],
            "rol": user["rol"],
            "institucion": user["institucion"]
        },
        "token": f"token-{user['rol']}-{user['id']}"
    }

# ==============================================================================
# PREDICCIÓN CON K-NN (COSENOS) Y PERSISTENCIA DE EVALUACIÓN
# ==============================================================================
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
    
    # 1. Cargar carreras base desde JSON para preservar centroides calibrados de O*NET
    carreras_base = []
    if os.path.exists(DATA_PATH):
        try:
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                carreras_base = json.load(f).get("carreras", [])
        except Exception as e:
            print("Aviso al leer JSON base:", e)

    carreras_json_map = {normalize_text(c["nombre_mostrar"]): c for c in carreras_base}
    carreras_para_evaluar = []

    # 2. Cargar todas las carreras y ofertas de la base de datos (incluyendo las creadas por el admin)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, cluster_id, area_nombre, nombre FROM carreras")
        db_carreras = [dict(r) for r in cursor.fetchall()]

        # Traer ofertas universitarias en vivo
        cursor.execute("""
            SELECT o.carrera_id, u.siglas, u.nombre as universidad_nombre, u.tipo, o.costo_promedio, o.matricula
            FROM oferta_universidad o
            JOIN universidades u ON o.universidad_id = u.id
        """)
        ofertas_raw = [dict(r) for r in cursor.fetchall()]
        ofertas_por_carrera = {}
        for off in ofertas_raw:
            cid = off["carrera_id"]
            if cid not in ofertas_por_carrera:
                ofertas_por_carrera[cid] = []
            ofertas_por_carrera[cid].append({
                "nombre": off["siglas"] or off["universidad_nombre"],
                "tipo": off["tipo"],
                "costo_promedio": f"S/ {int(off['costo_promedio'])}" if off["costo_promedio"] > 0 else "S/ 0",
                "matricula": f"S/ {int(off['matricula'])}" if off["matricula"] > 0 else "S/ 0"
            })

        for dbc in db_carreras:
            norm_name = normalize_text(dbc["nombre"])
            json_match = carreras_json_map.get(norm_name)

            if json_match:
                # Carrera pre-calibrada: usa vector ideal específico de O*NET
                vector_riasec = json_match.get("vector_ideal_riasec", DEFAULT_CENTROID)
                descripcion = json_match.get("descripcion", f"Programa profesional de {dbc['nombre']}.")
                id_modelo = json_match.get("id_modelo", dbc["area_nombre"])
                univs = ofertas_por_carrera.get(dbc["id"]) or json_match.get("universidades", [])
            else:
                # Carrera nueva creada por Administrador: asigna AUTOMÁTICAMENTE el centroide de su clúster
                vector_riasec = CLUSTER_CENTROIDS.get(dbc["cluster_id"], DEFAULT_CENTROID)
                descripcion = f"Carrera profesional en {dbc['area_nombre']} con formación académica integral."
                id_modelo = dbc["area_nombre"]
                univs = ofertas_por_carrera.get(dbc["id"], [])

            carreras_para_evaluar.append({
                "id_modelo": id_modelo,
                "nombre_mostrar": dbc["nombre"],
                "descripcion": descripcion,
                "vector_ideal_riasec": vector_riasec,
                "universidades": univs
            })
        conn.close()
    except Exception as e:
        print("Aviso al consultar carreras en BD, usando fallback JSON:", e)
        carreras_para_evaluar = carreras_base

    if not carreras_para_evaluar:
        carreras_para_evaluar = carreras_base

    # 3. Aplicar K-NN por Similitud de Cosenos sobre todas las carreras
    distancias = []
    for carrera in carreras_para_evaluar:
        vector_carrera = carrera.get("vector_ideal_riasec", DEFAULT_CENTROID)
        similitud = cosine_similarity(estudiante_vector, vector_carrera)
        afinidad = similitud * 100
        dist_calculada = 1.0 - similitud 
        
        distancias.append({
            "id_modelo": carrera["id_modelo"],
            "nombre_mostrar": carrera["nombre_mostrar"],
            "descripcion": carrera.get("descripcion", ""),
            "afinidad": round(afinidad, 1),
            "universidades": carrera.get("universidades", []),
            "distancia": dist_calculada
        })
        
    distancias.sort(key=lambda x: x["distancia"])
    carreras_recomendadas = distancias[:3]
    
    for c in carreras_recomendadas:
        del c["distancia"]

    # PERSISTENCIA EN BASE DE DATOS
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        usuario_id = None
        if data.codigo_estudiante:
            cursor.execute("SELECT id FROM usuarios WHERE codigo_estudiante = ?", (data.codigo_estudiante,))
            u = cursor.fetchone()
            if u:
                usuario_id = u["id"]

        if not usuario_id:
            cursor.execute("SELECT id FROM usuarios WHERE nombre_completo LIKE ?", (f"%{data.nombre_estudiante}%",))
            u = cursor.fetchone()
            usuario_id = u["id"] if u else 1

        carrera_top_nombre = carreras_recomendadas[0]["nombre_mostrar"] if carreras_recomendadas else "General"
        area_predicha = sorted_puntajes[0][0] # Nombre del perfil dominante

        cursor.execute("""
            INSERT INTO evaluaciones (usuario_id, nombre_estudiante, cluster_predicho, area_recomendada, carrera_top, holland_code, respuestas_json, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Completado')
        """, (
            usuario_id,
            data.nombre_estudiante,
            1,
            area_predicha,
            carrera_top_nombre,
            holland_code,
            json.dumps(data.respuestas)
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print("Aviso: no se pudo persistir evaluación en BD:", e)


    return {
        "estudiante": data.nombre_estudiante,
        "codigo_holland": holland_code,
        "puntajes_riasec": puntajes,
        "carreras_recomendadas": carreras_recomendadas
    }

# ==============================================================================
# PANEL DE ADMINISTRACIÓN - KPIS Y REPORTES
# ==============================================================================
@router.get("/admin/dashboard")
def get_admin_dashboard():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Total Tests
    cursor.execute("SELECT COUNT(*) FROM evaluaciones")
    total_tests = cursor.fetchone()[0]

    # 2. Perfil Dominante
    cursor.execute("""
        SELECT area_recomendada, COUNT(*) as cnt
        FROM evaluaciones
        GROUP BY area_recomendada
        ORDER BY cnt DESC
        LIMIT 1
    """)
    dominant_area_row = cursor.fetchone()
    perfil_dominante = dominant_area_row["area_recomendada"] if dominant_area_row else "Investigador"

    # 3. Carrera más sugerida
    cursor.execute("""
        SELECT carrera_top, COUNT(*) as cnt
        FROM evaluaciones
        GROUP BY carrera_top
        ORDER BY cnt DESC
        LIMIT 1
    """)
    top_career_row = cursor.fetchone()
    carrera_mas_sugerida = top_career_row["carrera_top"] if top_career_row else "Ingeniería de Sistemas"

    # 4. Últimos registros reales
    cursor.execute("""
        SELECT e.id, DATE(e.fecha) as date, e.nombre_estudiante as name, 
               COALESCE(e.holland_code, 'RIC') as code, e.carrera_top as career, e.estado as status
        FROM evaluaciones e
        ORDER BY e.id DESC
        LIMIT 10
    """)
    ultimos_registros = [dict(r) for r in cursor.fetchall()]

    conn.close()

    return {
        "total_tests": total_tests,
        "perfil_dominante": perfil_dominante,
        "carrera_mas_sugerida": carrera_mas_sugerida,
        "ultimos_registros": ultimos_registros
    }

# ==============================================================================
# PANEL DE ADMINISTRACIÓN - GESTIÓN DE ESTUDIANTES
# ==============================================================================
@router.get("/admin/students")
def list_students():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.codigo_estudiante, u.nombre_completo, u.institucion,
               DATE(u.fecha_registro) as fecha_registro,
               COALESCE((SELECT estado FROM evaluaciones WHERE usuario_id = u.id ORDER BY id DESC LIMIT 1), 'Pendiente') as estado_test,
               (SELECT carrera_top FROM evaluaciones WHERE usuario_id = u.id ORDER BY id DESC LIMIT 1) as carrera_recomendada
        FROM usuarios u
        WHERE u.rol = 'estudiante'
        ORDER BY u.id DESC
    """)
    students = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"students": students}

@router.post("/admin/students")
def create_student(data: CreateStudentSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO usuarios (codigo_estudiante, nombre_completo, password_hash, rol, institucion)
            VALUES (?, ?, ?, 'estudiante', ?)
        """, (
            data.codigo_estudiante.strip().upper(),
            data.nombre_completo.strip(),
            hash_password(data.password),
            data.institucion or "Colegio San Marcelo"
        ))
        conn.commit()
        new_id = cursor.lastrowid
    except DBIntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="El código de estudiante ya se encuentra registrado.")
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

    conn.close()
    return {
        "status": "success",
        "message": "Estudiante creado correctamente",
        "student": {
            "id": new_id,
            "codigo_estudiante": data.codigo_estudiante.upper(),
            "nombre_completo": data.nombre_completo,
            "institucion": data.institucion or "Colegio San Marcelo"
        }
    }

@router.put("/admin/students/{student_id}")
def update_student(student_id: int, data: UpdateStudentSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, codigo_estudiante, nombre_completo, institucion FROM usuarios WHERE id = ? AND rol = 'estudiante'", (student_id,))
        student = cursor.fetchone()
        if not student:
            conn.close()
            raise HTTPException(status_code=404, detail="Estudiante no encontrado.")

        fields_to_update = []
        params = []

        if data.codigo_estudiante is not None and data.codigo_estudiante.strip():
            fields_to_update.append("codigo_estudiante = ?")
            params.append(data.codigo_estudiante.strip().upper())
        if data.nombre_completo is not None and data.nombre_completo.strip():
            fields_to_update.append("nombre_completo = ?")
            params.append(data.nombre_completo.strip())
        if data.institucion is not None and data.institucion.strip():
            fields_to_update.append("institucion = ?")
            params.append(data.institucion.strip())
        if data.password is not None and len(data.password.strip()) > 0:
            fields_to_update.append("password_hash = ?")
            params.append(hash_password(data.password.strip()))

        if not fields_to_update:
            conn.close()
            return {"status": "success", "message": "No se enviaron campos modificados."}

        params.append(student_id)
        query = f"UPDATE usuarios SET {', '.join(fields_to_update)} WHERE id = ?"
        cursor.execute(query, tuple(params))
        conn.commit()
    except DBIntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="El código de estudiante ya se encuentra registrado por otro usuario.")
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

    conn.close()
    return {"status": "success", "message": "Estudiante actualizado correctamente."}

@router.delete("/admin/students/{student_id}")
def delete_student(student_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, codigo_estudiante FROM usuarios WHERE id = ? AND rol = 'estudiante'", (student_id,))
        student = cursor.fetchone()
        if not student:
            conn.close()
            raise HTTPException(status_code=404, detail="Estudiante no encontrado.")

        # 1. Eliminar evaluaciones vinculadas
        cursor.execute("DELETE FROM evaluaciones WHERE usuario_id = ?", (student_id,))
        # 2. Eliminar usuario
        cursor.execute("DELETE FROM usuarios WHERE id = ?", (student_id,))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

    conn.close()
    return {"status": "success", "message": "Estudiante y sus evaluaciones asociadas eliminados correctamente."}


# ==============================================================================
# PANEL DE ADMINISTRACIÓN - GESTOR DE OFERTA EDUCATIVA (UNIVERSIDADES / CARRERAS)
# ==============================================================================
@router.get("/admin/catalog")
def get_catalog():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, siglas, nombre, tipo FROM universidades ORDER BY siglas ASC")
    universidades = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT id, cluster_id, area_nombre, nombre FROM carreras ORDER BY nombre ASC")
    carreras = [dict(r) for r in cursor.fetchall()]

    cursor.execute("""
        SELECT o.id, o.carrera_id, c.nombre as carrera_nombre,
               o.universidad_id, u.siglas as universidad_siglas,
               o.costo_promedio, o.matricula
        FROM oferta_universidad o
        JOIN carreras c ON o.carrera_id = c.id
        JOIN universidades u ON o.universidad_id = u.id
        ORDER BY c.nombre ASC
    """)
    oferta = [dict(r) for r in cursor.fetchall()]

    conn.close()
    return {
        "universidades": universidades,
        "carreras": carreras,
        "oferta": oferta
    }

@router.post("/admin/oferta")
def update_or_create_offer(data: UpdateOfferSchema):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO oferta_universidad (carrera_id, universidad_id, costo_promedio, matricula)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(carrera_id, universidad_id) DO UPDATE SET
            costo_promedio = excluded.costo_promedio,
            matricula = excluded.matricula
    """, (data.carrera_id, data.universidad_id, data.costo_promedio, data.matricula))
    conn.commit()
    conn.close()

    return {"status": "success", "message": "Oferta universitaria actualizada correctamente"}

@router.post("/admin/carreras")
def create_career(data: CreateCareerSchema):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO carreras (cluster_id, area_nombre, nombre)
        VALUES (?, ?, ?)
    """, (data.cluster_id, data.area_nombre, data.nombre.strip()))
    carrera_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO oferta_universidad (carrera_id, universidad_id, costo_promedio, matricula)
        VALUES (?, ?, ?, ?)
    """, (carrera_id, data.universidad_id, data.costo_promedio, data.matricula))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": f"Carrera '{data.nombre}' creada y vinculada con éxito",
        "carrera_id": carrera_id
    }

@router.put("/admin/carreras/{carrera_id}")
def update_career(carrera_id: int, data: UpdateCareerSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM carreras WHERE id = ?", (carrera_id,))
        if not cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=404, detail="Carrera no encontrada.")

        fields = []
        params = []
        if data.nombre is not None and data.nombre.strip():
            fields.append("nombre = ?")
            params.append(data.nombre.strip())
        if data.area_nombre is not None and data.area_nombre.strip():
            fields.append("area_nombre = ?")
            params.append(data.area_nombre.strip())
        if data.cluster_id is not None:
            fields.append("cluster_id = ?")
            params.append(data.cluster_id)

        if fields:
            params.append(carrera_id)
            cursor.execute(f"UPDATE carreras SET {', '.join(fields)} WHERE id = ?", tuple(params))
            conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

    conn.close()
    return {"status": "success", "message": "Carrera actualizada correctamente."}

@router.delete("/admin/carreras/{carrera_id}")
def delete_career(carrera_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, nombre FROM carreras WHERE id = ?", (carrera_id,))
        carrera = cursor.fetchone()
        if not carrera:
            conn.close()
            raise HTTPException(status_code=404, detail="Carrera no encontrada.")

        cursor.execute("DELETE FROM oferta_universidad WHERE carrera_id = ?", (carrera_id,))
        cursor.execute("DELETE FROM carreras WHERE id = ?", (carrera_id,))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

    conn.close()
    return {"status": "success", "message": "Carrera y sus ofertas asociadas eliminadas correctamente."}

@router.post("/admin/universidades")
def create_university(data: CreateUniversitySchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO universidades (siglas, nombre, tipo)
            VALUES (?, ?, ?)
        """, (data.siglas.strip().upper(), data.nombre.strip(), data.tipo.strip()))
        conn.commit()
        new_id = cursor.lastrowid
    except DBIntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="La institución o siglas ya se encuentran registradas.")
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

    conn.close()
    return {"status": "success", "message": f"Universidad {data.siglas} creada con éxito", "id": new_id}

@router.delete("/admin/universidades/{universidad_id}")
def delete_university(universidad_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM universidades WHERE id = ?", (universidad_id,))
        if not cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=404, detail="Universidad no encontrada.")

        cursor.execute("DELETE FROM oferta_universidad WHERE universidad_id = ?", (universidad_id,))
        cursor.execute("DELETE FROM universidades WHERE id = ?", (universidad_id,))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

    conn.close()
    return {"status": "success", "message": "Universidad y sus aranceles asociados eliminados correctamente."}

@router.delete("/admin/oferta/{oferta_id}")
def delete_offer(oferta_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM oferta_universidad WHERE id = ?", (oferta_id,))
        if not cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=404, detail="Oferta no encontrada.")

        cursor.execute("DELETE FROM oferta_universidad WHERE id = ?", (oferta_id,))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

    conn.close()
    return {"status": "success", "message": "Oferta desvinculada correctamente."}

