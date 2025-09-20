import React, { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';

export const AuthNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup'>('login');

  if (currentScreen === 'login') {
    return (
      <LoginScreen onNavigateToSignup={() => setCurrentScreen('signup')} />
    );
  }

  return (
    <SignupScreen onNavigateToLogin={() => setCurrentScreen('login')} />
  );
};