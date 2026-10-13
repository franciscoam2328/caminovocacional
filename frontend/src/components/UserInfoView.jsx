import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { loginUser } from '@/infrastructure/api';

export default function UserInfoView({ onLoginSuccess, onGoHome, onGoTest }) {
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codigo.trim() || !password.trim()) {
      setErrorMessage("Por favor ingresa tu código y contraseña.");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await loginUser(codigo.trim(), password.trim());
      if (response && response.user) {
        onLoginSuccess(response.user);
      }
    } catch (err) {
      setErrorMessage(err.message || "Código o contraseña incorrectos. Verifica tus datos con tu tutor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col justify-center items-center px-gutter pt-[100px] pb-xl max-w-container-max mx-auto w-full relative z-10 min-h-screen"
    >
      {/* TopAppBar */}
      <header className="fixed w-full top-0 z-50 bg-primary shadow-lg h-[80px]">
        <div className="flex justify-between items-center w-full px-8 h-full max-w-container-max mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white font-manrope">
            <img src="/insignia_san_marcelo.jpg" alt="Insignia San Marcelo" className="h-16 w-auto object-contain drop-shadow-lg" />
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              Test - Colegio San Marcelo
            </span>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden sm:flex items-center gap-6 sm:gap-8 absolute left-1/2 -translate-x-1/2">
            <button onClick={onGoHome} className="text-white/80 hover:text-white font-medium text-[15px] transition-colors">Inicio</button>
            <div className="relative flex flex-col items-center">
              <button onClick={onGoTest} className="text-white font-medium text-[15px] py-2 border-b-2 border-white">Test Vocacional</button>
            </div>
          </nav>

          <div className="w-[150px] hidden md:block"></div>
        </div>
      </header>

      <div className="w-full max-w-[32rem] flex flex-col items-center bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-[0_15px_40px_rgba(0,123,255,0.06)] mt-4">
        {/* Badge Institucional */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-primary border border-blue-100 rounded-full text-xs font-bold mb-4">
          <span className="material-symbols-outlined text-[16px]">school</span>
          Acceso Institucional Alumnos
        </div>

        {/* Heading */}
        <h1 className="font-headline-md text-2xl font-black text-on-surface mb-2 text-center leading-tight">
          Inicia Sesión para tu Evaluación
        </h1>
        <p className="text-slate-500 text-sm text-center mb-6">
          Ingresa con las credenciales proporcionadas por tu colegio o departamento de tutoría.
        </p>

        {errorMessage && (
          <div className="w-full mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMessage}</span>
          </div>
        )}
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="font-label-md text-xs font-bold text-slate-700 block mb-1.5" htmlFor="student-code">
              Código de Estudiante / ID
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">badge</span>
              <input 
                id="student-code"
                autoFocus 
                className="w-full bg-slate-50 focus:bg-white text-on-surface text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-slate-400 font-medium uppercase" 
                placeholder="Ej: EST-101" 
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-label-md text-xs font-bold text-slate-700 block mb-1.5" htmlFor="student-password">
              Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
              <input 
                id="student-password"
                className="w-full bg-slate-50 focus:bg-white text-on-surface text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-slate-400 font-medium" 
                placeholder="••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Recordatorio de credenciales demo */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-blue-500">info</span>
              Cuentas de demostración disponibles:
            </p>
            <p><strong>Código:</strong> <code className="bg-white px-1 py-0.5 rounded border border-slate-200 text-primary">EST-101</code> &bull; <strong>Clave:</strong> <code className="bg-white px-1 py-0.5 rounded border border-slate-200 text-primary">123456</code> (Mateo Chávez)</p>
          </div>
          
          {/* Action Area */}
          <div className="w-full mt-2">
            <button 
              type="submit"
              disabled={isLoading || !codigo.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm py-3.5 rounded-xl shadow-lg hover:shadow-primary/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                  Verificando...
                </>
              ) : (
                <>
                  Ingresar a Evaluación
                  <span className="material-symbols-outlined text-sm">login</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-[11px] text-slate-400 text-center">
          ¿Problemas para acceder? Consulta con tu docente tutor o administrador del sistema.
        </p>
      </div>
    </motion.div>
  );
}
