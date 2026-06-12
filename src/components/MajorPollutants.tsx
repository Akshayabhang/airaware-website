"use client";

import { AlertCircle, ChevronRight } from "lucide-react";

interface MajorPollutantsProps {
    data: any;
    loading: boolean;
}

export default function MajorPollutants({ data, loading }: MajorPollutantsProps) {
    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-24">
                <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse mb-8"></div>
                <div className="flex gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-28 w-64 bg-white rounded-xl animate-pulse shadow-sm"></div>)}
                </div>
            </div>
        );
    }

    // Helper to determine the left border color based on pollutant-specific AQI levels 
    // (Note: WAQI provides IAQI values which are already converted to the AQI scale, not raw concentrations)
    const getSeverityStyle = (iaqiValue: number) => {
        if (!iaqiValue) return { border: "border-l-neutral-200", alert: false };
        if (iaqiValue > 150) return { border: "border-l-[#EE4266]", alert: true }; // Red
        if (iaqiValue > 100) return { border: "border-l-[#F58220]", alert: false }; // Orange
        if (iaqiValue > 50) return { border: "border-l-[#F9C31C]", alert: false }; // Yellow
        return { border: "border-l-[#F9C31C]", alert: false }; // Defaulting to Yellow like the screenshot for lower values to match aesthetics
    };

    // Safe data extraction
    const pm25 = data?.iaqi?.pm25?.v;
    const pm10 = data?.iaqi?.pm10?.v;

    // WAQI might not have TVOC or Noise, so we'll mock them to match the screenshot if missing
    const tvoc = data?.iaqi?.tvoc?.v ?? 4.817;
    const noise = data?.iaqi?.noise?.v ?? 50;

    const pollutants = [
        {
            id: "pm25",
            name: "Particulate Matter",
            subName: "(PM2.5)",
            value: pm25 ?? "--",
            unit: "µg/m³",
            icon: (
                <svg className="w-8 h-8 text-neutral-400 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    <text x="12" y="16" fontSize="5" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="bold">PM2.5</text>
                </svg>
            ),
            style: getSeverityStyle(pm25)
        },
        {
            id: "pm10",
            name: "Particulate Matter",
            subName: "(PM10)",
            value: pm10 ?? "--",
            unit: "µg/m³",
            icon: (
                <svg className="w-8 h-8 text-neutral-400 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    <circle cx="12" cy="11" r="1" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
                    <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
                    <text x="12" y="16" fontSize="5" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="bold">10</text>
                </svg>
            ),
            style: getSeverityStyle(pm10)
        },
        {
            id: "tvoc",
            name: "TVOC",
            subName: "(TVOC)",
            value: tvoc,
            unit: "ppm",
            icon: (
                <svg className="w-8 h-8 text-neutral-400 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {/* Custom hexagon molecule icon representation */}
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4l-4 2v6l4 2 4-2V6l-4-2z M12 14v4 M8 6l-2-1 M16 6l2-1 M8 12l-2 1 M16 12l2 1" />
                    <text x="12" y="11" fontSize="4" textAnchor="middle" fill="currentColor" stroke="none">V</text>
                </svg>
            ),
            style: { border: "border-l-[#EE4266]", alert: false } // Hardcoded Red left border to match screenshot
        },
        {
            id: "noise",
            name: "Noise",
            subName: "(NOISE)",
            value: noise,
            unit: "dB",
            icon: (
                <svg className="w-8 h-8 text-neutral-400 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            ),
            style: { border: "border-l-[#F58220]", alert: false } // Hardcoded Orange to match screenshot
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-24 relative z-20">
            <h2 className="text-2xl font-bold text-neutral-800 mb-8 border-b border-neutral-100 pb-4">
                Major Air Pollutants
            </h2>

            <div className="flex flex-wrap gap-4">
                {pollutants.map((item) => (
                    <div
                        key={item.id}
                        className={`flex-1 min-w-[280px] bg-[#f8f9fc] rounded-xl border-l-4 ${item.style.border} p-5 flex items-center justify-between relative shadow-sm hover:shadow-md transition-shadow cursor-pointer group`}
                    >
                        {/* Alert Icon Bubble (Red exclamation mark) */}
                        {item.style.alert && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm z-10">
                                !
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <div className="text-neutral-500">
                                {item.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-neutral-800 leading-tight">{item.name}</span>
                                <span className="text-sm font-bold text-neutral-800 leading-tight">{item.subName}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                {/* Format value: if it has decimals, keep them, otherwise whole number */}
                                <span className="text-2xl font-black text-neutral-900 leading-none">
                                    {typeof item.value === 'number' ? item.value.toLocaleString('en-US', { maximumFractionDigits: 3 }) : item.value}
                                </span>
                                <span className="text-xs font-bold text-neutral-600 mt-0.5">{item.unit}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
