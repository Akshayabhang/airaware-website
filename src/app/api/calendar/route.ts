import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateCity, validateYear, validatePollutant } from '@/utils/validator';
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
    logger.warn('Rate limit exceeded for calendar request', { ip });
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
  const rawYear = searchParams.get('year');
  const rawPollutant = searchParams.get('pollutant');

  // 2. Request Validation
  const city = validateCity(rawCity);
  const year = validateYear(rawYear);
  const pollutant = validatePollutant(rawPollutant);

  if (!city || !year) {
    logger.warn('Invalid calendar parameters received', { rawCity, rawYear, ip });
    return NextResponse.json({ error: 'Valid city and year parameters are required' }, { status: 400 });
  }

  // 3. Cache Check
  const cacheKey = `calendar:${city}:${year}:${pollutant}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    logger.info('Serving calendar data from cache', { cacheKey });
    return NextResponse.json(cachedData);
  }

  try {
    const cityRecord = await prisma.city.findUnique({
      where: { name: city }
    });

    if (!cityRecord) {
      const emptyResult = { data: {} };
      apiCache.set(cacheKey, emptyResult, 600); // Cache empty results for 10 minutes
      return NextResponse.json(emptyResult);
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    // Query historical records for the entire year
    const records = await prisma.aqiRecord.findMany({
      where: {
        cityId: cityRecord.id,
        timestamp: {
          gte: startDate,
          lt: endDate
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    const dailyData: Record<string, number> = {};

    records.forEach(record => {
      const dateStr = record.timestamp.toISOString().split('T')[0];
      const val = record[pollutant as keyof typeof record];
      if (typeof val === 'number') {
        if (dailyData[dateStr] === undefined) {
          dailyData[dateStr] = val;
        } else {
          dailyData[dateStr] = Math.max(dailyData[dateStr], val);
        }
      }
    });

    const result = { data: dailyData };

    // Cache the query result for 10 minutes (600s)
    apiCache.set(cacheKey, result, 600);

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Error fetching calendar data', error);
    return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 });
  }
}
