import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, action, target_type, target_id, details } = body;

    // Get client IP and user agent
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';

    // In a real app, this would save to Supabase
    const auditLog = {
      id: crypto.randomUUID(),
      user_id,
      action,
      target_type,
      target_id,
      details,
      ip_address,
      user_agent,
      created_at: new Date().toISOString(),
    };

    console.log('Audit Log:', auditLog);

    return NextResponse.json({
      success: true,
      data: auditLog,
      message: 'Audit log created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Mock audit logs
    const mockLogs = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
      id: crypto.randomUUID(),
      user_id: userId || crypto.randomUUID(),
      action: action || ['export_report', 'change_role', 'delete_user', 'update_settings'][i % 4],
      target_type: ['report', 'user', 'integration', 'settings'][i % 4],
      target_id: crypto.randomUUID(),
      details: {
        description: 'Action performed successfully',
      },
      ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
      user_agent: 'Mozilla/5.0',
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: mockLogs,
      total: mockLogs.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
