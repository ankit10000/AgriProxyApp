import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useLocalization, Language } from '../../context/LocalizationContext';
import { theme } from '../../styles/theme';

interface LanguageSelectionScreenProps {
  onLanguageSelected: () => void;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onLanguageSelected,
}) => {
  const { setLanguage, t } = useLocalization();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    onLanguageSelected();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/Iconondark.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('languageSelection.title')}</Text>
          <Text style={styles.subtitle}>{t('languageSelection.subtitle')}</Text>
        </View>

        {/* Language Options */}
        <View style={styles.languageContainer}>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => handleLanguageSelect('english')}
          >
            <View style={styles.languageContent}>
              <Text style={styles.languageFlag}>🇺🇸</Text>
              <Text style={styles.languageText}>{t('languageSelection.english')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => handleLanguageSelect('hindi')}
          >
            <View style={styles.languageContent}>
              <Text style={styles.languageFlag}>🇮🇳</Text>
              <Text style={styles.languageText}>{t('languageSelection.hindi')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            AgriProxy - Your Farming Assistant
          </Text>
          <Text style={styles.footerTextHindi}>
            एग्रीप्रॉक्सी - आपका कृषि सहायक
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 2,
  },
  logo: {
    height: 120,
    width: 200,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 2,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  titleHindi: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitleHindi: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  languageContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl * 2,
  },
  languageButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageFlag: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  languageText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  footerTextHindi: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});