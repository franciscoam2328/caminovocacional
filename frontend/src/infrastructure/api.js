/**
 * api.js
 * Adaptador de red (Infrastructure Layer) para comunicarse con el Backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://caminovocacional.onrender.com";

/**
 * Inicia sesión para Estudiantes o Administradores
 * @param {string} codigo - Código del estudiante o usuario admin
 * @param {string} password - Contraseña
 */
export async function loginUser(codigo, password) {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo, password })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Error al iniciar sesión');
        }
        return await res.json();
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
}

/**
 * Envía las respuestas del test vocacional a la API para obtener el clúster y recomendaciones.
 * @param {string} studentName - El nombre del estudiante.
 * @param {number[]} responses - Vector de 60 respuestas numéricas (escala 1-5).
 * @param {string} [studentCode] - Código del estudiante autenticado.
 * @returns {Promise<Object>} Resultado de la predicción y carreras recomendadas.
 */
export async function predictVocationalCluster(studentName, responses, studentCode = null) {
    try {
        const payload = {
            nombre_estudiante: studentName,
            respuestas: responses
        };
        if (studentCode) {
            payload.codigo_estudiante = studentCode;
        }

        const res = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error en la petición: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error al contactar con la API de predicción:", error);
        throw error;
    }
}

/**
 * Obtiene métricas y registros recientes para el Dashboard de Administración
 */
export async function fetchAdminDashboard() {
    try {
        const res = await fetch(`${API_URL}/admin/dashboard`);
        if (!res.ok) throw new Error("Error al obtener datos del dashboard");
        return await res.json();
    } catch (error) {
        console.error("Error en fetchAdminDashboard:", error);
        throw error;
    }
}

/**
 * Lista todos los estudiantes registrados y su estado de evaluación
 */
export async function fetchAdminStudents() {
    try {
        const res = await fetch(`${API_URL}/admin/students`);
        if (!res.ok) throw new Error("Error al listar estudiantes");
        return await res.json();
    } catch (error) {
        console.error("Error en fetchAdminStudents:", error);
        throw error;
    }
}

/**
 * Registra un nuevo estudiante desde el panel de administración
 */
export async function createStudent(studentData) {
    try {
        const res = await fetch(`${API_URL}/admin/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Error al crear estudiante");
        }
        return await res.json();
    } catch (error) {
        console.error("Error en createStudent:", error);
        throw error;
    }
}

/**
 * Obtiene el catálogo de universidades, carreras y ofertas
 */
export async function fetchAdminCatalog() {
    try {
        const res = await fetch(`${API_URL}/admin/catalog`);
        if (!res.ok) throw new Error("Error al obtener catálogo");
        return await res.json();
    } catch (error) {
        console.error("Error en fetchAdminCatalog:", error);
        throw error;
    }
}

/**
 * Actualiza los costos de pensión y matrícula para una carrera en una universidad
 */
export async function updateOffer(offerData) {
    try {
        const res = await fetch(`${API_URL}/admin/oferta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(offerData)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Error al actualizar oferta educativa");
        }
        return await res.json();
    } catch (error) {
        console.error("Error en updateOffer:", error);
        throw error;
    }
}

/**
 * Agrega una nueva carrera vinculada a una universidad
 */
export async function createCareer(careerData) {
    try {
        const res = await fetch(`${API_URL}/admin/carreras`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(careerData)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Error al crear carrera");
        }
        return await res.json();
    } catch (error) {
        console.error("Error en createCareer:", error);
        throw error;
    }
}

/**
 * Actualiza los datos de un estudiante
 */
export async function updateStudent(studentId, studentData) {
    try {
        const res = await fetch(`${API_URL}/admin/students/${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Error al actualizar estudiante");
        }
        return await res.json();
    } catch (error) {
        console.error("Error en updateStudent:", error);
        throw error;
    }
}

/**
 * Elimina un estudiante y sus evaluaciones asociadas
 */
export async function deleteStudent(studentId) {
    try {
        const res = await fetch(`${API_URL}/admin/students/${studentId}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Error al eliminar estudiante");
        }
        return await res.json();
    } catch (error) {
        console.error("Error en deleteStudent:", error);
        throw error;
    }
}

/**
 * Actualiza los datos de una carrera
 */
export async function updateCareer(careerId, careerData) {
    try {
        const res = await fetch(`${API_URL}/admin/carreras/${careerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(careerData)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Error al actualizar carrera");
        }
        return await res.json();
    } catch (error) {
        console.error("Error en updateCareer:", error);
        throw error;
    }
}

/**
 * Elimina una carrera y sus ofertas asociadas
 */
export async function deleteCareer(careerId) {
    try {
        const res = await fetch(`${API_URL}/admin/carreras/${careerId}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Error al eliminar carrera");
        }
        return await res.json();
    } catch (error) {
        console.error("Error en deleteCareer:", error);
        throw error;
    }
}

/**
 * Registra una nueva institución universitaria
 */
export async function createUniversity(universityData) {
    try {
        const res = await fetch(`${API_URL}/admin/universidades`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(universityData)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Error al crear universidad");
        }
        return await res.json();
    } catch (error) {
        console.error("Error en createUniversity:", error);
        throw error;
    }
}

/**
 * Elimina una institución universitaria y sus ofertas
 */
export async function deleteUniversity(universityId) {
    try {
        const res = await fetch(`${API_URL}/admin/universidades/${universityId}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Error al eliminar universidad");
        }
        return await res.json();
    } catch (error) {
        console.error("Error en deleteUniversity:", error);
        throw error;
    }
}

/**
 * Desvincula una oferta educativa puntual
 */
export async function deleteOffer(offerId) {
    try {
        const res = await fetch(`${API_URL}/admin/oferta/${offerId}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Error al eliminar oferta educativa");
        }
        return await res.json();
    } catch (error) {
        console.error("Error en deleteOffer:", error);
        throw error;
    }
}

