import { NextResponse } from 'next/server';
import { fetchHistory } from '@/lib/weatherApi';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const dt = searchParams.get('dt');

    if (!q || !dt) {
        return NextResponse.json({ error: 'Query parameters "q" and "dt" are required' }, { status: 400 });
    }

    try {
        const data = await fetchHistory(q, dt);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching history:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch history' }, { status: 500 });
    }
}
