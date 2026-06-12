import { NextRequest, NextResponse } from 'next/server';
import { analyzeAddress } from '@/lib/bitcoin/addressAnalyzer';

export async function GET(
  request: NextRequest
) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const report = await analyzeAddress(address);
    return NextResponse.json(report);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to analyze address';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
