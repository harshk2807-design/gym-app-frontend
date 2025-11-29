import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = authService.getAdmin();
    if (storedAdmin) {
      setAdmin(storedAdmin);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setAdmin(response.data.admin);
    return response;
  };

  const logout = () => {
    authService.logout();
    setAdmin(null);
  };

  const value = {
    admin,
    login,
    logout,
    loading,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
