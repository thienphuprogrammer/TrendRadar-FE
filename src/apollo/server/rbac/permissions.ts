/**
 * RBAC Permission Matrix
 * Defines what each role can do
 */

export type Role = 'Admin' | 'Owner' | 'Analyst' | 'Viewer';
export type Action = 'view' | 'create' | 'update' | 'delete' | 'export' | 'apply' | 'manage';
export type Resource =
  | 'Dashboard'
  | 'TrendExplorer'
  | 'ActionCenter'
  | 'DataLab'
  | 'ContentStudio'
  | 'Reports'
  | 'Notifications'
  | 'Integrations'
  | 'Settings'
  | 'Users'
  | 'Billing'
  | 'AuditLog';

export interface Permission {
  resource: Resource;
  action: Action;
  roles: Role[];
}

/**
 * Granular Permission Interface (aligned with frontend sample)
 * Provides 40+ fine-grained permissions for precise access control
 */
export interface GranularPermissions {
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

/**
 * Permission matrix based on the spec
 */
export const PERMISSIONS: Permission[] = [
  // Dashboard
  { resource: 'Dashboard', action: 'view', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },
  { resource: 'Dashboard', action: 'create', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'Dashboard', action: 'update', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'Dashboard', action: 'delete', roles: ['Admin', 'Owner'] },
  { resource: 'Dashboard', action: 'export', roles: ['Admin', 'Owner', 'Analyst'] },

  // Trend Explorer
  { resource: 'TrendExplorer', action: 'view', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },
  { resource: 'TrendExplorer', action: 'export', roles: ['Admin', 'Owner', 'Analyst'] },

  // Action Center
  { resource: 'ActionCenter', action: 'view', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'ActionCenter', action: 'apply', roles: ['Admin', 'Owner'] },

  // Data Lab
  { resource: 'DataLab', action: 'view', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'DataLab', action: 'create', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'DataLab', action: 'delete', roles: ['Admin', 'Owner', 'Analyst'] },

  // Content Studio
  { resource: 'ContentStudio', action: 'view', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'ContentStudio', action: 'create', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'ContentStudio', action: 'update', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'ContentStudio', action: 'delete', roles: ['Admin', 'Owner', 'Analyst'] },

  // Reports
  { resource: 'Reports', action: 'view', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },
  { resource: 'Reports', action: 'create', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'Reports', action: 'export', roles: ['Admin', 'Owner', 'Analyst'] },

  // Notifications
  { resource: 'Notifications', action: 'view', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },
  { resource: 'Notifications', action: 'manage', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },

  // Integrations
  { resource: 'Integrations', action: 'view', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'Integrations', action: 'create', roles: ['Admin', 'Owner'] },
  { resource: 'Integrations', action: 'update', roles: ['Admin', 'Owner'] },
  { resource: 'Integrations', action: 'delete', roles: ['Admin', 'Owner'] },

  // Settings
  { resource: 'Settings', action: 'view', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },
  { resource: 'Settings', action: 'manage', roles: ['Admin', 'Owner'] },

  // Users
  { resource: 'Users', action: 'view', roles: ['Admin'] },
  { resource: 'Users', action: 'create', roles: ['Admin'] },
  { resource: 'Users', action: 'update', roles: ['Admin'] },
  { resource: 'Users', action: 'delete', roles: ['Admin'] },

  // Billing
  { resource: 'Billing', action: 'view', roles: ['Admin', 'Owner'] },
  { resource: 'Billing', action: 'manage', roles: ['Admin', 'Owner'] },

  // Audit Log
  { resource: 'AuditLog', action: 'view', roles: ['Admin'] },
  { resource: 'AuditLog', action: 'export', roles: ['Admin'] },
];

/**
 * Check if a role has permission for a resource and action
 */
export function hasPermission(role: Role, resource: Resource, action: Action): boolean {
  const permission = PERMISSIONS.find(
    (p) => p.resource === resource && p.action === action
  );

  if (!permission) {
    return false;
  }

  return permission.roles.includes(role);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return PERMISSIONS.filter((p) => p.roles.includes(role));
}

/**
 * Check if role can access a resource (any action)
 */
export function canAccessResource(role: Role, resource: Resource): boolean {
  return PERMISSIONS.some((p) => p.resource === resource && p.roles.includes(role));
}

/**
 * Get granular permissions for a role
 * Returns a comprehensive permission object with all 40+ granular permissions
 */
export function getGranularPermissions(role: Role): GranularPermissions {
  switch (role) {
    case 'Admin':
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
    case 'Owner':
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
    case 'Analyst':
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
    case 'Viewer':
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
}

/**
 * Check if a role has a specific granular permission
 */
export function hasGranularPermission(
  role: Role,
  permission: keyof GranularPermissions
): boolean {
  const permissions = getGranularPermissions(role);
  return permissions[permission];
}


