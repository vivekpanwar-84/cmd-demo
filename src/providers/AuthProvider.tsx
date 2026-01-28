'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/auth/login', '/auth/signup'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // ✅ Load auth ONLY after mount (prevents hydration mismatch)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
  }, []);

  // ✅ Route Guard (runs only after auth loads)
  useEffect(() => {
    if (loading) return;

    if (!token && !isPublicRoute) {
      router.replace('/auth/login');
    }

    if (token && isPublicRoute) {
      router.replace('/');
    }
  }, [token, isPublicRoute, router, loading]);

  // Login
  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });

    setToken(data.token);
    setUser(data.user);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    router.replace('/');
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    router.replace('/auth/login');
  };

  // ✅ Prevent UI render until auth is resolved
  if (loading) return null;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      login,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}