import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Leaf } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { theme } from '../../styles/theme';
import { formatPrice } from '../../utils/helpers';
import { TabName, CartItem } from '../../types';

interface CartScreenProps {
  onTabChange: (tab: TabName) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({ onTabChange }) => {
  const { state, updateCartQuantity, removeFromCart } = useApp();
  const { t } = useLocalization();

  const handleQuantityUpdate = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const CartItemCard: React.FC<{ item: CartItem }> = ({ item }) => (
    <Card style={styles.cartItemCard}>
      <View style={styles.cartItemContainer}>
        <View style={styles.cartItemImage}>
          <Leaf size={24} color={theme.colors.secondary} />
        </View>

        <View style={styles.cartItemInfo}>
          <Text style={styles.cartItemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.cartItemCategory}>{item.category}</Text>
          <Text style={styles.cartItemPrice}>{formatPrice(item.price)}</Text>
        </View>

        <View style={styles.cartItemActions}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityUpdate(item.id, item.quantity - 1)}
            >
              <Minus size={16} color={theme.colors.primary} />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityUpdate(item.id, item.quantity + 1)}
            >
              <Plus size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemTotal}>
            {formatPrice(item.price * item.quantity)}
          </Text>
        </View>
      </View>
    </Card>
  );

  const EmptyCart = () => (
    <Card style={styles.emptyState}>
      <ShoppingCart size={64} color={theme.colors.textSecondary} />
      <Text style={styles.emptyStateTitle}>{t('cart.emptyCart')}</Text>
      <Text style={styles.emptyStateSubtitle}>
        {t('cart.emptyCartSubtitle')}
      </Text>
      <Button
        title={t('cart.browseProducts')}
        onPress={() => onTabChange('store')}
        style={styles.browseButton}
      />
    </Card>
  );

  const CartSummary = () => (
    <Card style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{t('cart.orderSummary')}</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{t('cart.items')} ({getCartItemsCount()})</Text>
        <Text style={styles.summaryValue}>{formatPrice(getCartTotal())}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{t('cart.deliveryFee')}</Text>
        <Text style={styles.summaryValue}>{t('cart.free')}</Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryRow}>
        <Text style={styles.summaryTotal}>{t('cart.total')}</Text>
        <Text style={styles.summaryTotalValue}>{formatPrice(getCartTotal())}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('cart.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {state.cart.length} {state.cart.length === 1 ? t('cart.item') : t('cart.itemsInCart')}
        </Text>
      </View>

      {state.cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyCart />
        </View>
      ) : (
        <>
          <ScrollView style={styles.cartItemsContainer} showsVerticalScrollIndicator={false}>
            {state.cart.map(item => (
              <CartItemCard key={item.id} item={item} />
            ))}

            <CartSummary />
          </ScrollView>

          <View style={styles.bottomAction}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => {
                // Handle checkout logic here
              }}
            >
              <Text style={styles.checkoutButtonText}>
                {t('cart.proceedToCheckout')}
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
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
    marginBottom: theme.spacing.md,
  },
  browseButton: {
    marginTop: theme.spacing.sm,
  },
  cartItemsContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  cartItemCard: {
    marginBottom: theme.spacing.md,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#ecfdf5',
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  cartItemInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  cartItemName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cartItemCategory: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  cartItemPrice: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.primary,
  },
  cartItemActions: {
    alignItems: 'flex-end',
  },
  removeButton: {
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  quantityButton: {
    padding: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    paddingHorizontal: theme.spacing.sm,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
  },
  summaryCard: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    fontWeight: theme.typography.weights.medium as any,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  summaryTotal: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text,
  },
  summaryTotalValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.primary,
  },
  bottomAction: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as any,
    marginRight: theme.spacing.sm,
  },
});