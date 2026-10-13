/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { motion } from 'framer-motion';

export default function AvatarSelectView({ studentName, onSelect, onGoHome, onGoTest }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
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
              <button onClick={onGoTest} className="text-white font-medium text-[15px] pb-2 border-b-2 border-white">
                Test Vocacional
              </button>
            </div>
          </div>
          {/* Placeholder for spacing to keep links centered */}
          <div className="w-[160px] hidden md:block"></div>
        </div>
      </header>

      {/* Header Section */}
      <div className="text-center max-w-[48rem] mx-auto mb-16 relative z-10 mt-10">
        <h2 className="font-headline-md text-headline-md text-primary mb-4 tracking-tight">¡Mucho gusto, {studentName}!</h2>
        <h1 className="font-headline-xl text-headline-xl text-on-surface">
          Elige a tu compañero de aventura
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-6 max-w-[42rem] mx-auto">
          Tu guía personal te acompañará en este viaje de descubrimiento vocacional. Selecciona el avatar con el que más te identifiques para comenzar a explorar tu futuro.
        </p>
      </div>

      {/* Selection Grid */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full max-w-[64rem] justify-center items-stretch relative z-10">
        
        {/* Avatar Card: Male */}
        <div onClick={() => onSelect('masculino')} className="group relative flex flex-col items-center p-8 bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,123,255,0.05)] hover:shadow-[0_20px_60px_rgba(0,112,234,0.15)] transition-all duration-500 hover:-translate-y-2 cursor-pointer w-full md:w-1/2 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-primary/5 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity">
          {/* Inner Glow Ring on Hover */}
          <div className="absolute inset-0 border-2 border-primary/0 rounded-[2rem] group-hover:border-primary/20 transition-colors duration-500"></div>
          {/* 3D Avatar Image */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-64 h-64 mb-8 relative z-10 transition-transform duration-500 group-hover:scale-105"
          >
            <img alt="Estudiante Masculino" className="w-full h-full object-cover rounded-full border-4 border-white/50 shadow-xl mix-blend-multiply" src="/avatars/boy_school.png" />
          </motion.div>
          {/* Action Button */}
          <button className="mt-auto relative z-10 w-full py-4 px-8 rounded-xl bg-surface-container hover:bg-gradient-to-r hover:from-primary hover:to-secondary text-primary hover:text-on-primary font-label-md text-label-md tracking-wide shadow-sm hover:shadow-[0_0_20px_rgba(0,89,187,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group/btn">
            <span>Seleccionar</span>
            <span className="material-symbols-outlined text-lg opacity-0 group-hover/btn:opacity-100 transform -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300">arrow_forward</span>
          </button>
        </div>

        {/* Avatar Card: Female */}
        <div onClick={() => onSelect('femenino')} className="group relative flex flex-col items-center p-8 bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,123,255,0.05)] hover:shadow-[0_20px_60px_rgba(0,112,234,0.15)] transition-all duration-500 hover:-translate-y-2 cursor-pointer w-full md:w-1/2 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-secondary/5 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity">
          {/* Inner Glow Ring on Hover */}
          <div className="absolute inset-0 border-2 border-secondary/0 rounded-[2rem] group-hover:border-secondary/20 transition-colors duration-500"></div>
          {/* 3D Avatar Image */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="w-64 h-64 mb-8 relative z-10 transition-transform duration-500 group-hover:scale-105"
          >
            <img alt="Estudiante Femenina" className="w-full h-full object-cover rounded-full border-4 border-white/50 shadow-xl mix-blend-multiply" src="/avatars/girl_school.png" />
          </motion.div>
          {/* Action Button */}
          <button className="mt-auto relative z-10 w-full py-4 px-8 rounded-xl bg-surface-container hover:bg-gradient-to-r hover:from-primary hover:to-secondary text-primary hover:text-on-primary font-label-md text-label-md tracking-wide shadow-sm hover:shadow-[0_0_20px_rgba(0,89,187,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group/btn">
            <span>Seleccionar</span>
            <span className="material-symbols-outlined text-lg opacity-0 group-hover/btn:opacity-100 transform -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300">arrow_forward</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}
