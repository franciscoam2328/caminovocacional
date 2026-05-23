# Camino Vocacional - Oferta Educativa Trujillo

Camino Vocacional es una plataforma web moderna y guiada por Inteligencia Artificial diseñada para ayudar a los estudiantes de secundaria a descubrir su vocación profesional mediante un test de aptitud. El sistema utiliza un modelo de Machine Learning (SVC) para predecir el perfil vocacional del estudiante y cruza el resultado con una base de datos local para recomendar carreras y universidades (con costos actualizados) en la ciudad de Trujillo.

**URL Base Frontend (Producción):** https://caminovocacional.vercel.app  
**URL Base API Backend (Producción):** https://caminovocacional.onrender.com  
**Documentación Interactiva (Swagger):** https://caminovocacional.onrender.com/docs

---

## 🎨 Frontend (SPA Web)

Esta aplicación fue transformada desde un concepto de diseño estático a una **Single Page Application (SPA) en React** ultra-optimizada.

### 🚀 Características Principales (Frontend)
- **Interfaz "Premium" y Glassmorphism**: Construido con **TailwindCSS v4**, la interfaz cuenta con fondos dinámicos, paneles de cristal translúcidos, desenfoques y micro-animaciones (vía **Framer Motion**) que elevan enormemente la experiencia de usuario (UX).
- **Test Interactivo de 54 Preguntas**: Evaluación basada en el modelo **RIASEC** de Holland.
- **Experiencia de Usuario (UX) de Auto-Avance**: El cuestionario elimina la fatiga de clics gracias a un algoritmo de "auto-advance". Al seleccionar una respuesta, la aplicación genera un sutil feedback visual e inmediatamente transiciona a la siguiente pregunta sin necesidad de un botón "Siguiente".
- **Resultados Dinámicos e Inteligentes**: El sistema renderiza un reporte personalizado que muestra el avatar seleccionado por el estudiante, íconos adaptativos (Material Symbols) según su área ganadora, y emplea una lógica matemática para **aleatorizar las carreras sugeridas** dentro de su propio clúster.
- **Generación de Reporte en PDF**: Funcionalidad de "Descargar PDF" implementada de forma nativa (usando `window.print` y Media Queries de CSS), preservando la compatibilidad con los gradientes modernos (`oklab`) de Tailwind v4.

### 🚀 Tecnologías Utilizadas (Frontend)
- **Next.js (App Router, Client Components):** Framework React para rendimiento y ruteo.
- **React 18:** Librería UI principal.
- **TailwindCSS v4:** Utilidades CSS para estilos responsivos y glassmorphism.
- **Framer Motion:** Librería para transiciones de estado fluidas.
- **Vercel:** Despliegue en la nube.

### 🏗️ Arquitectura (Frontend)
El Frontend está contenido en la carpeta `frontend/` y sigue una arquitectura modular de componentes:

```text
caminovocacional/
├── frontend/
│   ├── src/
│   │   ├── app/                 # Configuración principal de Next.js (layout.js, page.js, globals.css)
│   │   ├── components/          # Vistas modulares de la SPA
│   │   │   ├── LandingView.jsx
│   │   │   ├── UserInfoView.jsx
│   │   │   ├── AvatarSelectView.jsx
│   │   │   ├── TestForm.jsx
│   │   │   └── ResultDisplay.jsx
│   │   ├── core/                # Lógica pura (ej. array de questions.js)
│   │   └── infrastructure/      # Adaptadores de red (api.js para conectarse a Render)
│   ├── public/                  # Assets estáticos
│   └── tailwind.config.js       # Tokens de diseño y colores
```

---

## 🎓 Backend API

Esta es la API del proyecto. Utiliza un modelo de Machine Learning (SVC) para predecir el perfil vocacional del estudiante.

### 🚀 Tecnologías Utilizadas (Backend)
- **Python 3.12**
- **FastAPI:** Framework web moderno y rápido para construir la API.
- **Uvicorn:** Servidor ASGI para ejecutar la aplicación.
- **Pydantic:** Validación estricta de datos (Esquemas).
- **Scikit-Learn & Joblib:** Carga y ejecución del modelo predictivo de IA.
- **Docker:** Contenerización de la aplicación.
- **Render:** Despliegue en la nube (CI/CD automático).

### 🏗️ Arquitectura (Backend)
El proyecto sigue los principios de la Arquitectura Hexagonal (Puertos y Adaptadores) y Diseño Orientado al Dominio (DDD), separando claramente las responsabilidades:

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
├── Dockerfile         # Configuración para despliegue
└── requirements.txt   # Dependencias del proyecto
```

### 🌐 Endpoints Principales

**`GET /` (Health Check)**
Verifica que el servidor esté en línea.

**`POST /predict`**
Recibe un arreglo de 54 respuestas en escala Likert (1-5) correspondientes al test vocacional. Pasa estos datos por el modelo de IA para predecir el clúster vocacional y retorna las carreras recomendadas con las universidades locales disponibles.

**Cuerpo de la petición (JSON):**
```json
{
  "nombre_estudiante": "Juan Perez",
  "respuestas": [3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5]
}
```

**Respuesta exitosa:**
```json
{
  "estudiante": "Juan Perez",
  "cluster_predicho": 1,
  "area_recomendada": "Ciencias de la Salud",
  "carreras_disponibles": [
    {
      "id_carrera": 101,
      "nombre": "Medicina Humana",
      "universidades": [
         {"nombre": "UPAO", "tipo": "Privada", "costo_promedio": 1840},
         {"nombre": "UNT", "tipo": "Pública", "costo_promedio": 0}
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
