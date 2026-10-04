import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, getToken, setToken } from './api.js';
import { PageLoader } from './ui.jsx';
import { Forbidden } from './pages/Static.jsx';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!getToken());
  useEffect(() => {
    if (!getToken()) return;
    api('/me').then(setUser).catch(() => setToken(null)).finally(() => setReady(true));
  }, []);
  const enter = ({ token, user }) => { setToken(token); setUser(user); return user; };
  const value = {
    user, ready, setUser,
    login: (email, password) => api('/auth/login', { method: 'POST', body: { email, password } }).then(enter),
    register: (data) => api('/auth/register', { method: 'POST', body: data }).then(enter),
    logout: () => { setToken(null); setUser(null); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Protege páginas privadas; recuerda a dónde quería ir la persona.
export function Private({ children, admin }) {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <PageLoader />;
  if (!user) return <Navigate to="/ingresar" replace state={{ from: loc.pathname + loc.search }} />;
  if (admin && user.role !== 'admin') return <Forbidden />;
  return children;
}
