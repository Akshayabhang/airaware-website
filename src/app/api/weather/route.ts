import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    if (!city) {
        return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
    }

    try {
        const apiKey = process.env.INDIAN_WEATHER_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'INDIAN_WEATHER_API_KEY not configured' }, { status: 500 });
        }

        const indianApiUrl = `https://weather.indianapi.in/global/weather?location=${encodeURIComponent(city)}`;

        const response = await fetch(indianApiUrl, {
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 3600 } // Cache results for 1 hour to heavily save API quota
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Indian API Error (${response.status}):`, errorText);

            // Provide gracefully degraded mock data so frontend doesn't crash on API limits (like the 500 error we saw occasionally)
            return NextResponse.json({
                error: 'Upstream API Error',
                status: response.status
            }, { status: 502 });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error fetching Indian Weather API data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
