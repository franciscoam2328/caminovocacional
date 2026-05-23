import React from 'react';
import { motion } from 'framer-motion';

export default function LandingView({ onStart, onGoHome, onGoTest }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col min-h-screen"
    >
      {/* TopNavBar Shared Component */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 shadow-[0_10px_30px_rgba(0,123,255,0.08)] font-manrope antialiased">
        <div className="flex justify-between items-center px-8 h-20 max-w-[80rem] mx-auto">
          <a className="text-xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 active:scale-95 transform transition-transform duration-200" href="#!">
            Camino Vocacional
          </a>
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={onGoHome} className="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-1 font-semibold hover:text-blue-500 dark:hover:text-blue-300 transition-all duration-300">Inicio</button>
            <button onClick={onGoTest} className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-500 dark:hover:text-blue-300 transition-all duration-300">Test Vocacional</button>
          </div>
          <button onClick={onStart} className="bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md px-md py-sm rounded-full shadow-[0_4px_14px_rgba(0,112,234,0.39)] hover:shadow-[0_6px_20px_rgba(0,112,234,0.23)] active:scale-95 transform transition-all duration-200 hidden md:block">
            Comienza tu viaje
          </button>
          <button className="md:hidden text-primary">
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
                <span className="material-symbols-outlined text-sm" data-icon="explore">explore</span>
                <span>Descubrimiento Guiado</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                Usa el poder de tus datos para encontrar la carrera ideal en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Trujillo</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[32rem]">
                Combinamos algoritmos de precisión con la oferta real de las mejores universidades de la región para guiar tu futuro.
              </p>
              <div className="flex gap-sm mt-sm">
                <button onClick={onStart} className="bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md px-lg py-sm rounded-full shadow-[0_8px_30px_rgba(0,112,234,0.25)] hover:shadow-[0_8px_30px_rgba(0,112,234,0.4)] active:scale-95 transform transition-all duration-300">
                  Comienza tu viaje
                </button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter auto-rows-[250px]">
            {/* Bento Item 1: Descubre tu Potencial (2/3 width) */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,89,187,0.08)] hover:shadow-[0_8px_32px_rgba(0,89,187,0.15)] transition-all duration-500">
              <div className="absolute -right-8 -top-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-10 p-lg h-full flex flex-col md:flex-row items-center gap-md">
                <div className="flex-1">
                  <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-md">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-sm leading-tight">Descubre tu Potencial</h3>
                  <p className="font-body-md text-on-surface-variant leading-relaxed max-w-[24rem]">
                    Analizamos tus gustos y habilidades únicas para identificar los campos donde realmente destacarías.
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
                  <span className="material-symbols-outlined text-3xl">analytics</span>
                </div>
                <h3 className="font-headline-md text-[20px] font-bold text-on-surface mb-sm">Resultados y Alternativas</h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">Obtén tu carrera ideal y 2 opciones adicionales que encajan con tu perfil.</p>
                <span className="material-symbols-outlined text-[100px] text-secondary/5 absolute -bottom-4 -left-4 select-none pointer-events-none">query_stats</span>
              </div>
              <div className="absolute inset-0 border border-secondary/0 group-hover:border-secondary/20 rounded-[2rem] transition-colors duration-500 pointer-events-none"></div>
            </div>

            {/* Bento Item 3: Tu Plan (Full width) */}
            <div className="md:col-span-3 group relative overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,89,187,0.08)] hover:shadow-[0_8px_32px_rgba(0,89,187,0.15)] transition-all duration-500">
              <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
              <div className="relative z-10 p-lg flex flex-col md:flex-row items-center justify-between gap-xl">
                <div className="max-w-[36rem]">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-tertiary-container/10 text-tertiary mb-md border border-tertiary/10">
                    <span className="material-symbols-outlined text-xl">flag</span>
                    <span className="font-label-md">Ruta de Éxito</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-sm leading-tight">Universidades y Costos en Trujillo</h3>
                  <p className="font-body-md text-body-lg text-on-surface-variant leading-relaxed">Encuentra dónde estudiar tu carrera, con detalles de matrícula, pensiones y si la universidad es pública o privada.</p>
                </div>
                <div className="w-full md:w-[400px] aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-white/60 p-4 flex items-center justify-center relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0059bb_1px,transparent_1px)] [background-size:20px_20px]"></div>
                  <div className="relative z-10 bg-white/80 backdrop-blur px-6 py-3 rounded-full border border-white shadow-sm flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">map</span>
                    <span className="text-primary font-bold">Vista Previa del Mapa Interactivo</span>
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
            © 2026 Camino Vocacional Trujillo. Inspirado en nuestra herencia.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
