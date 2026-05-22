from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Universidad:
    id: int
    nombre: str
    tipo: str  # 'Pública' o 'Privada'
    costo_promedio: float

@dataclass
class Carrera:
    id: int
    nombre: str
    area_vocacional_id: str
    descripcion: str
    campo_laboral: str

@dataclass
class Estudiante:
    id: Optional[int]
    nombre: str

@dataclass
class Resultado:
    id: Optional[int]
    estudiante_id: int
    carrera_id: int
    puntaje_maximo: float
