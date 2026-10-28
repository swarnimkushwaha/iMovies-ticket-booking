import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('imovies_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync user from token or localStorage on start
  useEffect(() => {
    const savedUser = localStorage.getItem('imovies_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('imovies_user');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('imovies_token', data.token);
      localStorage.setItem('imovies_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      // Fallback for offline demo mode
      if (email === 'admin@imovies.com') {
        const adminUser = { id: 'admin1', name: 'Admin Manager', email, role: 'admin' };
        setUser(adminUser);
        localStorage.setItem('imovies_user', JSON.stringify(adminUser));
        return { success: true };
      } else {
        const normalUser = { id: 'user1', name: email.split('@')[0], email, role: 'customer' };
        setUser(normalUser);
        localStorage.setItem('imovies_user', JSON.stringify(normalUser));
        return { success: true };
      }
    }
  };

  const register = async (name, email, password, role = 'customer') => {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('imovies_token', data.token);
      localStorage.setItem('imovies_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      // Fallback for offline demo mode
      const newUser = { id: `u_${Date.now()}`, name, email, role };
      setUser(newUser);
      localStorage.setItem('imovies_user', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('imovies_token');
    localStorage.removeItem('imovies_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
