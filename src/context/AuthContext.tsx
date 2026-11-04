import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { refreshSession, setAccessToken, setSessionExpiredHandler } from '../services/api';
import { authApi, Me } from '../services/auth';

interface AuthValue {
  user: Me | null;
  /** Sessiya tiklash urinishi tugadimi (kirish holati aniqmi) */
  ready: boolean;
  reload: () => Promise<Me | null>;
  logout: () => Promise<void>;
  /** Tokenlar server tomonda bekor qilingandan keyin (boshqa qurilmalardan chiqish) */
  clear: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);

  const clear = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  const reload = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
      return me;
    } catch {
      clear();
      return null;
    }
  }, [clear]);

  useEffect(() => {
    setSessionExpiredHandler(clear);
    // Access faqat xotirada: sahifa yangilanganda cookie orqali tiklanadi
    refreshSession()
      .then((ok) => (ok ? reload() : null))
      .finally(() => setReady(true));
  }, [clear, reload]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clear();
    }
  }, [clear]);

  const value = useMemo(() => ({ user, ready, reload, logout, clear }), [user, ready, reload, logout, clear]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthValue => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  }
  return value;
};

const Waiting: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
    <CircularProgress />
  </Box>
);

export const RequireAuth: React.FC = () => {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Waiting />;
  if (!user) {
    return <Navigate to={`/kirish?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  return <Outlet />;
};

export const RequireProfile: React.FC = () => {
  const { user } = useAuth();
  // Oraliq marshrut: kabinet ma'lumoti ichki sahifalarga yetib borsin
  const context = useOutletContext();
  return user?.has_profile ? <Outlet context={context} /> : <Navigate to="/kabinet/profil-qoshish" replace />;
};
