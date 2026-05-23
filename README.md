# Camino Vocacional - Oferta Educativa Trujillo

Camino Vocacional es una plataforma web moderna y guiada por Inteligencia Artificial diseñada para ayudar a los estudiantes de secundaria a descubrir su perfil vocacional ideal y conectarlos con las mejores opciones de educación superior en Trujillo, Perú.

## 🚀 Características Principales (Frontend)

La interfaz de usuario fue construida como una **Single Page Application (SPA) en React** ultra-optimizada:

- **Interfaz "Premium" y Glassmorphism**: Construido con **TailwindCSS v4**, con fondos dinámicos, paneles de cristal translúcidos, desenfoques y micro-animaciones (**Framer Motion**) que elevan la UX.
- **Test Interactivo de 54 Preguntas**: Evaluación basada en el modelo **RIASEC** de Holland.
- **UX de Auto-Avance**: El cuestionario elimina la fatiga de clics avanzando automáticamente al seleccionar una respuesta.
- **Resultados Dinámicos**: Renderizado de avatares, íconos adaptativos según el área ganadora, y aleatorización de carreras recomendadas para mayor variedad.
- **Generación de PDF**: Funcionalidad de exportación nativa adaptada para preservar los complejos estilos modernos de Tailwind v4.

## 🎓 El "Cerebro" (Backend API)

El sistema utiliza un modelo de Machine Learning (SVM) para predecir el perfil vocacional del estudiante y cruza el resultado con una base de datos local para recomendar carreras y universidades (con costos actualizados).

- **URL Base (Producción)**: `https://caminovocacional.onrender.com`
- **Documentación Swagger**: `https://caminovocacional.onrender.com/docs`

### Arquitectura Hexagonal
El proyecto sigue principios de Diseño Orientado al Dominio (DDD):
```text
caminovocacional/
├── backend/
│   ├── app/           # Casos de uso e interfaces (Puertos)
│   ├── domain/        # Entidades puras y reglas de negocio
│   ├── infra/         # Adaptadores (Base de datos, IA, API FastAPI)
│   │   ├── api/       # Rutas (routes.py) y validaciones (schemas.py)
│   │   ├── data/      # Base de datos estática en JSON (Oferta Educativa)
│   │   └── model_ia/  # Archivo binario del modelo predictivo (.pkl)
│   └── main.py        # Punto de entrada de la aplicación
```

## 🛠️ Stack Tecnológico Completo

**Frontend:**
- Next.js (App Router, Client Components), React 18
- TailwindCSS v4, Framer Motion
- Despliegue recomendado: **Vercel**

**Backend:**
- Python 3.12, FastAPI, Uvicorn, Pydantic
- Scikit-Learn & Joblib (SVM RBF)
- Docker
- Despliegue: **Render** (CI/CD automático)

## ⚙️ Cómo ejecutar localmente

### 1. Servidor Frontend
```bash
cd frontend
npm install
npm run dev
# Disponible en http://localhost:3000
```

### 2. Servidor Backend API
```bash
# Crear y activar entorno virtual (Windows)
python -m venv .venv
.\.venv\Scripts\activate

# Instalar y ejecutar
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
# Disponible en http://127.0.0.1:8000
```

## 🌐 Endpoints Principales (Backend)
- `GET /` (Health Check): Verifica que el servidor esté en línea.
- `POST /predict`: Recibe un arreglo de 54 respuestas en escala Likert (1-5). Retorna el clúster vocacional y las carreras/universidades recomendadas.
