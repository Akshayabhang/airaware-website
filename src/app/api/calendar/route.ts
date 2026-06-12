import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const yearStr = searchParams.get('year');
    const pollutant = searchParams.get('pollutant') || 'aqi';

    if (!city || !yearStr) {
        return NextResponse.json({ error: 'City and year parameters are required' }, { status: 400 });
    }

    const year = parseInt(yearStr, 10);
    if (isNaN(year)) {
        return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
    }

    try {
        const cityRecord = await prisma.city.findUnique({
            where: { name: city }
        });

        if (!cityRecord) {
            return NextResponse.json({ data: {} });
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

        // Grouping logic: We want one value per day. 
        // Since recent 30 days have hourly data, we'll take the max value for that day to represent the worst reading.
        const dailyData: Record<string, number> = {};

        records.forEach(record => {
            // Format as YYYY-MM-DD local time string equivalent
            const dateStr = record.timestamp.toISOString().split('T')[0];

            let val = record[pollutant as keyof typeof record];
            if (typeof val === 'number') {
                if (dailyData[dateStr] === undefined) {
                    dailyData[dateStr] = val;
                } else {
                    // Take the maximum severity for the day if there are multiple recordings
                    dailyData[dateStr] = Math.max(dailyData[dateStr], val);
                }
            }
        });

        return NextResponse.json({ data: dailyData });
    } catch (error) {
        console.error('Error fetching calendar data:', error);
        return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 });
    }
}
