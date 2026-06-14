import { NextResponse } from 'next/server';
import { fetchForecast } from '@/lib/weatherApi';
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
    logger.warn('Rate limit exceeded for weatherapi forecast request', { ip });
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
  const rawDays = searchParams.get('days') || '3';

  // 2. Request Validation
  const q = validateCity(rawQ);
  const days = parseInt(rawDays, 10);

  if (!q) {
    logger.warn('Invalid query parameter "q" received', { rawQ, ip });
    return NextResponse.json({ error: 'Valid query parameter "q" is required' }, { status: 400 });
  }

  if (isNaN(days) || days < 1 || days > 10) {
    logger.warn('Invalid days parameter received', { rawDays, ip });
    return NextResponse.json({ error: 'Days parameter must be an integer between 1 and 10' }, { status: 400 });
  }

  // 3. Cache Check
  const cacheKey = `weatherapi:forecast:${q}:${days}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    logger.info('Serving forecast weather from cache', { cacheKey });
    return NextResponse.json(cachedData);
  }

  try {
    const data = await fetchForecast(q, days);

    // Cache forecast results for 10 minutes (600s)
    apiCache.set(cacheKey, data, 600);

    return NextResponse.json(data);
  } catch (error: any) {
    logger.error('Error fetching forecast', error);
    return NextResponse.json({ error: 'Failed to fetch forecast' }, { status: 500 });
  }
}
