import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const WAQI_TOKEN = process.env.WAQI_API_TOKEN || 'demo'; // Using 'demo' token for testing if none is provided

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const simple = searchParams.get('simple') === 'true';

  let apiUrl = '';
  // Try to prettier-print the location names using OpenWeatherMap Reverse Geocoding
  let prettyCityName = city;

  if (lat && lng) {
    // If we have coordinates, ALWAYS use geo lookup for WAQI since it strictly guarantees a station nearby
    apiUrl = `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${WAQI_TOKEN}`;

    // Reverse geocode to get a nicer name for the UI, but don't break the WAQI API call with it
    try {
      const REVERSE_GEO_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY || "d33d0ca895d676b2b6d49f221d938c7f";
      const reverseRes = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${REVERSE_GEO_KEY}`);
      if (reverseRes.ok) {
        const reverseData = await reverseRes.json();
        if (reverseData && reverseData.length > 0) {
          prettyCityName = reverseData[0].name;
        }
      }
    } catch (e) {
      console.warn("Reverse geocoding failed", e);
    }
  } else if (city) {
    // Only search WAQI by string if we have no coordinates
    apiUrl = `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${WAQI_TOKEN}`;
  } else {
    // Default to IP based
    apiUrl = `https://api.waqi.info/feed/here/?token=${WAQI_TOKEN}`;
  }


  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === 'error') {
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
      // Create a bounding box roughly ~50km around the target
      const bounds = `${gLat - 0.5},${gLng - 0.5},${gLat + 0.5},${gLng + 0.5}`;
      try {
        const boundsRes = await fetch(`https://api.waqi.info/v2/map/bounds?latlng=${bounds}&token=${WAQI_TOKEN}`);
        const boundsData = await boundsRes.json();
        if (boundsData.status === 'ok') {
          // Sort by AQI highest first and take top 10 to simulate the "Most Polluted Nearby" or just notable stations
          nearbyLocations = boundsData.data
            .filter((st: any) => !isNaN(parseInt(st.aqi)))
            .map((st: any) => ({
              name: st.station.name.split(',')[0], // Keep it short for the ticker
              aqi: parseInt(st.aqi),
              type: "AQI",
              // Approximate distance calculation
              distance: (Math.sqrt(Math.pow(st.lat - gLat, 2) + Math.pow(st.lon - gLng, 2)) * 111).toFixed(1) + " km"
            }))
            .sort((a: any, b: any) => b.aqi - a.aqi)
            .slice(0, 10);
        }
      } catch (e) {
        console.error("Failed to fetch nearby stations", e);
      }
    }

    // --- DATABASE HISTORICAL TRACKING LOGIC ---
    if (!simple && data.data && data.data.city && data.data.city.name) {
      const cityName = data.data.city.name;
      const geo = data.data.city.geo || [null, null];

      try {
        // 1. Ensure city exists
        const city = await prisma.city.upsert({
          where: { name: cityName },
          update: { lat: geo[0], lng: geo[1] },
          create: { name: cityName, lat: geo[0], lng: geo[1] },
        });

        const recordTime = data.data.time?.iso ? new Date(data.data.time.iso) : new Date();

        // Check if we already have a record for this exact hour to prevent massive duplication 
        // if user refreshes constantly
        const hourStart = new Date(recordTime);
        hourStart.setMinutes(0, 0, 0);

        const existingRecord = await prisma.aqiRecord.findFirst({
          where: {
            cityId: city.id,
            timestamp: {
              gte: hourStart,
              lt: new Date(hourStart.getTime() + 60 * 60 * 1000)
            }
          }
        });

        if (!existingRecord) {
          await prisma.aqiRecord.create({
            data: {
              cityId: city.id,
              timestamp: recordTime,
              aqi: data.data.aqi ?? 0,
              pm25: data.data.iaqi?.pm25?.v,
              pm10: data.data.iaqi?.pm10?.v,
              tvoc: data.data.iaqi?.tvoc?.v ?? 4.8, // Mocking TVOC if missing
              noise: data.data.iaqi?.noise?.v ?? 50.0 // Mocking Noise if missing
            }
          });
        }

        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

        await prisma.aqiRecord.deleteMany({
          where: {
            cityId: city.id,
            timestamp: {
              lt: threeYearsAgo
            }
          }
        });

      } catch (dbError) {
        console.error("Failed to save historical data to database:", dbError);
        // We don't throw here. If the DB save fails, we still want to return the live data to the user.
      }
    }

    // Attach nearby locations to the main response payload
    return NextResponse.json({ ...data, nearbyLocations });
  } catch (error) {
    console.error('Error fetching AQI:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
