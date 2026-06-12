import { NextRequest, NextResponse } from 'next/server';
import { analyzeTransaction } from '@/lib/bitcoin/txAnalyzer';

export async function GET(
  request: NextRequest
) {
  const { searchParams } = new URL(request.url);
  const txid = searchParams.get('txid');

  if (!txid) {
    return NextResponse.json({ error: 'TXID is required' }, { status: 400 });
  }

  try {
    const report = await analyzeTransaction(txid);
    return NextResponse.json(report);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to analyze transaction';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
