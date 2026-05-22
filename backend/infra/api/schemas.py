from pydantic import BaseModel, Field, field_validator
from typing import List

class TestInputSchema(BaseModel):
    nombre_estudiante: str = Field(..., min_length=2, max_length=50, description="Nombre o alias del estudiante")
    respuestas: List[int] = Field(..., description="Vector de respuestas del test vocacional")

    @field_validator('respuestas')
    @classmethod
    def validar_rango_likert(cls, v: List[int]) -> List[int]:
        # Tarea TA-006: Validación de escala Likert (1-5)
        if not all(1 <= x <= 5 for x in v):
            raise ValueError("Todas las respuestas deben pertenecer estrictamente a la escala Likert (del 1 al 5).")
        return v
