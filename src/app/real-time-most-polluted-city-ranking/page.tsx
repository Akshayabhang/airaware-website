"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import PollutionRanking from "@/components/PollutionRanking";

export default function RealTimePollutedCityRanking() {
    const [loading, setLoading] = useState(false);

    const handleSearch = (city: string) => {
        // Simple redirect or handled by navbar if needed
        window.location.href = `/?city=${encodeURIComponent(city)}`;
    };

    const handleLocate = () => {
        window.location.href = `/`;
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#fafbfc] relative overflow-x-hidden">
            <Navbar onSearch={handleSearch} onLocate={handleLocate} isLoading={loading} />

            {/* Hero Section with Skyline Background */}
            <div className="relative w-full pt-20 pb-16 overflow-hidden bg-white border-b border-neutral-100">
                {/* Background Skyline Image */}
                <div
                    className="absolute inset-0 z-0 opacity-[0.15] bg-no-repeat bg-right-bottom"
                    style={{
                        backgroundImage: "url('/skyline_faint_bg.png')",
                        backgroundSize: "60%", // Adjust size to match the reference
                        backgroundPosition: "calc(100% + 100px) bottom"
                    }}
                ></div>

                {/* Dotted World Map Background (Added per request) */}
                <div
                    className="absolute inset-0 z-[1] opacity-70 bg-no-repeat hidden lg:block"
                    style={{
                        backgroundImage: "url('/dotted_world_map.png')",
                        backgroundSize: "45%",
                        backgroundPosition: "right 10% center"
                    }}
                ></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <span className="text-neutral-500 font-bold text-sm mb-3">Real-time</span>
                    <h1 className="text-3xl md:text-[42px] font-black text-neutral-900 leading-[1.1] mb-4 max-w-2xl flex flex-wrap items-center justify-center lg:justify-start gap-3">
                        Real-time Most Polluted Cities in The World 2026
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold text-white bg-[#ff2752] rounded-md shadow-sm transform -translate-y-1">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                        </span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-base md:text-lg max-w-xl leading-relaxed mb-12">
                        Find out the world's most polluted cities with the real-time rankings of AQI & PM2.5 data
                    </p>

                    {/* Segmented Control / Tabs */}
                    <div className="inline-flex bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-neutral-100 p-1">
                        <button className="flex items-center gap-2 px-6 py-3.5 bg-[#4ca6ff] rounded-[10px] text-white font-bold text-sm shadow-sm transition-transform hover:scale-[1.02]">
                            <span className="w-2 h-2 bg-[#ff2752] rounded-full ring-2 ring-white/30 animate-pulse"></span>
                            Live AQI City Ranking
                        </button>
                        <button className="px-6 py-3.5 text-neutral-500 font-semibold text-sm hover:text-neutral-900 transition-colors">
                            World's Most Polluted Cities
                        </button>
                        <button className="px-6 py-3.5 text-neutral-500 font-semibold text-sm hover:text-neutral-900 transition-colors">
                            World's Most Polluted Countries
                        </button>
                    </div>
                </div>
            </div>

            {/* Injected Pollution Ranking Component */}
            {/* The existing PollutionRanking component has its own top title/margin, 
                so we apply negative margin to pull it up cohesively if needed, 
                or just let it flow naturally. */}
            <div className="flex-1 w-full bg-[#fafbfc] -mt-8">
                <PollutionRanking />
            </div>

        </div>
    );
}
