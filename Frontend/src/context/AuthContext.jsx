import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const login = async (payload) => { const r = await api.post('/auth/login', payload); setUser(r.data.user); return r.data.user; };
  const register = async (payload) => { const r = await api.post('/auth/register', payload); setUser(r.data.user); return r.data.user; };
  const logout = async () => { try { await api.post('/auth/logout'); } finally { setUser(null); } };
  const refreshUser = async () => { const r = await api.get('/auth/me'); setUser(r.data.user); return r.data.user; };
  return <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);