/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HollandPrintReport from './HollandPrintReport';

export default function ResultDisplay({ data, avatar, onRestart }) {
  const [recommendedCareers, setRecommendedCareers] = useState(() => {
    if (data?.carreras_recomendadas) {
      return data.carreras_recomendadas;
    }
    return [];
  });

  if (!data || recommendedCareers.length === 0) return null;

  const mainCareer = recommendedCareers[0];
  const altCareers = recommendedCareers.slice(1, 3);
  
  const [selectedCareerForUnivs, setSelectedCareerForUnivs] = useState(mainCareer);
  
  const iconMap = {
      'Arquitectura': 'architecture',
      'Arte y Diseño': 'palette',
      'Biología y Ciencias': 'biotech',
      'Comunicación y Periodismo': 'campaign',
      'Derecho': 'gavel',
      'Educación': 'school',
      'Enfermería': 'medical_services',
      'Finanzas y Contabilidad': 'account_balance',
      'Informática y Sistemas': 'computer',
      'Ingeniería Civil': 'engineering',
      'Ingeniería Eléctrica': 'electrical_services',
      'Ingeniería General': 'precision_manufacturing',
      'Ingeniería Mecánica': 'car_repair',
      'Lengua y Literatura': 'menu_book',
      'Marketing': 'storefront',
      'Medicina y Salud': 'health_and_safety',
      'Negocios y Administración': 'business_center',
      'Orientación Psicológica': 'psychology',
      'Psicología': 'psychology',
  };
  
  const mainIcon = iconMap[mainCareer.id_modelo] || 'stars';

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
      <nav className="bg-primary shadow-lg full-width top-0 sticky z-50 print:hidden h-[80px]">
        <div className="flex justify-between items-center w-full px-8 h-full max-w-[1280px] mx-auto">
          <div className="grid grid-cols-3 items-center w-full">
            <div className="flex items-center gap-3 text-xl font-extrabold tracking-tighter text-white font-headline-md">
              <img src="/insignia_san_marcelo.jpg" alt="Insignia San Marcelo" className="h-16 w-auto object-contain drop-shadow-lg" />
              <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                Test - Colegio San Marcelo
              </span>
            </div>
            <div className="hidden md:flex gap-6 items-center justify-center">
              <button onClick={onRestart} className="font-['Manrope'] text-sm font-medium tracking-tight text-white/80 hover:text-white transition-colors duration-200 ease-out px-3 py-2">
                Inicio
              </button>
              <button className="font-['Manrope'] text-sm tracking-tight text-white font-bold border-b-2 border-white pb-1 transition-all duration-200 ease-out px-3 py-2">
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
              className="w-full h-full object-cover scale-[2.2] origin-[50%_15%]" 
              src={avatar === 'femenino' 
                ? "/avatars/girl_graduate.png"
                : "/avatars/boy_graduate.png" 
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

        {/* Print-only Holland Detailed Report */}
        <HollandPrintReport data={data} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg lg:gap-xl print:gap-4">
          
          {/* Left Column: Results */}
          <section className="lg:col-span-8 flex flex-col gap-xl print:gap-6">
            {/* Recommended Careers */}
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">Tu Perfil Ideal</h2>
              
              {/* Winner Card */}
              <div 
                onClick={() => setSelectedCareerForUnivs(mainCareer)}
                className={`bg-white rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(0,89,187,0.15)] border-2 ${selectedCareerForUnivs.nombre_mostrar === mainCareer.nombre_mostrar ? 'border-primary' : 'border-primary/10 hover:border-primary/30'} cursor-pointer relative overflow-hidden group transition-all duration-500 mb-8 flex flex-col md:flex-row items-center gap-8`}>
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
                  <h3 className="font-headline-xl text-4xl text-on-surface mb-3 font-extrabold tracking-tight">{mainCareer.nombre_mostrar}</h3>
                  <p className="text-on-surface-variant text-body-md max-w-[36rem]">
                    {mainCareer.descripcion}
                  </p>
                </div>
                
                <div className="text-center md:text-right shrink-0 relative z-10 bg-surface px-6 py-4 rounded-2xl border border-surface-variant">
                  <div className="text-5xl font-black text-primary mb-1">{mainCareer.afinidad}%</div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Afinidad</div>
                  <div className="w-full bg-surface-variant rounded-full h-1.5 mt-3">
                    <div className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full" style={{ width: `${mainCareer.afinidad}%` }}></div>
                  </div>
                </div>
              </div>

              {altCareers.length > 0 && (
                <>
                  <div className="flex flex-col gap-1 mb-6">
                    <div className="flex items-center gap-4">
                      <h3 className="font-headline-md text-xl text-on-surface font-bold">{altCareers.length} Alternativas Recomendadas</h3>
                      <div className="h-px bg-surface-variant flex-1"></div>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1 font-medium mt-1">
                      <span className="material-symbols-outlined text-[16px] text-amber-500">lightbulb</span>
                      Haz clic en cualquier carrera para ver dónde estudiarla en Trujillo.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {altCareers.map((altCareer, index) => {
                      const isSecond = index === 0;
                      const colorClass = isSecond ? "text-secondary" : "text-tertiary-container";
                      const bgClass = isSecond ? "bg-secondary" : "bg-tertiary-container";
                      const altIcon = iconMap[altCareer.id_modelo] || 'stars';
                      return (
                        <div key={index} 
                             onClick={() => setSelectedCareerForUnivs(altCareer)}
                             className={`group bg-white rounded-2xl p-6 border ${selectedCareerForUnivs.nombre_mostrar === altCareer.nombre_mostrar ? 'border-primary ring-2 ring-primary/20' : 'border-slate-100'} cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5`}>
                          <div className={`w-14 h-14 bg-surface-container rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{altIcon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-headline-md text-lg text-on-surface font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">{altCareer.nombre_mostrar}</h4>
                            <div className="flex items-center gap-3">
                              <div className={`text-lg font-bold ${colorClass}`}>{altCareer.afinidad}%</div>
                              <div className="w-full bg-surface-variant rounded-full h-1.5 flex-1 max-w-[100px]">
                                <div className={`${bgClass} h-1.5 rounded-full`} style={{ width: `${altCareer.afinidad}%` }}></div>
                              </div>
                            </div>
                          </div>
                          {/* Affordance Icon */}
                          <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${selectedCareerForUnivs.nombre_mostrar === altCareer.nombre_mostrar ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-blue-50 group-hover:text-primary'}`}>
                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* University Comparison List */}
            <div className="mt-8">
              {recommendedCareers.map((career, careerIdx) => (
                <div key={careerIdx} className={`${selectedCareerForUnivs.nombre_mostrar === career.nombre_mostrar ? 'block' : 'hidden print:block'} mb-12`}>
                  <div className="flex flex-col md:flex-row justify-between items-end print:items-center print:justify-center mb-8 gap-4">
                    <div className="w-full print:text-center">
                      <span className="text-tertiary-container font-bold tracking-widest uppercase text-xs mb-2 block print:inline-block">Donde Estudiar</span>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">Opciones para {career.nombre_mostrar}</h2>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 print:grid print:grid-cols-2 print:gap-2">
                    {career.universidades?.map((univ, idx) => (
                      <div key={idx} className="bg-white rounded-3xl print:rounded-lg p-6 sm:p-8 print:p-3 shadow-[0_8px_20px_rgba(0,0,0,0.03)] print:shadow-none border border-slate-100 print:border-slate-200 hover:shadow-[0_12px_30px_rgba(0,89,187,0.08)] hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row print:flex-col items-center print:items-start gap-6 md:gap-8 print:gap-2 relative overflow-hidden group break-inside-avoid">
                        
                        {univ.tipo === 'Privada' && (
                          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] print:text-[8px] font-black tracking-wider px-4 py-1.5 print:px-2 print:py-0.5 rounded-bl-xl flex items-center gap-1 shadow-sm z-10">
                            <span className="material-symbols-outlined text-[14px] print:text-[10px]">verified</span> PRIVADA
                          </div>
                        )}
                        
                        <div className="w-20 h-20 print:w-10 print:h-10 print:hidden bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-105 transition-transform duration-500 p-2 text-center">
                          <span className={`font-black text-xl tracking-tighter ${idx % 3 === 0 ? 'text-primary' : idx % 3 === 1 ? 'text-secondary' : 'text-tertiary-container'}`}>
                            {univ.nombre}
                          </span>
                        </div>
                        
                        <div className="flex-1 text-center md:text-left print:text-left w-full">
                          <h3 className="font-headline-md text-2xl print:text-sm text-on-surface font-extrabold mb-1">{univ.carrera_exacta || univ.nombre}</h3>
                          <div className="flex flex-wrap items-center justify-center md:justify-start print:justify-start gap-4 print:gap-2 text-sm print:text-[10px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5 print:gap-0.5"><span className="material-symbols-outlined text-[18px] print:text-[12px]">account_balance</span> {univ.tipo}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block print:hidden"></span>
                            <span className="flex items-center gap-1.5 print:gap-0.5 bg-slate-100 print:bg-transparent px-2 print:px-0 py-0.5 rounded text-slate-600"><span className="material-symbols-outlined text-[18px] print:text-[12px]">calendar_month</span> {univ.nombre} Trujillo</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:items-end print:items-start w-full md:w-auto print:w-full mt-4 md:mt-0 print:mt-1 pt-4 md:pt-0 print:pt-1 border-t md:border-t-0 print:border-t border-slate-100 shrink-0">
                          <div className="text-[11px] print:text-[8px] uppercase tracking-widest text-slate-400 font-bold mb-1 print:mb-0">Pensión Promedio</div>
                          <div className={`font-headline-xl text-3xl print:text-sm font-black tracking-tight ${univ.costo_promedio === 'S/ 0' ? 'text-secondary' : 'text-on-surface'}`}>
                            {univ.costo_promedio === 'S/ 0' ? 'Gratuita' : univ.costo_promedio}
                          </div>
                          <div className="text-xs print:text-[9px] text-slate-500 mt-1 print:mt-0">Matrícula: {univ.matricula}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-xl print:hidden">
            <div className="bg-white/90 backdrop-blur-[16px] border border-white/50 shadow-[0_12px_40px_rgba(0,123,255,0.06)] rounded-3xl p-8 sticky top-28">
              <div className="flex items-center gap-3 mb-8 border-b border-surface-variant pb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                </div>
                <h2 className="font-headline-md text-xl font-bold text-on-surface">Perfil de {data.estudiante || 'Aroni'}</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-center mb-2">
                  <div className="text-[10px] uppercase font-bold text-primary tracking-widest mb-1">Tu Código Holland</div>
                  <div className="text-4xl font-black tracking-widest text-primary">{data.codigo_holland || 'RIA'}</div>
                </div>
                
                {data.puntajes_riasec && Object.entries(data.puntajes_riasec)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([area, score], idx) => {
                    const colors = ['bg-primary', 'bg-secondary', 'bg-tertiary-container'];
                    const textColors = ['text-primary', 'text-secondary', 'text-tertiary-container'];
                    return (
                      <div key={area} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-label-md text-label-md text-on-surface">{area}</span>
                          <span className={`font-label-sm text-label-sm ${textColors[idx]} font-black`}>{score} pts</span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-2.5 shadow-inner">
                          <div className={`${colors[idx]} h-2.5 rounded-full`} style={{ width: `${(score / 50) * 100}%` }}></div>
                        </div>
                      </div>
                    );
                })}
                
                <div className="mt-4 pt-6 border-t border-surface-variant relative">
                  <span className="material-symbols-outlined absolute -top-3 left-4 text-surface-variant bg-white px-2">format_quote</span>
                  <p className="text-on-surface-variant italic text-[13px] leading-relaxed">
                    Tus respuestas al test revelan que tienes una fuerte inclinación natural hacia <strong>{mainCareer.nombre_mostrar}</strong>. 
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
            © 2026 Colegio San Marcelo. Formando líderes para el mañana. Una herramienta gratuita de orientación vocacional para nuestra comunidad educativa.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
