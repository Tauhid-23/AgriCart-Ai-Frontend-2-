import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

// Create Cart Context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();

  // Fetch cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      console.log('🛒 Fetching cart items...');
      const res = await api.get('/marketplace/cart');
      console.log('✅ Cart items fetched:', res.data);
      
      // Handle both possible response structures
      if (res.data.cart) {
        // New structure: { success: true, cart: { items: [...] } }
        setCartItems(res.data.cart.items || []);
      } else if (res.data.items) {
        // Old structure: { success: true, items: [...] }
        setCartItems(res.data.items || []);
      } else {
        // Fallback to empty array
        setCartItems([]);
      }
    } catch (error) {
      console.error('❌ Error fetching cart items:', error);
      setError('Failed to load cart items: ' + (error.response?.data?.message || error.message));
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    console.log('🛒 Adding to cart:', { productId, quantity, isAuthenticated, user });
    
    if (!isAuthenticated || !user) {
      const errorMsg = 'User not authenticated - please login first';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    try {
      console.log('📤 Adding to cart:', { productId, quantity });
      const res = await api.post('/marketplace/cart/add', {
        productId,
        quantity
      });
      
      console.log('✅ Item added to cart:', res.data);
      
      // Handle both possible response structures
      if (res.data.cart) {
        // New structure: { success: true, cart: { items: [...] } }
        setCartItems(res.data.cart.items || []);
      } else if (res.data.items) {
        // Old structure: { success: true, items: [...] }
        setCartItems(res.data.items || []);
      } else {
        // Fallback - refetch cart items
        await fetchCartItems();
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error request:', error.request);
      console.error('❌ Error config:', error.config);
      
      // Provide more detailed error information
      let errorMessage = 'Failed to add product to cart';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Network error: No response received from server';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = `Request error: ${error.message}`;
      }
      
      throw new Error(errorMessage);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    if (quantity < 1) return;

    try {
      const res = await api.put(`/marketplace/cart/update/${itemId}`, {
        quantity
      });
      
      // Handle both possible response structures
      if (res.data.cart) {
        // New structure: { success: true, cart: { items: [...] } }
        setCartItems(res.data.cart.items || []);
      } else if (res.data.items) {
        // Old structure: { success: true, items: [...] }
        setCartItems(res.data.items || []);
      } else {
        // Fallback - refetch cart items
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    try {
      const res = await api.delete(`/marketplace/cart/remove/${itemId}`);
      
      // Handle both possible response structures
      if (res.data.cart) {
        // New structure: { success: true, cart: { items: [...] } }
        setCartItems(res.data.cart.items || []);
      } else if (res.data.items) {
        // Old structure: { success: true, items: [...] }
        setCartItems(res.data.items || []);
      } else {
        // Fallback - refetch cart items
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    try {
      const res = await api.delete('/marketplace/cart/clear');
      
      // Handle both possible response structures
      if (res.data.cart) {
        // New structure: { success: true, cart: { items: [...] } }
        setCartItems(res.data.cart.items || []);
      } else if (res.data.items) {
        // Old structure: { success: true, items: [...] }
        setCartItems(res.data.items || []);
      } else {
        // Fallback to empty array
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartCount,
    getCartTotal,
    clearCart,
    fetchCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;