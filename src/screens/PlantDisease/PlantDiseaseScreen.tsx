import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, Search, Activity, AlertTriangle, CheckCircle2, Clock, FileImage, Bug } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { theme } from '../../styles/theme';
import { formatDate, getDiseaseSeverityColor } from '../../utils/helpers';
import { TabName } from '../../types';

interface PlantDiseaseScreenProps {
  onTabChange: (tab: TabName) => void;
}

export const PlantDiseaseScreen: React.FC<PlantDiseaseScreenProps> = ({ onTabChange }) => {
  const { state, dispatch } = useApp();
  const [isScanning, setIsScanning] = useState(false);

  const handleCameraCapture = () => {
    Alert.alert(
      'Detect Plant Disease',
      'Choose how you want to capture your plant image:',
      [
        { text: 'Take Photo', onPress: () => capturePhoto() },
        { text: 'Upload from Gallery', onPress: () => uploadFromGallery() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const capturePhoto = async () => {
    try {
      setIsScanning(true);
      
      // Simulate AI detection process
      const newDisease = {
        id: Date.now(),
        date: new Date().toISOString(),
        crop: ['Wheat', 'Rice', 'Cotton', 'Tomato', 'Potato'][Math.floor(Math.random() * 5)],
        disease: '',
        severity: 'Low' as const,
        confidence: 0,
        treatment: '',
        status: 'scanning' as const
      };
      
      dispatch({ type: 'ADD_PLANT_DISEASE', payload: newDisease });
      
      // Simulate AI processing delay
      setTimeout(() => {
        const diseases = [
          { name: 'Leaf Spot', treatment: 'Apply copper-based fungicide spray every 7-10 days' },
          { name: 'Powdery Mildew', treatment: 'Use sulfur-based fungicide or neem oil spray' },
          { name: 'Rust Disease', treatment: 'Apply propiconazole-based fungicide' },
          { name: 'Bacterial Blight', treatment: 'Use copper-based bactericide spray' },
          { name: 'Early Blight', treatment: 'Apply chlorothalonil or mancozeb fungicide' },
        ];
        
        const selectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
        const severities = ['Low', 'Moderate', 'High'] as const;
        
        const completedDetection = {
          ...newDisease,
          disease: selectedDisease.name,
          severity: severities[Math.floor(Math.random() * 3)],
          confidence: 75 + Math.floor(Math.random() * 20), // 75-95%
          treatment: selectedDisease.treatment,
          status: 'identified' as const
        };
        
        dispatch({ type: 'UPDATE_PLANT_DISEASE', payload: completedDetection });
      }, 2500);
      
      Alert.alert('Success', 'Plant image captured! AI analysis in progress...');
    } catch (error) {
      Alert.alert('Error', 'Failed to capture plant image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const uploadFromGallery = async () => {
    try {
      setIsScanning(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      capturePhoto();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
      setIsScanning(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'identified':
        return 'warning';
      case 'treated':
        return 'success';
      case 'monitoring':
        return 'info';
      case 'scanning':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'identified':
        return 'Identified';
      case 'treated':
        return 'Treated';
      case 'monitoring':
        return 'Monitoring';
      case 'scanning':
        return 'Scanning';
      default:
        return 'Unknown';
    }
  };

  const updateTreatmentStatus = (diseaseId: number, newStatus: string) => {
    const disease = state.plantDiseases.find(d => d.id === diseaseId);
    if (disease) {
      const updatedDisease = { ...disease, status: newStatus as any };
      dispatch({ type: 'UPDATE_PLANT_DISEASE', payload: updatedDisease });
    }
  };

  const DiseaseCard: React.FC<{ disease: any }> = ({ disease }) => (
    <Card style={styles.diseaseCard}>
      <View style={styles.diseaseHeader}>
        <View style={styles.diseaseInfo}>
          <Text style={styles.diseaseDate}>{formatDate(disease.date)}</Text>
          <Badge variant={getStatusBadgeVariant(disease.status)}>
            {getStatusText(disease.status)}
          </Badge>
        </View>
        {disease.status === 'scanning' && <Activity size={16} color={theme.colors.warning} />}
        {disease.status === 'identified' && <AlertTriangle size={16} color={theme.colors.warning} />}
        {disease.status === 'treated' && <CheckCircle2 size={16} color={theme.colors.success} />}
        {disease.status === 'monitoring' && <Clock size={16} color={theme.colors.primary} />}
      </View>

      {disease.status === 'scanning' && (
        <View style={styles.scanningContainer}>
          <Activity size={24} color={theme.colors.warning} />
          <Text style={styles.scanningText}>
            AI is analyzing your plant image... This may take a few moments.
          </Text>
        </View>
      )}

      {(disease.status === 'identified' || disease.status === 'treated' || disease.status === 'monitoring') && (
        <>
          <View style={styles.diseaseDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Crop:</Text>
              <Text style={styles.detailValue}>{disease.crop}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Disease:</Text>
              <Text style={styles.detailValue}>{disease.disease}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Severity:</Text>
              <Text style={[styles.detailValue, { color: getDiseaseSeverityColor(disease.severity) }]}>
                {disease.severity}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Confidence:</Text>
              <Text style={styles.detailValue}>{disease.confidence}%</Text>
            </View>
          </View>

          <View style={styles.treatmentSection}>
            <Text style={styles.treatmentTitle}>Recommended Treatment</Text>
            <Text style={styles.treatmentText}>{disease.treatment}</Text>
          </View>

          {disease.status === 'identified' && (
            <View style={styles.actionButtons}>
              <Button
                title="Mark as Treated"
                variant="primary"
                size="small"
                onPress={() => updateTreatmentStatus(disease.id, 'treated')}
                style={styles.actionButton}
              />
              <Button
                title="Start Monitoring"
                variant="outline"
                size="small"
                onPress={() => updateTreatmentStatus(disease.id, 'monitoring')}
                style={styles.actionButton}
              />
            </View>
          )}

          {disease.status === 'monitoring' && (
            <View style={styles.actionButtons}>
              <Button
                title="Mark as Treated"
                variant="primary"
                size="small"
                onPress={() => updateTreatmentStatus(disease.id, 'treated')}
                style={styles.actionButton}
              />
            </View>
          )}
        </>
      )}
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Bug size={32} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Plant Disease Detection</Text>
            <Text style={styles.headerSubtitle}>
              AI-powered plant disease identification and treatment recommendations
            </Text>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          title="Scan Plant Disease"
          icon={Camera}
          onPress={handleCameraCapture}
          disabled={isScanning}
          style={styles.scanButton}
        />
        <Button
          title="Upload from Gallery"
          icon={FileImage}
          variant="outline"
          onPress={uploadFromGallery}
          disabled={isScanning}
          style={styles.scanButton}
        />
      </View>

      {/* Instructions */}
      <Card style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>How to get the best results:</Text>
        <Text style={styles.instructionItem}>1. Take a clear photo of the affected plant part</Text>
        <Text style={styles.instructionItem}>2. Ensure good lighting and focus</Text>
        <Text style={styles.instructionItem}>3. Include the diseased area in the frame</Text>
        <Text style={styles.instructionItem}>4. Avoid blurry or low-quality images</Text>
        <Text style={styles.instructionItem}>5. Capture multiple angles if needed</Text>
      </Card>

      {/* Detection History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Detection History</Text>
        {state.plantDiseases.length > 0 ? (
          state.plantDiseases.map(disease => (
            <DiseaseCard key={disease.id} disease={disease} />
          ))
        ) : (
          <Card style={styles.emptyState}>
            <Search size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>No plant scans yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Take your first plant photo to get AI-powered disease detection
            </Text>
          </Card>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Related Services</Text>
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => onTabChange('store')}
        >
          <Text style={styles.quickActionText}>Browse Fungicides</Text>
          <Text style={styles.quickActionSubtext}>Find treatments for identified diseases</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => onTabChange('soiltesting')}
        >
          <Text style={styles.quickActionText}>Soil Testing</Text>
          <Text style={styles.quickActionSubtext}>Check soil health for disease prevention</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  scanButton: {
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
  diseaseCard: {
    marginBottom: theme.spacing.md,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  diseaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  diseaseDate: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  scanningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  scanningText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  diseaseDetails: {
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
  },
  treatmentSection: {
    marginBottom: theme.spacing.md,
  },
  treatmentTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  treatmentText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
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