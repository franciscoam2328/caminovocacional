/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { QUESTIONS } from "../core/questions";
import { predictVocationalCluster } from "../infrastructure/api";

export default function TestForm({ studentName, avatar, onComplete, onGoHome, onGoTest }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
  
  // Calculate evolution stage (0 to 2)
  const stage = Math.min(2, Math.floor(currentQuestionIndex / 20));
  
  const getAvatarUrl = (gender, stage) => {
    const prefix = gender === "femenino" ? "girl" : "boy";
    const stageSuffix = stage === 0 ? "school" : stage === 1 ? "university" : "graduate";
    return `/avatars/${prefix}_${stageSuffix}.png`;
  };
  
  const avatarUrl = getAvatarUrl(avatar, stage);

  const handleOptionClick = (val) => {
    if (isSubmitting) return;
    
    setSelectedOption(val);

    const newResponses = [...responses, val];
    
    setTimeout(async () => {
      setResponses(newResponses);
      setSelectedOption(null); // Reset para la siguiente pregunta

      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Fin del test
        setIsSubmitting(true);
        setError(null);
        try {
          const resultData = await predictVocationalCluster(studentName, newResponses);
          onComplete(resultData);
        } catch (err) {
          console.error(err);
          setError("Ocurrió un problema de conexión con el servidor. Por favor, intenta de nuevo.");
          setIsSubmitting(false);
          // Revertir para permitir intentar de nuevo
          setResponses(responses);
        }
      }
    }, 350); // Delay visual de 350ms para ver el botón iluminarse
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-surface-bright text-on-surface font-body-md text-body-md min-h-screen flex flex-col antialiased relative w-full"
    >
      {/* TopAppBar */}
      <header className="fixed w-full top-0 z-50 bg-primary shadow-lg h-[80px] flex items-center">
        <div className="flex justify-between items-center px-8 h-20 max-w-[80rem] mx-auto w-full font-manrope antialiased">
          <div className="flex items-center gap-12 w-full">
            <div className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white font-manrope">
              <img src="/insignia_san_marcelo.jpg" alt="Insignia San Marcelo" className="h-16 w-auto object-contain drop-shadow-lg" />
              Futuro Marcelino
            </div>
            <nav className="flex flex-1 items-center justify-center gap-12 font-manrope mr-32">
              <button onClick={onGoHome} className="text-white/80 font-medium text-[15px] hover:text-white transition-colors">Inicio</button>
              <div className="relative py-2">
                <button onClick={onGoTest} className="text-white font-medium text-[15px] pb-2 border-b-2 border-white">Test Vocacional</button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content: Test Journey */}
      <main className="flex-1 w-full max-w-container-max mx-auto px-gutter py-xl relative">
        {/* Background decorative elements for the "Web 3.0" feel */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed-dim blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-secondary-fixed blur-[80px]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg min-h-[600px] items-center">
          
          {/* Left Side: 2.5D Journey Path & Avatar */}
          <div className="w-full h-full min-h-[400px] lg:min-h-[600px] rounded-xl overflow-hidden relative shadow-[0_4px_20px_rgba(0,123,255,0.08)] bg-white border border-white/50">
            <motion.img 
              key={avatarUrl}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 0.9, 
                scale: selectedOption !== null ? [1, 1.05, 1] : 1,
                y: selectedOption !== null ? 0 : [0, -10, 0]
              }}
              transition={{ 
                opacity: { duration: 0.5 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 }
              }}
              alt="Avatar de estudiante en el camino vocacional" 
              className="absolute inset-0 w-full h-full object-cover object-center p-8 lg:p-12 mix-blend-multiply" 
              src={avatarUrl} 
            />
            {/* Overlay Gradient to blend with background */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-bright/80 via-transparent to-transparent"></div>
          </div>

          {/* Right Side: Question Card */}
          <div className="flex flex-col justify-center">
            
            {error && (
              <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-sm underline">Cerrar</button>
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-[16px] border border-white/60 p-lg rounded-xl shadow-[0_4px_20px_rgba(0,123,255,0.08)] flex flex-col gap-lg relative overflow-hidden min-h-[450px]">
              
              {isSubmitting ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse">
                   <span className="material-symbols-outlined text-6xl text-primary animate-spin">autorenew</span>
                   <h2 className="font-headline-md text-headline-md text-on-surface text-center">Analizando tus respuestas...</h2>
                </div>
              ) : (
                <>
                  {/* Decorative subtle accent line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                  
                  {/* Progress Area */}
                  <div className="flex flex-col gap-xs">
                    <div className="flex justify-between items-center text-label-sm font-label-sm text-outline-variant">
                      <span className="uppercase tracking-widest text-outline">Pregunta {currentQuestionIndex + 1} de {totalQuestions}</span>
                      <span className="text-primary font-semibold">{Math.round(progressPercentage)}% completado</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="mt-md flex-1 flex flex-col justify-center gap-4">
                    <p className="text-primary/80 italic font-medium text-lg">
                      ¿Qué tanto te gustaría hacer esta actividad en tu futuro profesional?
                    </p>
                    <h2 className="font-headline-md text-headline-md text-on-surface leading-snug">
                      {currentQuestion.text}
                    </h2>
                  </div>

                  {/* Likert Scale */}
                  <div className="mt-lg flex flex-col gap-sm w-full">
                    <div className="flex justify-between items-center w-full max-w-[24rem] mx-auto relative">
                      {/* Connecting line behind buttons */}
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest -translate-y-1/2 -z-10"></div>
                      
                      {/* Rating Buttons */}
                      {[1, 2, 3, 4, 5].map((val) => {
                        const isActive = selectedOption === val;
                        return (
                          <button 
                            key={val}
                            onClick={() => handleOptionClick(val)}
                            disabled={selectedOption !== null} // Deshabilitar botones mientras hace la transición
                            className={`rounded-full flex items-center justify-center transition-all duration-200 ${
                              isActive 
                                ? "w-14 h-14 bg-primary border-2 border-primary font-headline-md text-headline-md text-on-primary shadow-[0_4px_12px_rgba(0,123,255,0.3)] transform scale-110" 
                                : "w-12 h-12 bg-surface-container-lowest border-2 border-outline-variant font-body-lg text-body-lg text-outline hover:border-primary hover:text-primary hover:bg-primary-fixed"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Labels */}
                    <div className="flex justify-between w-full text-label-sm font-label-sm mt-sm px-2">
                      <span className="max-w-[80px] text-center leading-tight text-red-500 font-medium">Lo detesto</span>
                      <span className="max-w-[80px] text-center leading-tight text-green-600 font-medium">Me encantaría</span>
                    </div>
                  </div>

                  {/* Action Button was removed for auto-advance */}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white w-full mt-auto border-t border-gray-100">
        <div className="px-8 py-10 max-w-[80rem] mx-auto flex justify-start items-center">
          <div className="flex flex-col items-start gap-2">
            <p className="font-manrope text-[14px] text-[#4b5563] text-left">© 2026 Colegio San Marcelo. Formando líderes para el mañana. Una herramienta gratuita de orientación vocacional para nuestra comunidad educativa.</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
