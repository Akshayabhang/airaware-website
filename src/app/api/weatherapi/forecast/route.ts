import { NextResponse } from 'next/server';
import { fetchForecast } from '@/lib/weatherApi';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const days = searchParams.get('days') || '3';

    if (!q) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        const data = await fetchForecast(q, parseInt(days));
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching forecast:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch forecast' }, { status: 500 });
    }
}
