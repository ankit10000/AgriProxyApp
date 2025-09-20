import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Filter, Star, ShoppingCart, Leaf, Heart } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';
import { useSearch } from '../../hooks/useSearch';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchBar } from '../../components/ui/SearchBar';
import { theme } from '../../styles/theme';
import { formatPrice } from '../../utils/helpers';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import { TabName, Product } from '../../types';

interface StoreScreenProps {
  onTabChange: (tab: TabName) => void;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({ onTabChange }) => {
  const { state, dispatch } = useApp();
  const { t } = useLocalization();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const { searchQuery, setSearchQuery, debouncedSearch } = useSearch();

  const filteredProducts = state.products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = !debouncedSearch || 
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const toggleFavorite = (productId: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: productId });
  };

  const isFavorite = (productId: number) => {
    return state.favorites.includes(productId);
  };

  const CategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.categoryFilter}
      contentContainerStyle={styles.categoryFilterContent}
    >
      {PRODUCT_CATEGORIES.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategoryButton
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category && styles.selectedCategoryButtonText
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productImage}>
          <Leaf size={32} color={theme.colors.secondary} />
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(product.id)}
        >
          <Heart 
            size={20} 
            color={isFavorite(product.id) ? theme.colors.error : theme.colors.textSecondary}
            fill={isFavorite(product.id) ? theme.colors.error : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={14} color="#fbbf24" fill="#fbbf24" />
          <Text style={styles.ratingText}>{product.rating}</Text>
        </View>

        <View style={styles.productFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
            {!product.inStock && (
              <Badge variant="error" size="small">{t('store.outOfStock')}</Badge>
            )}
          </View>
          
          <Button
            title={t('store.addToCart')}
            size="small"
            onPress={() => addToCart(product)}
            disabled={!product.inStock}
            style={styles.addToCartButton}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('store.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('placeholders.qualityProducts')}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={{ flex: 1 }}>
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder={t('store.searchProducts')}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <CategoryFilter />

      {/* Product Grid */}
      <ScrollView style={styles.productsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredProducts.length} {filteredProducts.length !== 1 ? t('store.productsFound') : t('store.product')}
          </Text>
          {debouncedSearch && (
            <Text style={styles.searchResultText}>
              {t('store.searchFor')} "{debouncedSearch}"
            </Text>
          )}
        </View>

        <View style={styles.productGrid}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <Card style={styles.emptyState}>
            <ShoppingCart size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>{t('placeholders.noProductsFound')}</Text>
            <Text style={styles.emptyStateSubtitle}>
              {debouncedSearch
                ? `${t('store.noProductsMatch')} "${debouncedSearch}"`
                : t('store.noProductsCategory')
              }
            </Text>
            {debouncedSearch && (
              <Button
                title={t('cart.clearSearch')}
                variant="outline"
                size="small"
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              />
            )}
          </Card>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => onTabChange('cart')}
        >
          <ShoppingCart size={24} color="white" />
          <Text style={styles.cartButtonText}>
            {t('store.viewCart')} ({state.cart.reduce((sum, item) => sum + item.quantity, 0)})
          </Text>
          {state.cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{state.cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    marginBottom: theme.spacing.md,
  },
  filterButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  categoryFilter: {
    paddingLeft: theme.spacing.md,
    maxHeight: 50,
    minHeight: 50,
  },
  categoryFilterContent: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  categoryButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 30,
  },
  selectedCategoryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.weights.medium as any,
  },
  selectedCategoryButtonText: {
    color: 'white',
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  resultsHeader: {
    marginBottom: theme.spacing.md,
  },
  resultsText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium as any,
  },
  searchResultText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  productHeader: {
    position: 'relative',
  },
  productImage: {
    height: 120,
    backgroundColor: '#ecfdf5',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
  },
  productInfo: {
    padding: theme.spacing.sm,
  },
  productName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    minHeight: 36,
  },
  productCategory: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  ratingText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  productFooter: {
    marginTop: theme.spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  productPrice: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.primary,
  },
  addToCartButton: {
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.lg,
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
  clearSearchButton: {
    marginTop: theme.spacing.sm,
  },
  bottomAction: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cartButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    position: 'relative',
  },
  cartButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as any,
    marginLeft: theme.spacing.sm,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: theme.spacing.md,
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold as any,
  },
});