import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Home, Store, ShoppingCart, User, Bell, FlaskConical, Bug, Calendar } from 'lucide-react-native';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { StoreScreen } from '../screens/Store/StoreScreen';
import { SoilTestingScreen } from '../screens/SoilTesting/SoilTestingScreen';
import { PlantDiseaseScreen } from '../screens/PlantDisease/PlantDiseaseScreen';
import { Header } from '../components/ui/Header';
import { useApp } from '../context/AppContext';
import { theme } from '../styles/theme';
import { TabName } from '../types';

// Placeholder screens for missing tabs
const ProfileScreen = ({ onTabChange }: { onTabChange: (tab: TabName) => void }) => (
  <View style={styles.placeholderContainer}>
    <User size={48} color={theme.colors.textSecondary} />
    <Text style={styles.placeholderTitle}>Profile</Text>
    <Text style={styles.placeholderSubtitle}>User profile coming soon</Text>
  </View>
);

const NotificationsScreen = ({ onTabChange }: { onTabChange: (tab: TabName) => void }) => {
  const { state } = useApp();
  
  return (
    <ScrollView style={styles.notificationsContainer}>
      <View style={styles.notificationsHeader}>
        <Text style={styles.notificationsTitle}>Notifications</Text>
        <Text style={styles.notificationsSubtitle}>Stay updated with your farm</Text>
      </View>
      
      {state.notifications.map((notification) => (
        <View key={notification.id} style={[styles.notificationCard, !notification.read && styles.unreadNotification]}>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>
      ))}
    </ScrollView>
  );
};

const CalendarScreen = ({ onTabChange }: { onTabChange: (tab: TabName) => void }) => (
  <View style={styles.placeholderContainer}>
    <Calendar size={48} color={theme.colors.textSecondary} />
    <Text style={styles.placeholderTitle}>Crop Calendar</Text>
    <Text style={styles.placeholderSubtitle}>Calendar feature coming soon</Text>
  </View>
);

const CartScreen = ({ onTabChange }: { onTabChange: (tab: TabName) => void }) => (
  <View style={styles.placeholderContainer}>
    <ShoppingCart size={48} color={theme.colors.textSecondary} />
    <Text style={styles.placeholderTitle}>Cart</Text>
    <Text style={styles.placeholderSubtitle}>Shopping cart coming soon</Text>
  </View>
);

const AppNavigator = () => {
  const [activeTab, setActiveTab] = useState<TabName>('home');

  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
  };

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onTabChange={handleTabChange} />;
      case 'store':
        return <StoreScreen onTabChange={handleTabChange} />;
      case 'soiltesting':
        return <SoilTestingScreen onTabChange={handleTabChange} />;
      case 'plantdisease':
        return <PlantDiseaseScreen onTabChange={handleTabChange} />;
      case 'profile':
        return <ProfileScreen onTabChange={handleTabChange} />;
      case 'notifications':
        return <NotificationsScreen onTabChange={handleTabChange} />;
      case 'calendar':
        return <CalendarScreen onTabChange={handleTabChange} />;
      case 'cart':
        return <CartScreen onTabChange={handleTabChange} />;
      default:
        return <HomeScreen onTabChange={handleTabChange} />;
    }
  };

  const TabButton = ({ tab, icon: Icon, label }: { tab: TabName; icon: any; label: string }) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        style={[styles.tabButton, isActive && styles.activeTabButton]}
        onPress={() => handleTabChange(tab)}
      >
        <Icon 
          size={isActive ? 24 : 20} 
          color={isActive ? theme.colors.primary : theme.colors.textSecondary} 
        />
        <Text style={[
          styles.tabLabel, 
          isActive && styles.activeTabLabel
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onTabChange={handleTabChange} />
      <View style={styles.screenContainer}>
        {renderCurrentScreen()}
      </View>
      
      <View style={styles.tabBar}>
        <TabButton tab="home" icon={Home} label="Home" />
        <TabButton tab="store" icon={Store} label="Store" />
        <TabButton tab="soiltesting" icon={FlaskConical} label="Soil" />
        <TabButton tab="plantdisease" icon={Bug} label="Plant Disease" />
        <TabButton tab="profile" icon={User} label="Profile" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 8,
    paddingTop: 8,
    height: 65,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  activeTabButton: {
    // Additional styling for active tab if needed
  },
  tabLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  activeTabLabel: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold as any,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
  },
  placeholderTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  placeholderSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  // Notifications Screen Styles
  notificationsContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  notificationsHeader: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  notificationsTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  notificationsSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  notificationMessage: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  notificationTime: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 4,
    marginLeft: theme.spacing.sm,
  },
});

export default AppNavigator;