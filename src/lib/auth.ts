export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  role: 'admin' | 'account_owner' | 'analyst' | 'viewer';
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
  // View permissions
  canViewDashboard: boolean;
  canViewAnalytics: boolean;
  canViewTrends: boolean;
  canViewReports: boolean;
  canViewDataLab: boolean;
  canViewNotifications: boolean;

  // Action permissions
  canExport: boolean;
  canExportPDF: boolean;
  canExportExcel: boolean;
  canExportPowerPoint: boolean;

  // Create/Edit permissions
  canCreateReports: boolean;
  canEditReports: boolean;
  canDeleteReports: boolean;
  canScheduleReports: boolean;

  // Content permissions
  canSchedulePosts: boolean;
  canGenerateContent: boolean;
  canCreateContent: boolean;
  canEditContent: boolean;

  // Data permissions
  canUploadData: boolean;
  canImportProducts: boolean;
  canApplyActions: boolean;
  canRunAutomation: boolean;

  // Trend permissions
  canAnalyzeTrends: boolean;
  canTargetTrends: boolean;
  canForecastTrends: boolean;
  canCompareTrends: boolean;

  // Management permissions
  canManageUsers: boolean;
  canManageRoles: boolean;
  canViewAuditLog: boolean;
  canManageIntegrations: boolean;
  canManageBilling: boolean;
  canManageSettings: boolean;

  // Alert permissions
  canCreateAlerts: boolean;
  canConfigureAlerts: boolean;
  canReceiveAlerts: boolean;
}

export const getRolePermissions = (role: User['role']): Permission => {
  switch (role) {
    case 'admin':
      return {
        // All permissions for Admin
        canViewDashboard: true,
        canViewAnalytics: true,
        canViewTrends: true,
        canViewReports: true,
        canViewDataLab: true,
        canViewNotifications: true,
        canExport: true,
        canExportPDF: true,
        canExportExcel: true,
        canExportPowerPoint: true,
        canCreateReports: true,
        canEditReports: true,
        canDeleteReports: true,
        canScheduleReports: true,
        canSchedulePosts: true,
        canGenerateContent: true,
        canCreateContent: true,
        canEditContent: true,
        canUploadData: true,
        canImportProducts: true,
        canApplyActions: true,
        canRunAutomation: true,
        canAnalyzeTrends: true,
        canTargetTrends: true,
        canForecastTrends: true,
        canCompareTrends: true,
        canManageUsers: true,
        canManageRoles: true,
        canViewAuditLog: true,
        canManageIntegrations: true,
        canManageBilling: true,
        canManageSettings: true,
        canCreateAlerts: true,
        canConfigureAlerts: true,
        canReceiveAlerts: true,
      };
    case 'account_owner':
      return {
        // Full permissions except system admin tasks
        canViewDashboard: true,
        canViewAnalytics: true,
        canViewTrends: true,
        canViewReports: true,
        canViewDataLab: true,
        canViewNotifications: true,
        canExport: true,
        canExportPDF: true,
        canExportExcel: true,
        canExportPowerPoint: true,
        canCreateReports: true,
        canEditReports: true,
        canDeleteReports: true,
        canScheduleReports: true,
        canSchedulePosts: true,
        canGenerateContent: true,
        canCreateContent: true,
        canEditContent: true,
        canUploadData: true,
        canImportProducts: true,
        canApplyActions: true,
        canRunAutomation: true,
        canAnalyzeTrends: true,
        canTargetTrends: true,
        canForecastTrends: true,
        canCompareTrends: true,
        canManageUsers: true,
        canManageRoles: false, // Cannot change system roles
        canViewAuditLog: true,
        canManageIntegrations: true,
        canManageBilling: true,
        canManageSettings: true,
        canCreateAlerts: true,
        canConfigureAlerts: true,
        canReceiveAlerts: true,
      };
    case 'analyst':
      return {
        // Analysis and content creation, no user/billing management
        canViewDashboard: true,
        canViewAnalytics: true,
        canViewTrends: true,
        canViewReports: true,
        canViewDataLab: true,
        canViewNotifications: true,
        canExport: true,
        canExportPDF: true,
        canExportExcel: true,
        canExportPowerPoint: false,
        canCreateReports: true,
        canEditReports: true,
        canDeleteReports: false,
        canScheduleReports: true,
        canSchedulePosts: true,
        canGenerateContent: true,
        canCreateContent: true,
        canEditContent: true,
        canUploadData: true,
        canImportProducts: true,
        canApplyActions: true,
        canRunAutomation: false,
        canAnalyzeTrends: true,
        canTargetTrends: true,
        canForecastTrends: true,
        canCompareTrends: true,
        canManageUsers: false,
        canManageRoles: false,
        canViewAuditLog: false,
        canManageIntegrations: false,
        canManageBilling: false,
        canManageSettings: false,
        canCreateAlerts: true,
        canConfigureAlerts: true,
        canReceiveAlerts: true,
      };
    case 'viewer':
      return {
        // Read-only access
        canViewDashboard: true,
        canViewAnalytics: true,
        canViewTrends: true,
        canViewReports: true,
        canViewDataLab: false,
        canViewNotifications: true,
        canExport: false,
        canExportPDF: false,
        canExportExcel: false,
        canExportPowerPoint: false,
        canCreateReports: false,
        canEditReports: false,
        canDeleteReports: false,
        canScheduleReports: false,
        canSchedulePosts: false,
        canGenerateContent: false,
        canCreateContent: false,
        canEditContent: false,
        canUploadData: false,
        canImportProducts: false,
        canApplyActions: false,
        canRunAutomation: false,
        canAnalyzeTrends: false,
        canTargetTrends: false,
        canForecastTrends: false,
        canCompareTrends: false,
        canManageUsers: false,
        canManageRoles: false,
        canViewAuditLog: false,
        canManageIntegrations: false,
        canManageBilling: false,
        canManageSettings: false,
        canCreateAlerts: false,
        canConfigureAlerts: false,
        canReceiveAlerts: true,
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
  role?: 'admin' | 'account_owner' | 'analyst' | 'viewer';
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
  role: 'account_owner',
  status: 'active',
  is_active: true,
  is_verified: true,
  avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_login: new Date().toISOString(),
};