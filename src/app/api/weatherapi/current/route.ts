import { NextResponse } from 'next/server';
import { fetchCurrentWeather } from '@/lib/weatherApi';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        const data = await fetchCurrentWeather(q);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching current weather:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch current weather' }, { status: 500 });
    }
}
