import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AuthState } from '../types';
import { mockUsers } from '../mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
  });

  // Check for stored auth on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        setAuthState(auth);
      } catch (e) {
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication - in production, this would call a real API
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'demo123') {
      const newAuthState: AuthState = {
        isAuthenticated: true,
        user,
        token: `token_${user.id}`,
      };
      setAuthState(newAuthState);
      localStorage.setItem('adminAuth', JSON.stringify(newAuthState));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false });
    localStorage.removeItem('adminAuth');
  };

  const hasPermission = (requiredRoles: string[]): boolean => {
    if (!authState.user) return false;
    return requiredRoles.includes(authState.user.role);
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
