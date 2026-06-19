import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'admin' | 'manager' | 'executive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin user so the app starts in a ready-to-test state
const DEFAULT_USER: User = {
  id: 'usr-1001',
  name: 'Anuja Sharma',
  email: 'anuja.sharma@aicrm.com',
  role: 'admin',
  teamId: 'team-alpha',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

  const login = (email: string, role: UserRole) => {
    setUser({
      id: `usr-${Math.floor(Math.random() * 9000) + 1000}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role,
      teamId: role === 'executive' ? 'team-alpha' : undefined,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    } else {
      login('test.user@aicrm.com', role);
    }
  };

  const value: AuthContextType = {
    user,
    role: user ? user.role : null,
    login,
    logout,
    switchRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
