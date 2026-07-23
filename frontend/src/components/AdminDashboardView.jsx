import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboardView({ onLogout }) {
  const [showToast, setShowToast] = useState(false);

  const mockData = [
    { id: 1, date: '2026-07-12', name: 'Mateo C.', code: 'RIC', career: 'Ingeniería de Sistemas', status: 'Completado' },
    { id: 2, date: '2026-07-12', name: 'Lucía M.', code: 'SAE', career: 'Psicología', status: 'Completado' },
    { id: 3, date: '2026-07-11', name: 'Diego F.', code: 'EAC', career: 'Administración', status: 'Completado' },
    { id: 4, date: '2026-07-11', name: 'Valeria R.', code: 'IAS', career: 'Medicina Humana', status: 'Completado' },
    { id: 5, date: '2026-07-10', name: 'Sebastián P.', code: 'RCE', career: 'Ingeniería Civil', status: 'Completado' },
  ];

  const handleExport = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 font-manrope pb-12"
    >
      {/* TopNav */}
      <nav className="bg-white border-b border-slate-200 px-8 h-[70px] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">shield_person</span>
          </div>
          <div>
            <h1 className="font-extrabold text-slate-800 leading-tight">San Marcelo Admin</h1>
            <p className="text-xs text-slate-500 font-medium">Panel de Control (Fase 1)</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-bold bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-lg">
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Cerrar Sesión
        </button>
      </nav>

      <main className="max-w-[70rem] mx-auto px-6 pt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Dashboard de Resultados</h2>
            <p className="text-slate-500">Resumen de evaluaciones vocacionales del ciclo actual.</p>
          </div>
          <button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Exportar a Excel
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <p className="text-slate-500 font-medium text-sm">Tests Realizados</p>
            <h3 className="text-3xl font-black text-slate-800">124</h3>
            <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> +12% esta semana</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <p className="text-slate-500 font-medium text-sm">Perfil Dominante</p>
            <h3 className="text-3xl font-black text-slate-800">Investigador</h3>
            <p className="text-slate-400 text-xs mt-2">Representa el 34% de la muestra</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">school</span>
            </div>
            <p className="text-slate-500 font-medium text-sm">Carrera Más Sugerida</p>
            <h3 className="text-2xl font-black text-slate-800">Ing. de Sistemas</h3>
            <p className="text-slate-400 text-xs mt-2">Área: Tecnología</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Últimos Registros</h3>
            <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">Modo Prototipo</div>
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
                {mockData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-600">{row.date}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">{row.name.charAt(0)}</div>
                      {row.name}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold rounded-md tracking-widest text-xs">{row.code}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700">{row.career}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* University Management Mock */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-800">Gestor de Oferta Educativa</h3>
              <p className="text-xs text-slate-500">Administración avanzada de carreras, escalas de pensiones y universidades locales.</p>
            </div>
            <div className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">construction</span> Módulo Fase 2 (Prototipo)
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Formulario Izquierda */}
              <div className="flex-1 flex flex-col gap-5 border-r border-slate-100 pr-0 md:pr-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">edit_document</span> 
                    Editor de Entidades (JSON)
                  </h4>
                  <button disabled className="text-xs text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1 cursor-not-allowed">
                    <span className="material-symbols-outlined text-[14px]">add</span> Añadir Universidad
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">1. Seleccionar Universidad</label>
                    <select disabled className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 font-medium cursor-not-allowed appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                      <option>UPAO - Univ. Privada Antenor Orrego</option>
                      <option>UNT - Univ. Nacional de Trujillo</option>
                      <option>UCV - Univ. César Vallejo</option>
                      <option>UPN - Univ. Privada del Norte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Seleccionar Carrera</label>
                    <select disabled className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 font-medium cursor-not-allowed appearance-none">
                      <option>Ingeniería de Sistemas y Software</option>
                      <option>Medicina Humana</option>
                      <option>Derecho</option>
                      <option>+ Añadir Nueva Carrera...</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Costo de Matrícula (S/)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">payments</span>
                      <input type="text" disabled value="350.00" className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm font-bold text-slate-700 cursor-not-allowed shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Pensión Base Regular (S/)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">trending_up</span>
                      <input type="text" disabled value="750.00" className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm font-bold text-slate-700 cursor-not-allowed shadow-sm" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">* Escala varía según evaluación socioeconómica</p>
                  </div>
                </div>
              </div>

              {/* Botonera Derecha */}
              <div className="w-full md:w-[250px] flex flex-col justify-end gap-3 pt-4 md:pt-0">
                <button disabled className="w-full bg-primary text-white font-bold py-3 rounded-xl text-sm flex justify-center items-center gap-2 cursor-not-allowed opacity-90 shadow-md">
                  <span className="material-symbols-outlined text-[18px]">save</span> Guardar Cambios
                </button>
                <button disabled className="w-full bg-slate-100 text-slate-500 font-bold py-3 rounded-xl text-sm flex justify-center items-center gap-2 cursor-not-allowed border border-slate-200">
                  <span className="material-symbols-outlined text-[18px]">history</span> Restaurar a Original
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
          >
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <div>
              <p className="font-bold text-sm">Exportación Exitosa</p>
              <p className="text-xs text-slate-300">El reporte se ha generado correctamente.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
