import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import {useAuth} from '../contexts/AuthContext';

export default function RootNavigation() {
  const {token, isLoading} = useAuth();

  if (isLoading) return null; // SplashScreen plus tard

  return (
    <NavigationContainer>
      {token ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
