import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    console.log('🔍 Checking authentication...');
    console.log('   Token exists:', !!token);
    console.log('   Saved user exists:', !!savedUser);
    
    if (token && savedUser) {
      try {
        console.log('✅ Token found, verifying with backend...');
        const response = await authAPI.getMe();
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', response.data.user.email);
      } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      console.log('⚠️ No token found - user needs to login');
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    console.log('🔐 Attempting login...');
    try {
      const response = await authAPI.login({ email, password });
      
      console.log('✅ Login successful');
      console.log('   Token:', response.data.data.token.substring(0, 20) + '...');
      console.log('   User:', response.data.data.user.email);
      
      // Store token and user data
      sessionStorage.setItem('token', response.data.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response.data.data.user };
    } catch (error) {
      console.error('Login error:', error);
      // Make sure to set isAuthenticated to false on login error
      setIsAuthenticated(false);
      
      // Remove any existing token
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    console.log('📝 Attempting registration...');
    try {
      const response = await authAPI.register(userData);
      
      console.log('✅ Registration successful');
      console.log('   Token:', response.data.data.token.substring(0, 20) + '...');
      console.log('   User:', response.data.data.user.email);
      
      // Store token and user data
      sessionStorage.setItem('token', response.data.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response.data.data.user };
    } catch (error) {
      console.error('Registration error:', error);
      // Make sure to set isAuthenticated to false on registration error
      setIsAuthenticated(false);
      
      // Remove any existing token
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Provide more detailed error message
      let errorMessage = 'Registration failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    // Clear session storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;