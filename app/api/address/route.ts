import { NextRequest, NextResponse } from 'next/server';
import { analyzeAddress } from '@/lib/bitcoin/addressAnalyzer';
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
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const report = await analyzeAddress(address);
    return NextResponse.json(report, {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': remaining.toString(),
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to analyze address';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
