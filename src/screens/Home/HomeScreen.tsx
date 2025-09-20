import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, Search, Calendar, TrendingUp, Leaf, ShoppingCart, MapPin } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { theme } from '../../styles/theme';
import { formatPrice } from '../../utils/helpers';
import { TabName } from '../../types';

interface HomeScreenProps {
  onTabChange: (tab: TabName) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onTabChange }) => {
  const { state } = useApp();
  const { t } = useLocalization();

  const QuickActionCard: React.FC<{
    icon: React.ComponentType<any>;
    title: string;
    subtitle: string;
    color: string;
    onPress: () => void;
  }> = ({ icon: Icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.quickActionCard, { backgroundColor: color }]}
    >
      <Icon size={32} color="white" />
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const FeatureCard: React.FC<{
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    color: string;
  }> = ({ icon: Icon, title, description, color }) => (
    <Card style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: color }]}>
        <Icon size={24} color="white" />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </Card>
  );

  const ProductCard: React.FC<{ product: any }> = ({ product }) => (
    <Card style={styles.productCard}>
      <View style={styles.productImage}>
        <Leaf size={48} color={theme.colors.secondary} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <Card style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>{t('home.welcomeBack')}, {state.user.name}! 🌱</Text>
        <Text style={styles.welcomeSubtitle}>{t('home.welcomeMessage')}</Text>
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <View style={styles.quickActionsRow}>
          <QuickActionCard
            icon={Camera}
            title={t('home.soilTesting')}
            subtitle={t('home.soilTestingSubtitle')}
            color={theme.colors.primary}
            onPress={() => onTabChange('soiltesting')}
          />
          <QuickActionCard
            icon={Search}
            title={t('home.pestDetection')}
            subtitle={t('home.pestDetectionSubtitle')}
            color="#dc2626"
            onPress={() => onTabChange('plantdisease')}
          />
        </View>
        <View style={styles.quickActionsRow}>
          <QuickActionCard
            icon={Calendar}
            title={t('home.cropCalendar')}
            subtitle={t('home.cropCalendarSubtitle')}
            color="#2563eb"
            onPress={() => onTabChange('calendar')}
          />
          <QuickActionCard
            icon={TrendingUp}
            title={t('home.mandiRates')}
            subtitle={t('home.mandiRatesSubtitle')}
            color="#7c3aed"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>{t('home.ourServices')}</Text>
        <FeatureCard
          icon={Leaf}
          title={t('home.cropAdvisory')}
          description={t('home.cropAdvisoryDesc')}
          color={theme.colors.secondary}
        />
        <FeatureCard
          icon={ShoppingCart}
          title={t('home.agriProxyStore')}
          description={t('home.agriProxyStoreDesc')}
          color={theme.colors.primary}
        />
        <FeatureCard
          icon={MapPin}
          title={t('home.droneSpraying')}
          description={t('home.droneSprayingDesc')}
          color="#2563eb"
        />
      </View>

      {/* Featured Products */}
      <View style={styles.productsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.featuredProducts')}</Text>
          <Button
            title={t('home.viewAll')}
            variant="ghost"
            size="small"
            onPress={() => onTabChange('store')}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
          {state.products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  welcomeSection: {
    margin: theme.spacing.md,
  },
  welcomeTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  quickActionsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.sm,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  quickActionContent: {
    marginTop: theme.spacing.sm,
  },
  quickActionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as any,
    color: 'white',
    marginBottom: theme.spacing.xs,
  },
  quickActionSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresSection: {
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  featureCard: {
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  productsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  productsScroll: {
    paddingLeft: theme.spacing.sm,
  },
  productCard: {
    marginHorizontal: theme.spacing.sm,
    width: 160,
  },
  productImage: {
    height: 120,
    backgroundColor: '#ecfdf5',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: theme.spacing.sm,
  },
  productName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  productCategory: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  productPrice: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.primary,
  },
});