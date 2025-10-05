/**
 * Optimized Auth Context
 * Performance-optimized authentication context with memoization
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, getRolePermissions, LoginRequest, RegisterRequest } from '@/lib/auth';
import { authService } from '@/lib/services/authService';

interface AuthContextType {
  user: User | null;
  permissions: ReturnType<typeof getRolePermissions>;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function OptimizedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const isValid = await authService.ensureValidToken();
          if (isValid) {
            const userData = await authService.getCurrentUser();
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        authService.clearAuthTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Memoized login function
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(credentials);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized register function
  const register = useCallback(async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.register(userData);
      await login({ email: userData.email, password: userData.password });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  // Memoized logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // Memoized clearError function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoized updateUser function
  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);

  // Memoized permissions based on user role
  const permissions = useMemo(() => {
    return user
      ? getRolePermissions(user.role)
      : {
          canViewDashboard: false,
          canViewAnalytics: false,
          canExport: false,
          canManageUsers: false,
          canManageIntegrations: false,
          canSchedulePosts: false,
          canEditReports: false,
          canManageBilling: false,
        };
  }, [user?.role]); // Only recompute when role changes

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      permissions,
      login,
      register,
      logout,
      isLoading,
      error,
      clearError,
      updateUser,
    }),
    [user, permissions, login, register, logout, isLoading, error, clearError, updateUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an OptimizedAuthProvider');
  }
  return context;
}

/**
 * Hook to get only user data (for components that only need user)
 */
export function useAuthUser() {
  const { user, isLoading } = useAuth();
  return { user, isLoading };
}

/**
 * Hook to get only permissions (for components that only need permissions)
 */
export function useAuthPermissions() {
  const { permissions } = useAuth();
  return permissions;
}

/**
 * Hook to get only auth actions (for components that only need actions)
 */
export function useAuthActions() {
  const { login, register, logout, clearError } = useAuth();
  return { login, register, logout, clearError };
}

