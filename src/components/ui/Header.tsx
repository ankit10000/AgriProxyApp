import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Bell, Menu, ShoppingCart } from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { MenuOverlay } from "./MenuOverlay";
import { LanguageToggle } from "./LanguageToggle";
import { theme } from "../../styles/theme";
import { TabName } from "../../types";

interface HeaderProps {
  onTabChange: (tab: TabName) => void;
}

const Logo: React.FC = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require("../../../assets/Iconondark.png")}
      style={styles.logoImage}
      resizeMode="contain"
    />
  </View>
);

export const Header: React.FC<HeaderProps> = ({ onTabChange }) => {
  const { state } = useApp();
  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const cartItemCount = state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <Logo />

        <View style={styles.headerActions}>
          <LanguageToggle />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onTabChange("notifications")}
          >
            <Bell size={22} color={theme.colors.primary} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onTabChange("cart")}
          >
            <ShoppingCart size={22} color={theme.colors.primary} />
            {cartItemCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowMenu(true)}
          >
            <Menu size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <MenuOverlay showMenu={showMenu} onClose={() => setShowMenu(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  logoContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: -30,
  },
  logoImage: {
    height: 60,
    width: 160,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  actionButton: {
    position: "relative",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: theme.typography.sizes.xs,
    color: "white",
    fontWeight: theme.typography.weights.bold as any,
  },
});
