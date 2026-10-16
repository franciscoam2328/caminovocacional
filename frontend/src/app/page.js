"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TestForm from '@/components/TestForm';
import ResultDisplay from '@/components/ResultDisplay';
import LandingView from '@/components/LandingView';
import UserInfoView from '@/components/UserInfoView';
import AvatarSelectView from '@/components/AvatarSelectView';
import TutorialView from '@/components/TutorialView';
import AdminLoginView from '@/components/AdminLoginView';
import AdminDashboardView from '@/components/AdminDashboardView';
import AccessibilityWidget from '@/components/AccessibilityWidget';

export default function Home() {
  // Estados de la SPA
  const [currentView, setCurrentView] = useState('LANDING'); // LANDING, USER_INFO, AVATAR_SELECT, TUTORIAL, TEST, RESULTS, ADMIN_LOGIN, ADMIN_DASHBOARD
  const [studentUser, setStudentUser] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [resultsData, setResultsData] = useState(null);

  // Restaurar sesión de Administrador al recargar la página (F5)
  useEffect(() => {
    try {
      const isAdminLogged = localStorage.getItem('camino_vocacional_admin_logged') === 'true';
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (isAdminLogged || hash === '#admin' || hash === '#!admin') {
        setCurrentView('ADMIN_DASHBOARD');
      }
    } catch (e) {
      console.warn("No se pudo verificar la sesión de administrador:", e);
    }
  }, []);

  // Funciones de navegación
  const goToUserInfo = () => setCurrentView('USER_INFO');
  
  const handleStudentLoginSuccess = (user) => {
    setStudentUser(user);
    setStudentName(user.nombre_completo || user.codigo_estudiante);
    setCurrentView('AVATAR_SELECT');
  };

  const selectAvatarAndStart = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setCurrentView('TUTORIAL');
  };

  const startTest = () => {
    setCurrentView('TEST');
  };

  const handleTestComplete = (data) => {
    setResultsData(data);
    setCurrentView('RESULTS');
  };

  const restartTest = () => {
    setStudentUser(null);
    setStudentName('');
    setAvatar('');
    setResultsData(null);
    setCurrentView('LANDING');
  };

  const goToAdminLogin = () => setCurrentView('ADMIN_LOGIN');
  
  const handleAdminLoginSuccess = () => {
    try {
      localStorage.setItem('camino_vocacional_admin_logged', 'true');
      if (typeof window !== 'undefined') {
        window.location.hash = 'admin';
      }
    } catch (e) {}
    setCurrentView('ADMIN_DASHBOARD');
  };

  const logoutAdmin = () => {
    try {
      localStorage.removeItem('camino_vocacional_admin_logged');
      if (typeof window !== 'undefined' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch (e) {}
    setCurrentView('LANDING');
  };

  return (
    <>
      {/* Menú de Accesibilidad Universal Flotante (WCAG 2.1 - Atajo CTRL + U) */}
      <AccessibilityWidget />

      <AnimatePresence mode="wait">
        {currentView === 'LANDING' && (
          <LandingView 
            key="landing" 
            onStart={goToUserInfo} 
            onGoHome={restartTest} 
            onGoTest={goToUserInfo} 
            onGoAdmin={goToAdminLogin} 
          />
        )}

        {currentView === 'USER_INFO' && (
          <UserInfoView 
            key="userinfo" 
            onLoginSuccess={handleStudentLoginSuccess}
            onGoHome={restartTest}
            onGoTest={goToUserInfo}
          />
        )}

        {currentView === 'AVATAR_SELECT' && (
          <AvatarSelectView 
            key="avatar" 
            studentName={studentName} 
            onSelect={selectAvatarAndStart} 
            onGoHome={restartTest}
            onGoTest={goToUserInfo}
          />
        )}

        {currentView === 'TUTORIAL' && (
          <TutorialView 
            key="tutorial" 
            studentName={studentName} 
            avatar={avatar} 
            onStartTest={startTest} 
            onGoHome={restartTest}
          />
        )}

        {currentView === 'TEST' && (
          <TestForm 
            key="test" 
            studentName={studentName} 
            studentCode={studentUser?.codigo_estudiante}
            avatar={avatar} 
            onComplete={handleTestComplete} 
            onGoHome={restartTest} 
            onGoTest={goToUserInfo} 
          />
        )}

        {currentView === 'RESULTS' && (
          <ResultDisplay 
            key="results" 
            data={resultsData} 
            avatar={avatar} 
            onRestart={restartTest} 
            onGoHome={restartTest} 
            onGoTest={goToUserInfo} 
          />
        )}

        {currentView === 'ADMIN_LOGIN' && (
          <AdminLoginView 
            key="adminlogin" 
            onLoginSuccess={handleAdminLoginSuccess} 
            onGoHome={restartTest} 
          />
        )}

        {currentView === 'ADMIN_DASHBOARD' && (
          <AdminDashboardView 
            key="admindashboard" 
            onLogout={logoutAdmin} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
