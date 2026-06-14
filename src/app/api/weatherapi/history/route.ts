import { NextResponse } from 'next/server';
import { fetchHistory } from '@/lib/weatherApi';
import { validateCity } from '@/utils/validator';
import { checkRateLimit } from '@/lib/rateLimiter';
import { apiCache } from '@/lib/apiCache';
import { logger } from '@/utils/logger';

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

export async function GET(request: Request) {
  const ip = getClientIp(request);

  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    logger.warn('Rate limit exceeded for weatherapi history request', { ip });
    return NextResponse.json(
      { error: 'Too Many Requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetSeconds),
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawQ = searchParams.get('q');
  const rawDt = searchParams.get('dt');

  // 2. Request Validation
  const q = validateCity(rawQ);
  
  if (!q) {
    logger.warn('Invalid query parameter "q" received', { rawQ, ip });
    return NextResponse.json({ error: 'Valid query parameter "q" is required' }, { status: 400 });
  }

  // Validate date string format YYYY-MM-DD
  const isValidDate = rawDt && /^\d{4}-\d{2}-\d{2}$/.test(rawDt);
  if (!isValidDate) {
    logger.warn('Invalid date parameter "dt" received', { rawDt, ip });
    return NextResponse.json({ error: 'Valid date parameter "dt" in YYYY-MM-DD format is required' }, { status: 400 });
  }

  // 3. Cache Check
  const cacheKey = `weatherapi:history:${q}:${rawDt}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    logger.info('Serving history weather from cache', { cacheKey });
    return NextResponse.json(cachedData);
  }

  try {
    const data = await fetchHistory(q, rawDt!);

    // Cache history results for 10 minutes (600s)
    apiCache.set(cacheKey, data, 600);

    return NextResponse.json(data);
  } catch (error: any) {
    logger.error('Error fetching history', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
