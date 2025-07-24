import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Search, X, Leaf } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useDebounce } from '../../hooks/useDebounce';
import { theme } from '../../styles/theme';
import { Product } from '../../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

interface SearchSuggestion {
  id: number;
  name: string;
  category: string;
  type: 'product' | 'category';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search crops, pesticides, advisory...",
  showSuggestions = true,
}) => {
  const { state } = useApp();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearch && showSuggestions) {
      const productSuggestions: SearchSuggestion[] = state.products
        .filter(product =>
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.category.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        .slice(0, 5)
        .map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          type: 'product' as const,
        }));

      // Add unique category suggestions
      const categories = Array.from(new Set(
        state.products
          .filter(product => 
            product.category.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
          .map(product => product.category)
      )).slice(0, 2);

      const categorySuggestions: SearchSuggestion[] = categories.map((category, index) => ({
        id: 1000 + index, // Unique ID for categories
        name: category,
        category: `All ${category}`,
        type: 'category' as const,
      }));

      setSuggestions([...productSuggestions, ...categorySuggestions]);
      setShowSuggestionsList(true);
    } else {
      setShowSuggestionsList(false);
    }
  }, [debouncedSearch, state.products, showSuggestions]);

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    onSearchChange(suggestion.name);
    setShowSuggestionsList(false);
  };

  const clearSearch = () => {
    onSearchChange('');
    setShowSuggestionsList(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={() => {
            if (debouncedSearch && suggestions.length > 0) {
              setShowSuggestionsList(true);
            }
          }}
          onBlur={() => {
            // Delay hiding to allow suggestion tap
            setTimeout(() => setShowSuggestionsList(false), 200);
          }}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Search Suggestions */}
      {showSuggestionsList && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView 
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={`${suggestion.type}-${suggestion.id}`}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <View style={styles.suggestionIcon}>
                  <Leaf size={16} color={theme.colors.secondary} />
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionName}>{suggestion.name}</Text>
                  <Text style={styles.suggestionCategory}>
                    {suggestion.type === 'category' ? suggestion.category : suggestion.category}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    zIndex: 1000,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    paddingVertical: 0, // Remove default padding on Android
  },
  clearButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.xs,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 240,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text,
    marginBottom: 2,
  },
  suggestionCategory: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
});