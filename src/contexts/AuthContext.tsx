import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AuthState } from '../types';
import { adminLogin } from '../services/api';

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
    try {
      // Call real backend authentication
      const response = await adminLogin(email, password);
      
      const newAuthState: AuthState = {
        isAuthenticated: true,
        user: {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
        },
        token: response.access_token,
      };
      
      setAuthState(newAuthState);
      localStorage.setItem('adminAuth', JSON.stringify(newAuthState));
    } catch (error) {
      throw error;
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
