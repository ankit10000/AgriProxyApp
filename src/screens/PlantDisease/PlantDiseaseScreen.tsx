import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  TextInput,
} from "react-native";
import {
  Camera,
  Search,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileImage,
  Bug,
  MapPin,
  Calendar,
  Mail,
  Send,
} from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { useLocalization } from "../../context/LocalizationContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { theme } from "../../styles/theme";
import { formatDate, getDiseaseSeverityColor } from "../../utils/helpers";
import { TabName } from "../../types";

interface PlantDiseaseScreenProps {
  onTabChange: (tab: TabName) => void;
}

export const PlantDiseaseScreen: React.FC<PlantDiseaseScreenProps> = ({
  onTabChange,
}) => {
  const { state, dispatch } = useApp();
  const { t } = useLocalization();
  const [isScanning, setIsScanning] = useState(false);
  const [showCropSelection, setShowCropSelection] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [address, setAddress] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const crops = [
    {
      id: 1,
      name: t("plantDisease.crops.wheat"),
      image: "🌾",
      months: [t("plantDisease.months.october"), t("plantDisease.months.november"), t("plantDisease.months.december")],
    },
    { id: 2, name: t("plantDisease.crops.rice"), image: "🌾", months: [t("plantDisease.months.june"), t("plantDisease.months.july"), t("plantDisease.months.august")] },
    { id: 3, name: t("plantDisease.crops.cotton"), image: "🌱", months: [t("plantDisease.months.may"), t("plantDisease.months.june"), t("plantDisease.months.july")] },
    {
      id: 4,
      name: t("plantDisease.crops.tomato"),
      image: "🍅",
      months: [t("plantDisease.months.february"), t("plantDisease.months.march"), t("plantDisease.months.april"), t("plantDisease.months.october"), t("plantDisease.months.november")],
    },
    {
      id: 5,
      name: t("plantDisease.crops.potato"),
      image: "🥔",
      months: [t("plantDisease.months.october"), t("plantDisease.months.november"), t("plantDisease.months.december")],
    },
    {
      id: 6,
      name: t("plantDisease.crops.onion"),
      image: "🧅",
      months: [t("plantDisease.months.october"), t("plantDisease.months.november"), t("plantDisease.months.december")],
    },
    {
      id: 7,
      name: t("plantDisease.crops.groundnut"),
      image: "🥜",
      months: [t("plantDisease.months.june"), t("plantDisease.months.july"), t("plantDisease.months.august")],
    },
    {
      id: 8,
      name: t("plantDisease.crops.mustard"),
      image: "🌻",
      months: [t("plantDisease.months.october"), t("plantDisease.months.november"), t("plantDisease.months.december")],
    },
  ];

  const handleCropSelection = () => {
    setShowCropSelection(true);
  };

  const selectCrop = (crop: any) => {
    setSelectedCrop(crop);
    setSelectedMonth("");
    setShowCropSelection(false);
  };

  const handleCameraCapture = () => {
    if (!selectedCrop) {
      Alert.alert(
        t("plantDisease.selectCrop"),
        t("plantDisease.selectCropFirst")
      );
      return;
    }
    if (!selectedMonth) {
      Alert.alert(
        t("plantDisease.plantingMonth"),
        t("plantDisease.selectMonth")
      );
      return;
    }
    if (!address.trim()) {
      Alert.alert(
        t("plantDisease.fullAddress"),
        t("plantDisease.enterAddress")
      );
      return;
    }

    Alert.alert(
      t("plantDisease.detectDisease"),
      t("plantDisease.chooseImageMethod"),
      [
        { text: t("plantDisease.takePhoto"), onPress: () => capturePhoto() },
        {
          text: t("plantDisease.uploadFromGallery"),
          onPress: () => uploadFromGallery(),
        },
        { text: t("common.cancel"), style: "cancel" },
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
        crop: selectedCrop?.name || "",
        disease: "",
        severity: "Low" as const,
        confidence: 0,
        treatment: "",
        status: "scanning" as const,
        month: selectedMonth,
        address: address,
      };

      dispatch({ type: "ADD_PLANT_DISEASE", payload: newDisease });

      // Simulate AI processing delay
      setTimeout(() => {
        const diseases = [
          {
            name: t("plantDisease.diseases.leafSpot"),
            treatment: t("plantDisease.treatments.leafSpot"),
          },
          {
            name: t("plantDisease.diseases.powderyMildew"),
            treatment: t("plantDisease.treatments.powderyMildew"),
          },
          {
            name: t("plantDisease.diseases.rustDisease"),
            treatment: t("plantDisease.treatments.rustDisease"),
          },
          {
            name: t("plantDisease.diseases.bacterialBlight"),
            treatment: t("plantDisease.treatments.bacterialBlight"),
          },
          {
            name: t("plantDisease.diseases.earlyBlight"),
            treatment: t("plantDisease.treatments.earlyBlight"),
          },
        ];

        const selectedDisease =
          diseases[Math.floor(Math.random() * diseases.length)];
        const severities = ["Low", "Moderate", "High"] as const;

        const completedDetection = {
          ...newDisease,
          disease: selectedDisease.name,
          severity: severities[Math.floor(Math.random() * 3)],
          confidence: 75 + Math.floor(Math.random() * 20), // 75-95%
          treatment: selectedDisease.treatment,
          status: "identified" as const,
        };

        dispatch({ type: "UPDATE_PLANT_DISEASE", payload: completedDetection });

        // Set report data for email functionality
        setReportData({
          ...completedDetection,
          month: selectedMonth,
          address: address,
        });
      }, 2500);

      Alert.alert(t("common.success"), t("plantDisease.imageCapture"));
    } catch (error) {
      Alert.alert(t("common.error"), t("plantDisease.captureError"));
    } finally {
      setIsScanning(false);
    }
  };

  const uploadFromGallery = async () => {
    try {
      setIsScanning(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      capturePhoto();
    } catch (error) {
      Alert.alert(t("common.error"), t("plantDisease.uploadError"));
      setIsScanning(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "identified":
        return "warning";
      case "treated":
        return "success";
      case "monitoring":
        return "info";
      case "scanning":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "identified":
        return t("plantDisease.status.identified");
      case "treated":
        return t("plantDisease.status.treated");
      case "monitoring":
        return t("plantDisease.status.monitoring");
      case "scanning":
        return t("plantDisease.status.scanning");
      default:
        return t("plantDisease.status.unknown");
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "Low":
        return t("plantDisease.severityLevels.low");
      case "Moderate":
        return t("plantDisease.severityLevels.moderate");
      case "High":
        return t("plantDisease.severityLevels.high");
      default:
        return severity;
    }
  };

  const getCropDisplayName = (cropName: string) => {
    // If crop name is localized already, return as is
    // If it's English, translate it
    switch (cropName) {
      case "Wheat":
      case t("plantDisease.crops.wheat"):
        return t("plantDisease.crops.wheat");
      case "Rice":
      case t("plantDisease.crops.rice"):
        return t("plantDisease.crops.rice");
      case "Cotton":
      case t("plantDisease.crops.cotton"):
        return t("plantDisease.crops.cotton");
      case "Tomato":
      case t("plantDisease.crops.tomato"):
        return t("plantDisease.crops.tomato");
      case "Potato":
      case t("plantDisease.crops.potato"):
        return t("plantDisease.crops.potato");
      case "Onion":
      case t("plantDisease.crops.onion"):
        return t("plantDisease.crops.onion");
      case "Groundnut":
      case t("plantDisease.crops.groundnut"):
        return t("plantDisease.crops.groundnut");
      case "Mustard":
      case t("plantDisease.crops.mustard"):
        return t("plantDisease.crops.mustard");
      default:
        return cropName;
    }
  };

  const updateTreatmentStatus = (diseaseId: number, newStatus: string) => {
    const disease = state.plantDiseases.find((d) => d.id === diseaseId);
    if (disease) {
      const updatedDisease = { ...disease, status: newStatus as any };
      dispatch({ type: "UPDATE_PLANT_DISEASE", payload: updatedDisease });
    }
  };

  const sendReportToSupport = () => {
    if (!reportData) return;

    // Simulate sending email to support team
    Alert.alert(
      t("plantDisease.reportSent"),
      t("plantDisease.reportSentMessage"),
      [{ text: t("common.ok"), onPress: () => setShowReportModal(false) }]
    );
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
        {disease.status === "scanning" && (
          <Activity size={16} color={theme.colors.warning} />
        )}
        {disease.status === "identified" && (
          <AlertTriangle size={16} color={theme.colors.warning} />
        )}
        {disease.status === "treated" && (
          <CheckCircle2 size={16} color={theme.colors.success} />
        )}
        {disease.status === "monitoring" && (
          <Clock size={16} color={theme.colors.primary} />
        )}
      </View>

      {disease.status === "scanning" && (
        <View style={styles.scanningContainer}>
          <Activity size={24} color={theme.colors.warning} />
          <Text style={styles.scanningText}>
            {t("placeholders.scanningMessage")}
          </Text>
        </View>
      )}

      {(disease.status === "identified" ||
        disease.status === "treated" ||
        disease.status === "monitoring") && (
        <>
          <View style={styles.diseaseDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("plantDisease.labels.crop")}</Text>
              <Text style={styles.detailValue}>{getCropDisplayName(disease.crop)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("plantDisease.labels.disease")}</Text>
              <Text style={styles.detailValue}>{disease.disease}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("plantDisease.labels.severity")}</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: getDiseaseSeverityColor(disease.severity) },
                ]}
              >
                {getSeverityText(disease.severity)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("plantDisease.labels.confidence")}</Text>
              <Text style={styles.detailValue}>{disease.confidence}%</Text>
            </View>
          </View>

          <View style={styles.treatmentSection}>
            <Text style={styles.treatmentTitle}>
              {t("plantDisease.recommendedTreatment")}
            </Text>
            <Text style={styles.treatmentText}>{disease.treatment}</Text>
          </View>

          {disease.status === "identified" && (
            <View style={styles.actionButtons}>
              <Button
                title={t("plantDisease.markTreated")}
                variant="primary"
                size="small"
                onPress={() => updateTreatmentStatus(disease.id, "treated")}
                style={styles.actionButton}
              />
              <Button
                title={t("plantDisease.startMonitoring")}
                variant="outline"
                size="small"
                onPress={() => updateTreatmentStatus(disease.id, "monitoring")}
                style={styles.actionButton}
              />
            </View>
          )}

          {disease.status === "monitoring" && (
            <View style={styles.actionButtons}>
              <Button
                title={t("plantDisease.markTreated")}
                variant="primary"
                size="small"
                onPress={() => updateTreatmentStatus(disease.id, "treated")}
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
            <Text style={styles.headerTitle}>{t("plantDisease.title")}</Text>
            <Text style={styles.headerSubtitle}>
              {t("plantDisease.subtitle")}
            </Text>
          </View>
        </View>
      </Card>

      {/* Crop Selection */}
      <Card style={styles.selectionCard}>
        <Text style={styles.selectionTitle}>
          {t("plantDisease.selectCrop")}
        </Text>
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={handleCropSelection}
        >
          <View style={styles.selectionContent}>
            <Text style={styles.selectionText}>
              {selectedCrop ? selectedCrop.name : t("plantDisease.chooseCrop")}
            </Text>
            {selectedCrop && (
              <Text style={styles.cropEmoji}>{selectedCrop.image}</Text>
            )}
          </View>
        </TouchableOpacity>
      </Card>

      {/* Month Selection */}
      {selectedCrop && (
        <Card style={styles.selectionCard}>
          <Text style={styles.selectionTitle}>
            {t("plantDisease.plantingMonth")}
          </Text>
          <View style={styles.monthContainer}>
            {selectedCrop?.months?.map((month: string) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthButton,
                  selectedMonth === month && styles.selectedMonthButton,
                ]}
                onPress={() => setSelectedMonth(month)}
              >
                <Text
                  style={[
                    styles.monthText,
                    selectedMonth === month && styles.selectedMonthText,
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      )}

      {/* Address Input */}
      {selectedCrop && selectedMonth && (
        <Card style={styles.selectionCard}>
          <Text style={styles.selectionTitle}>
            {t("plantDisease.fullAddress")}
          </Text>
          <TextInput
            style={styles.addressInput}
            placeholder={t("plantDisease.addressPlaceholder")}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </Card>
      )}

      {/* Action Buttons */}
      {selectedCrop && selectedMonth && address.trim() && (
        <View style={styles.actionButtonsContainer}>
          <Button
            title={t("plantDisease.scanDisease")}
            icon={Camera}
            onPress={handleCameraCapture}
            disabled={isScanning}
            style={styles.scanButton}
          />
          <Button
            title={t("plantDisease.uploadGallery")}
            icon={FileImage}
            variant="outline"
            onPress={uploadFromGallery}
            disabled={isScanning}
            style={styles.scanButton}
          />
        </View>
      )}

      {/* Instructions */}
      <Card style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>
          {t("plantDisease.instructions")}
        </Text>
        <Text style={styles.instructionItem}>
          1. {t("plantDisease.instruction1")}
        </Text>
        <Text style={styles.instructionItem}>
          2. {t("plantDisease.instruction2")}
        </Text>
        <Text style={styles.instructionItem}>
          3. {t("plantDisease.instruction3")}
        </Text>
        <Text style={styles.instructionItem}>
          4. {t("plantDisease.instruction4")}
        </Text>
        <Text style={styles.instructionItem}>
          5. {t("plantDisease.instruction5")}
        </Text>
      </Card>

      {/* Detection History */}
      <View style={styles.historySection}>
        <View style={styles.historySectionHeader}>
          <Text style={styles.sectionTitle}>
            {t("plantDisease.detectionHistory")}
          </Text>
          {reportData && (
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => setShowReportModal(true)}
            >
              <Mail size={16} color={theme.colors.primary} />
              <Text style={styles.reportButtonText}>
                {t("plantDisease.sendReport")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {state.plantDiseases.length > 0 ? (
          state.plantDiseases.map((disease) => (
            <DiseaseCard key={disease.id} disease={disease} />
          ))
        ) : (
          <Card style={styles.emptyState}>
            <Search size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>
              {t("plantDisease.noScansYet")}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {t("plantDisease.firstScanPrompt")}
            </Text>
          </Card>
        )}
      </View>

      {/* Crop Selection Modal */}
      <Modal
        visible={showCropSelection}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCropSelection(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("plantDisease.cropSelection")}
            </Text>
            <ScrollView style={styles.cropList}>
              {crops.map((crop) => (
                <TouchableOpacity
                  key={crop.id}
                  style={styles.cropItem}
                  onPress={() => selectCrop(crop)}
                >
                  <Text style={styles.cropEmoji}>{crop.image}</Text>
                  <Text style={styles.cropName}>{crop.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCropSelection(false)}
            >
              <Text style={styles.modalCloseText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reportModalContent}>
            <Text style={styles.modalTitle}>
              {t("plantDisease.reportToSupport")}
            </Text>
            {reportData && (
              <View style={styles.reportDetails}>
                <Text style={styles.reportDetailText}>
                  <Text style={styles.reportLabel}>
                    {t("plantDisease.crop")}{" "}
                  </Text>
                  {getCropDisplayName(reportData.crop)}
                </Text>
                <Text style={styles.reportDetailText}>
                  <Text style={styles.reportLabel}>
                    {t("plantDisease.disease")}{" "}
                  </Text>
                  {reportData.disease}
                </Text>
                <Text style={styles.reportDetailText}>
                  <Text style={styles.reportLabel}>
                    {t("plantDisease.severity")}{" "}
                  </Text>
                  {getSeverityText(reportData.severity)}
                </Text>
                <Text style={styles.reportDetailText}>
                  <Text style={styles.reportLabel}>
                    {t("plantDisease.month")}{" "}
                  </Text>
                  {reportData.month}
                </Text>
                <Text style={styles.reportDetailText}>
                  <Text style={styles.reportLabel}>
                    {t("plantDisease.address")}{" "}
                  </Text>
                  {reportData.address}
                </Text>
              </View>
            )}
            <View style={styles.reportModalButtons}>
              <TouchableOpacity
                style={styles.sendReportButton}
                onPress={sendReportToSupport}
              >
                <Send size={16} color="white" />
                <Text style={styles.sendReportText}>
                  {t("plantDisease.sendReport")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={styles.modalCloseText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  diseaseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  diseaseDate: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  scanningContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flexDirection: "row",
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  emptyState: {
    alignItems: "center",
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
    textAlign: "center",
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
  // New styles for crop selection and other features
  selectionCard: {
    margin: theme.spacing.md,
    marginTop: 0,
  },
  selectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  selectionButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  selectionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectionText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
  },
  cropEmoji: {
    fontSize: 24,
  },
  monthContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  monthButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  selectedMonthButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  monthText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text,
  },
  selectedMonthText: {
    color: "white",
    fontWeight: theme.typography.weights.semibold as any,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    minHeight: 80,
  },
  historySectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  reportButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.typography.weights.semibold as any,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  cropList: {
    maxHeight: 400,
  },
  cropItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cropName: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  modalCloseButton: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    fontWeight: theme.typography.weights.semibold as any,
  },
  // Report modal styles
  reportModalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    width: "90%",
    maxWidth: 400,
  },
  reportDetails: {
    marginBottom: theme.spacing.md,
  },
  reportDetailText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
  },
  reportLabel: {
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.primary,
  },
  reportModalButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  sendReportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
  },
  sendReportText: {
    fontSize: theme.typography.sizes.md,
    color: "white",
    fontWeight: theme.typography.weights.semibold as any,
  },
});
