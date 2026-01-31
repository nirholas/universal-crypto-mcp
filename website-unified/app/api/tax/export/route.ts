/**
 * Tax Export API Route
 * 
 * Exports tax reports in various formats
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { report, format } = body as {
      report: any;
      format: 'csv' | 'pdf' | 'turbotax' | 'form8949';
    };

    const exportedData = await exportTaxReport(report, format);
    
    const contentType = format === 'pdf' 
      ? 'application/pdf' 
      : 'text/csv';
    
    const filename = format === 'pdf'
      ? `tax-report-${report.year}.pdf`
      : `tax-report-${report.year}.csv`;

    return new NextResponse(exportedData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Tax export API error:', error);
    return NextResponse.json(
      { error: 'Failed to export tax report' },
      { status: 500 }
    );
  }
}

async function exportTaxReport(report: any, format: string): Promise<string> {
  // Generate CSV export
  const headers = 'Date,Type,Asset,Amount,Proceeds,Cost Basis,Gain/Loss,Holding Period\n';
  
  const rows = (report.transactions || []).map((tx: any) => 
    `${tx.date},${tx.type},${tx.asset},${tx.amount},${tx.proceeds},${tx.costBasis},${tx.gain},${tx.holdingPeriod}`
  ).join('\n');

  return headers + rows;
}
