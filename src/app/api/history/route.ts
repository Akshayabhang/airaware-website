import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateCity, validateTimeframe } from '@/utils/validator';
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
    logger.warn('Rate limit exceeded for history request', { ip });
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
  const rawCity = searchParams.get('city');
  const rawTimeframe = searchParams.get('timeframe');

  // 2. Request Validation
  const city = validateCity(rawCity);
  const timeframe = validateTimeframe(rawTimeframe);

  if (!city) {
    logger.warn('Invalid history parameters received', { rawCity, ip });
    return NextResponse.json({ error: 'Valid city parameter is required' }, { status: 400 });
  }

  // 3. Cache Check
  const cacheKey = `history:${city}:${timeframe}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    logger.info('Serving history data from cache', { cacheKey });
    return NextResponse.json(cachedData);
  }

  try {
    const cityRecord = await prisma.city.findUnique({
      where: { name: city }
    });

    if (!cityRecord) {
      const emptyResult = { data: [] };
      apiCache.set(cacheKey, emptyResult, 600); // Cache empty result for 10 minutes
      return NextResponse.json(emptyResult);
    }

    const now = new Date();
    const timeThreshold = new Date();

    switch (timeframe) {
      case '12h':
        timeThreshold.setHours(now.getHours() - 12);
        break;
      case '24h':
        timeThreshold.setHours(now.getHours() - 24);
        break;
      case '7d':
        timeThreshold.setDate(now.getDate() - 7);
        break;
      case '30d':
        timeThreshold.setDate(now.getDate() - 30);
        break;
      default:
        timeThreshold.setHours(now.getHours() - 24);
    }

    // Query historical records
    const records = await prisma.aqiRecord.findMany({
      where: {
        cityId: cityRecord.id,
        timestamp: {
          gte: timeThreshold
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    const formattedData = records.map(record => ({
      ...record,
      displayTime: ['12h', '24h'].includes(timeframe)
        ? record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : record.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }));

    const result = { data: formattedData };

    // Cache the history results for 10 minutes (600s)
    apiCache.set(cacheKey, result, 600);

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Error fetching historical data', error);
    return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
  }
}
