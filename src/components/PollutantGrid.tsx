// @ts-nocheck
// Defining a loose type for the WAQI API iaqi object
interface IaqiData {
    pm25?: { v: number };
    pm10?: { v: number };
    o3?: { v: number };
    no2?: { v: number };
    so2?: { v: number };
    co?: { v: number };
    t?: { v: number }; // Temperature
    h?: { v: number }; // Humidity
    w?: { v: number }; // Wind
}

interface PollutantGridProps {
    iaqi: IaqiData | null;
    loading?: boolean;
}

export default function PollutantGrid({ iaqi, loading = false }: PollutantGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-white rounded-2xl animate-pulse shadow-sm border border-neutral-100"></div>
                ))}
            </div>
        );
    }

    if (!iaqi) return null;

    const pollutants = [
        { key: "pm25", label: "PM2.5", full: "Fine Particulate Matter", unit: "µg/m³", icon: "🌫️" },
        { key: "pm10", label: "PM10", full: "Coarse Particulate Matter", unit: "µg/m³", icon: "💨" },
        { key: "o3", label: "O₃", full: "Ozone", unit: "ppb", icon: "⚡" },
        { key: "no2", label: "NO₂", full: "Nitrogen Dioxide", unit: "ppb", icon: "🚗" },
        { key: "so2", label: "SO₂", full: "Sulfur Dioxide", unit: "ppb", icon: "🏭" },
        { key: "co", label: "CO", full: "Carbon Monoxide", unit: "ppm", icon: "⛽" },
    ];

    return (
        <div className="mt-8 w-full">
            <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
                <span>📊</span> Pollutant Breakdown
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {pollutants.map((pollutant) => {
                    // Note: WAQI sometimes returns AQI values for individual pollutants rather than raw concentration
                    const value = iaqi[pollutant.key as keyof IaqiData]?.v;

                    if (value === undefined) return null;

                    // Simple dynamic coloring for individual pollutants (approximate logic based on general AQI scale)
                    let colorClass = "text-neutral-800";
                    if (value > 50 && value <= 100) colorClass = "text-yellow-600";
                    if (value > 100 && value <= 150) colorClass = "text-orange-600";
                    if (value > 150) colorClass = "text-red-600";

                    return (
                        <div
                            key={pollutant.key}
                            className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-neutral-500 group-hover:text-blue-500 transition-colors uppercase tracking-wider">{pollutant.label}</span>
                                    <span className="text-xs text-neutral-400 mt-0.5 line-clamp-1 truncate" title={pollutant.full}>{pollutant.full}</span>
                                </div>
                                <span className="text-xl opacity-70 group-hover:scale-110 transition-transform">{pollutant.icon}</span>
                            </div>

                            <div className="flex items-baseline gap-1 mt-auto">
                                <span className={`text-3xl font-black tracking-tight ${colorClass}`}>
                                    {value}
                                </span>
                                {/* Depending on API, WAQI may return AQI score or raw value. Assuming AQI score for consistency */}
                                <span className="text-sm font-medium text-neutral-400 ml-1">AQI/Score</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
