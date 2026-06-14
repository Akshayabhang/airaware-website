import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateCity, validateCoords } from '@/utils/validator';
import { checkRateLimit } from '@/lib/rateLimiter';
import { apiCache } from '@/lib/apiCache';
import { logger } from '@/utils/logger';

const WAQI_TOKEN = process.env.WAQI_API_TOKEN || 'demo';

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
    logger.warn('Rate limit exceeded for AQI request', { ip });
    return NextResponse.json(
      { error: 'Too Many Requests. Please try again later.' },
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
  const rawLat = searchParams.get('lat');
  const rawLng = searchParams.get('lng');
  const simple = searchParams.get('simple') === 'true';

  // 2. Request Validation
  const city = validateCity(rawCity);
  const coords = validateCoords(rawLat, rawLng);

  // If parameters were passed but failed validation, return 400 Bad Request
  if (rawCity && !city) {
    logger.warn('Invalid city parameter received', { rawCity, ip });
    return NextResponse.json({ error: 'Invalid city parameter' }, { status: 400 });
  }
  if ((rawLat || rawLng) && !coords) {
    logger.warn('Invalid coordinates received', { rawLat, rawLng, ip });
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  // 3. Check Cache
  const cacheKey = `aqi:${city || 'ip'}:${coords?.lat || '0'}:${coords?.lng || '0'}:${simple}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    logger.info('Serving AQI data from cache', { cacheKey });
    return NextResponse.json(cachedData);
  }

  let apiUrl = '';
  let prettyCityName = city;

  if (coords) {
    // If we have coordinates, use geo lookup for WAQI
    apiUrl = `https://api.waqi.info/feed/geo:${coords.lat};${coords.lng}/?token=${WAQI_TOKEN}`;

    // Reverse geocode to get a nicer name for the UI
    try {
      const REVERSE_GEO_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY || "d33d0ca895d676b2b6d49f221d938c7f";
      const reverseRes = await fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${coords.lat}&lon=${coords.lng}&limit=1&appid=${REVERSE_GEO_KEY}`,
        { next: { revalidate: 3600 } }
      );
      if (reverseRes.ok) {
        const reverseData = await reverseRes.json();
        if (reverseData && reverseData.length > 0) {
          prettyCityName = reverseData[0].name;
        }
      }
    } catch (e) {
      logger.warn('Reverse geocoding warning', { error: e });
    }
  } else if (city) {
    apiUrl = `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${WAQI_TOKEN}`;
  } else {
    apiUrl = `https://api.waqi.info/feed/here/?token=${WAQI_TOKEN}`;
  }

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`WAQI API returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      logger.warn('WAQI API returned error response', { errorMsg: data.data });
      return NextResponse.json({ error: data.data || 'Failed to fetch AQI data' }, { status: 400 });
    }

    // Override the raw WAQI station name with our prettier reverse-geocoded city name if available
    if (prettyCityName && data.data && data.data.city) {
      data.data.city.name = prettyCityName;
    }

    // --- FETCH NEARBY STATIONS FOR TICKER ---
    let nearbyLocations = [];
    if (!simple && data.data?.city?.geo) {
      const gLat = data.data.city.geo[0];
      const gLng = data.data.city.geo[1];
      const bounds = `${gLat - 0.5},${gLng - 0.5},${gLat + 0.5},${gLng + 0.5}`;
      try {
        const boundsRes = await fetch(`https://api.waqi.info/v2/map/bounds?latlng=${bounds}&token=${WAQI_TOKEN}`);
        const boundsData = await boundsRes.json();
        if (boundsData.status === 'ok') {
          nearbyLocations = boundsData.data
            .filter((st: any) => !isNaN(parseInt(st.aqi)))
            .map((st: any) => ({
              name: st.station.name.split(',')[0],
              aqi: parseInt(st.aqi),
              type: "AQI",
              distance: (Math.sqrt(Math.pow(st.lat - gLat, 2) + Math.pow(st.lon - gLng, 2)) * 111).toFixed(1) + " km"
            }))
            .sort((a: any, b: any) => b.aqi - a.aqi)
            .slice(0, 10);
        }
      } catch (e) {
        logger.warn('Failed to fetch nearby stations', { error: e });
      }
    }

    // --- DATABASE HISTORICAL TRACKING LOGIC ---
    if (!simple && data.data && data.data.city && data.data.city.name) {
      const cityName = data.data.city.name;
      const geo = data.data.city.geo || [null, null];

      try {
        const cityObj = await prisma.city.upsert({
          where: { name: cityName },
          update: { lat: geo[0], lng: geo[1] },
          create: { name: cityName, lat: geo[0], lng: geo[1] },
        });

        const recordTime = data.data.time?.iso ? new Date(data.data.time.iso) : new Date();
        const hourStart = new Date(recordTime);
        hourStart.setMinutes(0, 0, 0);

        const existingRecord = await prisma.aqiRecord.findFirst({
          where: {
            cityId: cityObj.id,
            timestamp: {
              gte: hourStart,
              lt: new Date(hourStart.getTime() + 60 * 60 * 1000)
            }
          }
        });

        if (!existingRecord) {
          await prisma.aqiRecord.create({
            data: {
              cityId: cityObj.id,
              timestamp: recordTime,
              aqi: data.data.aqi ?? 0,
              pm25: data.data.iaqi?.pm25?.v,
              pm10: data.data.iaqi?.pm10?.v,
              tvoc: data.data.iaqi?.tvoc?.v ?? 4.8,
              noise: data.data.iaqi?.noise?.v ?? 50.0
            }
          });
        }

        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

        await prisma.aqiRecord.deleteMany({
          where: {
            cityId: cityObj.id,
            timestamp: {
              lt: threeYearsAgo
            }
          }
        });

      } catch (dbError) {
        // Log structured database error without exposing query specifics
        logger.error('Database logging error', dbError);
      }
    }

    const resultPayload = { ...data, nearbyLocations };

    // Cache the successful result for 5 minutes
    apiCache.set(cacheKey, resultPayload, 300);

    return NextResponse.json(resultPayload);
  } catch (error) {
    logger.error('Error fetching AQI', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
