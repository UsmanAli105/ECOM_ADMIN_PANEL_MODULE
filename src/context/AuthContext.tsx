import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, checkSession } from '../services/authService';

export interface User {
  userId: number;
  displayName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    email: string,
    phone: string,
    displayName: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // On mount, check session and refresh token if needed
  useEffect(() => {
    const verifySession = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!storedToken || !userStr) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }
      const userObj = JSON.parse(userStr);
      try {
        const res = await checkSession(storedToken, userObj.userId);
        const isValid = res.data?.checkSessionResponseBean?.valid;
        if (isValid) {
          setUser(userObj);
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  useEffect(() => {
    if (token) {
      // Optionally decode token for user info, or fetch user profile here
      // For now, do nothing (user is set on login)
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiLogin(username, password);
      const loginBean = res.data?.userLoginResponseBean;
      const jwt = loginBean?.token;
      if (jwt) {
        setToken(jwt);
        localStorage.setItem('token', jwt);
        const userObj = {
          userId: loginBean.userId,
          displayName: loginBean.displayName,
          role: loginBean.role,
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj)); // Store user
      } else {
        const backendMsg = res.data?.status?.message || 'Invalid login response';
        throw new Error(backendMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    password: string,
    email: string,
    phone: string,
    displayName: string
  ) => {
    setLoading(true);
    try {
      const res = await apiRegister(username, password, email, phone, displayName);
      // Accept either code === 10000 or success === true as success
      const isSuccess =
        res.data?.code === 10000 ||
        res.data?.success === true ||
        (res.data?.status && res.data.status.code === 10000);

      if (isSuccess) {
        // Registration succeeded, no token expected
        return;
      } else {
        // Try to show backend message if available
        const backendMsg =
          res.data?.message ||
          res.data?.status?.message ||
          'Invalid registration response';
        throw new Error(backendMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Clear user
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 