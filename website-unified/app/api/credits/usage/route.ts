import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';

  // Calculate date range
  const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
  const now = Date.now();

  // Generate mock usage data
  const byDay = Array.from({ length: days }, (_, i) => {
    const date = new Date(now - (days - i - 1) * 86400000);
    return {
      date: date.toISOString().split('T')[0],
      requests: Math.floor(Math.random() * 100) + 10,
      creditsUsed: Math.random() * 20 + 5,
    };
  });

  const byService = [
    {
      serviceId: 'svc-1',
      serviceName: 'Premium GPT API',
      requests: 450,
      creditsUsed: 225.50,
    },
    {
      serviceId: 'svc-2',
      serviceName: 'AI Image Generator',
      requests: 120,
      creditsUsed: 85.00,
    },
    {
      serviceId: 'svc-3',
      serviceName: 'Code Analysis',
      requests: 80,
      creditsUsed: 40.00,
    },
  ];

  const totalRequests = byDay.reduce((sum, d) => sum + d.requests, 0);
  const totalCreditsUsed = byDay.reduce((sum, d) => sum + d.creditsUsed, 0);

  return NextResponse.json({
    totalRequests,
    totalCreditsUsed,
    avgCreditsPerRequest: totalCreditsUsed / totalRequests,
    byService,
    byDay,
  });
}
