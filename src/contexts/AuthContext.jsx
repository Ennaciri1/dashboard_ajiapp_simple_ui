import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadAuthData, saveAuthData, clearAuthData } from '../services/storage/authStorage';
import { isRoleAllowed } from '../constants/auth';
import { subscribeToUnauthorized, subscribeToTokenUpdate } from '../services/api/httpClient';

const AuthContext = createContext(null);

const EMPTY_STATE = { token: null, refreshToken: null, user: null };

const normalizeState = (state) => {
  if (!state?.token || !state?.user || !isRoleAllowed(state.user.role)) {
    return { ...EMPTY_STATE };
  }
  return {
    token: state.token,
    refreshToken: state.refreshToken ?? null,
    user: state.user
  };
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialState = normalizeState(loadAuthData());
    setToken(initialState.token);
    setRefreshToken(initialState.refreshToken);
    setUser(initialState.user);
    setIsLoading(false);

    const unsubscribeUnauthorized = subscribeToUnauthorized(() => {
      setToken(null);
      setRefreshToken(null);
      setUser(null);
    });

    const unsubscribeTokenUpdate = subscribeToTokenUpdate((authData) => {
      const normalized = normalizeState(authData);
      setToken(normalized.token);
      setRefreshToken(normalized.refreshToken);
      setUser(normalized.user);
    });

    return () => {
      unsubscribeUnauthorized();
      unsubscribeTokenUpdate();
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user && token && isRoleAllowed(user.role)) {
      saveAuthData({ user, token, refreshToken });
    } else {
      clearAuthData();
    }
  }, [user, token, refreshToken, isLoading]);

  const login = ({ token: accessToken, refreshToken: refresh, user: userData }) => {
    setToken(accessToken);
    setRefreshToken(refresh);
    setUser(userData);
    saveAuthData({ token: accessToken, refreshToken: refresh, user: userData });
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    clearAuthData();
  };

  const value = useMemo(() => ({
    isAuthenticated: Boolean(token && user),
    token,
    refreshToken,
    user,
    isLoading,
    login,
    logout,
  }), [token, refreshToken, user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
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
