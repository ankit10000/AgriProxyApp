import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LocalizationProvider, useLocalization } from './context/LocalizationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LanguageSelectionScreen } from './screens/LanguageSelection/LanguageSelectionScreen';
import { AuthNavigator } from './screens/Auth/AuthNavigator';
import AppNavigator from './navigation/AppNavigator';
import { theme } from './styles/theme';

const AppContent: React.FC = () => {
  const { isLanguageSelected } = useLocalization();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isLanguageSelected) {
    return <LanguageSelectionScreen onLanguageSelected={() => {}} />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return <AppNavigator />;
};

export const MainApp: React.FC = () => {
  return (
    <LocalizationProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});