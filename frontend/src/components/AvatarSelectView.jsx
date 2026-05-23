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
      <nav className="fixed top-0 w-full z-50 bg-white font-manrope antialiased border-b border-gray-100">
        <div className="flex justify-between items-center px-8 h-20 max-w-[80rem] mx-auto">
          {/* Brand */}
          <div className="text-xl font-extrabold tracking-tight text-blue-600 font-manrope antialiased">
            Camino Vocacional
          </div>
          {/* Centered Navigation Links */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-12">
            <button onClick={onGoHome} className="text-[#6b7280] font-medium text-[15px] hover:text-primary transition-colors">Inicio</button>
            <div className="relative group">
              <button onClick={onGoTest} className="text-primary font-medium text-[15px] pb-2 border-b-2 border-primary">
                Test Vocacional
              </button>
            </div>
          </div>
          {/* Placeholder for spacing to keep links centered */}
          <div className="w-[160px] hidden md:block"></div>
        </div>
      </nav>

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
          <div className="w-64 h-64 mb-8 relative z-10 transition-transform duration-500 group-hover:scale-105">
            <img alt="Estudiante Masculino" className="w-full h-full object-contain drop-shadow-2xl" src="https://lh3.googleusercontent.com/aida/ADBb0uhFb29YvJdZdGSJ1vZn2Byw-o8Y6_tg26VTJtbo6koKfAAxIbi48PqthKRb34xRuKTXic6oPm4-XzzvvFA4LcYN4GELms5z2_KuKsiQ6ETd5uq6KNqFX7NNGqnTTl40-y1jikrFsbnPUxjrcx1uS7auoQhwgfJMCDmSIpkVuO5oE_Q4PapICWE7zXYo6znREHFaDDw7fTayOoJ5_9ldEw5_Bs_e3FQokkDOJSPrywXVyU_24F9h8d4HTAiqqAjOx329SkfHLb0" />
          </div>
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
          <div className="w-64 h-64 mb-8 relative z-10 transition-transform duration-500 group-hover:scale-105">
            <img alt="Estudiante Femenina" className="w-full h-full object-contain drop-shadow-2xl" src="https://lh3.googleusercontent.com/aida/ADBb0uj_7Sudy17qakA-uzZhUr8PCh3XsLCo6nk6vTgBpvxzP5lynlKU_B2X2lS9WG61wpIRk2lK-G5uy_pd0u-tzyN5ykPjyt9pqWdwBxo4QVie3yz5ARftIM6CgNmyUW8p2Lc7knHQoykng29-QwjpUO2UoANs-zcGOHcflnsBmymI0_mS6c5AdtqthVYCDZUmcKqLavoRLOWUfI9FbvYiJe7JijPfpd8Cn8oYxl2YNDTt4V7LIMO37eM56t3Mu-6AZeC9tRfC93A" />
          </div>
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
