import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimiter';
import { validateCity } from '@/utils/validator';
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
    logger.warn('Rate limit exceeded for weather request', { ip });
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

  // 2. Request Validation
  const city = validateCity(rawCity);

  if (!city) {
    logger.warn('Invalid weather parameter received', { rawCity, ip });
    return NextResponse.json({ error: 'Valid city parameter is required' }, { status: 400 });
  }

  // 3. Cache Check
  const cacheKey = `weather:${city}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    logger.info('Serving weather data from cache', { cacheKey });
    return NextResponse.json(cachedData);
  }

  try {
    const apiKey = process.env.INDIAN_WEATHER_API_KEY;
    if (!apiKey) {
      logger.error('INDIAN_WEATHER_API_KEY environment variable is not configured');
      return NextResponse.json({ error: 'Weather API not configured' }, { status: 500 });
    }

    const indianApiUrl = `https://weather.indianapi.in/global/weather?location=${encodeURIComponent(city)}`;

    const response = await fetch(indianApiUrl, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Log response status but redact the key/headers
      logger.warn('Indian API error response received', { status: response.status });
      return NextResponse.json({ error: 'Upstream API Error' }, { status: 502 });
    }

    const data = await response.json();

    // Cache weather data for 10 minutes (600s) to save API quota
    apiCache.set(cacheKey, data, 600);

    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error fetching Indian Weather API data', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
