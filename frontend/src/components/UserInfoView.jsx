import React from 'react';
import { motion } from 'framer-motion';

export default function UserInfoView({ studentName, setStudentName, onSubmit, onGoHome, onGoTest }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentName.trim().length > 1) {
      onSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col justify-center items-center px-gutter pt-[100px] pb-xl max-w-container-max mx-auto w-full relative z-10 min-h-screen"
    >
      {/* TopAppBar (Simplified for Onboarding) */}
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
          <nav className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <button onClick={onGoHome} className="text-white/80 hover:text-white font-medium text-[15px] transition-colors">Inicio</button>
            <div className="relative flex flex-col items-center">
              <button onClick={onGoTest} className="text-white font-medium text-[15px] py-2 border-b-2 border-white">Test Vocacional</button>
            </div>
          </nav>
          
          {/* Spacer for right side alignment */}
          <div className="w-[150px] hidden md:block"></div>
        </div>
      </header>

      <div className="w-full max-w-[42rem] flex flex-col items-center">
        {/* Heading */}
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xl text-center leading-tight">
          ¡Hola! Queremos conocerte, ¿cómo te llamas?
        </h1>
        
        {/* Input Area */}
        <form onSubmit={handleSubmit} className="w-full max-w-[32rem] flex flex-col mb-xl relative justify-center">
          <label className="font-label-md text-label-md text-on-surface-variant mb-sm ml-sm" htmlFor="user-name">Tu Nombre</label>
          <div className="relative w-full shadow-[0_15px_40px_rgba(0,123,255,0.06)] rounded-xl group">
            <input 
              autoFocus 
              className="w-full bg-surface-container-lowest focus:bg-surface-container-lowest text-on-surface font-body-lg text-body-lg px-md py-lg rounded-xl border border-surface-variant focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-outline-variant/80" 
              id="user-name" 
              placeholder="Escribe tu nombre aquí..." 
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          
          {/* Action Area */}
          <div className="w-full max-w-[32rem] flex mt-md justify-center">
            <button 
              type="submit"
              disabled={studentName.trim().length < 2}
              className="bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md px-xl py-[16px] rounded-full shadow-[0_10px_30px_rgba(0,89,187,0.2)] hover:shadow-[0_0_20px_rgba(0,103,126,0.5)] disabled:opacity-50 transition-all flex items-center justify-center gap-sm"
            >
              Siguiente
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
