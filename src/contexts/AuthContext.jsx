import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, clearAccessToken } from '../services/api';
import { notify } from '../utils/toast';

export const AuthContext = createContext();

const AuthState = (props) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();

  // Try to restore session on mount via refresh token
  const restoreSession = useCallback(async () => {
    try {
      const token = await authApi.refresh();
      if (token) {
        const { data } = await authApi.getMe();
        if (data.success) {
          setUser(data.data.user);
          setIsAuthenticated(true);
        }
      }
    } catch {
      // No valid session
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout even if API fails
    }
    clearAccessToken();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
    notify.info('Logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        authLoading,
        handleLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
