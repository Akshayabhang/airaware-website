import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const timeframe = searchParams.get('timeframe') || '24h'; // 12h, 24h, 7d, 30d

    if (!city) {
        return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
    }

    try {
        const cityRecord = await prisma.city.findUnique({
            where: { name: city }
        });

        if (!cityRecord) {
            return NextResponse.json({ data: [] });
        }

        // Calculate time threshold
        const now = new Date();
        let timeThreshold = new Date();

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
                timestamp: 'asc' // Oldest to newest for graphing
            }
        });

        // Formatting for the frontend charting library
        const formattedData = records.map(record => ({
            ...record,
            // Create a nice display time based on the timeframe
            displayTime: ['12h', '24h'].includes(timeframe)
                ? record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : record.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }));

        return NextResponse.json({ data: formattedData });
    } catch (error) {
        console.error('Error fetching historical data:', error);
        return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
    }
}
