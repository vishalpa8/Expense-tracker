import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  fullName: string | null;
  login: (token: string, username: string, fullName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isTokenValid(localStorage.getItem('token')));
  const [username, setUsername] = useState<string | null>(() =>
    isTokenValid(localStorage.getItem('token')) ? localStorage.getItem('username') : null
  );
  const [fullName, setFullName] = useState<string | null>(() =>
    isTokenValid(localStorage.getItem('token')) ? localStorage.getItem('fullName') : null
  );

  const login = useCallback((token: string, username: string, fullName: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('fullName', fullName);
    setIsAuthenticated(true);
    setUsername(username);
    setFullName(fullName);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    setIsAuthenticated(false);
    setUsername(null);
    setFullName(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, fullName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
