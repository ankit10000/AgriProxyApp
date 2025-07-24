import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const useSearch = () => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearch) {
      const filtered = state.products.filter(product =>
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedSearch.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearch, state.products]);

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const selectSuggestion = (productName: string) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    suggestions,
    showSuggestions,
    clearSearch,
    selectSuggestion,
  };
};