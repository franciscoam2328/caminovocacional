# Camino Vocacional - Oferta Educativa Trujillo

Camino Vocacional es una plataforma web moderna y guiada por Datos diseñada para ayudar a los estudiantes de secundaria a descubrir su vocación profesional mediante un test de aptitud. El sistema utiliza un motor de recomendación matemático (K-Nearest Neighbors) basado en la teoría de Holland (RIASEC) para predecir el perfil vocacional del estudiante y cruza el resultado con una base de datos local para recomendar carreras y universidades (con costos actualizados) en la ciudad de Trujillo.

**URL Base Frontend (Producción):** https://caminovocacional.vercel.app  
**URL Base API Backend (Producción):** https://caminovocacional.onrender.com  
**Documentación Interactiva (Swagger):** https://caminovocacional.onrender.com/docs

---

## 🎨 Frontend (SPA Web)

Esta aplicación fue transformada desde un concepto de diseño estático a una **Single Page Application (SPA) en React** ultra-optimizada.

### 🚀 Características Principales (Frontend)
- **Interfaz "Premium" y Glassmorphism**: Construido con **TailwindCSS v4**, la interfaz cuenta con fondos dinámicos, paneles de cristal translúcidos, desenfoques y micro-animaciones (vía **Framer Motion**) que elevan enormemente la experiencia de usuario (UX).
- **Test Interactivo de 60 Preguntas**: Evaluación basada en el modelo **RIASEC** de Holland.
- **Avatares Evolutivos (Gamificación)**: El sistema cuenta con personajes generados por IA que acompañan al estudiante durante el test. Conforme avanza, el avatar evoluciona visualmente (Colegial → Universitario → Profesional con Toga) y reacciona con animaciones a las respuestas.
- **Experiencia de Usuario (UX) de Auto-Avance**: El cuestionario elimina la fatiga de clics gracias a un algoritmo de "auto-advance".
- **Resultados Dinámicos e Inteligentes**: El sistema renderiza un reporte personalizado mostrando el "Código Holland", porcentajes de afinidad y las opciones de estudio específicas de Trujillo.
- **Generación de Reporte en PDF**: Funcionalidad nativa de impresión que incluye gráficos avanzados (Telaraña/Radar) preservando la compatibilidad con los estilos de Tailwind.

### 🚀 Tecnologías Utilizadas (Frontend)
- **Next.js (App Router, Client Components)**
- **React 18**
- **TailwindCSS v4**
- **Framer Motion**

---

## 🎓 Backend API

El "cerebro" del proyecto. Es una API construida en Python que procesa las respuestas del usuario y calcula las distancias matemáticas para sugerir la mejor ruta profesional.

### 🚀 Tecnologías Utilizadas (Backend)
- **Python 3.12**
- **FastAPI:** Framework web moderno y ultra-rápido.
- **Uvicorn:** Servidor ASGI.
- **Pydantic:** Validación estricta de datos (Esquemas).
- **Docker:** Contenerización de la aplicación.

### 🏗️ Arquitectura (Backend)
El proyecto sigue principios de Arquitectura Limpia, separando claramente las responsabilidades y utilizando una base de datos local basada en JSON:

```text
caminovocacional/
├── backend/
│   ├── app/           # Casos de uso y lógica K-NN
│   ├── domain/        # Entidades puras y reglas de negocio
│   ├── infra/         # Adaptadores (API FastAPI)
│   │   ├── api/       # Rutas (routes.py) y validaciones (schemas.py)
│   │   └── data/      # Base de datos estática en JSON (Oferta Educativa)
│   └── main.py        # Punto de entrada
├── Dockerfile         
└── requirements.txt   
```

---

## 🧠 Lógica del Sistema de Recomendación

En lugar de utilizar modelos de "Caja Negra", este sistema implementa un **Sistema de Recomendación Basado en Contenido** altamente explicable, combinando:

1. **La Teoría RIASEC de John Holland:** Clasifica los intereses profesionales en 6 dimensiones (Realista, Investigador, Artístico, Social, Emprendedor, Convencional).
2. **Cálculo de Distancias (K-NN):** 
   - El test de 60 preguntas permite construir un **Vector de Personalidad** del estudiante para estas 6 dimensiones.
   - La base de datos contiene un **Vector Ideal** para cada carrera disponible (extraído de métricas estandarizadas de O*NET).
   - El algoritmo backend utiliza métricas matemáticas (Distancia Euclidiana) para encontrar los "vecinos más cercanos" (K-Nearest Neighbors). Las carreras con menor distancia geométrica al perfil del estudiante son las que se recomiendan como más afines.

---

## 📊 DATASET

We use several datasets:

*   Taken from https://www.onetonline.org/explore/interests/, we can get 6 separate datasets for each RIASEC personality, and related job options matched to personality.
*   Taken from https://www.onetonline.org/find/family?f=0&g=Go, we can get occupation dataset for all job listed in the website.

Esta data oficial de O*NET ha sido procesada, ponderada y cruzada manualmente con la oferta educativa real de las universidades públicas y privadas de la ciudad de Trujillo.

---

## 🌐 Endpoints Principales

**`GET /` (Health Check)**
Verifica que el servidor esté en línea.

**`POST /api/predict`**
Recibe un arreglo de 60 respuestas en escala Likert (1-5) correspondientes al test vocacional O*NET. Calcula los puntajes RIASEC, ejecuta el algoritmo de similitud por distancias y retorna el top 3 de carreras recomendadas junto con las universidades locales.

**Cuerpo de la petición (JSON):**
```json
{
  "nombre_estudiante": "Juan Perez",
  "respuestas": [5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1]
}
```

**Respuesta exitosa:**
```json
{
  "estudiante": "Juan Perez",
  "codigo_holland": "RIC",
  "puntajes_riasec": {
    "Realista": 40,
    "Investigador": 45,
    "Artístico": 20,
    "Social": 15,
    "Emprendedor": 25,
    "Convencional": 30
  },
  "carreras_recomendadas": [
    {
      "id_modelo": "Ingeniería y Tecnología",
      "nombre_mostrar": "Ingeniería de Sistemas y Software",
      "descripcion": "Programación, desarrollo de software, Inteligencia Artificial y datos.",
      "afinidad": 95.5,
      "universidades": [
         {"nombre": "UPAO", "tipo": "Privada", "costo_promedio": "S/ 620", "matricula": "S/ 300"},
         {"nombre": "UNT", "tipo": "Pública", "costo_promedio": "S/ 0", "matricula": "S/ 100"}
      ]
    }
  ]
}
```

---

## 🛠️ Instalación Local

Sigue estos pasos para levantar el entorno de desarrollo en tu computadora:

### 1. Clonar el repositorio
```bash
git clone https://github.com/franciscoam2328/caminovocacional.git
cd caminovocacional
```

### 2. Levantar el Backend (FastAPI)
Crear y activar un entorno virtual:
```bash
# En Windows:
python -m venv .venv
.\.venv\Scripts\activate

# En macOS/Linux:
python3 -m venv .venv
source .venv/bin/activate
```
Instalar dependencias y ejecutar:
```bash
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```
La API estará disponible en `http://127.0.0.1:8000`.

### 3. Levantar el Frontend (React/Next.js)
Abre otra terminal y navega a la carpeta `frontend`:
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:3000`.

---

## 🐳 Despliegue (Producción)

- **Frontend (Vercel)**: Configurado para despliegue continuo desde la carpeta `frontend/`. Cualquier cambio en la rama `main` actualizará la interfaz en la URL pública (`caminovocacional.vercel.app`).
- **Backend (Render)**: El proyecto incluye un `Dockerfile` optimizado y está configurado para despliegue continuo en Render. Cualquier cambio integrado en la rama `main` generará un re-despliegue automático de la API (`caminovocacional.onrender.com`).
