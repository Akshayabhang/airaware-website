"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LocationTicker from "@/components/LocationTicker";
import DashboardOverlay from "@/components/DashboardOverlay";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// Dynamic Imports for Heavy Components to reduce Initial Bundle Size
const MapHero = dynamic(() => import("@/components/MapHero"), { ssr: false, loading: () => <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" /> });
const MajorPollutants = dynamic(() => import("@/components/MajorPollutants"));
const HistoricalGraph = dynamic(() => import("@/components/HistoricalGraph"));
const HealthAdvice = dynamic(() => import("@/components/HealthAdvice"));
const HealthRisks = dynamic(() => import("@/components/HealthRisks"));
const IndiaMetroCities = dynamic(() => import("@/components/IndiaMetroCities"));
const AirQualityCalendar = dynamic(() => import("@/components/AirQualityCalendar"));
const PollutionRanking = dynamic(() => import("@/components/PollutionRanking"));
const AqiScale = dynamic(() => import("@/components/AqiScale"));
import { motion, Variants } from "framer-motion";

// 1. Ensure Skeleton loader for widgets keeps same layout geometry to avoid CLS jitter
const WidgetSkeleton = ({ height = "300px" }: { height?: string }) => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className={`w-full bg-neutral-100 rounded-[24px] dark:bg-neutral-800/50`} style={{ height }}></div>
  </div>
);

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const AnimatedSection = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={fadeUpVariant}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track specific coords for the map
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number }>({
    lat: 18.66,
    lng: 73.81,
  });

  const fallbackCities = [
    { city: "London" },
    { city: "New York" },
    { city: "Tokyo" },
    { city: "Sydney" },
    { city: "Paris" },
    { city: "Dubai" },
    { city: "Singapore" },
  ];

  const fetchData = async (params: {
    city?: string;
    lat?: number;
    lng?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      let query = "";
      if (params.lat && params.lng) {
        query = `?lat=${params.lat}&lng=${params.lng}`;
      } else if (params.city) {
        query = `?city=${encodeURIComponent(params.city)}`;
      }

      const res = await fetch(`/api/aqi${query}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to fetch AQI data");
      }

      if (json.data) {
        // Merge nearbyLocations into the data object so components can access it
        const mergedData = { ...json.data, nearbyLocations: json.nearbyLocations };
        setData(mergedData);
        // If data returns coords, update the map
        if (json.data.city?.geo) {
          setMapCoords({
            lat: json.data.city.geo[0],
            lng: json.data.city.geo[1],
          });
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt automatic geolocation to provide precision data immediately
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchData({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Fallback to a random major city if user denies permission
          const randomFallback = fallbackCities[Math.floor(Math.random() * fallbackCities.length)];
          fetchData(randomFallback);
        },
        { timeout: 5000 }
      );
    } else {
      const randomFallback = fallbackCities[Math.floor(Math.random() * fallbackCities.length)];
      fetchData(randomFallback);
    }
  }, []);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        fetchData({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setError("Unable to retrieve location");
        setLoading(false);
      },
      { timeout: 5000 }
    );
  };

  const handleSearch = (city: string) => {
    fetchData({ city });
  };

  return (
    <div className="flex flex-col w-full min-h-screen relative overflow-x-hidden">
      <Navbar
        onSearch={handleSearch}
        onLocate={handleLocate}
        isLoading={loading}
      />
      {/* Ticker right below Navbar */}
      <LocationTicker locations={data?.nearbyLocations} />

      {/* Main Container - Map takes up the top section as a background */}
      <div
        className="relative w-full overflow-hidden"
        style={{ minHeight: "850px" }}
      >
        {/* Absolute Background Map spanning the full width/height of this container */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
          <MapHero lat={mapCoords.lat} lng={mapCoords.lng} aqi={data?.aqi} />
        </div>

        {/* Floating Map Toggle button top-right (mocked) */}
        <div className="absolute top-6 right-6 z-10 hidden lg:flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-neutral-100 cursor-pointer hover:bg-white transition-colors">
          <span className="font-bold text-[#1a5f98] text-sm">AQI</span>
          <span className="font-bold text-neutral-800 text-sm">Map</span>
          <svg
            className="w-4 h-4 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </div>

        {/* Anchor point for the Dashboard Overlay inside the map container */}
        <div className="absolute bottom-0 w-full flex flex-col items-center z-20 pb-16">
          {/* The Floating Tabs sitting right on top of the overlay */}
          <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-start -mb-[2px] relative z-30">
            <div className="flex bg-white rounded-t-2xl overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-b-[3px] border-[#1288FC]">
              <button className="flex items-center gap-2 px-8 py-3.5 font-bold text-[#1288FC] text-sm bg-white hover:bg-[#f8f9fb] transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AQI
              </button>
              <Link href="/liveweather-ranking">
                <button className="flex items-center gap-2 px-8 py-3.5 font-bold text-neutral-500 text-sm bg-[#f8f9fa] border-l border-neutral-200 hover:bg-neutral-100 transition-colors h-full">
                  <span className="text-xl leading-none grayscale opacity-70">
                    ☀️
                  </span>{" "}
                  Weather
                </button>
              </Link>
            </div>
          </div>

          {/* The Massive Dashboard Card overlapping map */}
          <div className="w-full px-4 sm:px-6 lg:px-8 relative z-20">
            <DashboardOverlay
              data={data}
              loading={loading}
              onLocate={handleLocate}
            />
          </div>
        </div>
      </div>

      {/* Major Pollutants Breakdown Below the Map Section */}
      <AnimatedSection>
        <MajorPollutants data={data} loading={loading} />
      </AnimatedSection>

      {/* Historical Air Quality Bar Chart */}
      {loading ? <WidgetSkeleton height="400px" /> : data?.city?.name && (
        <AnimatedSection>
          <HistoricalGraph city={data.city.name} />
        </AnimatedSection>
      )}

      {/* Health Advice Calculator */}
      {loading ? <WidgetSkeleton height="250px" /> : data?.city?.name && (
        <AnimatedSection>
          <HealthAdvice city={data.city.name} data={data} />
        </AnimatedSection>
      )}

      {/* Health Risks Tabbed Widget */}
      {loading ? <WidgetSkeleton height="450px" /> : data?.city?.name && (
        <AnimatedSection>
          <HealthRisks aqi={data?.aqi || 0} city={data.city.name} />
        </AnimatedSection>
      )}

      {/* India Metro Cities Static Overview */}
      <AnimatedSection>
        <IndiaMetroCities />
      </AnimatedSection>

      {/* 3-Year Air Quality Calendar */}
      {loading ? <WidgetSkeleton height="600px" /> : data?.city?.name && (
        <AnimatedSection>
          <AirQualityCalendar city={data.city.name} />
        </AnimatedSection>
      )}

      {/* Most Polluted Cities 2026 Table */}
      <AnimatedSection>
        <PollutionRanking />
      </AnimatedSection>

      {/* Air Quality Index Scale Reference */}
      <AnimatedSection>
        <AqiScale />
      </AnimatedSection>
    </div>
  );
}
