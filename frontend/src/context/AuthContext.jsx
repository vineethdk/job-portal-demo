import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('jobportal_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('jobportal_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jobportal_user');
    }
  }, [user]);

  const loginUser = async (credentials) => {
    const res = await api.login(credentials);
    setUser(res.data);
    return res.data;
  };

  const registerUser = async (data) => {
    const res = await api.register(data);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
