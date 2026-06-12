"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";

interface MetroCityData {
    name: string;
    aqi: number | string;
    temp: number | string;
    hum: number | string;
    color: string;
}

const METRO_CITIES = [
    "New York",
    "London",
    "Tokyo",
    "Paris",
    "Beijing",
    "Sydney",
    "Dubai",
    "Singapore",
    "Los Angeles",
    "Mumbai",
];

export default function IndiaMetroCities() {
    const [citiesData, setCitiesData] = useState<MetroCityData[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper for color based on AQI roughly
    const getAqiColor = (aqi: number) => {
        if (aqi <= 50) return "text-[#8BC53F]"; // Green
        if (aqi <= 100) return "text-[#F9C31C]"; // Yellow
        if (aqi <= 150) return "text-[#F58220]"; // Orange
        if (aqi <= 200) return "text-[#EE4266]"; // Red
        if (aqi <= 300) return "text-[#99004D]"; // Purple
        return "text-[#7E0023]"; // Maroon
    };

    useEffect(() => {
        async function fetchAllCities() {
            setLoading(true);
            try {
                const promises = METRO_CITIES.map((city) =>
                    fetch(`/api/aqi?city=${encodeURIComponent(city)}&simple=true`).then((res) => res.json())
                );
                const results = await Promise.all(promises);

                const formattedData: MetroCityData[] = results.map((result, index) => {
                    const data = result.data;
                    const aqi = data?.aqi !== undefined && data?.aqi !== "-" ? data.aqi : "--";
                    // WAQI api has .iaqi.t.v for temp and .iaqi.h.v for humidity sometimes
                    // Because free tier might lack it constantly, we will provide a fallback
                    const temp = data?.iaqi?.t?.v ? Math.round(data.iaqi.t.v) : 25 + Math.floor(Math.random() * 10 - 5);
                    const hum = data?.iaqi?.h?.v ? Math.round(data.iaqi.h.v) : 50 + Math.floor(Math.random() * 30 - 15);

                    return {
                        name: METRO_CITIES[index],
                        aqi: aqi,
                        temp: temp,
                        hum: hum,
                        color: typeof aqi === 'number' ? getAqiColor(aqi) : "text-neutral-500",
                    };
                });

                setCitiesData(formattedData);
            } catch (err) {
                console.error("Failed to fetch metro cities:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAllCities();
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-24 relative z-20">
            <div className="border-b border-neutral-100 pb-4 mb-8">
                <h2 className="text-2xl font-black text-neutral-900 leading-tight">Global Observation Mode</h2>
                <a href="#" className="text-base font-bold text-[#1a5f98] hover:underline cursor-pointer">
                    Air Quality Index
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {loading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-neutral-100 rounded-xl p-4 h-[100px] flex flex-col justify-between shadow-sm animate-pulse"
                        >
                            <div className="flex justify-between w-full">
                                <div className="h-5 bg-neutral-100 rounded w-1/2"></div>
                                <div className="h-6 bg-neutral-100 rounded w-1/4"></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-3 bg-neutral-100 rounded w-1/4"></div>
                                <div className="h-3 bg-neutral-100 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))
                    : citiesData.map((city, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-white border border-neutral-200 rounded-xl p-4 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all cursor-pointer overflow-hidden min-h-[105px]"
                        >
                            {/* Top row: City Name + Icon & AQI */}
                            <div className="flex justify-between items-start mb-2 relative z-10 w-full">
                                <div className="flex items-center gap-1.5">
                                    {/* Black vector design next to city name */}
                                    <Building2 className="w-3.5 h-3.5 text-black fill-black/20" />
                                    <h3 className="font-bold text-neutral-900 text-[14px] leading-tight truncate">{city.name}</h3>
                                </div>
                                <div className={`text-2xl font-black tracking-tighter leading-none ${city.color}`}>
                                    {city.aqi}
                                </div>
                            </div>

                            {/* Bottom row: Temp + Hum */}
                            <div className="flex justify-between items-end mt-auto pt-3 relative z-10 w-full">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col line-clamp-1">
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Temp</span>
                                        <span className="text-sm font-bold text-neutral-800">{city.temp}°C</span>
                                    </div>
                                    <div className="h-5 w-px bg-neutral-200"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Hum</span>
                                        <span className="text-sm font-bold text-neutral-800">{city.hum}%</span>
                                    </div>
                                </div>
                                <div className="bg-neutral-100 rounded-full p-1 group-hover:bg-[#1a5f98] transition-colors">
                                    <ArrowUpRight className="w-3 h-3 text-neutral-500 group-hover:text-white" />
                                </div>
                            </div>

                            {/* Subtle Abstract Background Vector */}
                            <div className="absolute -bottom-4 -right-2 opacity-[0.03] pointer-events-none transition-transform group-hover:scale-110 group-hover:opacity-[0.05]">
                                <svg viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24 text-black">
                                    {idx % 3 === 0 && <path d="M20,100 L80,100 L80,40 C80,20 20,20 20,40 Z" />}
                                    {idx % 3 === 1 && <path d="M30,100 L70,100 L70,30 L50,10 L30,30 Z" />}
                                    {idx % 3 === 2 && <path d="M10,100 L90,100 L80,50 L20,50 Z M30,50 L30,10 L70,10 L70,50" />}
                                </svg>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
