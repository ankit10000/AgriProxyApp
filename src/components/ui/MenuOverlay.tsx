import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, Pressable } from 'react-native';
import { X, Settings, HelpCircle, Info, LogOut } from 'lucide-react-native';
import { theme } from '../../styles/theme';

interface MenuOverlayProps {
  showMenu: boolean;
  onClose: () => void;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ showMenu, onClose }) => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            onClose();
            // Add logout logic here
            console.log('User logged out');
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      icon: Settings,
      title: 'Settings',
      onPress: () => {
        onClose();
        console.log('Settings pressed');
      }
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      onPress: () => {
        onClose();
        console.log('Help & Support pressed');
      }
    },
    {
      icon: Info,
      title: 'About AgriProxy',
      onPress: () => {
        onClose();
        console.log('About AgriProxy pressed');
      }
    },
    {
      icon: LogOut,
      title: 'Logout',
      onPress: handleLogout,
      isDestructive: true
    }
  ];

  return (
    <Modal
      visible={showMenu}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable 
          style={styles.backdrop} 
          onPress={onClose}
        />
        
        <View style={styles.menuContainer}>
          {/* Menu Header */}
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContent}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <item.icon 
                  size={20} 
                  color={item.isDestructive ? theme.colors.error : theme.colors.textSecondary} 
                  style={styles.menuIcon}
                />
                <Text style={[
                  styles.menuItemText,
                  item.isDestructive && styles.destructiveText
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuContainer: {
    width: 280,
    height: '100%',
    backgroundColor: theme.colors.surface,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  menuTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
  },
  menuContent: {
    padding: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xs,
    backgroundColor: 'transparent',
  },
  menuIcon: {
    marginRight: theme.spacing.sm,
  },
  menuItemText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text,
    flex: 1,
  },
  destructiveText: {
    color: theme.colors.error,
  },
});