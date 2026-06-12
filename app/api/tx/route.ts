import { NextRequest, NextResponse } from 'next/server';
import { analyzeTransaction } from '@/lib/bitcoin/txAnalyzer';
import { limiter } from '@/lib/rate-limit';

export async function GET(
  request: NextRequest
) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'anonymous';
  const { isRateLimited, remaining } = limiter.check(new Response(), ip);

  if (isRateLimited) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
        }
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const txid = searchParams.get('txid');

  if (!txid) {
    return NextResponse.json({ error: 'TXID is required' }, { status: 400 });
  }

  try {
    const report = await analyzeTransaction(txid);
    return NextResponse.json(report, {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': remaining.toString(),
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to analyze transaction';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
