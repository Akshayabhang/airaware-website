"use client";

import { Search, MapPin, Globe, Moon, Sun, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface NavbarProps {
    onSearch: (city: string) => void;
    onLocate: () => void;
    isLoading?: boolean;
}

export default function Navbar({ onSearch, onLocate, isLoading = false }: NavbarProps) {
    const [query, setQuery] = useState("");
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isRankingMenuOpen, setIsRankingMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setIsMobileMenuOpen(false);
        }
    };

    const handleLocate = () => {
        onLocate();
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="sticky top-0 z-[1000] w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 gap-4">

                        {/* Logo Section */}
                        <Link href="/" className="flex items-center gap-1 flex-shrink-0">
                            <Image
                                src="/logo.png"
                                alt="AirWaRE Logo"
                                width={140}
                                height={40}
                                className="h-9 w-auto object-contain"
                                priority
                            />
                        </Link>

                        {/* Search Bar - Desktop only */}
                        <div className="flex-1 max-w-xl hidden md:block lg:ml-8">
                            <form onSubmit={handleSubmit} className="relative flex items-center w-full">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search any Location, City, State or..."
                                    className="w-full pl-10 pr-12 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#009EDB] focus:border-[#009EDB] transition-shadow text-sm placeholder:text-neutral-400"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={onLocate}
                                    disabled={isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#009EDB] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors disabled:opacity-50"
                                    title="Locate me"
                                >
                                    <MapPin className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        {/* Desktop Middle Links */}
                        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-auto">
                            <button
                                onClick={() => setIsRankingMenuOpen(!isRankingMenuOpen)}
                                className={`flex items-center gap-1 hover:text-[#009EDB] focus:outline-none ${isRankingMenuOpen ? "text-[#009EDB]" : ""}`}
                            >
                                Ranking
                                <ChevronDown className={`w-4 h-4 transition-transform ${isRankingMenuOpen ? "rotate-180 text-[#009EDB]" : "text-neutral-400"}`} />
                            </button>
                            <Link href="/products" className="flex items-center gap-1 hover:text-[#009EDB]">Products</Link>
                            <Link href="#" className="flex items-center gap-1 hover:text-[#009EDB]">Resources <ChevronDown className="w-4 h-4 text-neutral-400" /></Link>
                        </div>

                        {/* Right side actions - Desktop */}
                        <div className="hidden md:flex items-center gap-4 border-l border-neutral-200 dark:border-neutral-700 pl-4">
                            {/* Dark Mode Toggle */}
                            <div
                                className="flex flex-col items-center px-1 cursor-pointer"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">
                                    {mounted && theme === "dark" ? "Lights On" : "Lights Off"}
                                </span>
                                <div className="bg-neutral-100 dark:bg-neutral-700 p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">
                                    {mounted && theme === "dark" ? (
                                        <Sun className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                                    ) : (
                                        <Moon className="w-4 h-4 text-neutral-600" />
                                    )}
                                </div>
                            </div>

                            {/* Login Button */}
                            <button className="bg-[#1288FC] hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-md shadow-sm transition-colors flex items-center gap-2">
                                Login
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>

                        {/* Mobile Right: Theme + Hamburger */}
                        <div className="flex md:hidden items-center gap-2 ml-auto">
                            {/* Mobile Dark Mode Toggle */}
                            <button
                                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                {mounted && theme === "dark" ? (
                                    <Sun className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                                ) : (
                                    <Moon className="w-4 h-4 text-neutral-600" />
                                )}
                            </button>

                            {/* Hamburger Button */}
                            <button
                                className="p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>

                    </div>
                </div>

                {/* ===== MOBILE DROPDOWN MENU ===== */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-700 px-4 pb-5 pt-3 space-y-4 shadow-lg animate-in slide-in-from-top-2 fade-in duration-200">

                        {/* Mobile Search Bar */}
                        <form onSubmit={handleSubmit} className="relative flex items-center w-full">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search city or location..."
                                className="w-full pl-9 pr-12 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#009EDB] focus:border-transparent text-sm placeholder:text-neutral-400"
                                disabled={isLoading}
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !query.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#009EDB] disabled:bg-neutral-300 text-white p-1.5 rounded-md transition-colors"
                                title="Search"
                            >
                                <Search className="w-3.5 h-3.5" />
                            </button>
                        </form>

                        {/* Mobile Locate Me */}
                        <button
                            onClick={handleLocate}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-[#009EDB] text-[#009EDB] font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
                        >
                            <MapPin className="w-4 h-4" />
                            {isLoading ? "Locating..." : "Locate Me"}
                        </button>

                        {/* Mobile Nav Links */}
                        <div className="border-t border-neutral-100 dark:border-neutral-700 pt-3 space-y-1">
                            <Link href="/real-time-most-polluted-city-ranking" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium">
                                🌍 Live AQI Ranking
                            </Link>
                            <Link href="/liveweather-ranking" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium">
                                ☀️ Weather Ranking
                            </Link>
                            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium">
                                📦 Products
                            </Link>
                        </div>

                        {/* Mobile Login */}
                        <button className="w-full bg-[#1288FC] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                            Login
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>
                )}
            </nav>

            {/* Mega Menu Dropdown (Desktop only) */}
            {isRankingMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-t border-neutral-100 dark:border-neutral-700 p-8 z-[999] animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Live AQI Ranking */}
                        <Link href="/real-time-most-polluted-city-ranking" onClick={() => setIsRankingMenuOpen(false)} className="block bg-[#111111] rounded-[24px] p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform border border-neutral-800 h-[320px]">
                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-bold text-white bg-[#ff1a4a] rounded mb-4 shadow-md">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
                                </span>
                                <h3 className="text-2xl font-bold mb-4">AQI Ranking</h3>
                                <p className="text-sm text-neutral-400 leading-relaxed font-medium">Check real-time global AQI rankings to compare your location with other cities worldwide.</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ff1a4a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>

                        {/* Live Weather Ranking */}
                        <Link href="/liveweather-ranking" onClick={() => setIsRankingMenuOpen(false)} className="block bg-[#111111] rounded-[24px] p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform border border-neutral-800 h-[320px]">
                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-bold text-white bg-[#ff1a4a] rounded mb-4 shadow-md">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
                                </span>
                                <h3 className="text-2xl font-bold mb-4">Weather Ranking</h3>
                                <p className="text-sm text-neutral-400 leading-relaxed font-medium">Get real-time weather rankings of the hottest and coldest cities worldwide to know conditions.</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f59e0b]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>

                        {/* 2025 City Historic Ranking */}
                        <Link href="#historic-city-ranking" onClick={() => setIsRankingMenuOpen(false)} className="block bg-[#111111] rounded-[24px] p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform border border-neutral-800 h-[320px]">
                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <span className="inline-block px-3 py-1 text-sm font-bold text-white bg-[#2563eb] rounded mb-4 shadow-md">2025 City</span>
                                <h3 className="text-2xl font-bold mb-4">Historic AQI Ranking</h3>
                                <p className="text-sm text-neutral-400 leading-relaxed font-medium">Stay informed of historical AQI rankings for cities worldwide to track air quality trends over time.</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2563eb]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>

                        {/* 2025 Country Historic Ranking */}
                        <Link href="#historic-country-ranking" onClick={() => setIsRankingMenuOpen(false)} className="block bg-[#111111] rounded-[24px] p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform border border-neutral-800 h-[320px]">
                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <span className="inline-block px-3 py-1 text-sm font-bold text-white bg-[#2563eb] rounded mb-4 shadow-md">2025 Country</span>
                                <h3 className="text-2xl font-bold mb-4">Historic AQI Ranking</h3>
                                <p className="text-sm text-neutral-400 leading-relaxed font-medium">Know about most polluted countries worldwide to learn their air quality challenges.</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2563eb]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>

                    </div>
                </div>
            )}
        </>
    );
}
