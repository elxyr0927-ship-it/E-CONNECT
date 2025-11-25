import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './socket';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { reconnectSocket, disconnect } = useSocket();

  useEffect(() => {
    // Check for stored tokens on app start
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    if (accessToken && storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (loginData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      const { user: userData, role: userRole, accessToken, refreshToken } = data;

      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userRole);

      // Store worker-specific data if role is worker
      if (userRole === 'worker' && userData.id) {
        localStorage.setItem('workerId', userData.id);
        localStorage.setItem('workerName', userData.name || userData.username);
        if (userData.workerType) {
          localStorage.setItem('workerType', userData.workerType);
        } else {
          // Default to freelancer if not specified
          localStorage.setItem('workerType', 'freelancer');
        }
      }

      setUser(userData);
      setRole(userRole);
      setIsAuthenticated(true);

      // Ensure socket reconnects with new auth token
      reconnectSocket();

      return { user: userData, role: userRole };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('workerId');
    localStorage.removeItem('workerName');

    setUser(null);
    setRole(null);
    setIsAuthenticated(false);

    // Disconnect socket connection to notify server of logout
    disconnect();
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const { accessToken } = data;

      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      logout(); // If refresh fails, logout
      throw error;
    }
  };

  const value = {
    user,
    role,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
