import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Camera, FlaskConical, Activity, AlertTriangle, CheckCircle2, Clock, FileImage } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { theme } from '../../styles/theme';
import { formatDate } from '../../utils/helpers';
import { TabName } from '../../types';

interface SoilTestingScreenProps {
  onTabChange: (tab: TabName) => void;
}

export const SoilTestingScreen: React.FC<SoilTestingScreenProps> = () => {
  const { state, dispatch } = useApp();
  const { t } = useLocalization();
  const [isUploading, setIsUploading] = useState(false);

  const handleCameraCapture = () => {
    Alert.alert(
      t('soilTesting.captureTitle'),
      t('soilTesting.captureSubtitle'),
      [
        { text: t('plantDisease.takePhoto'), onPress: () => capturePhoto() },
        { text: t('plantDisease.uploadFromGallery'), onPress: () => uploadFromGallery() },
        { text: t('common.cancel'), style: 'cancel' }
      ]
    );
  };

  const capturePhoto = async () => {
    try {
      setIsUploading(true);
      // Simulate camera capture and soil test creation
      const newTest = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'processing' as const,
        ph: null,
        nitrogen: null,
        phosphorus: null,
        potassium: null,
        recommendations: []
      };
      
      dispatch({ type: 'ADD_SOIL_TEST', payload: newTest });
      
      // Simulate processing delay
      setTimeout(() => {
        const completedTest = {
          ...newTest,
          status: 'completed' as const,
          ph: 6.5 + Math.random() * 1.5,
          nitrogen: (['Low', 'Medium', 'High'] as const)[Math.floor(Math.random() * 3)],
          phosphorus: (['Low', 'Medium', 'High'] as const)[Math.floor(Math.random() * 3)],
          potassium: (['Low', 'Medium', 'High'] as const)[Math.floor(Math.random() * 3)],
          recommendations: [
            t('soilTesting.recommendations.organicMatter'),
            t('soilTesting.recommendations.monitorPH'),
            t('soilTesting.recommendations.applyNPK')
          ]
        };
        dispatch({ type: 'UPDATE_SOIL_TEST', payload: completedTest });
      }, 3000);
      
      Alert.alert(t('common.success'), t('soilTesting.successMessage'));
    } catch (error) {
      Alert.alert(t('common.error'), t('soilTesting.errorMessage'));
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFromGallery = async () => {
    try {
      setIsUploading(true);
      // Simulate gallery upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      capturePhoto(); // Use same logic for demo
    } catch (error) {
      Alert.alert(t('common.error'), t('soilTesting.uploadError'));
      setIsUploading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('soilTesting.status.completed');
      case 'processing':
        return t('soilTesting.status.processing');
      case 'failed':
        return t('soilTesting.status.failed');
      default:
        return t('soilTesting.status.unknown');
    }
  };

  const getNutrientLevel = (level: string | null) => {
    if (!level) return { text: t('soilTesting.nutrientLevels.processing'), color: '#6b7280' };
    
    switch (level.toLowerCase()) {
      case 'high':
        return { text: t('soilTesting.nutrientLevels.high'), color: '#10b981' };
      case 'medium':
        return { text: t('soilTesting.nutrientLevels.medium'), color: '#f59e0b' };
      case 'low':
        return { text: t('soilTesting.nutrientLevels.low'), color: '#ef4444' };
      default:
        return { text: level, color: '#6b7280' };
    }
  };

  const SoilTestCard: React.FC<{ test: any }> = ({ test }) => (
    <Card style={styles.testCard}>
      <View style={styles.testHeader}>
        <View style={styles.testInfo}>
          <Text style={styles.testDate}>{formatDate(test.date)}</Text>
          <Badge variant={getStatusBadgeVariant(test.status)}>
            {getStatusText(test.status)}
          </Badge>
        </View>
        {test.status === 'processing' && <Clock size={16} color={theme.colors.warning} />}
        {test.status === 'completed' && <CheckCircle2 size={16} color={theme.colors.success} />}
        {test.status === 'failed' && <AlertTriangle size={16} color={theme.colors.error} />}
      </View>

      {test.status === 'completed' && (
        <>
          <View style={styles.testResults}>
            <Text style={styles.resultsTitle}>{t('placeholders.testResults')}</Text>
            
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>{t('soilTesting.phLevelLabel')}</Text>
              <Text style={styles.nutrientValue}>{test.ph?.toFixed(1) || 'N/A'}</Text>
            </View>
            
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>{t('soilTesting.nitrogenLabel')}</Text>
              <Text style={[styles.nutrientValue, { color: getNutrientLevel(test.nitrogen).color }]}>
                {getNutrientLevel(test.nitrogen).text}
              </Text>
            </View>
            
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>{t('soilTesting.phosphorusLabel')}</Text>
              <Text style={[styles.nutrientValue, { color: getNutrientLevel(test.phosphorus).color }]}>
                {getNutrientLevel(test.phosphorus).text}
              </Text>
            </View>
            
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>{t('soilTesting.potassiumLabel')}</Text>
              <Text style={[styles.nutrientValue, { color: getNutrientLevel(test.potassium).color }]}>
                {getNutrientLevel(test.potassium).text}
              </Text>
            </View>
          </View>

          {test.recommendations && test.recommendations.length > 0 && (
            <View style={styles.recommendations}>
              <Text style={styles.recommendationsTitle}>{t('placeholders.recommendations')}</Text>
              {test.recommendations.map((rec: string, index: number) => (
                <Text key={index} style={styles.recommendationItem}>
                  • {rec}
                </Text>
              ))}
            </View>
          )}
        </>
      )}

      {test.status === 'processing' && (
        <View style={styles.processingContainer}>
          <Activity size={24} color={theme.colors.warning} />
          <Text style={styles.processingText}>
            {t('soilTesting.processingMessage')}
          </Text>
        </View>
      )}
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <FlaskConical size={32} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{t('plantDisease.soilTesting')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('plantDisease.getInstantSoilAnalysis')}
            </Text>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title={t('placeholders.takeSoilPhoto')}
          icon={Camera}
          onPress={handleCameraCapture}
          disabled={isUploading}
          style={styles.actionButton}
        />
        <Button
          title={t('placeholders.uploadFromGallery')}
          icon={FileImage}
          variant="outline"
          onPress={uploadFromGallery}
          disabled={isUploading}
          style={styles.actionButton}
        />
      </View>

      {/* Instructions */}
      <Card style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>{t('placeholders.howToTakeSoilSample')}</Text>
        <Text style={styles.instructionItem}>{t('placeholders.soilInstruction1')}</Text>
        <Text style={styles.instructionItem}>{t('placeholders.soilInstruction2')}</Text>
        <Text style={styles.instructionItem}>{t('placeholders.soilInstruction3')}</Text>
        <Text style={styles.instructionItem}>{t('placeholders.soilInstruction4')}</Text>
      </Card>

      {/* Test History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>{t('soilTesting.testHistory')}</Text>
        {state.soilTests.length > 0 ? (
          state.soilTests.map(test => (
            <SoilTestCard key={test.id} test={test} />
          ))
        ) : (
          <Card style={styles.emptyState}>
            <FlaskConical size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>{t('placeholders.noSoilTestsYet')}</Text>
            <Text style={styles.emptyStateSubtitle}>
              {t('soilTesting.emptySubtitle')}
            </Text>
          </Card>
        )}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  headerCard: {
    margin: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  instructionsCard: {
    margin: theme.spacing.md,
    marginTop: 0,
  },
  instructionsTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  instructionItem: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  historySection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  testCard: {
    marginBottom: theme.spacing.md,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  testInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  testDate: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  testResults: {
    marginBottom: theme.spacing.md,
  },
  resultsTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  nutrientLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  nutrientValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
  },
  recommendations: {
    marginTop: theme.spacing.md,
  },
  recommendationsTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  recommendationItem: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  processingText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyStateSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  quickActionItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  quickActionSubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
});