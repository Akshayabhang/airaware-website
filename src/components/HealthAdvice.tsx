"use client";

import { Activity, Shield, Home, Car, Info, ArrowRight } from "lucide-react";

interface HealthAdviceProps {
    city: string;
    data: any;
}

export default function HealthAdvice({ city, data }: HealthAdviceProps) {
    // Berkeley Earth Rule of Thumb: 1 cigarette ≈ 22 μg/m3 of PM2.5

    // Note: WAQI `iaqi.pm25.v` is actually the *AQI* value for PM2.5, not raw concentration. 
    // Let's use the provided AQI to estimate PM2.5 concentration if we don't have it directly
    const aqi = data?.aqi || 0;

    // Rough estimation function if raw PM2.5 μg/m³ is not available
    const estimatePm25Concentration = (aqi: number) => {
        if (aqi <= 50) return (aqi / 50) * 12.0;
        if (aqi <= 100) return 12.1 + ((aqi - 51) / 49) * (35.4 - 12.1);
        if (aqi <= 150) return 35.5 + ((aqi - 101) / 49) * (55.4 - 35.5);
        if (aqi <= 200) return 55.5 + ((aqi - 151) / 49) * (150.4 - 55.5);
        if (aqi <= 300) return 150.5 + ((aqi - 201) / 99) * (250.4 - 150.5);
        return 250.5 + ((aqi - 301) / 199) * (500.4 - 250.5);
    };

    const pm25Concentration = estimatePm25Concentration(aqi);

    // Calculate Cigarettes (1 cig = 22 μg/m3)
    const dailyCigs = Math.max(0, pm25Concentration / 22);
    const weeklyCigs = dailyCigs * 7;
    const monthlyCigs = dailyCigs * 30;

    if (!data?.aqi) return null;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12 relative z-20">

            <div className="mb-6">
                <h2 className="text-xl font-bold text-neutral-900 leading-tight">Health Advice For People Living In</h2>
                <span className="text-xl font-bold text-[#1a5f98]">{city || "Select a location"}</span>
            </div>

            <div className="bg-white rounded-[32px] p-6 lg:p-10 shadow-sm border border-neutral-100 flex flex-col">

                {/* Top Section: Cigarette Calculations */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-neutral-100 pb-10 gap-10 lg:gap-0">

                    {/* Daily (Large) & Graphic */}
                    <div className="flex items-center gap-6 lg:gap-12">
                        <div className="flex flex-col">
                            <span className="text-6xl font-black text-[#EE4266] leading-none mb-1">{dailyCigs.toFixed(1)}</span>
                            <span className="text-sm font-bold text-[#EE4266] leading-tight">Cigarettes<br />per day</span>
                        </div>

                        {/* SVG Cigarette Graphic matching screenshot */}
                        <div className="relative w-32 h-16 ml-4">
                            <svg width="100%" height="100%" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Smoke Particles */}
                                <circle cx="65" cy="5" r="3" fill="#A3A3A3" opacity="0.6" />
                                <circle cx="60" cy="12" r="4" fill="#A3A3A3" opacity="0.8" />
                                <circle cx="68" cy="18" r="5" fill="#A3A3A3" opacity="0.9" />
                                <circle cx="62" cy="25" r="3" fill="#A3A3A3" opacity="0.7" />
                                <circle cx="67" cy="30" r="2" fill="#A3A3A3" opacity="0.6" />
                                {/* Filter */}
                                <rect x="10" y="38" width="15" height="6" rx="1" fill="#D39F63" />
                                {/* Body */}
                                <rect x="25" y="38" width="40" height="6" fill="#F4F4F4" stroke="#E5E5E5" strokeWidth="0.5" />
                                {/* Ash/Burn End */}
                                <rect x="65" y="38.5" width="2" height="5" fill="#333333" />
                                {/* Embers */}
                                <circle cx="66" cy="41" r="1.5" fill="#EE4266" />
                            </svg>
                        </div>
                    </div>

                    {/* Weekly and Monthly Summaries */}
                    <div className="flex gap-16 lg:gap-24">
                        <div className="flex flex-col">
                            <span className="text-neutral-800 font-bold mb-2">Weekly</span>
                            <span className="text-2xl font-black text-[#EE4266] leading-none">
                                {weeklyCigs.toFixed(1)} <span className="text-lg font-bold">Cigarettes</span>
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-neutral-800 font-bold mb-2">Monthly</span>
                            <span className="text-2xl font-black text-[#EE4266] leading-none">
                                {Math.round(monthlyCigs)} <span className="text-lg font-bold">Cigarettes</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Explanation & Disclaimer */}
                <div className="py-8 border-b border-neutral-100 flex flex-col lg:flex-row items-start lg:justify-between gap-6 lg:gap-12">
                    <div className="flex flex-col gap-4 max-w-2xl">
                        <p className="text-neutral-800 text-lg">
                            Breathing the air in this location is as harmful as smoking <strong>{dailyCigs.toFixed(1)}</strong> cigarettes a day.
                        </p>
                        <p className="text-[#a5a5a5] text-[11px] italic pr-4">
                            Disclaimer: This cigarette-equivalent estimate is based on the average PM2.5 concentration over the last 24 hours, assuming continuous exposure during that time.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-full text-neutral-500 text-sm whitespace-nowrap bg-neutral-50 shrink-0 self-start lg:self-center">
                        Source: Berkeley Earth
                        <Info className="w-4 h-4 ml-1" />
                    </div>
                </div>

                {/* Bottom Section: Solutions */}
                <div className="pt-8">
                    <h3 className="text-sm font-bold text-neutral-900 mb-6 tracking-wide">Solutions for Current AQI (US)</h3>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-0">

                        <div className="flex flex-wrap gap-4 lg:gap-8">
                            {/* Solution: Air Purifier (Active Style in Screenshot) */}
                            <div className="flex items-center gap-3 bg-[#f6f9fc] border border-[#d6e5fa] rounded-xl px-5 py-3 cursor-pointer transition-colors hover:bg-[#eff4fb]">
                                <Shield className="w-8 h-8 text-neutral-600 stroke-1" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-neutral-900 leading-tight">Air Purifier</span>
                                    <span className="text-xs text-neutral-500 font-medium">Turn On</span>
                                </div>
                            </div>

                            {/* Solution: Car Filter */}
                            <div className="flex items-center gap-3 px-5 py-3 opacity-90 cursor-default">
                                <Car className="w-8 h-8 text-neutral-600 stroke-1" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-neutral-900 leading-tight">Car Filter</span>
                                    <span className="text-xs text-neutral-500 font-medium">Must</span>
                                </div>
                            </div>

                            {/* Solution: N95 Mask */}
                            <div className="flex items-center gap-3 px-5 py-3 opacity-90 cursor-default">
                                <Activity className="w-8 h-8 text-neutral-600 stroke-1" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-neutral-900 leading-tight">N95 Mask</span>
                                    <span className="text-xs text-neutral-500 font-medium">Must</span>
                                </div>
                            </div>

                            {/* Solution: Stay Indoor */}
                            <div className="flex items-center gap-3 px-5 py-3 opacity-90 cursor-default">
                                <Home className="w-8 h-8 text-neutral-600 stroke-1" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-neutral-900 leading-tight">Stay Indoor</span>
                                    <span className="text-xs text-neutral-500 font-medium">Must</span>
                                </div>
                            </div>
                        </div>

                        {/* Right side call to action */}
                        <div className="lg:pl-8 lg:border-l border-neutral-200 flex flex-col pt-4 lg:pt-0">
                            <p className="text-sm text-neutral-600 mb-2 font-medium">
                                Must turn on the air purifier<br />to enjoy fresh air.
                            </p>
                            <a href="#" className="inline-flex items-center text-sm font-bold text-[#1a5f98] hover:underline">
                                Get an Air Purifier
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
