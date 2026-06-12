"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { ChevronDown, BarChart2, TrendingUp } from "lucide-react";

interface GraphData {
    id: string;
    timestamp: string;
    aqi: number;
    pm25: number;
    pm10: number;
    tvoc: number;
    noise: number;
    displayTime: string;
}

interface HistoricalGraphProps {
    city: string;
}

type Timeframe = "12h" | "24h" | "7d" | "30d";
type Pollutant = "aqi" | "pm25" | "pm10" | "tvoc" | "noise";

export default function HistoricalGraph({ city }: HistoricalGraphProps) {
    const [data, setData] = useState<GraphData[]>([]);
    const [loading, setLoading] = useState(false);
    const [timeframe, setTimeframe] = useState<Timeframe>("24h");
    const [pollutant, setPollutant] = useState<Pollutant>("aqi");

    useEffect(() => {
        async function fetchHistory() {
            if (!city) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/history?city=${encodeURIComponent(city)}&timeframe=${timeframe}`);
                const json = await res.json();
                if (json.data) {
                    setData(json.data);
                }
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [city, timeframe]);

    // Determine colors based on value and pollutant type using the screenshot's color ramp
    const getBarColor = (val: number, type: Pollutant) => {
        // For simplicity, we apply AQI logic to all for the demo, though technically PM2.5/TVOC have different thresholds
        let color = "#8BC53F"; // Green (Good)  
        let threshold1 = 50, threshold2 = 100, threshold3 = 150, threshold4 = 200;

        // Adjusting thresholds roughly if it's TVOC or Noise to make the graph colorful
        if (type === 'tvoc') { threshold1 = 2; threshold2 = 4; threshold3 = 6; threshold4 = 8; }
        if (type === 'noise') { threshold1 = 40; threshold2 = 60; threshold3 = 80; threshold4 = 100; }

        if (val > threshold4) color = "#99004D"; // Purple (Severe)
        else if (val > threshold3) color = "#EE4266"; // Red (Unhealthy)
        else if (val > threshold2) color = "#F58220"; // Orange (Poor)
        else if (val > threshold1) color = "#F9C31C"; // Yellow (Moderate)

        return color;
    };

    // Find Min and Max
    const values = data.map(d => d[pollutant]);
    const maxVal = values.length > 0 ? Math.max(...values) : 0;
    const minVal = values.length > 0 ? Math.min(...values) : 0;

    const maxData = data.find(d => d[pollutant] === maxVal);
    const minData = data.find(d => d[pollutant] === minVal);

    const formatTimestamp = (ts: string) => {
        if (!ts) return "";
        return new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    const pollutantLabels: Record<Pollutant, string> = {
        aqi: "AQI (US)",
        pm25: "PM2.5",
        pm10: "PM10",
        tvoc: "TVOC",
        noise: "Noise"
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-24 relative z-20">

            {/* Header and Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-neutral-200 pb-4 mb-8">
                <div>
                    <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-1">AQI Graph</h2>
                    <h1 className="text-2xl font-black text-neutral-800 mb-1">Historical Air Quality Data</h1>
                    <h3 className="text-xl font-bold text-[#1288FC]">{city || "Select a location"}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0">
                    {/* Chart Type Toggles */}
                    <div className="flex items-center gap-2 mr-2">
                        <button className="p-2 border border-neutral-300 rounded hover:bg-neutral-50 bg-white">
                            <TrendingUp className="w-5 h-5 text-neutral-500" />
                        </button>
                        <button className="p-2 border border-neutral-300 rounded bg-neutral-200 shadow-inner">
                            <BarChart2 className="w-5 h-5 text-neutral-700" />
                        </button>
                    </div>

                    {/* Timeframe Dropdown */}
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-neutral-300 text-neutral-700 py-2.5 pl-6 pr-12 rounded-xl font-medium text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm"
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
                        >
                            <option value="12h">12 Hours</option>
                            <option value="24h">24 Hours</option>
                            <option value="7d">7 Days</option>
                            <option value="30d">30 Days</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>

                    {/* Pollutant Dropdown */}
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-neutral-300 text-neutral-700 py-2.5 pl-6 pr-12 rounded-xl font-medium text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm"
                            value={pollutant}
                            onChange={(e) => setPollutant(e.target.value as Pollutant)}
                        >
                            <option value="aqi">AQI (US)</option>
                            <option value="pm25">PM2.5</option>
                            <option value="pm10">PM10</option>
                            <option value="tvoc">TVOC</option>
                            <option value="noise">Noise</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="w-full h-[500px] bg-white rounded-3xl shadow-sm border border-neutral-100 animate-pulse flex items-center justify-center">
                    <div className="text-neutral-400 font-medium">Fetching historical data...</div>
                </div>
            ) : (
                <div className="w-full bg-white rounded-[32px] shadow-sm border border-neutral-100 p-8 pb-12 relative overflow-hidden">

                    {/* Top Info Bar (City Tag + Min/Max Cards) */}
                    <div className="flex flex-col lg:flex-row justify-between items-start mb-12">

                        {/* City Tag */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f8f9fc] border border-[#d9dbec] rounded-2xl mb-6 lg:mb-0">
                            <div className="w-3 h-3 rounded-full bg-neutral-600"></div>
                            <span className="font-bold text-neutral-700 text-sm">{city}</span>
                        </div>

                        {/* Min/Max Summary Cards */}
                        <div className="flex gap-8">
                            {/* Min Card */}
                            {minData && (
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-sm`} style={{ backgroundColor: getBarColor(minVal, pollutant) }}>
                                        {typeof minVal === 'number' ? parseFloat(minVal.toFixed(2)) : minVal}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-neutral-800">Min.</span>
                                        <span className="text-sm font-medium text-neutral-500">at {formatTimestamp(minData.timestamp)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Max Card */}
                            {maxData && (
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-sm`} style={{ backgroundColor: getBarColor(maxVal, pollutant) }}>
                                        {typeof maxVal === 'number' ? parseFloat(maxVal.toFixed(2)) : maxVal}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-neutral-800">Max.</span>
                                        <span className="text-sm font-medium text-neutral-500">at {formatTimestamp(maxData.timestamp)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recharts Bar Chart */}
                    <div className="w-full h-[400px]">
                        {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={2}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="displayTime"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#737373', fontSize: 11, fontWeight: 700 }}
                                        dy={10}
                                        // Show fewer ticks on x-axis if there's a lot of data (e.g. 30 days = 720 points)
                                        interval={data.length > 100 ? Math.floor(data.length / 10) : 'preserveStartEnd'}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#737373', fontSize: 11, fontWeight: 700 }}
                                        label={{ value: pollutantLabels[pollutant], angle: -90, position: 'insideLeft', fill: '#171717', fontWeight: 800, fontSize: 12, dy: 50 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f5f5f5' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#737373', marginBottom: '4px' }}
                                        formatter={(value: number | undefined) => [value ? parseFloat(value.toFixed(2)) : 0, pollutantLabels[pollutant]]}
                                        labelFormatter={(label, payload) => {
                                            if (payload && payload.length > 0) {
                                                return formatTimestamp(payload[0].payload.timestamp);
                                            }
                                            return label;
                                        }}
                                    />
                                    <Bar dataKey={pollutant} radius={[4, 4, 0, 0]} maxBarSize={40}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getBarColor(entry[pollutant], pollutant)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 font-medium pb-20">
                                No historical data available for this city/timeframe yet.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
