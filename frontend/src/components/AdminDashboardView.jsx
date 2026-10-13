"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchAdminDashboard, 
  fetchAdminStudents, 
  createStudent, 
  updateStudent,
  deleteStudent,
  fetchAdminCatalog, 
  updateOffer, 
  createCareer,
  updateCareer,
  deleteCareer,
  createUniversity,
  deleteUniversity,
  deleteOffer
} from '@/infrastructure/api';

export default function AdminDashboardView({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'students' | 'catalog'
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Datos de API
  const [dashboardData, setDashboardData] = useState({
    total_tests: 0,
    perfil_dominante: 'Cargando...',
    carrera_mas_sugerida: 'Cargando...',
    ultimos_registros: []
  });
  const [students, setStudents] = useState([]);
  const [catalog, setCatalog] = useState({
    universidades: [],
    carreras: [],
    oferta: []
  });

  // Filtros de búsqueda
  const [searchStudent, setSearchStudent] = useState('');
  const [searchCareer, setSearchCareer] = useState('');

  // Estados del Formulario de Oferta Educativa (Editor de Costos)
  const [selectedUniId, setSelectedUniId] = useState('');
  const [selectedCarreraId, setSelectedCarreraId] = useState('');
  const [matricula, setMatricula] = useState('350.00');
  const [pension, setPension] = useState('750.00');
  const [isSavingOffer, setIsSavingOffer] = useState(false);

  // Modales de Estudiante
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    codigo_estudiante: '',
    nombre_completo: '',
    password: '',
    institucion: 'Colegio San Marcelo'
  });

  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState({
    id: null,
    codigo_estudiante: '',
    nombre_completo: '',
    password: '',
    institucion: ''
  });

  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // Modales de Carrera
  const [showAddCareerModal, setShowAddCareerModal] = useState(false);
  const [newCareer, setNewCareer] = useState({
    nombre: '',
    cluster_id: 2,
    area_nombre: 'Ingeniería y Tecnología',
    universidad_id: '',
    costo_promedio: 650.0,
    matricula: 350.0
  });

  const [showEditCareerModal, setShowEditCareerModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState({
    id: null,
    nombre: '',
    area_nombre: '',
    cluster_id: 1
  });

  const [showDeleteCareerModal, setShowDeleteCareerModal] = useState(false);
  const [deletingCareer, setDeletingCareer] = useState(null);

  // Modales de Universidad
  const [showAddUniModal, setShowAddUniModal] = useState(false);
  const [newUni, setNewUni] = useState({
    siglas: '',
    nombre: '',
    tipo: 'Privada'
  });

  const [showDeleteUniModal, setShowDeleteUniModal] = useState(false);
  const [deletingUni, setDeletingUni] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cargar datos iniciales
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dash, studs, cat] = await Promise.all([
        fetchAdminDashboard().catch(() => null),
        fetchAdminStudents().catch(() => null),
        fetchAdminCatalog().catch(() => null)
      ]);

      if (dash) setDashboardData(dash);
      if (studs && studs.students) setStudents(studs.students);
      if (cat) {
        setCatalog(cat);
        if (cat.universidades.length > 0) {
          setSelectedUniId(cat.universidades[0].id.toString());
          setNewCareer(prev => ({ ...prev, universidad_id: cat.universidades[0].id }));
        }
        if (cat.carreras.length > 0) {
          setSelectedCarreraId(cat.carreras[0].id.toString());
        }
      }
    } catch (e) {
      console.error("Error al cargar datos administrativos:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Actualizar costos al cambiar selección de Universidad o Carrera
  useEffect(() => {
    if (selectedUniId && selectedCarreraId && catalog.oferta.length > 0) {
      const match = catalog.oferta.find(
        (o) => o.universidad_id.toString() === selectedUniId.toString() &&
               o.carrera_id.toString() === selectedCarreraId.toString()
      );
      if (match) {
        setPension(Number(match.costo_promedio).toFixed(2));
        setMatricula(Number(match.matricula).toFixed(2));
      } else {
        setPension('750.00');
        setMatricula('350.00');
      }
    }
  }, [selectedUniId, selectedCarreraId, catalog.oferta]);

  // =========================================================================
  // CRUD ESTUDIANTES
  // =========================================================================
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.codigo_estudiante || !newStudent.nombre_completo || !newStudent.password) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }
    try {
      await createStudent(newStudent);
      showNotification(`Estudiante ${newStudent.codigo_estudiante.toUpperCase()} creado con éxito`);
      setShowAddStudentModal(false);
      setNewStudent({ codigo_estudiante: '', nombre_completo: '', password: '', institucion: 'Colegio San Marcelo' });
      const updatedStuds = await fetchAdminStudents();
      if (updatedStuds?.students) setStudents(updatedStuds.students);
    } catch (err) {
      alert(err.message || "Error al crear estudiante");
    }
  };

  const handleOpenEditStudent = (st) => {
    setEditingStudent({
      id: st.id,
      codigo_estudiante: st.codigo_estudiante,
      nombre_completo: st.nombre_completo,
      password: '',
      institucion: st.institucion || 'Colegio San Marcelo'
    });
    setShowEditStudentModal(true);
  };

  const handleSaveEditStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        codigo_estudiante: editingStudent.codigo_estudiante,
        nombre_completo: editingStudent.nombre_completo,
        institucion: editingStudent.institucion
      };
      if (editingStudent.password?.trim()) {
        payload.password = editingStudent.password.trim();
      }
      await updateStudent(editingStudent.id, payload);
      showNotification(`Estudiante ${editingStudent.codigo_estudiante.toUpperCase()} actualizado.`);
      setShowEditStudentModal(false);
      const updatedStuds = await fetchAdminStudents();
      if (updatedStuds?.students) setStudents(updatedStuds.students);
    } catch (err) {
      alert(err.message || "Error al actualizar estudiante");
    }
  };

  const handleConfirmDeleteStudent = async () => {
    if (!deletingStudent) return;
    try {
      await deleteStudent(deletingStudent.id);
      showNotification(`Estudiante ${deletingStudent.codigo_estudiante} eliminado.`);
      setShowDeleteStudentModal(false);
      setDeletingStudent(null);
      const [updatedStuds, updatedDash] = await Promise.all([
        fetchAdminStudents(),
        fetchAdminDashboard()
      ]);
      if (updatedStuds?.students) setStudents(updatedStuds.students);
      if (updatedDash) setDashboardData(updatedDash);
    } catch (err) {
      alert(err.message || "Error al eliminar estudiante");
    }
  };

  // =========================================================================
  // CRUD OFERTA / CARRERAS / UNIVERSIDADES
  // =========================================================================
  const handleSaveOffer = async () => {
    if (!selectedUniId || !selectedCarreraId) return;
    setIsSavingOffer(true);
    try {
      await updateOffer({
        carrera_id: parseInt(selectedCarreraId),
        universidad_id: parseInt(selectedUniId),
        costo_promedio: parseFloat(pension) || 0,
        matricula: parseFloat(matricula) || 0
      });
      showNotification("Oferta educativa y pensiones actualizadas en la base de datos.");
      const updatedCat = await fetchAdminCatalog();
      if (updatedCat) setCatalog(updatedCat);
    } catch (err) {
      alert(err.message || "Error al actualizar oferta educativa");
    } finally {
      setIsSavingOffer(false);
    }
  };

  const handleCreateCareer = async (e) => {
    e.preventDefault();
    if (!newCareer.nombre || !newCareer.universidad_id) {
      alert("Por favor completa los campos.");
      return;
    }
    try {
      await createCareer({
        ...newCareer,
        universidad_id: parseInt(newCareer.universidad_id),
        costo_promedio: parseFloat(newCareer.costo_promedio) || 0,
        matricula: parseFloat(newCareer.matricula) || 0
      });
      showNotification(`Carrera '${newCareer.nombre}' creada e indexada correctamente.`);
      setShowAddCareerModal(false);
      setNewCareer({
        nombre: '',
        cluster_id: 2,
        area_nombre: 'Ingeniería y Tecnología',
        universidad_id: catalog.universidades[0]?.id || '',
        costo_promedio: 650.0,
        matricula: 350.0
      });
      const updatedCat = await fetchAdminCatalog();
      if (updatedCat) setCatalog(updatedCat);
    } catch (err) {
      alert(err.message || "Error al crear la carrera");
    }
  };

  const handleOpenEditCareer = (career) => {
    setEditingCareer({
      id: career.id,
      nombre: career.nombre,
      area_nombre: career.area_nombre,
      cluster_id: career.cluster_id
    });
    setShowEditCareerModal(true);
  };

  const handleSaveEditCareer = async (e) => {
    e.preventDefault();
    try {
      await updateCareer(editingCareer.id, {
        nombre: editingCareer.nombre,
        area_nombre: editingCareer.area_nombre,
        cluster_id: editingCareer.cluster_id
      });
      showNotification(`Carrera '${editingCareer.nombre}' actualizada.`);
      setShowEditCareerModal(false);
      const updatedCat = await fetchAdminCatalog();
      if (updatedCat) setCatalog(updatedCat);
    } catch (err) {
      alert(err.message || "Error al actualizar carrera");
    }
  };

  const handleConfirmDeleteCareer = async () => {
    if (!deletingCareer) return;
    try {
      await deleteCareer(deletingCareer.id);
      showNotification(`Carrera '${deletingCareer.nombre}' eliminada correctamente.`);
      setShowDeleteCareerModal(false);
      setDeletingCareer(null);
      const updatedCat = await fetchAdminCatalog();
      if (updatedCat) setCatalog(updatedCat);
    } catch (err) {
      alert(err.message || "Error al eliminar carrera");
    }
  };

  const handleCreateUniversity = async (e) => {
    e.preventDefault();
    if (!newUni.siglas || !newUni.nombre) return;
    try {
      await createUniversity(newUni);
      showNotification(`Universidad '${newUni.siglas.toUpperCase()}' registrada.`);
      setShowAddUniModal(false);
      setNewUni({ siglas: '', nombre: '', tipo: 'Privada' });
      const updatedCat = await fetchAdminCatalog();
      if (updatedCat) setCatalog(updatedCat);
    } catch (err) {
      alert(err.message || "Error al registrar universidad");
    }
  };

  const handleConfirmDeleteUni = async () => {
    if (!deletingUni) return;
    try {
      await deleteUniversity(deletingUni.id);
      showNotification(`Universidad '${deletingUni.siglas}' eliminada.`);
      setShowDeleteUniModal(false);
      setDeletingUni(null);
      const updatedCat = await fetchAdminCatalog();
      if (updatedCat) setCatalog(updatedCat);
    } catch (err) {
      alert(err.message || "Error al eliminar universidad");
    }
  };

  const handleDeleteOffer = async (offerId, carreraNombre, uniSiglas) => {
    if (!confirm(`¿Desvincular '${carreraNombre}' de la universidad '${uniSiglas}'?`)) return;
    try {
      await deleteOffer(offerId);
      showNotification(`Oferta de ${carreraNombre} en ${uniSiglas} desvinculada.`);
      const updatedCat = await fetchAdminCatalog();
      if (updatedCat) setCatalog(updatedCat);
    } catch (err) {
      alert(err.message || "Error al desvincular oferta");
    }
  };

  // Filtrados
  const filteredStudents = students.filter(st => {
    const q = searchStudent.toLowerCase();
    return st.nombre_completo.toLowerCase().includes(q) || 
           st.codigo_estudiante.toLowerCase().includes(q) ||
           (st.institucion && st.institucion.toLowerCase().includes(q));
  });

  const filteredCareers = catalog.carreras.filter(c => {
    const q = searchCareer.toLowerCase();
    return c.nombre.toLowerCase().includes(q) || 
           c.area_nombre.toLowerCase().includes(q);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 font-manrope pb-16"
    >
      {/* TopNav */}
      <nav className="bg-white border-b border-slate-200 px-8 h-[76px] flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">shield_person</span>
          </div>
          <div>
            <h1 className="font-extrabold text-slate-800 leading-tight text-base">San Marcelo Admin</h1>
            <p className="text-xs text-slate-500 font-medium">Panel Integral de Orientación Vocacional & CRUD</p>
          </div>
        </div>

        {/* Tabs de Navegación del Panel */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">monitoring</span>
            Dashboard de Resultados
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'students' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            Gestión de Alumnos ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">school</span>
            Oferta Educativa ({catalog.carreras.length})
          </button>
        </div>

        <button 
          onClick={onLogout} 
          className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors text-xs font-bold bg-slate-100 hover:bg-red-50 px-4 py-2.5 rounded-xl cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Cerrar Sesión
        </button>
      </nav>

      {/* Tabs Mobile */}
      <div className="md:hidden flex overflow-x-auto gap-2 p-4 bg-white border-b border-slate-200">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'students' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          Alumnos ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'catalog' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          Oferta ({catalog.carreras.length})
        </button>
      </div>

      <main className="max-w-[76rem] mx-auto px-6 pt-8">

        {/* =========================================================================
            TAB 1: DASHBOARD DE RESULTADOS
           ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Evaluaciones Vocacionales en Tiempo Real</h2>
                <p className="text-slate-500 text-sm">Monitoreo consolidado de estudiantes y perfiles vocacionales RIASEC.</p>
              </div>
              <button 
                onClick={() => showNotification("Reporte exportado exitosamente a formato Excel/CSV.")} 
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Exportar Reporte
              </button>
            </div>

            {/* KPIs Dinámicos desde BD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Tests Completados</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">{dashboardData.total_tests}</h3>
                <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> Datos sincronizados con Supabase
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Perfil Dominante</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{dashboardData.perfil_dominante}</h3>
                <p className="text-slate-400 text-xs mt-2">Área de mayor afinidad escolar</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Carrera Más Sugerida</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{dashboardData.carrera_mas_sugerida}</h3>
                <p className="text-slate-400 text-xs mt-2">Tendencia de preferencia profesional</p>
              </div>
            </div>

            {/* Tabla de Evaluaciones Reales */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-extrabold text-slate-800 text-sm">Historial de Evaluaciones Realizadas</h3>
                <div className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Base de Datos en Vivo
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Estudiante</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Código Holland</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Carrera Recomendada</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dashboardData.ultimos_registros.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-400 text-sm">No hay evaluaciones registradas aún.</td>
                      </tr>
                    ) : (
                      dashboardData.ultimos_registros.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 text-xs text-slate-600 font-medium">{row.date}</td>
                          <td className="py-4 px-6 text-sm font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                              {row.name.charAt(0)}
                            </div>
                            {row.name}
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <span className="px-2.5 py-1 bg-blue-50 text-primary font-bold rounded-md tracking-widest text-xs border border-blue-100">
                              {row.code}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-700 font-semibold">{row.career}</td>
                          <td className="py-4 px-6 text-sm">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: GESTIÓN DE ALUMNOS (CRUD COMPLETO: CREAR, LISTAR, EDITAR, BORRAR)
           ========================================================================= */}
        {activeTab === 'students' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Directorio de Estudiantes (CRUD Completo)</h2>
                <p className="text-slate-500 text-sm">Administra IDs institucionales, actualiza nombres o contraseñas y remueve accesos.</p>
              </div>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Registrar Nuevo Alumno
              </button>
            </div>

            {/* Barra de Búsqueda de Alumnos */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Buscar por código, nombre o colegio..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                />
              </div>
              <span className="text-xs font-semibold text-slate-500 self-end sm:self-center">
                Mostrando {filteredStudents.length} de {students.length} alumnos
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm">Alumnos Registrados en Supabase</h3>
                <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                  Colegio San Marcelo
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80">
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Código / ID</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombres y Apellidos</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Institución</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado Test</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Resultado Obtenido</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">
                          No se encontraron estudiantes con el criterio de búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 text-xs font-mono font-bold text-primary">
                            <span className="bg-primary/5 px-2 py-1 rounded border border-primary/20">{st.codigo_estudiante}</span>
                          </td>
                          <td className="py-4 px-6 text-sm font-bold text-slate-800">{st.nombre_completo}</td>
                          <td className="py-4 px-6 text-xs text-slate-500">{st.institucion}</td>
                          <td className="py-4 px-6 text-sm">
                            {st.estado_test === 'Completado' ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Completado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pendiente
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-xs font-bold text-slate-700">
                            {st.carrera_recomendada || <span className="text-slate-400 font-normal italic">Sin evaluación aún</span>}
                          </td>
                          <td className="py-4 px-6 text-xs text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditStudent(st)}
                                title="Editar Estudiante"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDeletingStudent(st);
                                  setShowDeleteStudentModal(true);
                                }}
                                title="Eliminar Estudiante"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: GESTOR DE OFERTA EDUCATIVA (CRUD COMPLETO CARRERAS Y UNIVERSIDADES)
           ========================================================================= */}
        {activeTab === 'catalog' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Catálogo de Carreras y Universidades (CRUD)</h2>
                <p className="text-slate-500 text-sm">Gestiona opciones vocacionales, edita aranceles de pensión/matrícula y administra instituciones.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setShowAddUniModal(true)}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">domain_add</span>
                  Nueva Universidad
                </button>
                <button
                  onClick={() => setShowAddCareerModal(true)}
                  className="bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Añadir Nueva Carrera
                </button>
              </div>
            </div>

            {/* SECCIÓN 1: EDITOR DE ARANCELES RÁPIDO */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Editor Rápido de Costos y Pensiones por Institución</h3>
                  <p className="text-xs text-slate-500">Los cambios se aplican inmediatamente al algoritmo de costeo vocacional.</p>
                </div>
                <div className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">sync</span> Sincronizado en Nube
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Formulario */}
                  <div className="flex-1 flex flex-col gap-5 border-r border-slate-100 pr-0 md:pr-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">1. Seleccionar Universidad</label>
                        <select 
                          value={selectedUniId}
                          onChange={(e) => setSelectedUniId(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                        >
                          {catalog.universidades.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.siglas} - {u.nombre} ({u.tipo})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">2. Seleccionar Carrera</label>
                        <select 
                          value={selectedCarreraId}
                          onChange={(e) => setSelectedCarreraId(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                        >
                          {catalog.carreras.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre} [{c.area_nombre}]
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Costo de Matrícula Regular (S/)</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">payments</span>
                          <input 
                            type="number" 
                            step="10"
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Pensión Base Regular Mensual (S/)</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">trending_up</span>
                          <input 
                            type="number" 
                            step="10"
                            value={pension}
                            onChange={(e) => setPension(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">* Escala base referencial para Trujillo</p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="w-full md:w-[260px] flex flex-col justify-center gap-3">
                    <button 
                      onClick={handleSaveOffer}
                      disabled={isSavingOffer}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl text-xs flex justify-center items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSavingOffer ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                          Guardando en BD...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">save</span> 
                          Guardar Cambios en BD
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        setPension('750.00');
                        setMatricula('350.00');
                        showNotification("Valores restablecidos a escala base estándar.");
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl text-xs flex justify-center items-center gap-2 border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">history</span> 
                      Restaurar Valores
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: TABLA DE TODAS LAS CARRERAS (CRUD CARRERAS) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Directorio de Carreras Profesionales ({catalog.carreras.length})</h3>
                  <p className="text-xs text-slate-500">Modifica títulos, áreas vocacionales o elimina carreras del modelo de IA.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input
                    type="text"
                    placeholder="Filtrar carreras..."
                    value={searchCareer}
                    onChange={(e) => setSearchCareer(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80">
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Carrera</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Área / Clúster</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Universidades que la Dictan</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCareers.map((c) => {
                      const offersForCareer = catalog.oferta.filter(o => o.carrera_id === c.id);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 text-xs font-mono font-bold text-slate-400">#{c.id}</td>
                          <td className="py-4 px-6 text-sm font-bold text-slate-800">{c.nombre}</td>
                          <td className="py-4 px-6 text-xs">
                            <span className="inline-block bg-primary/5 text-primary border border-primary/20 px-2.5 py-1 rounded-md font-bold">
                              {c.area_nombre} (Clúster {c.cluster_id})
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs">
                            <div className="flex flex-wrap gap-1.5">
                              {offersForCareer.length === 0 ? (
                                <span className="text-slate-400 italic">Sin vincular</span>
                              ) : (
                                offersForCareer.map(off => (
                                  <span 
                                    key={off.id} 
                                    className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold"
                                  >
                                    {off.universidad_siglas}: S/{off.costo_promedio}
                                    <button 
                                      onClick={() => handleDeleteOffer(off.id, c.nombre, off.universidad_siglas)}
                                      title="Desvincular oferta"
                                      className="text-slate-400 hover:text-red-500 ml-0.5 cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-xs text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditCareer(c)}
                                title="Editar Carrera"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDeletingCareer(c);
                                  setShowDeleteCareerModal(true);
                                }}
                                title="Eliminar Carrera"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECCIÓN 3: UNIVERSIDADES REGISTRADAS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Universidades e Institutos Registrados ({catalog.universidades.length})</h3>
                  <p className="text-xs text-slate-500">Instituciones activas en Trujillo y la región para la recomendación vocacional.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {catalog.universidades.map((u) => {
                  const careerCount = catalog.oferta.filter(o => o.universidad_id === u.id).length;
                  return (
                    <div key={u.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center text-xs">
                          {u.siglas}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800">{u.nombre}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{u.tipo} • {careerCount} carreras vinculadas</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setDeletingUni(u);
                          setShowDeleteUniModal(true);
                        }}
                        title="Eliminar Universidad"
                        className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* =========================================================================
          MODALES DE ACCIÓN
         ========================================================================= */}

      {/* Modal: Registrar Alumno */}
      <AnimatePresence>
        {showAddStudentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5 text-primary font-black text-lg">
                  <span className="material-symbols-outlined">person_add</span>
                  Crear Credencial de Alumno
                </div>
                <button 
                  onClick={() => setShowAddStudentModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Código de Estudiante / ID</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: EST-106 o DNI"
                    value={newStudent.codigo_estudiante}
                    onChange={(e) => setNewStudent({ ...newStudent, codigo_estudiante: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombres y Apellidos</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Silva Alvarado"
                    value={newStudent.nombre_completo}
                    onChange={(e) => setNewStudent({ ...newStudent, nombre_completo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña Inicial</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institución Educativa</label>
                  <input
                    type="text"
                    value={newStudent.institucion}
                    onChange={(e) => setNewStudent({ ...newStudent, institucion: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    Guardar Estudiante en Base de Datos
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Editar Alumno */}
      <AnimatePresence>
        {showEditStudentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5 text-primary font-black text-lg">
                  <span className="material-symbols-outlined">edit</span>
                  Editar Datos de Alumno
                </div>
                <button 
                  onClick={() => setShowEditStudentModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveEditStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Código de Estudiante / ID</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.codigo_estudiante}
                    onChange={(e) => setEditingStudent({ ...editingStudent, codigo_estudiante: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombres y Apellidos</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.nombre_completo}
                    onChange={(e) => setEditingStudent({ ...editingStudent, nombre_completo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institución Educativa</label>
                  <input
                    type="text"
                    value={editingStudent.institucion}
                    onChange={(e) => setEditingStudent({ ...editingStudent, institucion: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cambiar Contraseña <span className="text-slate-400 font-normal">(Dejar en blanco para conservar)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Nueva contraseña opcional"
                    value={editingStudent.password}
                    onChange={(e) => setEditingStudent({ ...editingStudent, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    Actualizar Cambios en Base de Datos
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Confirmar Eliminar Alumno */}
      <AnimatePresence>
        {showDeleteStudentModal && deletingStudent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="font-extrabold text-slate-800 text-base mb-1">¿Eliminar Estudiante?</h3>
              <p className="text-xs text-slate-500 mb-4">
                Se eliminará permanentemente al alumno <strong className="text-slate-700">{deletingStudent.nombre_completo}</strong> ({deletingStudent.codigo_estudiante}) y todo su historial de evaluaciones asociadas.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDeleteStudentModal(false);
                    setDeletingStudent(null);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDeleteStudent}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow cursor-pointer"
                >
                  Sí, Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Añadir Nueva Carrera */}
      <AnimatePresence>
        {showAddCareerModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5 text-primary font-black text-lg">
                  <span className="material-symbols-outlined">add_circle</span>
                  Nueva Carrera Profesional
                </div>
                <button 
                  onClick={() => setShowAddCareerModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateCareer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Carrera</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ingeniería Biomédica"
                    value={newCareer.nombre}
                    onChange={(e) => setNewCareer({ ...newCareer, nombre: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Área Vocacional / Clúster</label>
                  <select
                    value={newCareer.area_nombre}
                    onChange={(e) => {
                      const area = e.target.value;
                      let clus = 1;
                      if (area === 'Ingeniería y Tecnología') clus = 2;
                      else if (area === 'Negocios y Gestión') clus = 3;
                      else if (area === 'Humanidades y Artes') clus = 4;
                      setNewCareer({ ...newCareer, area_nombre: area, cluster_id: clus });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="Ciencias de la Salud">Ciencias de la Salud (Clúster 1)</option>
                    <option value="Ingeniería y Tecnología">Ingeniería y Tecnología (Clúster 2)</option>
                    <option value="Negocios y Gestión">Negocios y Gestión (Clúster 3)</option>
                    <option value="Humanidades y Artes">Humanidades y Artes (Clúster 4)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Universidad Inicial</label>
                  <select
                    value={newCareer.universidad_id}
                    onChange={(e) => setNewCareer({ ...newCareer, universidad_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    {catalog.universidades.map((u) => (
                      <option key={u.id} value={u.id}>{u.siglas} - {u.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Matrícula (S/)</label>
                    <input
                      type="number"
                      step="10"
                      value={newCareer.matricula}
                      onChange={(e) => setNewCareer({ ...newCareer, matricula: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pensión Mensual (S/)</label>
                    <input
                      type="number"
                      step="10"
                      value={newCareer.costo_promedio}
                      onChange={(e) => setNewCareer({ ...newCareer, costo_promedio: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Crear Carrera en Base de Datos
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Editar Carrera */}
      <AnimatePresence>
        {showEditCareerModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5 text-primary font-black text-lg">
                  <span className="material-symbols-outlined">edit</span>
                  Editar Carrera Profesional
                </div>
                <button 
                  onClick={() => setShowEditCareerModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveEditCareer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Carrera</label>
                  <input
                    type="text"
                    required
                    value={editingCareer.nombre}
                    onChange={(e) => setEditingCareer({ ...editingCareer, nombre: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Área Vocacional</label>
                  <select
                    value={editingCareer.area_nombre}
                    onChange={(e) => {
                      const area = e.target.value;
                      let clus = 1;
                      if (area === 'Ingeniería y Tecnología') clus = 2;
                      else if (area === 'Negocios y Gestión') clus = 3;
                      else if (area === 'Humanidades y Artes') clus = 4;
                      setEditingCareer({ ...editingCareer, area_nombre: area, cluster_id: clus });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="Ciencias de la Salud">Ciencias de la Salud (Clúster 1)</option>
                    <option value="Ingeniería y Tecnología">Ingeniería y Tecnología (Clúster 2)</option>
                    <option value="Negocios y Gestión">Negocios y Gestión (Clúster 3)</option>
                    <option value="Humanidades y Artes">Humanidades y Artes (Clúster 4)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    Guardar Cambios de Carrera
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Confirmar Eliminar Carrera */}
      <AnimatePresence>
        {showDeleteCareerModal && deletingCareer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">delete_forever</span>
              </div>
              <h3 className="font-extrabold text-slate-800 text-base mb-1">¿Eliminar Carrera?</h3>
              <p className="text-xs text-slate-500 mb-4">
                Se eliminará permanentemente la carrera <strong className="text-slate-700">{deletingCareer.nombre}</strong> y todas sus vinculaciones con universidades locales.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDeleteCareerModal(false);
                    setDeletingCareer(null);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDeleteCareer}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow cursor-pointer"
                >
                  Sí, Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Registrar Nueva Universidad */}
      <AnimatePresence>
        {showAddUniModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5 text-primary font-black text-lg">
                  <span className="material-symbols-outlined">domain_add</span>
                  Registrar Universidad / Instituto
                </div>
                <button 
                  onClick={() => setShowAddUniModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateUniversity} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Siglas de la Institución</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: TECSUP, SENATI, UPCH"
                    value={newUni.siglas}
                    onChange={(e) => setNewUni({ ...newUni, siglas: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo de la Institución</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Instituto Superior de Tecnología TECSUP"
                    value={newUni.nombre}
                    onChange={(e) => setNewUni({ ...newUni, nombre: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Entidad</label>
                  <select
                    value={newUni.tipo}
                    onChange={(e) => setNewUni({ ...newUni, tipo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="Privada">Privada</option>
                    <option value="Pública">Pública / Estatal</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">domain</span>
                    Registrar Institución en BD
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Confirmar Eliminar Universidad */}
      <AnimatePresence>
        {showDeleteUniModal && deletingUni && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">domain_disabled</span>
              </div>
              <h3 className="font-extrabold text-slate-800 text-base mb-1">¿Eliminar Universidad?</h3>
              <p className="text-xs text-slate-500 mb-4">
                Se eliminará la universidad <strong className="text-slate-700">{deletingUni.siglas} - {deletingUni.nombre}</strong> y todas sus ofertas arancelarias asignadas.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDeleteUniModal(false);
                    setDeletingUni(null);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDeleteUni}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow cursor-pointer"
                >
                  Sí, Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[10000] border border-slate-700"
          >
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <div>
              <p className="font-extrabold text-xs">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
