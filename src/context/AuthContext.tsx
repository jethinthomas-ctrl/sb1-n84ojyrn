import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setAuthState({
        isAuthenticated: true,
        currentUser: JSON.parse(savedUser),
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      setAuthState({
        isAuthenticated: true,
        currentUser: user,
      });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u) => u.email === userData.email);

    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    setAuthState({
      isAuthenticated: true,
      currentUser: newUser,
    });
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return true;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
    });
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
