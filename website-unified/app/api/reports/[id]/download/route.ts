'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Fetch download URL from reporting service
    const response = await fetch(
      `${process.env.REPORTING_SERVICE_URL}/api/v1/reports/${id}/download`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.REPORTING_SERVICE_API_KEY}`,
          'X-User-Id': session.user.id,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }
      if (response.status === 202) {
        return NextResponse.json(
          { error: 'Report is still generating' },
          { status: 202 }
        );
      }
      throw new Error('Failed to get download URL');
    }

    const { downloadUrl, expiresAt } = await response.json();

    // Option 1: Return signed URL for client-side download
    return NextResponse.json({
      downloadUrl,
      expiresAt,
    });

    // Option 2: Stream the file directly
    /*
    const fileResponse = await fetch(downloadUrl);
    const blob = await fileResponse.blob();
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': fileResponse.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${report.name}.${report.format}"`,
      },
    });
    */
  } catch (error) {
    console.error('Report download error:', error);
    return NextResponse.json(
      { error: 'Failed to download report' },
      { status: 500 }
    );
  }
}
