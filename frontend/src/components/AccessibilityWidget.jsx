"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultSettings = {
  highContrast: false,
  highlightLinks: false,
  textSize: 0, // 0 = normal, 1 = 112%, 2 = 125%, 3 = 138%
  textSpacing: false,
  stopAnimations: false,
  hideImages: false,
  dyslexia: false,
  largeCursor: false,
  lineHeight: false,
  textAlign: false,
  colorMode: 0, // 0 = normal, 1 = monocromo, 2 = alta saturacion, 3 = protanopia, 4 = deuteranopia, 5 = tritanopia, 6 = sepia
  screenReader: false,
  readingGuide: false,
};

function applySettingsToDOM(newSettings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  
  // 1. Alto Contraste
  root.classList.toggle('a11y-high-contrast', !!newSettings.highContrast);
  // 2. Resaltar Enlaces
  root.classList.toggle('a11y-highlight-links', !!newSettings.highlightLinks);
  // 3. Tamaño de Texto
  root.classList.remove('a11y-text-scale-1', 'a11y-text-scale-2', 'a11y-text-scale-3');
  if (newSettings.textSize === 1) root.classList.add('a11y-text-scale-1');
  if (newSettings.textSize === 2) root.classList.add('a11y-text-scale-2');
  if (newSettings.textSize === 3) root.classList.add('a11y-text-scale-3');
  // 4. Espaciado de Texto
  root.classList.toggle('a11y-text-spacing', !!newSettings.textSpacing);
  // 5. Detener Animaciones
  root.classList.toggle('a11y-stop-animations', !!newSettings.stopAnimations);
  // 6. Ocultar Imágenes
  root.classList.toggle('a11y-hide-images', !!newSettings.hideImages);
  // 7. Apto para Dislexia
  root.classList.toggle('a11y-dyslexia', !!newSettings.dyslexia);
  // 8. Cursor Grande
  root.classList.toggle('a11y-large-cursor', !!newSettings.largeCursor);
  // 9. Altura de Línea
  root.classList.toggle('a11y-line-height', !!newSettings.lineHeight);
  // 10. Texto Alineado
  root.classList.toggle('a11y-text-align', !!newSettings.textAlign);
  // 11. Modos de Color y Daltonismo
  root.classList.remove(
    'a11y-monochrome', 
    'a11y-high-saturation', 
    'a11y-protanopia', 
    'a11y-deuteranopia', 
    'a11y-tritanopia', 
    'a11y-sepia'
  );
  const mode = newSettings.colorMode ?? (newSettings.saturation || 0);
  if (mode === 1) root.classList.add('a11y-monochrome');
  if (mode === 2) root.classList.add('a11y-high-saturation');
  if (mode === 3) root.classList.add('a11y-protanopia');
  if (mode === 4) root.classList.add('a11y-deuteranopia');
  if (mode === 5) root.classList.add('a11y-tritanopia');
  if (mode === 6) root.classList.add('a11y-sepia');
}

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [largeWidget, setLargeWidget] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [rulerY, setRulerY] = useState(200);

  // Estados de accesibilidad
  const [settings, setSettings] = useState(defaultSettings);

  // Cargar preferencias guardadas
  useEffect(() => {
    try {
      const saved = localStorage.getItem('camino_vocacional_a11y');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettingsToDOM(parsed);
      }
    } catch (e) {
      console.warn("No se pudieron cargar preferencias de accesibilidad", e);
    }
  }, []);

  // Escuchar atajo de teclado CTRL + U
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Efecto para Guía de Lectura (Regla Horizontal)
  useEffect(() => {
    if (!settings.readingGuide) return;
    const handleMouseMove = (e) => {
      setRulerY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.readingGuide]);

  // Efecto para Lector de Pantalla por Voz (TTS Nativo en Español)
  useEffect(() => {
    if (!settings.screenReader) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const speak = (text) => {
      if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-PE';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    };

    speak("Lector de voz activado. Haz clic sobre cualquier pregunta o texto de la pantalla para escuchar.");

    const handleClickToSpeak = (e) => {
      if (e.target.closest('#a11y-widget-panel') || e.target.closest('.a11y-keep')) {
        return;
      }
      const target = e.target;
      const text = target.innerText || target.getAttribute('aria-label') || target.getAttribute('title') || target.alt;
      if (text && text.trim().length > 0) {
        speak(text.trim());
      }
    };

    document.addEventListener('click', handleClickToSpeak, true);
    return () => {
      document.removeEventListener('click', handleClickToSpeak, true);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [settings.screenReader]);

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    applySettingsToDOM(updated);
    try {
      localStorage.setItem('camino_vocacional_a11y', JSON.stringify(updated));
    } catch (e) {}
  };

  const resetAll = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    const reset = {
      highContrast: false,
      highlightLinks: false,
      textSize: 0,
      textSpacing: false,
      stopAnimations: false,
      hideImages: false,
      dyslexia: false,
      largeCursor: false,
      lineHeight: false,
      textAlign: false,
      colorMode: 0,
      screenReader: false,
      readingGuide: false,
    };
    setSettings(reset);
    applySettingsToDOM(reset);
    try {
      localStorage.removeItem('camino_vocacional_a11y');
    } catch (e) {}
  };

  return (
    <>
      {/* Guía de Lectura (Regla Horizontal) */}
      {settings.readingGuide && (
        <div 
          className="a11y-reading-ruler" 
          style={{ top: `${rulerY}px` }} 
          aria-hidden="true" 
        />
      )}

      {/* Botón Flotante de Acceso Rápido */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir Menú de Accesibilidad (Atajo Ctrl+U)"
          title="Menú de Accesibilidad (Ctrl + U)"
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 border-2 border-white"
        >
          <span className="material-symbols-outlined text-3xl a11y-keep">accessibility_new</span>
        </button>
      </div>

      {/* Panel Desplegable Lateral estilo UserWay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="a11y-widget-panel"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-3 sm:top-4 right-3 sm:right-4 bottom-3 sm:bottom-4 bg-white rounded-3xl shadow-2xl border border-slate-200 z-[10000] flex flex-col overflow-hidden w-[calc(100vw-1.5rem)] max-w-[360px] sm:max-w-none ${
              largeWidget ? 'sm:w-[440px]' : 'sm:w-[360px]'
            }`}
          >
            {/* Header Azul */}
            <div className="bg-blue-600 text-white p-5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-2xl a11y-keep">accessibility_new</span>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">Menú De Accesibilidad</h3>
                  <span className="text-[11px] text-blue-100 font-semibold">(CTRL + U)</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Cerrar panel de accesibilidad"
              >
                <span className="material-symbols-outlined text-lg a11y-keep">close</span>
              </button>
            </div>

            {/* Sub-header con Información y Toggle de tamaño */}
            <div className="bg-blue-50 px-5 py-3 border-b border-blue-100 flex items-center justify-between">
              <button
                onClick={() => setShowInfoModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-full transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-sm a11y-keep">play_arrow</span>
                Guía de Accesibilidad
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Widget grande</span>
                <button
                  onClick={() => setLargeWidget(!largeWidget)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${largeWidget ? 'bg-blue-600' : 'bg-slate-300'}`}
                  aria-label="Alternar tamaño de widget"
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${largeWidget ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Cuadrícula de Opciones */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 gap-3 bg-slate-50/50">
              {/* 1. Contraste + */}
              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.highContrast
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">contrast</span>
                <span className="text-xs font-extrabold leading-tight">Contraste +</span>
                {settings.highContrast && <span className="text-[10px] font-bold text-blue-100 mt-1">Activo</span>}
              </button>

              {/* 2. Resaltar Enlaces */}
              <button
                onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.highlightLinks
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">link</span>
                <span className="text-xs font-extrabold leading-tight">Resaltar enlaces</span>
                {settings.highlightLinks && <span className="text-[10px] font-bold text-blue-100 mt-1">Activo</span>}
              </button>

              {/* 3. Agrandar Texto (Cíclico: 0, 1, 2, 3) */}
              <button
                onClick={() => updateSetting('textSize', (settings.textSize + 1) % 4)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.textSize > 0
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">format_size</span>
                <span className="text-xs font-extrabold leading-tight">Agrandar texto</span>
                <span className={`text-[10px] font-bold mt-1 ${settings.textSize > 0 ? 'text-blue-100' : 'text-slate-400'}`}>
                  {settings.textSize === 0 ? 'Normal' : `+${settings.textSize * 12}%`}
                </span>
              </button>

              {/* 4. Espaciado de Texto */}
              <button
                onClick={() => updateSetting('textSpacing', !settings.textSpacing)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.textSpacing
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">space_bar</span>
                <span className="text-xs font-extrabold leading-tight">Espaciado de texto</span>
                {settings.textSpacing && <span className="text-[10px] font-bold text-blue-100 mt-1">Activo</span>}
              </button>

              {/* 5. Detener Animaciones */}
              <button
                onClick={() => updateSetting('stopAnimations', !settings.stopAnimations)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.stopAnimations
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">motion_photos_off</span>
                <span className="text-xs font-extrabold leading-tight">Detener animaciones</span>
                {settings.stopAnimations && <span className="text-[10px] font-bold text-blue-100 mt-1">Activo</span>}
              </button>

              {/* 6. Ocultar Imágenes */}
              <button
                onClick={() => updateSetting('hideImages', !settings.hideImages)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.hideImages
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">hide_image</span>
                <span className="text-xs font-extrabold leading-tight">Ocultar Imágenes</span>
                {settings.hideImages && <span className="text-[10px] font-bold text-blue-100 mt-1">Activo</span>}
              </button>

              {/* 7. Apto para Dislexia */}
              <button
                onClick={() => updateSetting('dyslexia', !settings.dyslexia)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.dyslexia
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="text-2xl font-black mb-1 font-serif a11y-keep tracking-widest">Df</span>
                <span className="text-xs font-extrabold leading-tight">Apto para dislexia</span>
                {settings.dyslexia && <span className="text-[10px] font-bold text-blue-100 mt-1">Activo (Lexend)</span>}
              </button>

              {/* 8. Cursor Grande */}
              <button
                onClick={() => updateSetting('largeCursor', !settings.largeCursor)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.largeCursor
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">near_me</span>
                <span className="text-xs font-extrabold leading-tight">Cursor Grande</span>
                {settings.largeCursor && <span className="text-[10px] font-bold text-blue-100 mt-1">Activo</span>}
              </button>

              {/* 9. Altura de Línea */}
              <button
                onClick={() => updateSetting('lineHeight', !settings.lineHeight)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.lineHeight
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">format_line_spacing</span>
                <span className="text-xs font-extrabold leading-tight">Altura de la línea</span>
                {settings.lineHeight && <span className="text-[10px] font-bold text-blue-100 mt-1">Activo (2.1x)</span>}
              </button>

              {/* 10. Texto Alineado */}
              <button
                onClick={() => updateSetting('textAlign', !settings.textAlign)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.textAlign
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">format_align_left</span>
                <span className="text-xs font-extrabold leading-tight">Texto alineado</span>
                {settings.textAlign && <span className="text-[10px] font-bold text-blue-100 mt-1">Izquierda</span>}
              </button>

              {/* 11. Paleta de Colores y Daltonismo */}
              <button
                onClick={() => updateSetting('colorMode', (settings.colorMode + 1) % 7)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.colorMode > 0
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">palette</span>
                <span className="text-xs font-extrabold leading-tight">Paleta / Daltonismo</span>
                <span className={`text-[10px] font-bold mt-1 ${settings.colorMode > 0 ? 'text-blue-100' : 'text-slate-400'}`}>
                  {settings.colorMode === 0 && 'Normal'}
                  {settings.colorMode === 1 && 'Monocromo'}
                  {settings.colorMode === 2 && 'Alta Saturación'}
                  {settings.colorMode === 3 && 'Protanopía (Rojo)'}
                  {settings.colorMode === 4 && 'Deuteranopía (Verde)'}
                  {settings.colorMode === 5 && 'Tritanopía (Azul)'}
                  {settings.colorMode === 6 && 'Modo Sepia'}
                </span>
              </button>

              {/* 12. Lector de Pantalla por Voz (TTS) */}
              <button
                onClick={() => updateSetting('screenReader', !settings.screenReader)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.screenReader
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">record_voice_over</span>
                <span className="text-xs font-extrabold leading-tight">Lector de Voz (TTS)</span>
                {settings.screenReader ? (
                  <span className="text-[10px] font-bold text-blue-100 mt-1 animate-pulse">Voz Activa</span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 mt-1">Desactivado</span>
                )}
              </button>

              {/* 13. Guía de Lectura (Regla Horizontal) */}
              <button
                onClick={() => updateSetting('readingGuide', !settings.readingGuide)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  settings.readingGuide
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep">view_day</span>
                <span className="text-xs font-extrabold leading-tight">Guía de Lectura</span>
                {settings.readingGuide ? (
                  <span className="text-[10px] font-bold text-blue-100 mt-1">Regla Activa</span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 mt-1">Desactivado</span>
                )}
              </button>

              {/* 14. Información del Sistema */}
              <button
                onClick={() => setShowInfoModal(true)}
                className="p-3.5 rounded-2xl border bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 flex flex-col items-center justify-center text-center transition-all"
              >
                <span className="material-symbols-outlined text-3xl mb-1.5 a11y-keep text-blue-600">info</span>
                <span className="text-xs font-extrabold leading-tight">Información WCAG</span>
                <span className="text-[10px] font-bold text-slate-400 mt-1">Guía</span>
              </button>
            </div>

            {/* Footer con Botón Restablecer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={resetAll}
                className="text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 px-4 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm a11y-keep">restart_alt</span>
                Restablecer Todo
              </button>

              <span className="text-[11px] font-semibold text-slate-400">
                WCAG 2.1 AA Compliant
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Información y Guía */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 my-auto relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-blue-600 font-extrabold text-lg">
                  <span className="material-symbols-outlined a11y-keep">verified_user</span>
                  Accesibilidad Universal
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                >
                  <span className="material-symbols-outlined text-sm a11y-keep">close</span>
                </button>
              </div>

              <div className="py-4 space-y-3 text-slate-600 text-sm">
                <p>
                  Esta plataforma incorpora directrices de accesibilidad web (<strong>WCAG 2.1 Nivel AA</strong>) para garantizar la igualdad de oportunidades y la inclusión educativa:
                </p>
                <ul className="space-y-2 text-xs text-slate-700 list-disc pl-5">
                  <li><strong>Lector de Pantalla (Voz TTS):</strong> Síntesis de voz nativa en español para estudiantes con discapacidad visual severa o ceguera parcial.</li>
                  <li><strong>Filtros de Daltonismo:</strong> Paletas calibradas para Protanopía (rojo), Deuteranopía (verde), Tritanopía (azul/amarillo) y Modo Sepia de descanso visual.</li>
                  <li><strong>Guía de Lectura:</strong> Regla horizontal interactiva que sigue al cursor para evitar la fatiga visual y el salto de líneas en dislexia o TDAH.</li>
                  <li><strong>Apto para Dislexia:</strong> Implementa la tipografía de alta legibilidad <em>Lexend</em> con espaciado optimizado.</li>
                  <li><strong>Cognitivo y Motor:</strong> Pausa de animaciones para prevenir sobrecarga sensorial.</li>
                  <li><strong>Atajo rápido:</strong> Presiona <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 font-mono font-bold">CTRL + U</kbd> en cualquier pantalla para abrir este menú.</li>
                </ul>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
