"use client";

interface LocationTickerProps {
    locations?: { name: string; distance: string; aqi: number; type: string }[];
}

export default function LocationTicker({ locations = [] }: LocationTickerProps) {
    const getBadgeColor = (aqi: number) => {
        if (aqi > 150) return "bg-[#EE4266] text-white"; // Red/Pink
        if (aqi > 100) return "bg-[#F58220] text-white"; // Orange
        if (aqi > 50) return "bg-[#F9C31C] text-black"; // Yellow
        return "bg-[#8BC53F] text-white"; // Green
    };

    return (
        <div className="w-full bg-[#f8f9fa] border-b border-neutral-100 py-2 overflow-x-auto whitespace-nowrap hide-scrollbar flex items-center justify-start sm:justify-center z-[100] relative shadow-sm">
            <div className="flex w-max px-4 gap-8">
                {(locations && locations.length > 0 ? locations : [
                    { name: "Aher", distance: "2.87 km", aqi: 159, type: "AQI" },
                    { name: "Udyog Nagar", distance: "3.17 km", aqi: 179, type: "AQI" },
                    { name: "Rupee Housing Society", distance: "3.34 km", aqi: 152, type: "AQI" },
                    { name: "Alandi Fata", distance: "4.04 km", aqi: 146, type: "AQI" },
                ]).map((loc, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-3 text-sm cursor-pointer hover:bg-black/5 px-2 rounded transition-colors py-1"
                    >
                        <span className="font-extrabold text-neutral-800 text-sm tracking-tight">
                            {loc.name}
                        </span>
                        <span className="text-neutral-500 text-xs font-medium ml-1 mr-2">
                            {loc.distance}
                        </span>
                        <div
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide flex gap-1 items-center shadow-sm ${getBadgeColor(loc.aqi)}`}
                        >
                            <span>{loc.aqi}</span>
                            <span className="text-[9px] opacity-90">{loc.type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}
