import React, { useState, useEffect } from 'react';
import WeatherSearchHero from './WeatherSearchHero';
import WeatherParameters from './WeatherParameters';

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

export default function WeatherDashboard() {
    const [city, setCity] = useState('Pune');
    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch forecast data whenever city changes
    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`/api/weatherapi/current?q=${encodeURIComponent(city)}`);
                if (!res.ok) throw new Error('API fetch failed');

                const data = await res.json();
                if (data.error) throw new Error(data.error.message || 'Error fetching weather data');

                setWeatherData(data);
            } catch (err: any) {
                console.error("Weather fetch error:", err);
                setError(err.message || 'Could not fetch weather data');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city]);

    const handleLocationSelect = (selectedCity: string) => {
        setCity(selectedCity);
    };

    // Map API response to Component Props
    let paramsData: WeatherParamsData | null = null;
    if (weatherData && weatherData.current && weatherData.location) {
        const d = new Date(weatherData.location.localtime);
        const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }); // "6 Mar."

        paramsData = {
            locationName: weatherData.location.name,
            wind_kph: weatherData.current.wind_kph,
            wind_dir: weatherData.current.wind_dir,
            wind_degree: weatherData.current.wind_degree,
            gust_kph: weatherData.current.gust_kph,
            cloud: weatherData.current.cloud,
            vis_km: weatherData.current.vis_km,
            precip_mm: weatherData.current.precip_mm,
            pressure_mb: weatherData.current.pressure_mb,
            uv: weatherData.current.uv,
            dateStr: dateStr,
        };
    }

    return (
        <div className="flex flex-col w-full bg-slate-50 dark:bg-[#0a0f18] transition-colors duration-300">
            {/* Search Hero Section */}
            <WeatherSearchHero
                onLocationSelect={handleLocationSelect}
                currentWeatherData={weatherData}
                isHeroLoading={loading}
            />

            {/* Weather Parameters Section */}
            {loading ? (
                <div className="w-full flex justify-center items-center py-20 min-h-[500px] bg-slate-100 dark:bg-[#030614] transition-colors duration-300">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            ) : error ? (
                <div className="w-full flex justify-center items-center py-20 bg-slate-100 dark:bg-[#030614] transition-colors duration-300">
                    <div className="bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-100 p-4 rounded-xl border border-red-500 max-w-lg text-center">
                        {error}
                    </div>
                </div>
            ) : paramsData ? (
                <WeatherParameters data={paramsData} />
            ) : null}

        </div>
    );
}
