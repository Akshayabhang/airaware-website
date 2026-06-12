"use client";

import dynamic from "next/dynamic";

// Dynamically import the LiveWeatherClient component
// This ensures that the code runs ONLY on the browser,
// preventing Next.js Server-Side Rendering (SSR) crashes
// caused by window/document references in the Windy map API.
const LiveWeatherClient = dynamic(() => import("./LiveWeatherClient"), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col w-full min-h-screen bg-[#0a0f18] items-center justify-center">
            <div className="text-white text-sm font-medium animate-pulse">Initializing Earth Engine...</div>
        </div>
    )
});

export default function LiveWeatherRankingPage() {
    return <LiveWeatherClient />;
}
