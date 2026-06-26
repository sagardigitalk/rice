"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '@/services/authService';
import { useRouter, usePathname } from 'next/navigation';
import { Loader } from '@/components/common/Loader';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    
    const token = localStorage.getItem('token');
    
    // If no token, we can synchronously stop loading and bypass API check
    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    // If token exists, verify it
    const verifyToken = async () => {
      try {
        const res = await authService.getMe();
        if (res.success) {
          setUser(res.data);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const isPublicPath = pathname === '/login' || pathname === '/forgot-password' || pathname.startsWith('/reset-password');

  // Protected Route Logic
  useEffect(() => {
    if (!isLoading && isMounted) {
      if (!user && !isPublicPath) {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/');
      }
    }
  }, [user, isLoading, pathname, router, isMounted, isPublicPath]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  // Prevent hydration mismatch by not rendering anything until mounted on client
  if (!isMounted) {
    return null;
  }

  // If loading (verifying token), show loader to prevent flashing incorrect state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <Loader text="Authenticating..." />
      </div>
    );
  }

  // If redirecting to login because no user, return null so dashboard doesn't blink
  if (!user && !isPublicPath) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
