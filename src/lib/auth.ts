export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  role: 'admin' | 'seller' | 'analyst' | 'viewer';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  is_active: boolean;
  is_verified: boolean;
  phone?: string;
  company?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Permission {
  canViewDashboard: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canManageUsers: boolean;
  canManageIntegrations: boolean;
  canSchedulePosts: boolean;
  canEditReports: boolean;
  canManageBilling: boolean;
}

export const getRolePermissions = (role: User['role']): Permission => {
  switch (role) {
    case 'admin':
      return {
        canViewDashboard: true,
        canViewAnalytics: true,
        canExport: true,
        canManageUsers: true,
        canManageIntegrations: true,
        canSchedulePosts: true,
        canEditReports: true,
        canManageBilling: true,
      };
    case 'seller':
      return {
        canViewDashboard: true,
        canViewAnalytics: true,
        canExport: true,
        canManageUsers: true,
        canManageIntegrations: true,
        canSchedulePosts: true,
        canEditReports: true,
        canManageBilling: true,
      };
    case 'analyst':
      return {
        canViewDashboard: true,
        canViewAnalytics: true,
        canExport: true,
        canManageUsers: false,
        canManageIntegrations: false,
        canSchedulePosts: true,
        canEditReports: true,
        canManageBilling: false,
      };
    case 'viewer':
      return {
        canViewDashboard: true,
        canViewAnalytics: true,
        canExport: false,
        canManageUsers: false,
        canManageIntegrations: false,
        canSchedulePosts: false,
        canEditReports: false,
        canManageBilling: false,
      };
  }
};

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role?: 'admin' | 'seller' | 'analyst' | 'viewer';
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}


// Mock user for demo
export const mockUser: User = {
  id: 1,
  email: 'john@example.com',
  first_name: 'John',
  last_name: 'Doe',
  full_name: 'John Doe',
  role: 'seller',
  status: 'active',
  is_active: true,
  is_verified: true,
  avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_login: new Date().toISOString(),
};