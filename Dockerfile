# Utilizar una imagen base ligera de Python (versión 3.12 acorde al entorno local)
FROM python:3.12-slim

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Evitar que Python escriba archivos .pyc
ENV PYTHONDONTWRITEBYTECODE=1
# Evitar el almacenamiento en buffer de stdout/stderr para ver logs en tiempo real en Render
ENV PYTHONUNBUFFERED=1

# Copiar el archivo de dependencias
COPY requirements.txt .

# Instalar las dependencias de forma limpia y sin caché
RUN pip install --no-cache-dir -r requirements.txt

# Copiar la estructura de la aplicación (la carpeta backend)
COPY backend/ ./backend/

# Exponer el puerto 10000 (el que usará Render por defecto en su capa gratuita)
EXPOSE 10000

# Comando de arranque
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "10000"]
