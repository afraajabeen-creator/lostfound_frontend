import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

/**
 * Authentication Context providing global user and authentication state.
 * 
 * VIVA TIP:
 * React Context API enables state sharing across components without "prop drilling".
 * On app load, useEffect checks localStorage for an existing JWT token and restores the user session.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [token, setToken] = useState(authService.getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate session on load
    const initAuth = async () => {
      const storedToken = authService.getStoredToken();
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('lostfound_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session expired or invalid:', err);
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success) {
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isStudent = user?.role === 'ROLE_STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isStudent,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
