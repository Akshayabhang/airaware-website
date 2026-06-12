import React, { useState, useEffect, useRef } from 'react';

interface LocationResult {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    url: string;
}

interface RecentLocation {
    name: string;
    country: string;
    temp_c: number;
    feelslike_c: number;
    is_day: number;
    condition: {
        text: string;
        icon: string;
    };
}

interface WeatherSearchHeroProps {
    onLocationSelect: (location: string) => void;
    recentLocations?: RecentLocation[];
    currentWeatherData?: any;
    isHeroLoading?: boolean;
}

export default function WeatherSearchHero({ onLocationSelect, recentLocations = [], currentWeatherData, isHeroLoading }: WeatherSearchHeroProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<LocationResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Derived values for the hero display
    const locationName = currentWeatherData?.location?.name || '';

    useEffect(() => {
        if (!locationName) return;
        const favorites = JSON.parse(localStorage.getItem('weatherFavorites') || '[]');
        setIsFavorite(favorites.includes(locationName));
    }, [locationName]);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/weatherapi/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setShowDropdown(true);
                }
            } catch (error) {
                console.error("Error fetching search results", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceFn = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceFn);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (selectedLocation: string) => {
        setQuery('');
        setShowDropdown(false);
        onLocationSelect(selectedLocation);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            handleSelect(query.trim());
        }
    };

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                onLocationSelect(`${latitude},${longitude}`);
                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location. Please ensure location services are enabled.");
                setIsLocating(false);
            }
        );
    };

    const handleToggleFavorite = () => {
        if (!locationName) return;

        const favoritesStr = localStorage.getItem('weatherFavorites') || '[]';
        let favorites: string[] = JSON.parse(favoritesStr);

        if (favorites.includes(locationName)) {
            favorites = favorites.filter(fav => fav !== locationName);
            setIsFavorite(false);
        } else {
            favorites.push(locationName);
            setIsFavorite(true);
        }

        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    };

    const handleShare = async () => {
        if (!locationName) return;

        const shareData = {
            title: `Weather in ${locationName}`,
            text: `Check out the current weather conditions for ${locationName} on Airtracker!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                const compactText = `Weather in ${locationName}: ${tempC}°C, ${conditionText}. Check it out at ${window.location.href}`;
                await navigator.clipboard.writeText(compactText);
                setShowShareToast(true);
                setTimeout(() => setShowShareToast(false), 3000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const tempC = currentWeatherData?.current?.temp_c ? Math.round(currentWeatherData.current.temp_c) : '--';
    const conditionText = currentWeatherData?.current?.condition?.text || '--';
    const conditionIcon = currentWeatherData?.current?.condition?.icon;
    const feelsLikeC = currentWeatherData?.current?.feelslike_c ? Math.round(currentWeatherData.current.feelslike_c) : '--';
    const humidity = currentWeatherData?.current?.humidity || '--';

    const pm25 = currentWeatherData?.current?.air_quality?.pm2_5 ? Math.round(currentWeatherData.current.air_quality.pm2_5) : '--';
    const pm10 = currentWeatherData?.current?.air_quality?.pm10 ? Math.round(currentWeatherData.current.air_quality.pm10) : '--';
    const displayAqiScore = Math.max(Number(pm25) * 2, Number(pm10) || 50);

    let aqiText = 'GOOD';
    if (displayAqiScore > 50) aqiText = 'MODERATE';
    if (displayAqiScore > 100) aqiText = 'UNHEALTHY FOR SENSITIVE GROUPS';
    if (displayAqiScore > 150) aqiText = 'UNHEALTHY';
    if (displayAqiScore > 200) aqiText = 'VERY UNHEALTHY';

    const lastUpdated = currentWeatherData?.current?.last_updated || '...';

    return (
        <div className="relative w-full py-10 px-4 md:px-8 flex flex-col justify-center min-h-[500px]">
            {/* Background Image (Dark Mode) */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-300 opacity-0 dark:opacity-100"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2074&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-[#0B1528]/40"></div>
            </div>

            {/* Background Image (Light Mode) */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-300 opacity-100 dark:opacity-0"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622278647429-71bc97e904e8?q=80&w=2074&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-blue-100/30"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">

                    <div className="text-slate-900 dark:text-white transition-colors duration-300">
                        {isHeroLoading ? (
                            <div className="h-14 w-64 bg-slate-300 dark:bg-white/10 animate-pulse rounded"></div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-semibold mb-1">{locationName} Weather Conditions</h1>
                                <h2 className="text-xl text-slate-700 dark:text-white/90">Current Temperature Level</h2>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleLocateMe}
                                disabled={isLocating}
                                className="flex items-center gap-2 border border-slate-300 text-slate-700 hover:bg-black/5 dark:border-white/30 dark:hover:bg-white/10 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                            >
                                {isLocating ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-slate-600 dark:border-white/60 border-t-transparent rounded-full"></div>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                )}
                                <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Locate me'}</span>
                            </button>

                            <button
                                onClick={handleToggleFavorite}
                                className={`w-10 h-10 flex items-center justify-center border hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors ${isFavorite ? 'border-red-500 text-red-500 bg-red-50 dark:bg-transparent' : 'border-slate-300 text-blue-600 dark:border-white/30 dark:text-[#3b82f6]'}`}
                            >
                                <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={handleShare}
                                    className="w-10 h-10 flex items-center justify-center border border-slate-300 text-slate-700 hover:bg-black/5 dark:border-white/30 dark:hover:bg-white/10 dark:text-white rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </button>

                                {showShareToast && (
                                    <div className="absolute top-12 right-0 bg-slate-800 text-white dark:bg-black/80 text-xs py-1.5 px-3 rounded whitespace-nowrap z-50 animate-fade-in-up">
                                        Copied compact text!
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full relative" ref={dropdownRef}>
                            <form onSubmit={handleSubmit} className="relative flex items-center w-full md:w-[400px] bg-white/70 dark:bg-black/40 border border-slate-300 dark:border-white/20 rounded-md overflow-hidden h-12 backdrop-blur-md transition-colors duration-300">
                                <div className="pl-4 text-slate-500 dark:text-white/60">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Search by city..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                                    className="flex-1 h-full px-4 outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/60 bg-transparent"
                                />

                                {isLoading && (
                                    <div className="px-3 text-slate-500 dark:text-white/60">
                                        <div className="animate-spin h-4 w-4 border-2 border-slate-400 dark:border-white/60 border-t-transparent rounded-full"></div>
                                    </div>
                                )}
                            </form>

                            {showDropdown && results.length > 0 && (
                                <div className="absolute top-14 left-0 w-full bg-white dark:bg-[#1e293b] text-slate-800 dark:text-white rounded-md shadow-2xl max-h-60 overflow-y-auto z-50 border border-slate-200 dark:border-white/10 transition-colors duration-300">
                                    {results.map((result) => (
                                        <div
                                            key={result.id}
                                            onClick={() => handleSelect(result.name)}
                                            className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-0 transition-colors"
                                        >
                                            <p className="font-medium text-[15px]">{result.name}</p>
                                            <p className="text-slate-500 dark:text-white/50 text-xs mt-0.5">{result.region}, {result.country}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-4">

                    <div className="text-slate-900 dark:text-white flex flex-col justify-center transition-colors duration-300">
                        {isHeroLoading ? (
                            <div className="h-32 w-48 bg-slate-300 dark:bg-white/10 animate-pulse rounded mb-4"></div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-6">
                                    <h1 className="text-[100px] leading-none font-bold tracking-tight text-slate-800 dark:text-white">{tempC}<span className="text-4xl font-normal align-top leading-tight ml-1">°C</span></h1>

                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-center bg-blue-100 text-blue-900 dark:bg-[#a5b4fc] dark:text-[#1e1b4b] text-xs font-bold px-4 py-1.5 rounded-full w-max mb-2">
                                            Pleasant
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {conditionIcon && <img src={`https:${conditionIcon}`} alt={conditionText} className="w-10 h-10 object-contain drop-shadow-sm" />}
                                            {!conditionIcon && (
                                                <svg className="w-10 h-10 text-slate-700 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.708.707a1 1 0 01-1.414 1.414l-.708-.707a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM13.5 15.657a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm-4.22-4.22a1 1 0 010-1.415l-.708-.707a1 1 0 00-1.414 1.414l.708.707a1 1 0 011.415 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm4.22-4.22a1 1 0 01-1.415 0l-.708-.707a1 1 0 011.414-1.414l.708.707a1 1 0 010 1.415z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-lg font-semibold">{conditionText}</span>
                                                <div className="text-sm font-medium text-slate-600 dark:text-white/80 grid grid-cols-[auto_auto] gap-x-3 gap-y-1 mt-1">
                                                    <span>Feels Like</span>
                                                    <span className="font-bold text-slate-800 dark:text-white">{feelsLikeC}°C</span>
                                                    <span>Humidity</span>
                                                    <span className="font-bold text-slate-800 dark:text-white">{humidity}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <p className="text-slate-500 dark:text-white/60 text-sm mt-8">Last Updated: {lastUpdated} (Local Time)</p>
                    </div>

                    <div className="flex justify-end items-center h-full">
                        {isHeroLoading ? (
                            <div className="h-48 w-80 bg-slate-300 dark:bg-[#8c495e] animate-pulse rounded-[24px]"></div>
                        ) : (
                            <div className="bg-white/80 dark:bg-[#8c495e]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-[24px] p-6 w-full max-w-[340px] text-slate-900 dark:text-white shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-medium text-[15px]">Air Quality Index</h3>
                                    <button className="w-6 h-6 bg-slate-100 dark:bg-white rounded-full flex items-center justify-center text-slate-600 dark:text-[#8c495e]">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                    </button>
                                </div>

                                <div className="flex items-center gap-6 relative">
                                    <div className="flex items-baseline gap-1 relative z-10 w-[50%]">
                                        <span className="text-[42px] font-bold leading-none">{displayAqiScore || '--'}</span>
                                        <span className="text-sm font-medium text-slate-600 dark:text-white/90">AQI</span>
                                    </div>

                                    <div className="w-[1px] h-14 bg-slate-300 dark:bg-white/20 absolute left-1/2 -ml-[0.5px]"></div>

                                    <div className="flex flex-col gap-2 w-[50%] pl-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600 dark:text-white/90">PM2.5 :</span>
                                            <span className="font-bold">{pm25}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600 dark:text-white/90">PM10 :</span>
                                            <span className="font-bold">{pm10}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm mt-8 border-t border-slate-200 dark:border-white/10 pt-4 text-slate-700 dark:text-white/90">Air quality index is: <span className="font-bold tracking-wide dark:text-white">{aqiText}</span></p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
