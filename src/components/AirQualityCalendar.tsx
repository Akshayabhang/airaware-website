"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface AirQualityCalendarProps {
    city: string;
}

type Pollutant = "aqi" | "pm25" | "pm10" | "tvoc" | "noise";

export default function AirQualityCalendar({ city }: AirQualityCalendarProps) {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState<number>(currentYear);
    const [pollutant, setPollutant] = useState<Pollutant>("aqi");
    const [dailyData, setDailyData] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    // Month pagination starting point (0 = Jan/Feb/Mar, 3 = Apr/May/Jun, etc.)
    const currentMonthIdx = new Date().getMonth();
    // Snap starting month array to groups of 3 (e.g., if we are in March [2], show Jan[0]-Mar[2])
    const initialStartMonth = Math.floor(currentMonthIdx / 3) * 3;
    const [startMonth, setStartMonth] = useState(initialStartMonth);

    useEffect(() => {
        async function fetchCalendarData() {
            if (!city) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/calendar?city=${encodeURIComponent(city)}&year=${year}&pollutant=${pollutant}`);
                const json = await res.json();
                if (json.data) {
                    setDailyData(json.data);
                }
            } catch (err) {
                console.error("Failed to fetch calendar data:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCalendarData();
    }, [city, year, pollutant]);

    // Color mappings based on severity (using the specific hex codes from earlier components/screenshot)
    const getSeverityData = (val: number | undefined, type: Pollutant) => {
        if (val === undefined || val === null) return { color: "bg-neutral-50 text-neutral-400", hex: "#f5f5f5" };

        let threshold1 = 50, threshold2 = 100, threshold3 = 150, threshold4 = 200, threshold5 = 300;

        // Adjust thresholds for other pollutants if needed for demo
        if (type === 'tvoc') { threshold1 = 2; threshold2 = 4; threshold3 = 6; threshold4 = 8; threshold5 = 10; }
        if (type === 'noise') { threshold1 = 40; threshold2 = 60; threshold3 = 80; threshold4 = 100; threshold5 = 120; }

        if (val > threshold5) return { color: "bg-[#7E0023] text-white", hex: "#7E0023" }; // Maroon (Hazardous)
        if (val > threshold4) return { color: "bg-[#99004D] text-white", hex: "#99004D" }; // Purple (Severe)
        if (val > threshold3) return { color: "bg-[#EE4266] text-white", hex: "#EE4266" }; // Red (Unhealthy)
        if (val > threshold2) return { color: "bg-[#F58220] text-white", hex: "#F58220" }; // Orange (Poor)
        if (val > threshold1) return { color: "bg-[#F9C31C] text-white", hex: "#F9C31C" }; // Yellow (Moderate)
        return { color: "bg-[#8BC53F] text-white", hex: "#8BC53F" }; // Green (Good)
    };

    const daysOfWeek = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
    const monthsOfYear = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const handlePrev = () => {
        if (startMonth > 0) setStartMonth(startMonth - 3);
    };

    const handleNext = () => {
        if (startMonth < 9) setStartMonth(startMonth + 3);
    };

    // Helper to generate the exact grid layout for one specific month
    const renderMonth = (monthIndex: number) => {
        const monthName = monthsOfYear[monthIndex];
        // Create Date objects to find the first day of the month and number of days
        const firstDay = new Date(year, monthIndex, 1).getDay(); // 0(Sun) - 6(Sat)
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        const blanks = Array.from({ length: firstDay }).map((_, i) => null);
        const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);

        const calendarCells = [...blanks, ...days];

        // Group into weeks
        const weeks = [];
        for (let i = 0; i < calendarCells.length; i += 7) {
            weeks.push(calendarCells.slice(i, i + 7));
        }

        return (
            <div key={monthIndex} className="flex-1 min-w-[300px]">
                {/* Month grid header */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-neutral-500">
                    {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
                </div>

                {/* Calendar Rows */}
                <div className="flex flex-col gap-2">
                    {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="grid grid-cols-7 gap-1">
                            {week.map((dayNum, dIdx) => {
                                if (!dayNum) return <div key={dIdx} className="h-14"></div>; // Empty cell

                                // Formulate the key to look up in dailyData (YYYY-MM-DD)
                                // Use built-in padding
                                const monthStr = String(monthIndex + 1).padStart(2, '0');
                                const dayStr = String(dayNum).padStart(2, '0');
                                const dateKey = `${year}-${monthStr}-${dayStr}`;

                                const value = dailyData[dateKey];
                                const severity = getSeverityData(value, pollutant);

                                return (
                                    <div key={dIdx} className="flex flex-col h-[52px] rounded border border-neutral-200 overflow-hidden shadow-sm">
                                        {/* Top half: Date header */}
                                        <div className="h-1/2 bg-white flex items-center justify-center text-[10px] font-bold text-neutral-600 border-b border-neutral-100">
                                            {dayNum} {monthName}
                                        </div>
                                        {/* Bottom half: Value / Color area */}
                                        <div className={clsx("h-1/2 flex items-center justify-center text-[11px] font-bold", severity.color)}>
                                            {value !== undefined ? typeof value === 'number' ? Math.round(value) : value : "--"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-24 relative z-20">

            {/* Header section identical to screenshot */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-100 pb-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-neutral-900 leading-tight">Air Quality Calendar {year}</h2>
                    <span className="text-lg font-bold text-[#1a5f98]">{city || "Select a location"}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
                    {/* Year Dropdown */}
                    <div className="relative">
                        <select
                            className="appearance-none bg-[#f8f9fc] border border-neutral-300 text-neutral-800 py-2.5 pl-6 pr-12 rounded-xl font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[#1a5f98] cursor-pointer"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                        >
                            {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                    </div>

                    {/* Pollutant Dropdown */}
                    <div className="relative">
                        <select
                            className="appearance-none bg-[#f8f9fc] border border-neutral-300 text-neutral-800 py-2.5 pl-6 pr-12 rounded-xl font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[#1a5f98] cursor-pointer"
                            value={pollutant}
                            onChange={(e) => setPollutant(e.target.value as Pollutant)}
                        >
                            <option value="aqi">AQI (US)</option>
                            <option value="pm25">PM2.5</option>
                            <option value="pm10">PM10</option>
                            <option value="tvoc">TVOC</option>
                            <option value="noise">Noise</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100">
                {loading ? (
                    <div className="w-full h-64 flex items-center justify-center text-neutral-400 font-medium">Fetching 3-year history calendar...</div>
                ) : (
                    <>
                        {/* 3-Month View Flex Container */}
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 w-full overflow-x-auto pb-4">
                            {renderMonth(startMonth)}
                            {renderMonth(startMonth + 1)}
                            {renderMonth(startMonth + 2)}
                        </div>

                        {/* Footer Controls & Legend */}
                        <div className="flex flex-col lg:flex-row justify-between items-end mt-12 gap-8 lg:gap-0">

                            {/* Legend Box */}
                            <div className="w-full lg:max-w-xl border border-neutral-200 rounded-xl p-4 md:px-8 bg-white shadow-sm flex flex-col justify-center">
                                <div className="flex justify-between w-full text-xs font-bold text-neutral-800 mb-2">
                                    <span className="w-1/6 text-center">Good</span>
                                    <span className="w-1/6 text-center">Moderate</span>
                                    <span className="w-1/6 text-center">Poor</span>
                                    <span className="w-1/6 text-center">Unhealthy</span>
                                    <span className="w-1/6 text-center">Severe</span>
                                    <span className="w-1/6 text-center pl-2">Hazardous</span>
                                </div>

                                <div className="relative w-full h-3 rounded-full overflow-hidden flex outline outline-1 outline-neutral-200">
                                    {/* 6 colored segments */}
                                    <div className="w-1/6 h-full bg-[#8BC53F]"></div>
                                    <div className="w-1/6 h-full bg-[#F9C31C]"></div>
                                    <div className="w-1/6 h-full bg-[#F58220]"></div>
                                    <div className="w-1/6 h-full bg-[#EE4266]"></div>
                                    <div className="w-1/6 h-full bg-[#99004D]"></div>
                                    <div className="w-1/6 h-full bg-[#7E0023]"></div>

                                    {/* White dot indicator - just cosmetic placement to match screenshot structure */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] border-[#8BC53F] bg-white shadow-sm pointer-events-none"></div>
                                </div>

                                <div className="flex justify-between w-full text-[11px] font-bold text-neutral-500 mt-2 px-1">
                                    <span>0</span>
                                    <span>50</span>
                                    <span>100</span>
                                    <span>150</span>
                                    <span>200</span>
                                    <span>300</span>
                                    <span>301+</span>
                                </div>
                            </div>

                            {/* Pagination Arrows */}
                            <div className="flex gap-4 ml-auto lg:ml-0">
                                <button
                                    onClick={handlePrev}
                                    disabled={startMonth === 0}
                                    className="w-10 h-10 rounded-full bg-[#52a6ff] hover:bg-[#3491f6] disabled:bg-neutral-200 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shadow-sm"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={startMonth >= 9}
                                    className="w-10 h-10 rounded-full bg-[#9ac9ff] hover:bg-[#7ab7ff] disabled:bg-neutral-200 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shadow-sm"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
