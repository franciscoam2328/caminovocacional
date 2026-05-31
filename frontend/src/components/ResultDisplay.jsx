/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ResultDisplay({ data, avatar, onRestart }) {
  const [shuffledCareers, setShuffledCareers] = useState(() => {
    if (data?.carreras_disponibles) {
      return [...data.carreras_disponibles].sort(() => Math.random() - 0.5);
    }
    return [];
  });

  if (!data) return null;

  // Mapa de iconos por Clúster
  const clusterIcons = {
    1: 'medical_services',
    2: 'computer',
    3: 'architecture',
    4: 'storefront',
    5: 'gavel',
    6: 'school'
  };
  
  const mainIcon = clusterIcons[data.cluster_predicho] || 'stars';

  // Extraemos la primera carrera como la recomendación principal
  const mainCareer = shuffledCareers[0] || { nombre: "Ingeniería de Software" };
  const altCareers = shuffledCareers.slice(1, 3);

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background text-on-background min-h-screen flex flex-col font-body-md text-body-md w-full"
    >
      {/* TopNavBar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 border-b border-white/20 dark:border-slate-800 shadow-[0_8px_32px_rgba(0,123,255,0.08)] print:hidden">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-3 items-center w-full">
            <div className="text-xl font-black tracking-tighter text-blue-600 dark:text-blue-400 font-headline-md">
              Camino Vocacional
            </div>
            <div className="hidden md:flex gap-6 items-center justify-center">
              <button onClick={onRestart} className="font-['Manrope'] text-sm font-medium tracking-tight text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all active:scale-95 duration-200 ease-out px-3 py-2">
                Inicio
              </button>
              <button className="font-['Manrope'] text-sm tracking-tight text-primary font-bold border-b-2 border-primary pb-1 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all active:scale-95 duration-200 ease-out px-3 py-2">
                Test Vocacional
              </button>
            </div>
            <div className="hidden md:block"></div>
          </div>
        </div>
      </nav>

      <main id="resultado-pdf" className="flex-grow w-full max-w-[1280px] mx-auto px-6 py-lg flex flex-col gap-xl mt-8 bg-background">
        {/* Hero Section */}
        <header 
          className="bg-white/90 backdrop-blur-[16px] border border-white/50 shadow-[0_12px_40px_rgba(0,123,255,0.06)] rounded-2xl p-lg flex flex-col md:flex-row items-center gap-lg relative overflow-hidden bg-primary-fixed/20"
          style={{ backgroundImage: 'radial-gradient(at top left, rgba(0, 89, 187, 0.08) 0%, transparent 50%), url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
        >
          {/* Decorative background element */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-tertiary-container/20 rounded-full blur-3xl"></div>
          
          <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-2xl shrink-0 relative z-10 bg-white ring-8 ring-white/50">
            <img 
              alt="Avatar graduado" 
              className="w-full h-full object-cover" 
              src={avatar === 'femenino' 
                ? "https://lh3.googleusercontent.com/aida/ADBb0uj_7Sudy17qakA-uzZhUr8PCh3XsLCo6nk6vTgBpvxzP5lynlKU_B2X2lS9WG61wpIRk2lK-G5uy_pd0u-tzyN5ykPjyt9pqWdwBxo4QVie3yz5ARftIM6CgNmyUW8p2Lc7knHQoykng29-QwjpUO2UoANs-zcGOHcflnsBmymI0_mS6c5AdtqthVYCDZUmcKqLavoRLOWUfI9FbvYiJe7JijPfpd8Cn8oYxl2YNDTt4V7LIMO37eM56t3Mu-6AZeC9tRfC93A"
                : "https://lh3.googleusercontent.com/aida-public/AB6AXuAm3AtJb-WAeffhOFL9usKpOSYW1hgo33nBJbLuhuUAJxstV6_L0tjncc3MACvxV-bk88D3mghjNjgcYZ4UdekF_6vxYPI-hozBlRdWTpr52ckNNSy_X_jzy5tvYmv5kmzOh90Cc6k4RxJScRoxU3wZcSRXcH_tOfdWHWxNS-IDgoRcDwJUy_ZfN7bouSWVNtPuRrDcTh-nlcJI5eRUfdkcaJxVHEwv0IhqzPGtkXr3ef-I-lLDkBWYl0mXjK7fDKQ_kjO4-ijv" 
              } 
            />
          </div>
          
          <div className="flex-1 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-white/50 shadow-sm mb-4">
              <span className="material-symbols-outlined text-tertiary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Resultados del Test Vocacional</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4 tracking-tight font-extrabold">
              ¡Felicidades {data.estudiante || 'Aroni'}!
            </h1>
            <p className="font-headline-md text-headline-md bg-gradient-to-r from-[#0059bb] to-[#a96428] bg-clip-text text-transparent font-medium">
              Este es tu camino hacia el futuro.
            </p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg lg:gap-xl">
          
          {/* Left Column: Results */}
          <section className="lg:col-span-8 flex flex-col gap-xl">
            {/* Recommended Careers */}
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">Tu Perfil Ideal ({data.area_recomendada})</h2>
              
              {/* Winner Card */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(0,89,187,0.15)] border-2 border-primary/10 relative overflow-hidden group hover:border-primary/30 transition-all duration-500 mb-8 flex flex-col md:flex-row items-center gap-8">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-secondary"></div>
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-[200px]">{mainIcon}</span>
                </div>
                <div className="w-24 h-24 bg-primary-fixed rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{mainIcon}</span>
                </div>
                
                <div className="flex-1 text-center md:text-left relative z-10">
                  <div className="text-tertiary-container font-black tracking-widest uppercase text-xs mb-2 flex items-center justify-center md:justify-start gap-1">
                    <span className="material-symbols-outlined text-[14px]">military_tech</span> Primera Opción
                  </div>
                  <h3 className="font-headline-xl text-4xl text-on-surface mb-3 font-extrabold tracking-tight">{mainCareer.nombre}</h3>
                  <p className="text-on-surface-variant text-body-md max-w-[36rem]">
                    Tu perfil se alinea perfectamente con campos donde puedes liderar, innovar y desarrollar soluciones efectivas.
                  </p>
                </div>
                
                <div className="text-center md:text-right shrink-0 relative z-10 bg-surface px-6 py-4 rounded-2xl border border-surface-variant">
                  <div className="text-5xl font-black text-primary mb-1">95%</div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Afinidad</div>
                  <div className="w-full bg-surface-variant rounded-full h-1.5 mt-3">
                    <div className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>

              {altCareers.length > 0 && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-headline-md text-xl text-on-surface font-bold">{altCareers.length} Alternativas Recomendadas</h3>
                    <div className="h-px bg-surface-variant flex-1"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {altCareers[0] && (
                      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5">
                        <div className="w-14 h-14 bg-surface-container rounded-xl flex items-center justify-center shrink-0 text-secondary">
                          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-headline-md text-lg text-on-surface font-bold mb-1 line-clamp-1">{altCareers[0].nombre}</h4>
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-secondary">88%</div>
                            <div className="w-full bg-surface-variant rounded-full h-1.5 flex-1 max-w-[100px]">
                              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '88%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {altCareers[1] && (
                      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5">
                        <div className="w-14 h-14 bg-surface-container rounded-xl flex items-center justify-center shrink-0 text-tertiary-container">
                          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-headline-md text-lg text-on-surface font-bold mb-1 line-clamp-1">{altCareers[1].nombre}</h4>
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-tertiary-container">82%</div>
                            <div className="w-full bg-surface-variant rounded-full h-1.5 flex-1 max-w-[100px]">
                              <div className="bg-tertiary-container h-1.5 rounded-full" style={{ width: '82%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* University Comparison List */}
            <div className="mt-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                  <span className="text-tertiary-container font-bold tracking-widest uppercase text-xs mb-2 block">Donde Estudiar</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">Mejores Universidades en Trujillo</h2>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {mainCareer.universidades?.map((univ, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_12px_30px_rgba(0,89,187,0.08)] hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden group">
                    
                    {univ.tipo === 'Privada' && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black tracking-wider px-4 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-sm z-10">
                        <span className="material-symbols-outlined text-[14px]">verified</span> LICENCIADA POR SUNEDU
                      </div>
                    )}
                    
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-105 transition-transform duration-500 p-2 text-center">
                      <span className={`font-black text-xl tracking-tighter ${idx % 3 === 0 ? 'text-primary' : idx % 3 === 1 ? 'text-secondary' : 'text-tertiary-container'}`}>
                        {univ.nombre.split(' ')[0]}
                      </span>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left w-full">
                      <h3 className="font-headline-md text-2xl text-on-surface font-extrabold mb-2">{univ.nombre}</h3>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">account_balance</span> {univ.tipo}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block"></span>
                        <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded text-slate-600"><span className="material-symbols-outlined text-[18px]">calendar_month</span> 10 Semestres</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                      <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">Pensiones Mensuales</div>
                      <div className={`font-headline-xl text-3xl font-black tracking-tight ${univ.costo_promedio === 0 ? 'text-secondary' : 'text-on-surface'}`}>
                        {univ.costo_promedio === 0 ? 'Gratuita' : `S/ ${univ.costo_promedio}`}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{univ.tipo === 'Pública' ? 'Inversión Anual: S/ 150.00' : 'Inscripción: S/ 300.00'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-xl">
            <div className="bg-white/90 backdrop-blur-[16px] border border-white/50 shadow-[0_12px_40px_rgba(0,123,255,0.06)] rounded-3xl p-8 sticky top-28">
              <div className="flex items-center gap-3 mb-8 border-b border-surface-variant pb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                </div>
                <h2 className="font-headline-md text-xl font-bold text-on-surface">Perfil de {data.estudiante || 'Aroni'}</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                {/* Skill Bar 1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-label-md text-label-md text-on-surface">Afinidad Principal</span>
                    <span className="font-label-sm text-label-sm text-primary font-black">Alto</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2.5 shadow-inner">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                {/* Skill Bar 2 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-label-md text-label-md text-on-surface">Versatilidad</span>
                    <span className="font-label-sm text-label-sm text-secondary font-black">Medio-Alto</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2.5 shadow-inner">
                    <div className="bg-secondary h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                {/* Skill Bar 3 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-label-md text-label-md text-on-surface">Intereses Secundarios</span>
                    <span className="font-label-sm text-label-sm text-tertiary-container font-black">Medio</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2.5 shadow-inner">
                    <div className="bg-tertiary-container h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div className="mt-4 pt-6 border-t border-surface-variant relative">
                  <span className="material-symbols-outlined absolute -top-3 left-4 text-surface-variant bg-white px-2">format_quote</span>
                  <p className="text-on-surface-variant italic text-[13px] leading-relaxed">
                    Tus respuestas al test revelan que tienes una fuerte inclinación natural y vocacional hacia el área de <strong>{data.area_recomendada}</strong>. Tus intereses y habilidades encajan perfectamente con este campo profesional.
                  </p>
                </div>
                
                <button onClick={onRestart} className="w-full mt-6 bg-primary hover:bg-primary-container text-white font-label-md py-4 px-6 rounded-2xl shadow-[0_8px_20px_rgba(0,89,187,0.3)] hover:shadow-[0_12px_25px_rgba(0,89,187,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-base relative overflow-hidden group print:hidden">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <span className="material-symbols-outlined relative z-10 text-xl">refresh</span>
                  <span className="relative z-10">Volver al Inicio</span>
                </button>
                
                <button onClick={handleDownloadPDF} className="w-full mt-2 bg-white hover:bg-surface-container border-2 border-primary text-primary font-label-md py-4 px-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-base relative overflow-hidden group print:hidden">
                  <span className="material-symbols-outlined relative z-10 text-xl">download</span>
                  <span className="relative z-10">Descargar PDF</span>
                </button>
              </div>
            </div>
          </aside>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 full-width border-t border-slate-100 dark:border-slate-800 py-12 w-full mt-auto">
        <div className="max-w-[1280px] mx-auto w-full px-6">
          <div className="font-['Manrope'] text-sm text-slate-500 dark:text-slate-400 text-left">
            © 2026 Camino Vocacional Trujillo. Inspirado en nuestra herencia.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
