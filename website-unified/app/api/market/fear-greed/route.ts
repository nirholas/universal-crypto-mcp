import { NextResponse } from 'next/server';

const ALTERNATIVE_ME_API = 'https://api.alternative.me/fng';

export async function GET() {
  try {
    const response = await fetch(`${ALTERNATIVE_ME_API}/?limit=1&format=json`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fear/greed index');
    }

    const data = await response.json();
    const fng = data.data?.[0];

    if (!fng) {
      throw new Error('No data returned');
    }

    // Classify the value
    const value = parseInt(fng.value);
    let classification: string;
    if (value <= 20) classification = 'Extreme Fear';
    else if (value <= 40) classification = 'Fear';
    else if (value <= 60) classification = 'Neutral';
    else if (value <= 80) classification = 'Greed';
    else classification = 'Extreme Greed';

    return NextResponse.json({
      value,
      classification,
      timestamp: parseInt(fng.timestamp) * 1000,
      time_until_update: fng.time_until_update,
    });
  } catch (error) {
    console.error('Fear/greed error:', error);
    
    // Return mock data
    return NextResponse.json({
      value: 55,
      classification: 'Neutral',
      timestamp: Date.now(),
      time_until_update: '12:00:00',
    });
  }
}
