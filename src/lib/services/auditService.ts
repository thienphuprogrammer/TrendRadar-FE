export interface AuditLogData {
  user_id?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, any>;
}

export class AuditService {
  private static instance: AuditService;

  private constructor() {}

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  async log(data: AuditLogData): Promise<void> {
    try {
      await fetch('/api/audit/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  async getLogs(filters: {
    user_id?: string;
    action?: string;
    limit?: number;
  } = {}): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (filters.user_id) params.append('user_id', filters.user_id);
      if (filters.action) params.append('action', filters.action);
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/audit/log?${params.toString()}`);
      const result = await response.json();

      return result.success ? result.data : [];
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }
  }

  logExport(format: string, resource: string): void {
    this.log({
      action: 'export',
      target_type: resource,
      details: { format },
    });
  }

  logRoleChange(targetUserId: string, oldRole: string, newRole: string): void {
    this.log({
      action: 'role_changed',
      target_type: 'user',
      target_id: targetUserId,
      details: { old_role: oldRole, new_role: newRole },
    });
  }

  logUserAction(action: string, targetType: string, targetId?: string): void {
    this.log({
      action,
      target_type: targetType,
      target_id: targetId,
    });
  }

  logAutomation(workflowId: string, status: string): void {
    this.log({
      action: 'automation_run',
      target_type: 'workflow',
      target_id: workflowId,
      details: { status },
    });
  }
}
