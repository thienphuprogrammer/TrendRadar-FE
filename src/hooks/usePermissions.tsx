import { useMemo } from 'react';
import { useAuth } from './useAuth';
import {
  getGranularPermissions,
  hasGranularPermission,
  type GranularPermissions,
  type Role,
} from '@/apollo/server/rbac/permissions';

/**
 * Hook to access granular permissions for the current user
 * Provides 40+ fine-grained permission checks for UI components
 */
export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo<GranularPermissions>(() => {
    if (!user || !user.role) {
      // Return viewer permissions as default for unauthenticated users
      return getGranularPermissions('Viewer');
    }
    return getGranularPermissions(user.role as Role);
  }, [user]);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: keyof GranularPermissions): boolean => {
    return permissions[permission];
  };

  /**
   * Check if user has ALL of the specified permissions
   */
  const hasAllPermissions = (...perms: Array<keyof GranularPermissions>): boolean => {
    return perms.every((perm) => permissions[perm]);
  };

  /**
   * Check if user has ANY of the specified permissions
   */
  const hasAnyPermission = (...perms: Array<keyof GranularPermissions>): boolean => {
    return perms.some((perm) => permissions[perm]);
  };

  /**
   * Get user role
   */
  const role = user?.role as Role | undefined;

  return {
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    role,
    isAdmin: role === 'Admin',
    isOwner: role === 'Owner',
    isAnalyst: role === 'Analyst',
    isViewer: role === 'Viewer',
  };
}

