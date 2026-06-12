import React, { useMemo } from 'react';

interface WeatherParamsData {
    locationName: string;
    wind_kph: number;
    wind_dir: string;
    wind_degree: number;
    gust_kph: number;
    cloud: number;
    vis_km: number;
    precip_mm: number;
    pressure_mb: number;
    uv: number;
    dateStr: string;
}

interface WeatherParametersProps {
    data: WeatherParamsData;
}

export default function WeatherParameters({ data }: WeatherParametersProps) {

    const windDescription = useMemo(() => {
        if (data.wind_kph < 1) return "Calm";
        if (data.wind_kph < 5) return "Light air";
        if (data.wind_kph < 11) return "Light breeze";
        if (data.wind_kph < 19) return "Gentle breeze";
        if (data.wind_kph < 28) return "Moderate breeze";
        if (data.wind_kph < 38) return "Fresh breeze";
        if (data.wind_kph < 49) return "Strong breeze";
        return "High wind";
    }, [data.wind_kph]);

    const wind_ms = (data.wind_kph * (1000 / 3600)).toFixed(1);
    const gust_ms = (data.gust_kph * (1000 / 3600)).toFixed(1);

    const pressurePercentage = Math.min(Math.max((data.pressure_mb - 950) / 100 * 100, 0), 100);
    const uvPercentage = Math.min((data.uv / 11) * 100, 100);

    return (
        <div className="w-full bg-slate-100 dark:bg-[#030614] text-slate-900 dark:text-white p-6 md:p-10 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">

                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold"><span className="text-blue-600 dark:text-[#3b82f6] transition-colors">{data.locationName}</span> Weather Parameters</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">

                    {/* Wind Card */}
                    <div className="lg:col-span-4 bg-white dark:bg-[#0B1528] rounded-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/5 transition-colors duration-300 drop-shadow-sm dark:drop-shadow-none">
                        <div className="h-40 flex items-end justify-center pb-4 relative overflow-hidden bg-slate-50 dark:bg-gradient-to-b dark:from-[#081021] dark:to-[#0A1426] transition-colors duration-300">
                            <div className="flex items-baseline gap-4 text-slate-200 dark:text-white/80">
                                <svg className="w-12 h-20" viewBox="0 0 24 40" fill="none" stroke="currentColor"><path d="M11 20v20M13 20v20M12 20l-8-8M12 20l8-8M12 20v-12" strokeWidth="2" /><circle cx="12" cy="8" r="2" fill="#10b981" /></svg>
                                <svg className="w-16 h-24" viewBox="0 0 24 40" fill="none" stroke="currentColor"><path d="M11 20v20M13 20v20M12 20l-8-8M12 20l8-8M12 20v-12" strokeWidth="2" /><circle cx="12" cy="8" r="2" fill="#10b981" /></svg>
                                <svg className="w-10 h-16" viewBox="0 0 24 40" fill="none" stroke="currentColor"><path d="M11 20v20M13 20v20M12 20l-8-8M12 20l8-8M12 20v-12" strokeWidth="2" /><circle cx="12" cy="8" r="2" fill="#10b981" /></svg>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60 mb-1 transition-colors">
                                    Wind Speed
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div className="text-4xl font-bold">{data.wind_kph} <span className="text-lg font-normal text-slate-400 dark:text-white/70">km/h</span></div>
                                    <div className="bg-blue-100 text-blue-900 dark:bg-[#a5b4fc] dark:text-[#1e1b4b] text-xs font-bold px-3 py-1 rounded-full transition-colors">{windDescription}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 border-t border-slate-100 dark:border-white/10 pt-6 transition-colors">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60 mb-2 transition-colors">
                                        Gust Speed
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="mb-2 text-[#d97706]">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" /></svg>
                                    </div>
                                    <div className="text-2xl font-bold">{gust_ms} <span className="text-sm font-normal text-slate-400 dark:text-white/70 transition-colors">m/s</span></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60 mb-2 transition-colors">
                                        Direction
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="mb-2 text-blue-500 dark:text-[#3b82f6]">
                                        <svg className="w-6 h-6" style={{ transform: `rotate(${data.wind_degree}deg)` }} fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                                    </div>
                                    <div className="text-2xl font-bold">{data.wind_degree}° <span className="text-sm font-normal text-slate-400 dark:text-white/70 transition-colors">{data.wind_dir}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#121F36] border-t border-slate-100 dark:border-transparent p-4 text-xs text-slate-400 dark:text-white/50 transition-colors duration-300">
                            Current wind speed is a {data.wind_kph} km/h, with gusts at {gust_ms} m/s
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-4">

                        {/* Cloud Cover & Vis */}
                        <div className="bg-white dark:bg-[#0B1528] rounded-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/5 h-1/2 drop-shadow-sm dark:drop-shadow-none transition-colors duration-300">
                            <div className="h-24 flex items-center justify-around px-4 pt-4 relative overflow-hidden text-slate-200 dark:text-white/80 transition-colors duration-300">
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.759-1.564 5.5 5.5 0 011.082 10.54H5.5z" /></svg>
                                <svg className="w-10 h-10 mb-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.759-1.564 5.5 5.5 0 011.082 10.54H5.5z" /></svg>
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.759-1.564 5.5 5.5 0 011.082 10.54H5.5z" /></svg>
                            </div>
                            <div className="flex-1 p-5 grid grid-cols-2 gap-2">
                                <div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-white/60 mb-1 transition-colors">
                                        Cloud Cover
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="text-3xl font-bold">{data.cloud}<span className="text-base font-normal">%</span></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-white/60 mb-1 transition-colors">
                                        Visibility
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="text-3xl font-bold">{data.vis_km} <span className="text-base font-normal text-slate-400 dark:text-white/70 transition-colors">km</span></div>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#121F36] border-t border-slate-100 dark:border-transparent p-4 text-[11px] text-slate-400 dark:text-white/50 transition-colors duration-300">
                                Recent visibility is {data.vis_km}km with {data.cloud}% cloud coverage, so plan accordingly!
                            </div>
                        </div>

                        {/* Precipitation */}
                        <div className="bg-white dark:bg-[#0B1528] rounded-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/5 h-1/2 drop-shadow-sm dark:drop-shadow-none transition-colors duration-300">
                            <div className="px-5 pt-4 pb-2 flex justify-between items-center text-sm">
                                <span className="text-slate-700 dark:text-white transition-colors">Precipitation</span>
                                <svg className="w-4 h-4 text-slate-400 dark:text-white/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="flex-1 flex px-5 pb-5 items-center justify-between">
                                <div className="relative">
                                    <svg className="w-16 h-16 text-slate-200 dark:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.759-1.564 5.5 5.5 0 011.082 10.54H5.5z" /></svg>
                                    <div className="absolute top-2 right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <div className="absolute -bottom-2 left-3 flex gap-2">
                                        <span className="w-0.5 h-2 bg-blue-400 dark:bg-[#3b82f6] rotate-12 transition-colors"></span>
                                        <span className="w-0.5 h-2 bg-blue-400 dark:bg-[#3b82f6] rotate-12 transition-colors"></span>
                                        <span className="w-0.5 h-2 bg-blue-400 dark:bg-[#3b82f6] rotate-12 transition-colors"></span>
                                    </div>
                                </div>
                                <div className="text-4xl font-bold">{data.precip_mm} <span className="text-base font-normal text-slate-400 dark:text-white/70 transition-colors">mm</span></div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#121F36] border-t border-slate-100 dark:border-transparent p-4 text-[11px] text-slate-400 dark:text-white/50 transition-colors duration-300">
                                Current precipitation chances sit at {data.precip_mm}mm
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-4">

                        {/* Pressure Card */}
                        <div className="bg-white dark:bg-[#0B1528] rounded-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/5 h-1/2 drop-shadow-sm dark:drop-shadow-none transition-colors duration-300">
                            <div className="px-5 pt-4 pb-2 flex justify-between items-center text-sm">
                                <span className="text-slate-700 dark:text-white transition-colors">Pressure</span>
                                <svg className="w-4 h-4 text-slate-400 dark:text-white/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="flex-1 px-5 pb-2 flex items-center justify-between gap-4">
                                <div className="relative w-24 h-24">
                                    <svg viewBox="0 0 36 36" className="w-full h-full text-slate-200 dark:text-white/20 transition-colors duration-300">
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" />
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray={`${pressurePercentage}, 100`} />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 w-[2px] h-8 bg-slate-800 dark:bg-white origin-bottom rounded -translate-x-1/2 -translate-y-full transition-colors duration-300" style={{ transform: `translateX(-50%) translateY(-100%) rotate(${(pressurePercentage / 100) * 270 - 135}deg)` }}>
                                        <div className="w-2 h-2 rounded-full bg-red-500 absolute -bottom-1 -left-[3px]"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-3xl font-bold">{data.pressure_mb} <span className="text-sm font-normal text-slate-400 dark:text-white/70 transition-colors">mb</span></div>
                                    <div className="bg-red-50 text-red-600 dark:bg-red-500 dark:text-white text-[10px] font-bold px-3 py-1 rounded mt-1 transition-colors">Moderate</div>
                                </div>
                            </div>
                            <div className="px-5 pb-4">
                                <div className="h-1.5 w-full bg-gradient-to-r from-green-500 via-orange-500 to-red-500 rounded mb-1 relative">
                                    <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow border border-slate-200 dark:border-transparent" style={{ left: `${pressurePercentage}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#121F36] border-t border-slate-100 dark:border-transparent p-4 text-[11px] text-slate-400 dark:text-white/50 transition-colors duration-300">
                                Current pressure level is a {data.pressure_mb} mb.
                            </div>
                        </div>

                        {/* UV Index */}
                        <div className="bg-white dark:bg-[#0B1528] rounded-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/5 h-1/2 drop-shadow-sm dark:drop-shadow-none transition-colors duration-300">
                            <div className="px-5 pt-4 pb-2 flex justify-between items-center text-sm relative z-10">
                                <span className="text-slate-700 dark:text-white transition-colors">UV Index</span>
                                <svg className="w-4 h-4 text-slate-400 dark:text-white/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>

                            <div className="flex-1 relative overflow-hidden flex flex-col items-center pt-2">
                                <div className="absolute -top-10 left-4 w-24 h-24 bg-yellow-400 dark:bg-yellow-500 rounded-full opacity-60 dark:opacity-80 blur-[2px] shadow-[0_0_30px_#facc15] dark:shadow-[0_0_30px_#eab308] transition-colors duration-300"></div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="text-sm text-slate-600 dark:text-white/80 transition-colors">UV Index</div>
                                    <div className="text-3xl font-bold mb-4 text-slate-900 dark:text-white transition-colors">{data.uv}</div>
                                </div>

                                <div className="w-full px-5 pb-4 mt-auto">
                                    <div className="h-6 w-full rounded relative shadow-inner overflow-hidden flex items-center justify-center font-bold text-xs" style={{ background: 'linear-gradient(to right, #84cc16, #eab308, #ef4444, #d946ef)' }}>
                                        <span className="text-white drop-shadow-md z-10">{data.uv < 3 ? 'Low' : data.uv < 6 ? 'Moderate' : data.uv < 8 ? 'High' : 'Very High'}</span>
                                        <div className="absolute top-0 bottom-0 left-0 bg-black/20" style={{ width: `${uvPercentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#121F36] border-t border-slate-100 dark:border-transparent p-4 text-[11px] text-slate-400 dark:text-white/50 transition-colors duration-300">
                                The present UV index is {data.uv}, consider suggestions for the same!
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-2 bg-white dark:bg-[#0B1528] rounded-2xl flex flex-col border border-slate-200 dark:border-white/5 p-6 border-l border-slate-200 dark:border-white/10 drop-shadow-sm dark:drop-shadow-none transition-colors duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white transition-colors">Suggestions for</h3>
                                <span className="text-sm text-blue-600 dark:text-[#3b82f6] transition-colors">{data.locationName}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 dark:text-white/60 transition-colors">Today</div>
                                <div className="text-sm font-bold">{data.dateStr}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-10 gap-x-2 mt-4 relative">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-full h-[1px] bg-slate-200 dark:bg-white/5 transition-colors duration-300"></div>
                                <div className="absolute h-full w-[1px] bg-slate-200 dark:bg-white/5 transition-colors duration-300"></div>
                            </div>

                            <div className="flex flex-col gap-2 relative z-10">
                                <svg className="w-8 h-8 text-slate-400 dark:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <div>
                                    <div className="text-sm font-medium">Heat Stroke</div>
                                    <div className="text-[10px] text-slate-500 dark:text-white/60 flex items-center gap-1 mt-1 transition-colors"><span className="w-1 h-1 bg-blue-500 dark:bg-[#3b82f6] rounded-full transition-colors"></span> Avoid Outdoor</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 relative z-10 pl-2">
                                <div className="flex text-slate-400 dark:text-white/80 transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                    <svg className="w-5 h-5 -ml-2 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Clothing</div>
                                    <div className="text-[10px] text-slate-500 dark:text-white/60 flex items-center gap-1 mt-1 transition-colors"><span className="w-1 h-1 bg-blue-500 dark:bg-[#3b82f6] rounded-full transition-colors"></span> Breathable</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 relative z-10">
                                <svg className="w-8 h-8 text-slate-400 dark:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div>
                                    <div className="text-sm font-medium">Driving</div>
                                    <div className="text-[10px] text-slate-500 dark:text-white/60 flex items-center gap-1 mt-1 transition-colors"><span className="w-1 h-1 bg-blue-500 dark:bg-[#3b82f6] rounded-full transition-colors"></span> Enjoy Driving</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 relative z-10 pl-2">
                                <svg className="w-8 h-8 text-slate-400 dark:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <div>
                                    <div className="text-sm font-medium">Sunscreen</div>
                                    <div className="text-[10px] text-slate-500 dark:text-white/60 flex items-center gap-1 mt-1 transition-colors"><span className="w-1 h-1 bg-blue-500 dark:bg-[#3b82f6] rounded-full transition-colors"></span> Needed</div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
