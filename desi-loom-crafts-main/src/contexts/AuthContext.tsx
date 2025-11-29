import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // NOTE: We intentionally avoid using localStorage for auth persistence here.
  // Proper persistence should be handled by secure http-only cookies or tokens
  // managed by the backend. For now initialize as not authenticated.
  useEffect(() => {
    // Try to restore a cached user from localStorage so profile page is
    // visible after a refresh during development. In production use secure
    // cookies or tokens instead of localStorage.
    try {
      const raw = localStorage.getItem('handloom_user');
      if (raw) {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('Failed to parse cached user from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = await api.login(email, password);
      
      if (foundUser) {
        const { password: _, _id, id, ...rest } = foundUser as any;
        // normalize backend _id -> id for frontend usage
        const normalized = { id: (id || _id)?.toString(), ...rest } as any;
        // keep user in memory; backend should handle sessions or tokens
        setUser(normalized);
        setIsAuthenticated(true);
        try { localStorage.setItem('handloom_user', JSON.stringify(normalized)); } catch (e) { console.warn('Failed to persist user to localStorage', e); }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // basic client-side validation
    if (!email || !email.trim() || !password || password.length < 6 || !name || !name.trim()) {
      return false;
    }

    try {
      const newUser = await api.signup(email, password, name);

      if (newUser && !newUser.error) {
        const { password: _, _id, id, ...rest } = newUser as any;
        const normalized = { id: (id || _id)?.toString(), ...rest } as any;
        setUser(normalized);
        setIsAuthenticated(true);
        try { localStorage.setItem('handloom_user', JSON.stringify(normalized)); } catch (e) { console.warn('Failed to persist user to localStorage', e); }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear in-memory auth state. Backend should expire session/token.
    setUser(null);
    setIsAuthenticated(false);
    try { localStorage.removeItem('handloom_user'); } catch (e) { console.warn('Failed to remove cached user from localStorage', e); }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      // Try to persist update to backend. If backend doesn't support this
      // route yet, the call will fail silently and we'll keep in-memory state.
      (async () => {
        try {
          await api.updateUser(updatedUser.id, updates);
        } catch (e) {
          console.warn('Failed to update user on backend', e);
        }
      })();
      try { localStorage.setItem('handloom_user', JSON.stringify(updatedUser)); } catch (e) { console.warn('Failed to persist updated user to localStorage', e); }
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
