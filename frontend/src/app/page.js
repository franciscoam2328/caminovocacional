"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TestForm from '@/components/TestForm';
import ResultDisplay from '@/components/ResultDisplay';
import LandingView from '@/components/LandingView';
import UserInfoView from '@/components/UserInfoView';
import AvatarSelectView from '@/components/AvatarSelectView';
import TutorialView from '@/components/TutorialView';
import AdminLoginView from '@/components/AdminLoginView';
import AdminDashboardView from '@/components/AdminDashboardView';

export default function Home() {
  // Estados de la SPA
  const [currentView, setCurrentView] = useState('LANDING'); // LANDING, USER_INFO, AVATAR_SELECT, TUTORIAL, TEST, RESULTS
  const [studentName, setStudentName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [resultsData, setResultsData] = useState(null);

  // Funciones de navegación
  const goToUserInfo = () => setCurrentView('USER_INFO');
  
  const handleNameSubmit = () => {
    if (studentName.trim().length > 1) {
      setCurrentView('AVATAR_SELECT');
    }
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
    setStudentName('');
    setAvatar('');
    setResultsData(null);
    setCurrentView('LANDING');
  };

  const goToAdminLogin = () => setCurrentView('ADMIN_LOGIN');
  const handleAdminLoginSuccess = () => setCurrentView('ADMIN_DASHBOARD');
  const logoutAdmin = () => setCurrentView('LANDING');

  return (
    <>
      <AnimatePresence mode="wait">
        {currentView === 'LANDING' && (
          <LandingView key="landing" onStart={goToUserInfo} onGoHome={restartTest} onGoTest={goToUserInfo} onGoAdmin={goToAdminLogin} />
        )}

        {currentView === 'USER_INFO' && (
          <UserInfoView 
            key="userinfo" 
            studentName={studentName} 
            setStudentName={setStudentName} 
            onSubmit={handleNameSubmit} 
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
          <TestForm key="test" studentName={studentName} avatar={avatar} onComplete={handleTestComplete} onGoHome={restartTest} onGoTest={goToUserInfo} />
        )}

        {currentView === 'RESULTS' && (
          <ResultDisplay key="results" data={resultsData} avatar={avatar} onRestart={restartTest} onGoHome={restartTest} onGoTest={goToUserInfo} />
        )}

        {currentView === 'ADMIN_LOGIN' && (
          <AdminLoginView key="adminlogin" onLoginSuccess={handleAdminLoginSuccess} onGoHome={restartTest} />
        )}

        {currentView === 'ADMIN_DASHBOARD' && (
          <AdminDashboardView key="admindashboard" onLogout={logoutAdmin} />
        )}
      </AnimatePresence>
    </>
  );
}
