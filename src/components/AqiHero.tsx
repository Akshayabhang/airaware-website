import { getAqiInfo } from "@/utils/aqi";

interface AqiHeroProps {
    aqi: number | null;
    city: string;
    time: string;
    loading?: boolean;
}

export default function AqiHero({ aqi, city, time, loading = false }: AqiHeroProps) {
    if (loading || aqi === null) {
        return (
            <div className="w-full h-80 bg-white rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center justify-center animate-pulse">
                <div className="w-48 h-48 rounded-full border-[16px] border-neutral-100 mb-6"></div>
                <div className="h-6 w-32 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 w-48 bg-neutral-200 rounded"></div>
            </div>
        );
    }

    const info = getAqiInfo(aqi);

    // Calculate circumference and dash offset for the circular gauge (approximate)
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    // Cap at 500 for visual gauge calculation
    const percentage = Math.min((aqi / 500) * 100, 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`relative overflow-hidden w-full rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-700 shadow-lg border border-white/20 bg-gradient-to-br ${info.gradient}`}>

            {/* City & Time */}
            <div className="z-10 mb-8 text-white">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-sm mb-2">{city}</h1>
                <p className="text-white/80 font-medium">Updated: {time}</p>
            </div>

            {/* AQI Gauge */}
            <div className="relative w-64 h-64 flex justify-center items-center z-10">
                {/* Background Track */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r={radius}
                        strokeWidth="20"
                        className="stroke-white/20 fill-none"
                    />
                    {/* Progress Indicator */}
                    <circle
                        cx="128"
                        cy="128"
                        r={radius}
                        strokeWidth="20"
                        className="stroke-white fill-none drop-shadow-md transition-all duration-1000 ease-out"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                            strokeLinecap: "round"
                        }}
                    />
                </svg>

                {/* Center Numbers */}
                <div className="flex flex-col items-center">
                    <span className="text-6xl font-black text-white drop-shadow-md tracking-tighter">
                        {aqi}
                    </span>
                    <span className="text-xl font-bold text-white/90 tracking-wide uppercase mt-1">
                        AQI
                    </span>
                </div>
            </div>

            {/* Level Tag */}
            <div className="z-10 mt-8">
                <span className="inline-flex items-center px-6 py-2 rounded-full text-lg font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-sm">
                    {info.level}
                </span>
            </div>

            {/* Subtle decorative background circles */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-black/10 blur-3xl mix-blend-overlay pointer-events-none"></div>
        </div>
    );
}
