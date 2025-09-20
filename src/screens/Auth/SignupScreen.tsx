import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useLocalization } from '../../context/LocalizationContext';
import { theme } from '../../styles/theme';

interface SignupScreenProps {
  onNavigateToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const { t } = useLocalization();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (!formData.name.trim()) {
      Alert.alert(t('common.error'), t('auth.requiredField'));
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert(t('common.error'), t('auth.requiredField'));
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert(t('common.error'), t('auth.invalidEmail'));
      return;
    }

    if (!formData.password.trim()) {
      Alert.alert(t('common.error'), t('auth.requiredField'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordMismatch'));
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
      });

      if (success) {
        Alert.alert(t('common.success'), t('auth.signupSuccess'));
      } else {
        Alert.alert(t('common.error'), t('auth.signupError'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.signupError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.title}>{t('auth.signupTitle')}</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <User size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder={t('auth.name')}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder={t('auth.email')}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Phone size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder={t('auth.phone')}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Location Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <MapPin size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder={t('auth.location')}
                  value={formData.location}
                  onChangeText={(value) => handleInputChange('location', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder={t('auth.password')}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder={t('auth.confirmPassword')}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.disabledButton]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? t('common.loading') : t('auth.signupButton')}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>{t('auth.alreadyHaveAccount')} </Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text style={styles.loginLink}>{t('auth.login')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logo: {
    height: 60,
    width: 120,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  passwordInput: {
    paddingRight: theme.spacing.sm,
  },
  eyeIcon: {
    padding: theme.spacing.xs,
  },
  signupButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  disabledButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  signupButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as any,
    color: 'white',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold as any,
  },
});