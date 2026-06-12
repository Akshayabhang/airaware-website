"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import WeatherDashboard from "@/components/WeatherDashboard";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";

// Dynamically import Leaflet components to avoid SSR window issues
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);

function MapEffect() {
    const mapHooks = require("react-leaflet"); // Workaround for dynamic import of hooks
    const map = mapHooks.useMap();

    useEffect(() => {
        if (map && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    map.flyTo([pos.coords.latitude, pos.coords.longitude], 6, { animate: true, duration: 1.5 });
                },
                (err) => {
                    console.warn("Geolocation blocked or failed. Using default location.", err);
                }
            );
        }
    }, [map]);

    return null;
}

// Interactivity Component for Custom Controls
function MapControls() {
    const mapHooks = require("react-leaflet");
    const map = mapHooks.useMap();

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    map.flyTo([pos.coords.latitude, pos.coords.longitude], 10, { animate: true, duration: 1.5 });
                },
                (err) => {
                    alert("Could not access your location. Please check browser permissions.");
                    console.warn(err);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    return (
        <div className="absolute bottom-24 right-4 z-[400] flex flex-col gap-2">
            {/* Locate Me Button overlayed directly on the map */}
            <button
                onClick={handleLocateMe}
                title="Find My Location"
                className="w-10 h-10 bg-white dark:bg-[#1e293b] text-blue-600 dark:text-blue-400 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center border border-neutral-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-[400]"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </button>
        </div>
    );
}

export default function LiveWeatherRankingPage() {
    const [loading, setLoading] = useState(false);
    const [activeLayer, setActiveLayer] = useState<"wind" | "temp" | "rh" | "pressure">("temp");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { theme, systemTheme } = useTheme();

    // Theme resolution for initial render
    const currentTheme = mounted ? (theme === "system" ? systemTheme : theme) : "dark";

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (city: string) => {
        router.push(`/?city=${encodeURIComponent(city)}`);
    };

    const handleLocate = () => {
        router.push(`/`);
    };

    const changeLayer = (layer: "wind" | "temp" | "rh" | "pressure") => {
        setActiveLayer(layer);
    };

    // Note: requires a free OpenWeatherMap API key.
    const getTileUrl = () => {
        const apiKey = process.env.NEXT_PUBLIC_OWM_API_KEY || "d33d0ca895d676b2b6d49f221d938c7f";
        switch (activeLayer) {
            case "temp":
                return `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`;
            case "wind":
                return `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`;
            case "rh":
                return `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`;
            case "pressure":
            default:
                return `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${apiKey}`;
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-50 dark:bg-[#0a0f18] relative text-slate-800 dark:text-white transition-colors duration-300">
            <div className="bg-white text-black relative z-50">
                <Navbar onSearch={handleSearch} onLocate={handleLocate} isLoading={loading} />
            </div>

            {/* Top Half Map Container */}
            <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden bg-slate-200 dark:bg-[#1e293b] transition-colors duration-300">

                {/* Leaflet Map Target */}
                {mounted && (
                    <div className="absolute inset-0 z-0">
                        <MapContainer
                            center={[20, 80]}
                            zoom={4}
                            scrollWheelZoom={false}
                            className="w-full h-full"
                            zoomControl={false}
                        >
                            {/* Base Map Layer required since OWM tiles are transparent overlays */}
                            <TileLayer
                                key={`base-${currentTheme}`}
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Carto</a>'
                                url={currentTheme === "dark" ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"}
                            />
                            {/* OpenWeatherMap Weather Overlay Tool */}
                            <TileLayer
                                key={activeLayer}
                                url={getTileUrl()}
                                opacity={0.65} // Slightly more transparent so cities below are visible
                            />
                            <MapEffect />
                            <MapControls />
                        </MapContainer>
                    </div>
                )}

                {/* Fallback until mounted */}
                {!mounted && (
                    <div className="absolute inset-0 z-[1] flex items-center justify-center bg-slate-50 dark:bg-[#0a0f18] transition-colors duration-300">
                        <div className="text-slate-600 dark:text-white text-sm font-medium animate-pulse">Initializing Map Engine...</div>
                    </div>
                )}

                {/* Custom Overlay Controls - Right Side Vertical Menu (Matching Screenshot) */}
                <div className="absolute top-6 right-4 z-10 flex flex-col items-end gap-2">
                    {/* Menu Button Placeholder */}
                    <div className="flex bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md rounded-full shadow-lg border border-neutral-200 dark:border-white/10 p-1 mb-2 items-center transition-colors">
                        <span className="px-3 text-sm font-semibold text-slate-800 dark:text-white">Menu</span>
                        <button className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center shadow-inner hover:bg-red-500 transition-colors">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>

                    {/* Wind Layer */}
                    <button
                        onClick={() => changeLayer("wind")}
                        className={`group flex items-center gap-3 transition-transform hover:-translate-x-1`}
                    >
                        <span className={`text-sm font-semibold px-2 py-1 rounded bg-white/80 dark:bg-black/40 backdrop-blur opacity-0 group-hover:opacity-100 transition-colors ${activeLayer === 'wind' ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-neutral-300'}`}>Wind</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-colors ${activeLayer === 'wind' ? 'bg-gradient-to-tr from-blue-600 to-green-400 border-white dark:border-white/50 ring-2 ring-blue-500/50' : 'bg-white dark:bg-[#1e293b] border-neutral-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-[#334155]'}`}>
                            <svg className={`w-5 h-5 ${activeLayer === 'wind' ? 'text-white' : 'text-slate-500 dark:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </button>

                    {/* Temperature Layer */}
                    <button
                        onClick={() => changeLayer("temp")}
                        className={`group flex items-center gap-3 transition-transform hover:-translate-x-1 mt-1`}
                    >
                        <span className={`text-sm font-semibold px-2 py-1 rounded bg-white/80 dark:bg-black/40 backdrop-blur opacity-0 group-hover:opacity-100 transition-colors ${activeLayer === 'temp' ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-neutral-300'}`}>Temperature</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-colors ${activeLayer === 'temp' ? 'bg-gradient-to-tr from-orange-500 to-red-500 border-white dark:border-white/50 ring-2 ring-red-500/50' : 'bg-white dark:bg-[#1e293b] border-neutral-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-[#334155]'}`}>
                            <svg className={`w-5 h-5 ${activeLayer === 'temp' ? 'text-white' : 'text-slate-500 dark:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                    </button>

                    {/* Rain/Radar/Humidity Layer */}
                    <button
                        onClick={() => changeLayer("rh")}
                        className={`group flex items-center gap-3 transition-transform hover:-translate-x-1 mt-1`}
                    >
                        <span className={`text-sm font-semibold px-2 py-1 rounded bg-white/80 dark:bg-black/40 backdrop-blur opacity-0 group-hover:opacity-100 transition-colors ${activeLayer === 'rh' ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-neutral-300'}`}>Humidity / Rain</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-colors ${activeLayer === 'rh' ? 'bg-gradient-to-tr from-blue-400 to-blue-800 border-white dark:border-white/50 ring-2 ring-blue-500/50' : 'bg-white dark:bg-[#1e293b] border-neutral-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-[#334155]'}`}>
                            <svg className={`w-5 h-5 ${activeLayer === 'rh' ? 'text-white' : 'text-slate-500 dark:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                    </button>

                    {/* Pressure Layer */}
                    <button
                        onClick={() => changeLayer("pressure")}
                        className={`group flex items-center gap-3 transition-transform hover:-translate-x-1 mt-1`}
                    >
                        <span className={`text-sm font-semibold px-2 py-1 rounded bg-white/80 dark:bg-black/40 backdrop-blur opacity-0 group-hover:opacity-100 transition-colors ${activeLayer === 'pressure' ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-neutral-300'}`}>Pressure</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-colors ${activeLayer === 'pressure' ? 'bg-[#8b5cf6] border-white dark:border-white/50 ring-2 ring-purple-500/50' : 'bg-white dark:bg-[#1e293b] border-neutral-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-[#334155]'}`}>
                            <svg className={`w-5 h-5 ${activeLayer === 'pressure' ? 'text-white' : 'text-slate-500 dark:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </button>

                    {/* Altitude (Visual placeholder matching screenshot) */}
                    <button className={`group flex items-center gap-3 transition-transform hover:-translate-x-1 mt-1`}>
                        <span className={`text-sm font-semibold px-2 py-1 rounded bg-white/80 dark:bg-black/40 backdrop-blur opacity-0 group-hover:opacity-100 transition-colors text-slate-500 dark:text-neutral-300`}>Altitude</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border bg-yellow-500 border-white/40 hover:bg-yellow-400`}>
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </button>
                </div>

                {/* Bottom Horizontal Bar */}
                <div className="absolute bottom-0 inset-x-0 z-10 flex flex-col pointer-events-none">

                    {/* Floating Controls Row (Play button, Date Bubble, Options) */}
                    <div className="px-4 pb-2 flex items-end justify-between w-full relative h-16 pointer-events-none">

                        {/* Play Controls & Date Bubble */}
                        <div className="flex items-center gap-3 pointer-events-auto">
                            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                <svg className="w-5 h-5 text-red-600 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            </button>

                            <div className="bg-[#eab308] text-black font-bold text-sm px-4 py-1.5 rounded-lg shadow-lg relative cursor-pointer">
                                Thu 5 - 8 AM
                                {/* Triangle pointing down */}
                                <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#eab308]"></div>
                            </div>
                        </div>

                        {/* Right Side Tools Menu - Matching Screenshot */}
                        <div className="flex flex-col gap-2 items-end pointer-events-auto">
                            <div className="flex items-center gap-2 text-xs font-semibold text-white/80 bg-black/40 backdrop-blur rounded-full px-3 py-1 shadow-lg border border-white/5">
                                <label className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"><input type="radio" name="display" className="w-3 h-3 accent-blue-500" defaultChecked /> pressure</label>
                                <label className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors ml-2"><input type="radio" name="display" className="w-3 h-3 accent-blue-500" /> particles animation</label>
                            </div>

                            <div className="flex bg-[#333333]/90 backdrop-blur rounded-lg p-1 text-white text-xs font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5">
                                <button className="px-3 py-1 hover:bg-white/10 rounded transition-colors">3D</button>
                                <button className="px-3 py-1 border-l border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
                                <button className="px-3 py-1 border-l border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
                                <button className="px-3 py-1 border-l border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg></button>
                            </div>

                            <div className="flex bg-[#333333]/90 backdrop-blur rounded-lg p-1 text-white text-xs font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5">
                                <button className="bg-[#eab308] text-black px-3 py-1 rounded transition-colors shadow-sm">ECMWF <span className="text-[10px] opacity-70 ml-1">9km</span></button>
                                <button className="px-3 py-1 hover:bg-white/10 rounded transition-colors">GFS <span className="text-[10px] opacity-70 ml-1">22km</span></button>
                                <button className="px-3 py-1 hover:bg-white/10 rounded transition-colors">ICON <span className="text-[10px] opacity-70 ml-1">13km</span></button>
                                <button className="px-3 py-1 border-l border-white/10 hover:bg-white/10 rounded-r transition-colors">1 more...</button>
                            </div>
                        </div>
                    </div>

                    {/* Timeline and Scale Bar */}
                    <div className="w-full bg-white dark:bg-[#2a2d36] border-t border-neutral-200 dark:border-[#40434a] flex items-center h-10 select-none pointer-events-auto transition-colors duration-300">

                        {/* Timeline Elements */}
                        <div className="flex-1 flex items-center h-full overflow-x-hidden text-[11px] font-medium text-slate-500 dark:text-white/50 border-r border-neutral-200 dark:border-[#40434a] transition-colors duration-300">
                            {['Thu 5', 'Fri 6', 'Sat 7', 'Sun 8', 'Mon 9', 'Tue 10', 'Wed 11', 'Thu 12', 'Fri 13', 'Sat 14', 'Sun 15'].map((day, i) => (
                                <div key={day} className={`flex-1 min-w-[60px] h-full flex items-center justify-center border-r border-neutral-200 dark:border-[#40434a] hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors ${i === 0 ? 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white shadow-[inset_0_-2px_0_0_#eab308]' : ''} ${i >= 7 ? 'hidden md:flex' : ''}`}>
                                    {day} <span className="hidden lg:inline-block text-[#eab308] ml-1">☀</span>
                                </div>
                            ))}
                        </div>

                        {/* Metric Scale */}
                        <div className="w-[300px] hidden md:flex h-full items-center bg-slate-100 dark:bg-[#2a2d36] transition-colors duration-300">
                            {/* Specific scale matching active layer */}
                            <div className="flex w-full h-full relative cursor-crosshair">
                                {activeLayer === 'wind' && (
                                    <>
                                        <div className="w-8 h-full flex items-center justify-center bg-slate-200 dark:bg-[#40434a] text-slate-600 dark:text-white/80 text-[10px] border-r border-neutral-300 dark:border-white/10 transition-colors duration-300">kt</div>
                                        <div className="flex-1 h-full flex items-center text-[10px] text-slate-600 dark:text-white/80 font-mono transition-colors duration-300">
                                            <div className="flex-1 h-full bg-slate-100 dark:bg-[#2a2d36] flex justify-end items-end pb-1 pr-1 border-r border-neutral-300 dark:border-white/5 border-b-2 border-b-blue-900 transition-colors duration-300">0</div>
                                            <div className="flex-1 h-full bg-[#3b82f6] text-white flex justify-end items-end pb-1 pr-1 border-r border-white/5 border-b-2 border-b-blue-500">5</div>
                                            <div className="flex-1 h-full bg-[#10b981] text-white flex justify-end items-end pb-1 pr-1 border-r border-white/5 border-b-2 border-b-green-500">10</div>
                                            <div className="flex-1 h-full bg-[#eab308] flex justify-end items-end pb-1 pr-1 border-r border-white/5 border-b-2 border-b-yellow-500 text-black">20</div>
                                            <div className="flex-1 h-full bg-[#ef4444] text-white flex justify-end items-end pb-1 pr-1 border-r border-white/5 border-b-2 border-b-red-500">30</div>
                                            <div className="flex-1 h-full bg-[#8b5cf6] text-white flex justify-end items-end pb-1 pr-1 border-b-2 border-b-purple-500">40</div>
                                            <div className="flex-1 h-full flex justify-end items-end pb-1 pr-1 border-b-2 border-b-purple-900">60</div>
                                        </div>
                                    </>
                                )}
                                {activeLayer !== 'wind' && (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 dark:text-white/50 italic px-4 bg-slate-100 dark:bg-[#2a2d36] transition-colors duration-300">
                                        Color scale updates dynamically based on {activeLayer} model.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* Weather Dashboard */}
            <WeatherDashboard />
        </div>
    );
}
