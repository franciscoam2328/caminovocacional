import React from 'react';
import { motion } from 'framer-motion';

export default function TutorialView({ studentName, avatar, onStartTest, onGoHome }) {
  const avatarImage = avatar === 'masculino' 
    ? '/avatars/boy_school.png' 
    : '/avatars/girl_school.png';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 px-6 md:px-12 relative min-h-screen"
    >
      {/* TopNavBar (Shared Component) */}
      <header className="fixed w-full top-0 z-50 bg-primary shadow-lg h-[80px]">
        <div className="flex justify-between items-center px-8 h-full max-w-[80rem] mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white font-manrope">
            <img src="/insignia_san_marcelo.jpg" alt="Insignia San Marcelo" className="h-16 w-auto object-contain drop-shadow-lg" />
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              Test - Colegio San Marcelo
            </span>
          </div>
          {/* Centered Navigation Links */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-12">
            <button onClick={onGoHome} className="text-white/80 font-medium text-[15px] hover:text-white transition-colors">Inicio</button>
            <div className="relative group">
              <button className="text-white font-medium text-[15px] pb-2 border-b-2 border-white">
                Test Vocacional
              </button>
            </div>
          </div>
          {/* Placeholder for spacing to keep links centered */}
          <div className="w-[160px] hidden md:block"></div>
        </div>
      </header>

      {/* Tutorial Content */}
      <div className="w-full max-w-[64rem] mx-auto flex flex-col md:flex-row items-center gap-12 mt-10">
        
        {/* Avatar Area */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full md:w-1/3 flex justify-center shrink-0 relative"
        >
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-[60px] -z-10 w-64 h-64 mx-auto top-10"></div>
          <img 
            src={avatarImage} 
            alt="Tu Avatar" 
            className="w-64 md:w-80 h-auto object-cover rounded-full drop-shadow-2xl mix-blend-multiply" 
          />
        </motion.div>

        {/* Speech Bubble Area */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,89,187,0.1)] relative border border-primary/10">
            {/* Speech Bubble Tail (Desktop) */}
            <div className="hidden md:block absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white rotate-45 border-l border-b border-primary/10"></div>
            {/* Speech Bubble Tail (Mobile) */}
            <div className="md:hidden absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rotate-45 border-t border-l border-primary/10"></div>

            <h2 className="font-headline-md text-2xl md:text-3xl text-primary font-bold mb-6 tracking-tight">
              ¡Genial {studentName || 'Aroni'}! Yo te guiaré.
            </h2>
            
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              Antes de empezar, aquí tienes la regla de oro: <strong className="text-primary">Responde con el corazón.</strong>
            </p>

            <div className="bg-blue-50/50 rounded-2xl p-6 mb-8 border border-blue-100">
              <ul className="space-y-4 text-slate-600">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-amber-500">lightbulb</span>
                  <span><strong>No califiques tu habilidad.</strong> No importa si eres bueno o malo en la actividad, o si tus notas son buenas.</span>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-amber-500">favorite</span>
                  <span><strong>Califica tu gusto.</strong> Solo pregúntate: <em>"¿Sería feliz haciendo esto todos los días?"</em></span>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">Usa la escala del 1 al 5:</h3>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">1</div>
                  <span className="text-sm font-medium text-slate-600">Lo detesto</span>
                </div>
                <div className="hidden sm:block h-px bg-slate-200 flex-1 mx-4"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">3</div>
                  <span className="text-sm font-medium text-slate-600">Me da igual</span>
                </div>
                <div className="hidden sm:block h-px bg-slate-200 flex-1 mx-4"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">5</div>
                  <span className="text-sm font-medium text-slate-600">Me encantaría</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={onStartTest}
                className="bg-primary text-white font-bold py-4 px-10 rounded-xl shadow-[0_10px_30px_rgba(0,89,187,0.3)] hover:shadow-[0_15px_40px_rgba(0,89,187,0.4)] active:scale-95 transform transition-all duration-300 flex items-center gap-3"
              >
                ¡Entendido, vamos a darle!
                <span className="material-symbols-outlined">rocket_launch</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
