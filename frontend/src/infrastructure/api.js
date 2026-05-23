/**
 * api.js
 * Adaptador de red (Infrastructure Layer) para comunicarse con el Backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Envía las respuestas del test vocacional a la API para obtener el clúster y recomendaciones.
 * @param {string} studentName - El nombre del estudiante.
 * @param {number[]} responses - Vector de 54 respuestas numéricas (escala 1-5).
 * @returns {Promise<Object>} Resultado de la predicción y carreras recomendadas.
 */
export async function predictVocationalCluster(studentName, responses) {
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL no está definida en las variables de entorno.");
    }

    try {
        const res = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre_estudiante: studentName,
                respuestas: responses
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error en la petición: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error al contactar con la API de predicción:", error);
        throw error;
    }
}
