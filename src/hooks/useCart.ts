import { useState } from 'react';
import { useApp } from '../context/AppContext';

export const useCart = () => {
  const { state, addToCart, removeFromCart } = useApp();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      const newQuantities = { ...quantities };
      delete newQuantities[productId];
      setQuantities(newQuantities);
      removeFromCart(productId);
    } else {
      setQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
    }
  };

  const getQuantity = (productId: number) => {
    return quantities[productId] || 1;
  };

  const getTotalPrice = () => {
    return state.cart.reduce((total, item) => {
      const quantity = getQuantity(item.id);
      return total + (item.price * quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return state.cart.length;
  };

  return {
    cart: state.cart,
    quantities,
    updateQuantity,
    getQuantity,
    getTotalPrice,
    getCartItemCount,
    addToCart,
    removeFromCart,
  };
};