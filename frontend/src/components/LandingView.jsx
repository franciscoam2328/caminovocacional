/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LandingView({ onStart, onGoHome, onGoTest }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col min-h-screen"
    >
      {/* TopNavBar Shared Component */}
      <nav className="fixed top-0 w-full z-50 bg-primary shadow-lg font-manrope antialiased h-[80px]">
        <div className="flex justify-between items-center px-8 h-full max-w-[80rem] mx-auto">
          <a className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white active:scale-95 transform transition-transform duration-200" href="#!">
            <img src="/insignia_san_marcelo.jpg" alt="Insignia San Marcelo" className="h-16 w-auto object-contain drop-shadow-lg" />
            Futuro Marcelino
          </a>
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={onGoHome} className="text-white border-b-2 border-white pb-1 font-semibold hover:text-white/80 transition-all duration-300">Inicio</button>
            <button onClick={onGoTest} className="text-white/80 font-medium hover:text-white transition-all duration-300">Test Vocacional</button>
          </div>
          <button onClick={onStart} className="bg-white text-primary font-bold px-md py-sm rounded-full shadow-md hover:shadow-lg active:scale-95 transform transition-all duration-200 hidden md:block">
            Iniciar Test Vocacional
          </button>
          <button className="md:hidden text-white">
            <span className="material-symbols-outlined" data-icon="menu">menu</span>
          </button>
        </div>
      </nav>

      <main className="w-full max-w-container-max mx-auto px-gutter relative pt-32 flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[819px] flex items-center justify-center pt-lg pb-xl">
          {/* Background Huaca Graphic */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center overflow-hidden">
            <img alt="Huaca Background" className="w-full h-full object-cover mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmBf9dr6aioJsU5RyB9Kl-fLzAlFMfBpIGM5UH4Q0tRg0aOo23w9546joouXKx1S2cSdvr2_AC0WvGirupkTnU2ZajrAVCgOAwzCmeI-bR6dyy2DnltP9xpOfXku5t1jBJtVBaTFcdvf6CtnmUDZl-DtZQOAgn49MJ_vjcv3FFHcB3dCBjBZNp5bbmNMgA_ftP4l-xkOuWYe4Cqtp_l6bc0wFLiggAlKA8_anO3sP5nj9JLFZ7G6BRV6L-2bO_A8Ky9Fb_Myg9" />
            <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-surface"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10 w-full items-center">
            <div className="md:col-span-5 flex flex-col items-start gap-md">
              <div className="inline-flex items-center gap-2 px-sm py-xs bg-primary-fixed rounded-full text-on-primary-fixed font-label-sm text-label-sm shadow-sm backdrop-blur-sm bg-opacity-70">
                <span className="text-sm">🏫</span>
                <span className="font-bold">Plataforma Oficial: Colegio San Marcelo</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                Usa el poder de tus datos para encontrar la carrera ideal en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Trujillo</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[32rem]">
                Una iniciativa tecnológica exclusiva del <strong>Colegio San Marcelo</strong>. Diseñada para guiar a nuestros estudiantes de secundaria hacia el éxito universitario utilizando análisis matemático de precisión.
              </p>
              <div className="flex flex-col items-start gap-3 mt-sm">
                <button onClick={onStart} className="bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md px-lg py-4 rounded-full shadow-[0_8px_30px_rgba(0,112,234,0.3)] hover:shadow-[0_8px_30px_rgba(0,112,234,0.5)] active:scale-95 transform transition-all duration-300 flex items-center gap-2 text-lg">
                  <span className="material-symbols-outlined text-xl">play_arrow</span>
                  Iniciar Test Vocacional
                </button>
                <p className="text-sm font-medium text-slate-500 ml-4 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">timer</span> Toma solo 5 minutos. No requiere registro.
                </p>
              </div>
            </div>
            <div className="md:col-span-7 flex justify-center items-center relative h-[500px]">
              <div className="absolute w-[120%] h-[120%] bg-primary-fixed-dim/20 rounded-full blur-[100px] -z-10"></div>
              <img alt="Estudiante en camino vocacional" className="w-full max-w-[600px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,89,187,0.15)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXKrGxGhyTGJfNXatsa2KG1mtXpK9gmro5AULj50yC9QDtnaPMmGtCfNwC6dk3j2BbOXD6xWZ-wRvha7BOPwXScccahUWTc9hqSpR7jqTq-c80wCbJ6JlS68y-sb9ZFFjw2PYJBfOjP0YyTNlrONEhbWAjf13mcNuiusJ2RKaAAwjQR-xybWBLEEwd11LISBUBgfuJ5Y97jl7mb5Wlh3XYSM1VzV0gnxyB17f7_SjoqBsDTiXmrpGVPaszJ3eYqQsl4d2ShDfH" />
            </div>
          </div>
        </section>

        {/* Bento Grid: How it Works */}
        <section className="py-xl">
          <div className="text-center mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">El proceso de decisión</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[42rem] mx-auto">
              Nuestro motor de recomendaciones utiliza múltiples variables para trazar un camino claro hacia tu educación superior.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter md:grid-rows-[250px_auto] auto-rows-auto">
            {/* Bento Item 1: Descubre tu Potencial (2/3 width) */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,89,187,0.08)] hover:shadow-[0_8px_32px_rgba(0,89,187,0.15)] transition-all duration-500">
              <div className="absolute -right-8 -top-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-10 p-lg h-full flex flex-col md:flex-row items-center gap-md">
                <div className="flex-1">
                  <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-md">
                    <span className="material-symbols-outlined text-3xl">quiz</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-sm leading-tight">1. Responde 60 preguntas</h3>
                  <p className="font-body-md text-on-surface-variant leading-relaxed max-w-[24rem]">
                    Evalúa qué actividades te gustaría hacer en el futuro utilizando el prestigioso método científico de Holland (RIASEC).
                  </p>
                </div>
                <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[120px] md:text-[180px] text-primary/5 absolute select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">psychology</span>
                </div>
              </div>
              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 rounded-[2rem] transition-colors duration-500 pointer-events-none"></div>
            </div>

            {/* Bento Item 2: Explora Carreras (1/3 width) */}
            <div className="md:col-span-1 group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,89,187,0.08)] hover:shadow-[0_8px_32px_rgba(0,89,187,0.15)] transition-all duration-500">
              <div className="relative z-10 p-lg h-full flex flex-col justify-center text-center items-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-md shadow-lg group-hover:rotate-6 transition-transform duration-500">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="font-headline-md text-[20px] font-bold text-on-surface mb-sm">2. Descubre tu perfil</h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">La IA calculará tu nivel de afinidad exacto con docenas de carreras profesionales.</p>
                <span className="material-symbols-outlined text-[100px] text-secondary/5 absolute -bottom-4 -left-4 select-none pointer-events-none">psychology</span>
              </div>
              <div className="absolute inset-0 border border-secondary/0 group-hover:border-secondary/20 rounded-[2rem] transition-colors duration-500 pointer-events-none"></div>
            </div>

            {/* Bento Item 3: Tu Plan (Full width) */}
            <div className="md:col-span-3 group relative overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,89,187,0.08)] hover:shadow-[0_8px_32px_rgba(0,89,187,0.15)] transition-all duration-500">
              <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="relative z-10 p-lg flex flex-col md:flex-row items-center justify-between gap-xl">
                <div className="max-w-[36rem]">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary mb-md border border-primary/10">
                    <span className="material-symbols-outlined text-xl">school</span>
                    <span className="font-label-md">Oferta Local</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-sm leading-tight">3. Encuentra tu Universidad</h3>
                  <p className="font-body-md text-body-lg text-on-surface-variant leading-relaxed">Te mostraremos exactamente en qué universidades o institutos de la ciudad de <strong>Trujillo</strong> puedes estudiar tus mejores opciones. Información real y procesable al instante.</p>
                </div>
                <div className="w-full md:w-[400px] aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/60 p-4 flex items-center justify-center relative overflow-hidden shadow-inner cursor-pointer group/btn" onClick={() => setIsModalOpen(true)}>
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:20px_20px]"></div>
                  
                  {/* Hexagon Graphic Hint */}
                  <span className="material-symbols-outlined text-[150px] absolute opacity-10 text-primary group-hover/btn:scale-110 transition-transform duration-500">hexagon</span>

                  <div className="relative z-10 bg-white/90 backdrop-blur px-8 py-4 rounded-full border border-white shadow-[0_8px_20px_rgba(37,99,235,0.15)] flex items-center gap-3 group-hover/btn:-translate-y-1 transition-all duration-300">
                    <span className="material-symbols-outlined text-primary text-2xl">info</span>
                    <span className="text-primary font-bold text-lg">Conoce el método</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/10 rounded-[2rem] transition-colors duration-500 pointer-events-none"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Shared Component */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 border-t border-slate-200 dark:border-slate-800 font-manrope text-sm mt-xl">
        <div className="max-w-[80rem] mx-auto px-8 flex justify-between items-center">
          <div className="text-on-surface-variant font-medium">
            © 2026 Colegio San Marcelo. Formando líderes para el mañana. Una herramienta gratuita de orientación vocacional para nuestra comunidad educativa.
          </div>
        </div>
      </footer>

      {/* Holland Info Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Modelo Científico</div>
                <h3 className="text-2xl font-black text-slate-800">El Método RIASEC (O*NET)</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 sm:p-8 flex flex-col gap-8">
              <p className="text-slate-600 text-lg leading-relaxed">
                Nuestra plataforma no elige carreras al azar. Utilizamos la teoría de intereses vocacionales de John Holland integrada con la base de datos <strong>O*NET</strong>. Calculamos tu perfil mediante el algoritmo de <strong>K-Vecinos Más Cercanos (KNN)</strong> para medir la distancia matemática exacta entre tu personalidad y tu carrera ideal.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined font-bold">build</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">R - Realista</h4>
                    <p className="text-sm text-slate-500 mt-1">Trabajo práctico, maquinaria, herramientas, aire libre.</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined font-bold">biotech</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">I - Investigador</h4>
                    <p className="text-sm text-slate-500 mt-1">Ciencias, análisis, resolución de problemas complejos.</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined font-bold">palette</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">A - Artístico</h4>
                    <p className="text-sm text-slate-500 mt-1">Creatividad, diseño, originalidad, expresión libre.</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined font-bold">volunteer_activism</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">S - Social</h4>
                    <p className="text-sm text-slate-500 mt-1">Ayudar, enseñar, curar, orientar a otras personas.</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined font-bold">trending_up</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">E - Emprendedor</h4>
                    <p className="text-sm text-slate-500 mt-1">Liderazgo, persuasión, negocios, influencia.</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined font-bold">rule</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">C - Convencional</h4>
                    <p className="text-sm text-slate-500 mt-1">Organización, datos, rutinas, atención al detalle.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center">
                <p className="text-primary font-medium text-sm">
                  Al completar el test, obtendrás tu Código Holland de 3 letras (tus 3 perfiles dominantes) para encontrar tu carrera 100% afín.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
