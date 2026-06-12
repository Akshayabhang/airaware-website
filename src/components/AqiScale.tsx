const aqiLevels = [
  { category: "Good", range: "0 – 50", color: "bg-[#4ade80]", text: "text-green-700", bg: "bg-green-50 dark:bg-green-900/20", description: "Fresh air. Enjoy outdoor activities freely." },
  { category: "Moderate", range: "51 – 100", color: "bg-[#fbbf24]", text: "text-yellow-700", bg: "bg-yellow-50 dark:bg-yellow-900/20", description: "Acceptable for most. Sensitive groups may notice mild discomfort." },
  { category: "Poor", range: "101 – 150", color: "bg-[#f97316]", text: "text-orange-700", bg: "bg-orange-50 dark:bg-orange-900/20", description: "Breathing may feel slightly uncomfortable for some." },
  { category: "Unhealthy", range: "151 – 200", color: "bg-[#e11d48]", text: "text-red-700", bg: "bg-red-50 dark:bg-red-900/20", description: "Risky for children, pregnant women & elderly. Limit outdoors." },
  { category: "Severe", range: "201 – 300", color: "bg-[#9333ea]", text: "text-purple-700", bg: "bg-purple-50 dark:bg-purple-900/20", description: "Prolonged exposure may cause chronic illness. Avoid outdoor activities." },
  { category: "Hazardous", range: "301+", color: "bg-[#991b1b]", text: "text-red-900", bg: "bg-rose-50 dark:bg-rose-900/20", description: "Life-threatening. Stay indoors with windows closed." },
];

export default function AqiScale() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-5">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Air Quality Index (AQI) Scale
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Know what each AQI category means for your health.
          </p>
        </div>
        {/* Compact gradient bar */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold">
          {aqiLevels.map((l) => (
            <span key={l.category} className={`${l.color} text-white px-2 py-0.5 rounded-full`}>{l.category}</span>
          ))}
        </div>
      </div>

      {/* Compact Table Card */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        {aqiLevels.map((level, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-3 sm:py-4 ${level.bg} ${idx < aqiLevels.length - 1 ? "border-b border-neutral-100 dark:border-neutral-700" : ""}`}
          >
            {/* Color dot */}
            <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${level.color} shadow-sm`} />

            {/* Category + Range */}
            <div className="w-28 sm:w-36 shrink-0">
              <span className={`font-bold text-sm ${level.text} dark:opacity-90`}>{level.category}</span>
              <span className="ml-2 text-xs text-neutral-400 font-medium">{level.range}</span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-snug">
              {level.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
