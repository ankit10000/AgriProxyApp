import React, { useState, useCallback, memo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorBoundary } from "react-error-boundary";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  SafeAreaView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Camera,
  Edit,
  Save,
  Eye,
  EyeOff,
  Phone,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useLocalization } from "../../context/LocalizationContext";
import { profileApi, ProfileUpdateRequest } from "../../services/profileApi";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { theme } from "../../styles/theme";
import { TabName } from "../../types";
import { useApiMutation, useApiQuery } from "../../hooks";

interface ProfileScreenProps {
  onTabChange: (tab: TabName) => void;
}

interface ProfileFormData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: React.ComponentType<any>;
  secure?: boolean;
  editable?: boolean;
  keyboardType?: any;
  isEditing: boolean;
  error?: string;
}

// Error Fallback Component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: theme.colors.error }}>
      Something went wrong
    </Text>
    <Text style={{ textAlign: 'center', marginBottom: 20, color: theme.colors.textSecondary }}>
      {error.message}
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
      }}
      onPress={resetErrorBoundary}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const ProfileScreenContent: React.FC<ProfileScreenProps> = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLocalization();

  const [isEditing, setIsEditing] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Fetch user profile data
  const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useApiQuery(
    () => profileApi.getProfile(),
    {
      successMessage: '',
      errorMessage: 'Failed to load profile data',
      showToast: false,
    }
  );

  // Update profile mutation
  const { mutate: updateProfile, loading: updateLoading } = useApiMutation(
    (updateData: ProfileUpdateRequest) => profileApi.updateProfile(updateData),
    {
      successMessage: t('profile.updateSuccess') || 'Profile updated successfully! ✅',
      errorMessage: t('profile.updateError') || 'Failed to update profile',
      onSuccess: async (response) => {
        if (response?.success) {
          setIsEditing(false);
          await refetchProfile();
          const formData = getValues();
          await updateUser({
            name: formData.fullName,
            phone: formData.phone,
            location: `${formData.addressLine}, ${formData.city}, ${formData.state} - ${formData.pincode}`.replace(/^, |, $/, ''),
          } as any);
        }
      },
    }
  );

  // Upload avatar mutation
  const { mutate: uploadAvatar, loading: uploadLoading } = useApiMutation(
    (imageUri: string) => profileApi.uploadAvatar(imageUri),
    {
      successMessage: 'Profile photo updated successfully! 📸',
      errorMessage: 'Failed to upload profile photo',
      onSuccess: async () => {
        await refetchProfile();
      },
    }
  );

  const isLoading = updateLoading || uploadLoading;

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<ProfileFormData>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      fullName: user?.name || "",
      phone: user?.phone || "",
      addressLine: user?.addressLine || user?.location || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode || "",
    },
    mode: "onChange",
  });

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        username: user?.username || "",
        email: user?.email || "",
        password: "",
        fullName: user?.name || "",
        phone: user?.phone || "",
        addressLine: user?.addressLine || user?.location || "",
        city: user?.city || "",
        state: user?.state || "",
        pincode: user?.pincode || "",
      });
    }
  }, [user, reset]);

  // Clear network errors when form changes
  useEffect(() => {
    if (networkError) {
      setNetworkError(null);
    }
  }, [errors]);

  // Special handler for pincode to restrict to numbers only
  const handlePincodeChange = useCallback((text: string) => {
    // Only allow numbers and limit to 6 digits
    return text.replace(/[^0-9]/g, "").slice(0, 6);
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    setNetworkError(null);
    clearErrors();

    const updateData: ProfileUpdateRequest = {
      name: data.fullName,
      phone: data.phone,
      username: data.username,
      addressLine: data.addressLine,
      city: data.city,
      state: data.state,
      ...(data.pincode.trim() && /^\d{6}$/.test(data.pincode.trim())
        ? { pincode: data.pincode.trim() }
        : {}),
    };

    await updateProfile(updateData);
  };

  const handleCancel = () => {
    // Reset form to original values
    reset({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      fullName: user?.name || "",
      phone: user?.phone || "",
      addressLine: user?.addressLine || user?.location || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode || "",
    });
    setIsEditing(false);
  };

  const handlePhotoChange = () => {
    Alert.alert(t("profile.changePhoto"), t("profile.choosePhotoMethod"), [
      { text: t("profile.takePhoto"), onPress: () => capturePhoto() },
      { text: t("profile.chooseGallery"), onPress: () => chooseFromGallery() },
      { text: t("common.cancel"), style: "cancel" },
    ]);
  };

  const capturePhoto = async () => {
    try {
      // Request camera permissions
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.status !== "granted") {
        Alert.alert(
          t("common.error"),
          "Camera permission is required to take photos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera capture error:", error);
      Alert.alert(t("common.error"), "Failed to capture photo");
    }
  };

  const chooseFromGallery = async () => {
    try {
      // Request media library permissions
      const libraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (libraryPermission.status !== "granted") {
        Alert.alert(
          t("common.error"),
          "Gallery permission is required to select photos"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Gallery selection error:", error);
      Alert.alert(t("common.error"), "Failed to select photo");
    }
  };

  const uploadProfileImage = async (imageUri: string) => {
    setNetworkError(null);
    await uploadAvatar(imageUri);
  };

  // Network Error Component
  const NetworkErrorBanner = () => {
    if (!networkError) return null;

    return (
      <View style={styles.networkErrorBanner}>
        <Text style={styles.networkErrorText}>{networkError}</Text>
        <TouchableOpacity
          onPress={() => setNetworkError(null)}
          style={styles.networkErrorClose}
        >
          <Text style={styles.networkErrorCloseText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NetworkErrorBanner />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                {user?.avatar ? (
                  <Image
                    source={{ uri: profileApi.getAvatarUrl(user.avatar) || "" }}
                    style={styles.avatarImage}
                    onError={() => console.log("Avatar image load error")}
                  />
                ) : (
                  <User size={40} color={theme.colors.textSecondary} />
                )}
              </View>
              {isEditing && (
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={handlePhotoChange}
                >
                  <Camera size={16} color="white" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.userName}>{user?.name || "User"}</Text>
              <Text style={styles.userEmail}>{user?.email || ""}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Edit size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Profile Form */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>{t("profile.personalInfo")}</Text>

          <Controller
            control={control}
            name="username"
            rules={{
              required: t("profile.requiredFields"),
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                key="username"
                label={t("profile.username")}
                value={value}
                onChangeText={onChange}
                placeholder={t("profile.usernamePlaceholder")}
                icon={User}
                isEditing={isEditing}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="fullName"
            rules={{
              required: t("profile.requiredFields"),
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                key="fullName"
                label={t("profile.fullName")}
                value={value}
                onChangeText={onChange}
                placeholder={t("profile.fullNamePlaceholder")}
                icon={User}
                isEditing={isEditing}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: t("profile.requiredFields"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("auth.invalidEmail"),
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                key="email"
                label={t("auth.email")}
                value={value}
                onChangeText={onChange}
                placeholder={t("auth.email")}
                icon={Mail}
                keyboardType="email-address"
                isEditing={isEditing}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                key="phone"
                label={t("auth.phone")}
                value={value}
                onChangeText={onChange}
                placeholder={t("profile.phonePlaceholder")}
                icon={Phone}
                keyboardType="phone-pad"
                isEditing={isEditing}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                key="password"
                label={t("auth.password")}
                value={value}
                onChangeText={onChange}
                placeholder={t("profile.passwordPlaceholder")}
                icon={Lock}
                secure={true}
                isEditing={isEditing}
                error={error?.message}
              />
            )}
          />
        </Card>

        {/* Address Information */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>{t("profile.addressInfo")}</Text>

          <Controller
            control={control}
            name="addressLine"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                key="addressLine"
                label={t("profile.addressLine")}
                value={value}
                onChangeText={onChange}
                placeholder={t("profile.addressLinePlaceholder")}
                icon={MapPin}
                isEditing={isEditing}
                error={error?.message}
              />
            )}
          />

          <View style={styles.addressRow}>
            <View style={styles.addressField}>
              <Controller
                control={control}
                name="city"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <InputField
                    key="city"
                    label={t("profile.city")}
                    value={value}
                    onChangeText={onChange}
                    placeholder={t("profile.cityPlaceholder")}
                    icon={MapPin}
                    isEditing={isEditing}
                    error={error?.message}
                  />
                )}
              />
            </View>
            <View style={styles.addressField}>
              <Controller
                control={control}
                name="state"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <InputField
                    key="state"
                    label={t("profile.state")}
                    value={value}
                    onChangeText={onChange}
                    placeholder={t("profile.statePlaceholder")}
                    icon={MapPin}
                    isEditing={isEditing}
                    error={error?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="pincode"
            rules={{
              pattern: {
                value: /^\d{6}$/,
                message: "Pincode must be exactly 6 digits",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                key="pincode"
                label={t("profile.pincode")}
                value={value}
                onChangeText={(text) => onChange(handlePincodeChange(text))}
                placeholder={t("profile.pincodePlaceholder")}
                icon={MapPin}
                keyboardType="numeric"
                isEditing={isEditing}
                error={error?.message}
              />
            )}
          />
        </Card>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <Button
              title={t("common.cancel")}
              variant="outline"
              onPress={handleCancel}
              style={styles.actionButton}
            />
            <Button
              title={isLoading ? t("common.loading") : t("common.save")}
              icon={Save}
              onPress={handleSubmit(onSubmit)}
              style={!isValid ? { ...styles.actionButton, ...styles.disabledButton } : styles.actionButton}
              disabled={isLoading || !isValid}
            />
          </View>
        )}

        {/* Additional Options */}
        <Card style={styles.optionsCard}>
          <Text style={styles.sectionTitle}>{t("profile.accountOptions")}</Text>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>{t("profile.changeLanguage")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>{t("profile.notifications")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>{t("profile.privacy")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={[styles.optionText, styles.dangerText]}>
              {t("profile.deleteAccount")}
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

// Main ProfileScreen component wrapped with ErrorBoundary
export const ProfileScreen: React.FC<ProfileScreenProps> = (props) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('ProfileScreen Error:', error, errorInfo);
        // You can log to crash analytics service here
      }}
      onReset={() => {
        // Optional: Reset any global state if needed
        console.log('ProfileScreen error boundary reset');
      }}
    >
      <ProfileScreenContent {...props} />
    </ErrorBoundary>
  );
};

const InputField = memo<InputFieldProps>(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    icon: Icon,
    secure = false,
    editable = true,
    keyboardType = "default",
    isEditing,
    error,
  }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[styles.inputWrapper, error && styles.inputError]}>
          <Icon
            size={20}
            color={theme.colors.textSecondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.textInput, !editable && styles.disabledInput]}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secure && !showPassword}
            editable={isEditing && editable}
            keyboardType={keyboardType}
            autoCapitalize={
              secure
                ? "none"
                : keyboardType === "email-address"
                ? "none"
                : "words"
            }
            autoCorrect={false}
            multiline={false}
            returnKeyType="done"
          />
          {secure && (
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
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

InputField.displayName = "InputField";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    margin: theme.spacing.md,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  userName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  editButton: {
    padding: theme.spacing.sm,
  },
  formCard: {
    margin: theme.spacing.md,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
    paddingVertical: Platform.OS === "ios" ? 0 : 8,
    textAlignVertical: "center",
    minHeight: Platform.OS === "android" ? 40 : undefined,
  },
  disabledInput: {
    opacity: 0.6,
  },
  eyeIcon: {
    padding: theme.spacing.xs,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addressField: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  optionsCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    marginBottom: theme.spacing.xl,
  },
  optionItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  optionText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
  },
  dangerText: {
    color: theme.colors.error,
  },
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  networkErrorBanner: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  networkErrorText: {
    color: 'white',
    fontSize: theme.typography.sizes.sm,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  networkErrorClose: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs / 2,
  },
  networkErrorCloseText: {
    color: 'white',
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
