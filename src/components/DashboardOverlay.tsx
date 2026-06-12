"use client";

import { Share2, Crosshair, HelpCircle, ArrowUpRight } from "lucide-react";

interface DashboardOverlayProps {
  data: any;
  loading: boolean;
  onLocate: () => void;
}

export default function DashboardOverlay({
  data,
  loading,
  onLocate,
}: DashboardOverlayProps) {
  if (loading) {
    return (
      <div className="w-full max-w-[1240px] mx-auto bg-white rounded-b-2xl rounded-tr-2xl p-8 shadow-md animate-pulse h-[450px] relative z-20 border border-neutral-100" />
    );
  }

  // Fallbacks if data isn't perfectly structured
  const aqi = data?.aqi ?? 134;
  const city =
    data?.city?.name ?? "Chikhali Cdc, Pimpri Chinchwad, Maharashtra, India";
  const time = data?.time?.iso
    ? new Date(data.time.iso).toLocaleString()
    : "2026-03-05 01:51:36 (Local Time)";
  const pm25 = data?.iaqi?.pm25?.v ?? 49;
  const pm10 = data?.iaqi?.pm10?.v ?? 61;

  // Gauge calculation (0-301+ scale approximation from image)
  const aqiCategory =
    aqi > 200
      ? "Severe"
      : aqi > 150
        ? "Unhealthy"
        : aqi > 100
          ? "Poor"
          : aqi > 50
            ? "Moderate"
            : "Good";
  const aqiColorBg =
    aqi > 200
      ? "bg-[#EE4266]"
      : aqi > 150
        ? "bg-[#EE4266]"
        : aqi > 100
          ? "bg-[#F58220]"
          : aqi > 50
            ? "bg-[#F9C31C]"
            : "bg-[#8BC53F]";
  const aqiColorText =
    aqi > 200
      ? "text-[#EE4266]"
      : aqi > 150
        ? "text-[#EE4266]"
        : aqi > 100
          ? "text-[#F58220]"
          : aqi > 50
            ? "text-[#F9C31C]"
            : "text-[#8BC53F]";
  const aqiColorMutedBg =
    aqi > 200
      ? "bg-[#EE4266]/20"
      : aqi > 150
        ? "bg-[#EE4266]/20"
        : aqi > 100
          ? "bg-[#F58220]/20"
          : aqi > 50
            ? "bg-[#F9C31C]/20"
            : "bg-[#8BC53F]/20";

  // Position thumb on linear gauge (mapping 0-400 roughly to 0-100%)
  const gaugePercentage = Math.min((aqi / 400) * 100, 100);

  return (
    <div className="w-full max-w-[1240px] mx-auto bg-white rounded-tr-[32px] rounded-bl-[32px] rounded-br-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden relative">
      {/* Top White Area - Header */}
      <div className="px-5 py-5 pb-2 sm:px-10 sm:py-8 sm:pb-4 relative z-10">
        <h2 className="text-lg sm:text-[22px] font-bold text-neutral-900 flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 tracking-tight">
          Real-time Air Quality Index (AQI)
          <HelpCircle className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-neutral-600" />
        </h2>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full mb-2 sm:mb-8">
          <div>
            <a
              href="#"
              className="text-[#009EDB] text-xl sm:text-2xl font-bold hover:underline mb-0.5 sm:mb-1 block"
            >
              {city}
            </a>
            <div className="text-xs sm:text-sm font-medium text-neutral-500 italic flex flex-wrap gap-2 sm:gap-3">
              <span>
                Last Updated:{" "}
                <span className="text-neutral-700 font-bold">{time}</span>
              </span>
              <span className="text-neutral-300 hidden sm:inline">|</span>
              <span>
                Nearest Monitor:{" "}
                <span className="text-neutral-700 font-bold">0.35 km</span>
              </span>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 mt-3 lg:mt-0">
            <button
              onClick={onLocate}
              className="flex items-center gap-2 border border-[#009EDB] text-[#009EDB] px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-bold text-xs sm:text-sm hover:bg-blue-50 transition-colors bg-white shadow-sm"
            >
              <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Locate me
            </button>
            <button className="border border-neutral-300 p-2 sm:p-2.5 rounded-full hover:bg-neutral-50 text-neutral-500 bg-white shadow-sm">
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button className="border border-neutral-300 p-2 sm:p-2.5 rounded-full hover:bg-neutral-50 text-neutral-500 bg-white shadow-sm">
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Area - The new pink/white theme */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-white via-pink-50/50 to-[#ff9eb5] px-4 sm:px-10 pt-3 sm:pt-4 pb-12 sm:pb-16 lg:pb-10 flex flex-col border-t border-neutral-50 rounded-b-3xl">
        {/* Abstract vector background matching screenshot aesthetics */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 mix-blend-multiply flex justify-end">
          {/* Subtle clouds SVG */}
          <svg viewBox="0 0 1000 300" className="w-[800px] h-[300px] text-pink-200 fill-current opacity-60">
            <path d="M 150 150 Q 200 100 250 150 Q 350 50 450 150 Q 500 120 550 150 Q 600 80 700 150 Q 750 110 800 150 L 800 300 L 150 300 Z" />
          </svg>
        </div>

        {/* Indian Monuments Silhouette (Taj Mahal, etc) */}
        <div className="absolute bottom-0 left-0 w-full h-[140px] pointer-events-none opacity-15 overflow-hidden flex items-end">
          <svg viewBox="0 0 1000 100" className="w-full h-auto text-pink-900 fill-current ml-20">
            {/* Very abstracted generic silhouette shapes of monuments to match the look */}
            <path d="M 0 100 L 0 80 L 20 80 L 25 70 L 30 80 L 50 80 L 50 100 Z" />

            {/* Taj Mahal-esque center */}
            <path d="M 120 100 L 120 40 L 130 35 L 140 40 L 140 60 L 150 60 L 150 20 C 150 0 170 0 170 20 L 170 60 L 180 60 L 180 40 L 190 35 L 200 40 L 200 100 Z" />
            <path d="M 100 100 L 100 50 L 110 40 L 110 100 Z" />
            <path d="M 210 100 L 210 40 L 220 50 L 220 100 Z" />

            {/* Other domes */}
            <path d="M 300 100 L 300 60 Q 320 30 340 60 L 340 100 Z" />
            <path d="M 400 100 L 400 70 L 420 50 L 440 70 L 440 100 Z" />
            <path d="M 500 100 L 500 60 C 520 40 540 40 560 60 L 560 100 Z" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row justify-between w-full relative z-20 gap-4 sm:gap-8 lg:gap-0">
          {/* LEFT SIDE: AQI Details Overlay Over Gradient */}
          <div className="flex-1 max-w-lg">
            <div className="flex items-start justify-between sm:justify-start gap-4 sm:gap-12 mb-3 sm:mb-6">
              {/* Massive AQI Number */}
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-neutral-700 text-xs sm:text-sm mb-1 object-fit sm:mb-2">
                  <span
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${aqiColorBg} shadow-[0_0_8px_rgba(245,130,32,0.6)] animate-pulse`}
                  ></span>
                  Live AQI
                </div>
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <span
                    className={`text-[80px] leading-[0.85] sm:text-[140px] font-black tracking-tighter sm:leading-none ${aqiColorText} drop-shadow-sm`}
                  >
                    {aqi}
                  </span>
                  <span className="text-xs sm:text-xl font-bold text-neutral-400 uppercase leading-[0.85] sm:leading-none">
                    AQI <br className="sm:hidden" /> (US)
                  </span>
                </div>
              </div>

              {/* Status Box */}
              <div className="pt-2 sm:pt-8 flex flex-col items-end sm:items-center">
                <div className="text-right sm:text-center font-bold text-neutral-800 text-[10px] sm:text-xs mb-0.5 sm:mb-1 tracking-wide">
                  Air Quality is
                </div>
                <div
                  className={`px-3 py-1 sm:px-6 sm:py-2 bg-[#f4a1b0]/40 text-[#EE4266] rounded-xl text-lg sm:text-2xl font-black border border-pink-200/50 shadow-sm`}
                >
                  {aqiCategory}
                </div>
              </div>
            </div>

            {/* PM Breakdown Row */}
            <div className="flex justify-between sm:justify-start sm:gap-12 mb-4 sm:mb-8 mt-1 sm:mt-2 items-baseline bg-white/40 sm:bg-transparent rounded-xl p-3 sm:p-0">
              <div className="text-xs sm:text-sm font-bold text-neutral-800">
                PM2.5 :{" "}
                <span className="text-lg sm:text-xl font-black">
                  {pm25} <span className="text-[9px] sm:text-[10px] font-bold">µg/m³</span>
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-800">
                PM10 :{" "}
                <span className="text-lg sm:text-xl font-black">
                  {pm10} <span className="text-[9px] sm:text-[10px] font-bold">µg/m³</span>
                </span>
              </div>
            </div>

            {/* Linear Gradient Gauge */}
            <div className="w-full max-w-md relative mt-4">
              {/* Scale Labels */}
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-neutral-800 w-full mb-2">
                <span className="text-[#8BC53F]">Good</span>
                <span className="text-[#F9C31C]">Moderate</span>
                <span className="text-[#F58220]">Poor</span>
                <span className="text-[#EE4266]">Unhealthy</span>
                <span className="text-[#99004D]">Severe</span>
                <span className="text-[#7E0023]">Hazardous</span>
              </div>

              {/* Gradient Track */}
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#8BC53F] via-[#F9C31C] via-[#F58220] via-[#EE4266] to-[#7E0023] relative">
                {/* Thumb / Pin */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.3)] border-2 border-orange-500 z-10"
                  style={{ left: `calc(${gaugePercentage}% - 8px)` }}
                ></div>
              </div>

              {/* Ticks/Numbers below track */}
              <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-neutral-700 w-full mt-2 relative overflow-visible opacity-80">
                <span className="absolute transform -translate-x-1/2" style={{ left: "0%" }}>0</span>
                <span className="absolute transform -translate-x-1/2" style={{ left: "16.66%" }}>50</span>
                <span className="absolute transform -translate-x-1/2" style={{ left: "33.33%" }}>100</span>
                <span className="absolute transform -translate-x-1/2" style={{ left: "50%" }}>150</span>
                <span className="absolute transform -translate-x-1/2" style={{ left: "66.66%" }}>200</span>
                <span className="absolute transform -translate-x-1/2" style={{ left: "83.33%" }}>300</span>
                <span className="absolute transform -translate-x-0" style={{ right: "0%" }}>301+</span>
              </div>
            </div>
          </div>

          {/* CENTER GRAPHIC - The Coughing Character */}
          <div className="hidden lg:block absolute left-[52%] bottom-0 w-[180px] h-[260px] -translate-x-1/2 pointer-events-none z-30">
            {/* Simple character representation to match screenshot */}
            <svg
              viewBox="0 0 200 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-lg"
            >
              {/* Legs */}
              <path d="M 80 250 L 70 300 L 90 300 L 90 250 Z" fill="#64748b" />
              <path d="M 120 250 L 110 300 L 130 300 L 130 250 Z" fill="#64748b" />

              {/* Shoes */}
              <path d="M 70 300 L 50 300 L 50 295 C 50 290 70 290 90 290 L 90 300 Z" fill="#0f172a" />
              <path d="M 110 300 L 150 300 L 150 295 C 150 290 130 290 130 290 L 130 300 Z" fill="#0f172a" />

              {/* Body (Pink Shirt) */}
              <path d="M 70 120 L 130 120 C 140 120 150 140 140 250 L 60 250 C 50 140 60 120 70 120 Z" fill="#ec4899" />

              {/* Head / Face */}
              <circle cx="100" cy="80" r="45" fill="#fcd34d" />

              {/* Hair */}
              <path d="M 60 80 C 60 40 140 40 140 80 C 140 50 120 30 100 30 C 80 30 60 50 60 80 Z" fill="#292524" />

              {/* Mask */}
              <rect x="75" y="85" width="50" height="25" rx="10" fill="white" stroke="#94a3b8" strokeWidth="2" />

              {/* Eyes */}
              <path d="M 80 70 Q 90 60 100 70" stroke="#000" strokeWidth="3" fill="none" />
              <path d="M 100 70 Q 110 60 120 70" stroke="#000" strokeWidth="3" fill="none" />
            </svg>
          </div>

          {/* RIGHT SIDE: Weather Widget */}
          <div className="relative z-20 flex-1 max-w-[400px] flex flex-col justify-end items-end pb-2 sm:pb-4 pt-6 sm:pt-8 lg:pt-0 mt-2 sm:mt-8 lg:mt-0">
            {/* The white card matching the screenshot */}
            <div className="w-full sm:w-[380px] bg-white/40 backdrop-blur-[64px] shadow-lg rounded-[20px] sm:rounded-[24px] overflow-hidden relative z-20 xl:mr-8 mb-6 border border-white/60">
              {/* Arrow linking outward */}
              <button className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#212121] text-white p-2 sm:p-2.5 rounded-xl hover:scale-105 transition-transform shadow-md">
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-4 sm:gap-6">
                {/* Cloud Icon Mock */}
                <div className="w-12 h-8 sm:w-14 sm:h-10 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full shadow-inner relative self-center">
                  <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 shadow-sm border-2 border-white"></div>
                </div>

                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-neutral-900 drop-shadow-sm">
                    32
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-neutral-900 -ml-0.5 sm:-ml-1">
                    &deg;c
                  </span>
                  <span className="text-base sm:text-lg font-medium text-neutral-700 ml-2 sm:ml-4">
                    Mist
                  </span>
                </div>
              </div>

              {/* Weather Stats row */}
              <div className="w-full flex justify-between px-3 sm:px-6 py-2.5 sm:py-4 border-t border-neutral-300 pointer-events-none mt-1 sm:mt-2">
                <div className="flex flex-col gap-0.5 sm:gap-1 items-center">
                  <span className="text-neutral-500 flex items-center gap-1 text-[10px] sm:text-xs">
                    {/* Using generic SVG so I don't import too many lucide icons just for tiny details */}
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Humidity
                  </span>
                  <span className="font-bold text-neutral-800 text-xs sm:text-sm">24 %</span>
                </div>
                <div className="flex flex-col gap-0.5 sm:gap-1 items-center">
                  <span className="text-neutral-500 flex items-center gap-1 text-[10px] sm:text-xs">
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                    Wind Speed
                  </span>
                  <span className="font-bold text-neutral-800 text-xs sm:text-sm">5.4 km/h</span>
                </div>
                <div className="flex flex-col gap-0.5 sm:gap-1 items-center">
                  <span className="text-neutral-600 flex items-center gap-1 text-[10px] sm:text-xs">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    UV Index
                  </span>
                  <span className="font-bold text-neutral-800 text-[10px] sm:text-xs">8</span>
                </div>
              </div>
            </div>

            {/* 'We are here' badge floating over weather card */}
            <div className="absolute right-0 bottom-4 z-30 transform translate-x-1/3 sm:translate-x-1/2 translate-y-1/2">
              <div className="relative">
                <span className="absolute -top-4 -left-6 sm:-left-6 text-[10px] sm:text-xs font-black text-[#009EDB] rotate-[-15deg] bg-yellow-100 px-1 py-0.5 rounded shadow-sm whitespace-nowrap">
                  We Are Here!
                </span>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1288FC] rounded-full border-[3px] border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
