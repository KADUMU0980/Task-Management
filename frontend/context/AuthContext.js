'use client';
import axios from 'axios';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  const getAuthHeader = useCallback((tkn) => ({
    headers: { Authorization: `Bearer ${tkn || token}` },
  }), [token]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('taskflow_token');
    const storedUser = localStorage.getItem('taskflow_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      axios
        .get(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, { name, email, password });
      const { token: tkn, user: usr } = res.data;
      setToken(tkn);
      setUser(usr);
      localStorage.setItem('taskflow_token', tkn);
      localStorage.setItem('taskflow_user', JSON.stringify(usr));
      toast.success('Welcome to TaskFlow! 🎉');
      router.push('/dashboard');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      const { token: tkn, user: usr } = res.data;
      setToken(tkn);
      setUser(usr);
      localStorage.setItem('taskflow_token', tkn);
      localStorage.setItem('taskflow_user', JSON.stringify(usr));
      toast.success(`Welcome back, ${usr.name}! 👋`);
      router.push('/dashboard');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const updateProfile = async (data) => {
    try {
      const res = await axios.put(`${API}/api/auth/profile`, data, getAuthHeader());
      setUser(res.data.user);
      localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
      toast.success('Profile updated!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axios.put(
        `${API}/api/auth/password`,
        { currentPassword, newPassword },
        getAuthHeader()
      );
      const { token: tkn } = res.data;
      setToken(tkn);
      localStorage.setItem('taskflow_token', tkn);
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Password change failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout, updateProfile, changePassword, getAuthHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
