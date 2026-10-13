from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class TestInputSchema(BaseModel):
    nombre_estudiante: str = Field(..., min_length=2, max_length=50, description="Nombre o alias del estudiante")
    codigo_estudiante: Optional[str] = Field(None, description="Código institucional del estudiante")
    respuestas: List[int] = Field(..., description="Vector de respuestas del test vocacional")

    @field_validator('respuestas')
    @classmethod
    def validar_rango_likert(cls, v: List[int]) -> List[int]:
        if len(v) != 60:
            raise ValueError(f"Se esperaban 60 respuestas, pero se recibieron {len(v)}.")
        # Tarea TA-006: Validación de escala Likert (1-5)
        if not all(1 <= x <= 5 for x in v):
            raise ValueError("Todas las respuestas deben pertenecer estrictamente a la escala Likert (del 1 al 5).")
        return v

class LoginInputSchema(BaseModel):
    codigo: str = Field(..., min_length=2, max_length=50, description="Código o usuario")
    password: str = Field(..., min_length=3, max_length=100, description="Contraseña")

class CreateStudentSchema(BaseModel):
    codigo_estudiante: str = Field(..., min_length=3, max_length=30, description="Código del estudiante ej: EST-2026-001")
    nombre_completo: str = Field(..., min_length=3, max_length=100, description="Nombre y apellidos")
    password: str = Field(..., min_length=4, max_length=50, description="Contraseña asignada")
    institucion: Optional[str] = Field("Colegio San Marcelo", description="Institución educativa")

class UpdateOfferSchema(BaseModel):
    carrera_id: int = Field(..., description="ID de la carrera")
    universidad_id: int = Field(..., description="ID de la universidad")
    costo_promedio: float = Field(..., ge=0, description="Pensión mensual estimada")
    matricula: float = Field(..., ge=0, description="Costo de matrícula")

class CreateCareerSchema(BaseModel):
    cluster_id: int = Field(..., ge=1, le=10, description="ID del cluster vocacional")
    area_nombre: str = Field(..., min_length=3, description="Nombre del área vocacional")
    nombre: str = Field(..., min_length=3, description="Nombre de la nueva carrera")
    universidad_id: int = Field(..., description="Universidad a la que se vincula inicialmente")
    costo_promedio: float = Field(..., ge=0, description="Pensión mensual estimada")
    matricula: float = Field(..., ge=0, description="Costo de matrícula")

class UpdateStudentSchema(BaseModel):
    codigo_estudiante: Optional[str] = Field(None, min_length=2, max_length=30, description="Código del estudiante")
    nombre_completo: Optional[str] = Field(None, min_length=2, max_length=100, description="Nombres y apellidos")
    password: Optional[str] = Field(None, min_length=4, max_length=50, description="Nueva contraseña (opcional)")
    institucion: Optional[str] = Field(None, min_length=2, max_length=100, description="Institución educativa")

class UpdateCareerSchema(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=150, description="Nombre de la carrera")
    area_nombre: Optional[str] = Field(None, min_length=2, description="Área vocacional")
    cluster_id: Optional[int] = Field(None, ge=1, le=10, description="ID del cluster")

class CreateUniversitySchema(BaseModel):
    siglas: str = Field(..., min_length=2, max_length=20, description="Siglas ej: UPAO, UNT")
    nombre: str = Field(..., min_length=3, max_length=150, description="Nombre de la institución")
    tipo: str = Field("Privada", max_length=30, description="Pública o Privada")


