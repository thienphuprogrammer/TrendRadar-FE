import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Simulate refreshing dashboard data
    await new Promise(resolve => setTimeout(resolve, 1000));

    const refreshedData = {
      kpis: [
        { name: 'Total Revenue', value: Math.floor(Math.random() * 1000000) },
        { name: 'Active Users', value: Math.floor(Math.random() * 10000) },
        { name: 'Conversion Rate', value: (Math.random() * 10).toFixed(2) },
        { name: 'Engagement Rate', value: (Math.random() * 100).toFixed(1) },
      ],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: refreshedData,
      message: 'Dashboard data refreshed successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to refresh dashboard data' },
      { status: 500 }
    );
  }
}
