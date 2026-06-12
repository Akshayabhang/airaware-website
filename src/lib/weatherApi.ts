const API_KEY = process.env.WEATHER_API_KEY || "5b4df43611064291862175148260603";
const BASE_URL = "https://api.weatherapi.com/v1";

export async function fetchCurrentWeather(q: string) {
    const res = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(q)}&aqi=yes`);
    if (!res.ok) {
        throw new Error(`WeatherAPI error: ${res.statusText}`);
    }
    return res.json();
}

export async function fetchForecast(q: string, days: number = 3) {
    const res = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(q)}&days=${days}&aqi=yes&alerts=yes`);
    if (!res.ok) {
        throw new Error(`WeatherAPI error: ${res.statusText}`);
    }
    return res.json();
}

export async function fetchHistory(q: string, dt: string) {
    const res = await fetch(`${BASE_URL}/history.json?key=${API_KEY}&q=${encodeURIComponent(q)}&dt=${dt}`);
    if (!res.ok) {
        throw new Error(`WeatherAPI error: ${res.statusText}`);
    }
    return res.json();
}

export async function fetchSearch(q: string) {
    const res = await fetch(`${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(q)}`);
    if (!res.ok) {
        throw new Error(`WeatherAPI error: ${res.statusText}`);
    }
    return res.json();
}

export async function fetchAstronomy(q: string, dt: string) {
    const res = await fetch(`${BASE_URL}/astronomy.json?key=${API_KEY}&q=${encodeURIComponent(q)}&dt=${dt}`);
    if (!res.ok) {
        throw new Error(`WeatherAPI error: ${res.statusText}`);
    }
    return res.json();
}
