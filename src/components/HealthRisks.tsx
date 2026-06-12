"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";

interface HealthRisksProps {
    aqi: number;
    city: string;
}

type ConditionKey = "asthma" | "heart" | "allergies" | "sinus" | "cold" | "copd";

interface ConditionData {
    id: ConditionKey;
    label: string;
    tabIcon: React.ReactNode;
    getDynamicSeverity: (aqi: number) => {
        level: "Low" | "Mild" | "Moderate" | "High" | "Severe";
        aqiLabel: string;
        aqiRange: string;
        colorHex: string; // The vibrant button/badge color
        bgColor: string;  // The pale background box color
        textColor: string; // Color for the bold title text in the box
    };
    symptoms: string;
    dos: string[];
    donts: string[];
    illustration: React.ReactNode;
}

// Custom simple SVGs to mimic the screenshots
const AsthmaSVG = () => (
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mt-8 mb-6">
        <path d="M50 150 C 50 100, 150 100, 150 150" stroke="#333" strokeWidth="2" fill="none" />
        <circle cx="100" cy="80" r="30" fill="#222" />
        <rect x="90" y="80" width="10" height="20" fill="white" stroke="#333" strokeWidth="2" />
        {/* Clouds in background */}
        <path d="M30 60 Q 40 50, 50 60 Q 60 50, 70 60" stroke="#666" strokeWidth="1" fill="none" />
        <path d="M130 50 Q 140 40, 150 50 Q 160 40, 180 50" stroke="#666" strokeWidth="1" fill="none" />
    </svg>
);

const HeartSVG = () => (
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mt-8 mb-6">
        <path d="M50 150 C 50 100, 150 100, 150 150" stroke="#333" strokeWidth="2" fill="#FFEFEF" />
        <path d="M80 120 L 100 100 L 120 120" stroke="#333" strokeWidth="2" fill="none" />
        {/* Floating broken heart */}
        <path d="M130 70 C 130 50, 170 50, 150 80 L 130 100 L 110 80 C 90 50, 130 50, 130 70 Z" stroke="#CC0000" strokeWidth="2" fill="none" />
        <path d="M130 70 L 120 85 L 140 90 L 130 100" stroke="#CC0000" strokeWidth="2" fill="none" />
        {/* Buildings in background */}
        <rect x="20" y="100" width="30" height="50" stroke="#666" strokeWidth="1" fill="none" />
        <rect x="150" y="90" width="30" height="60" stroke="#666" strokeWidth="1" fill="none" />
    </svg>
);

const AllergiesSVG = () => (
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mt-8 mb-6">
        <path d="M60 150 C 60 90, 140 90, 140 150" stroke="#333" strokeWidth="2" fill="#FFEFEF" />
        <circle cx="100" cy="70" r="25" fill="#222" />
        {/* Scratching arm */}
        <path d="M80 120 C 60 120, 50 140, 70 140 C 90 140, 100 120, 80 120" stroke="#333" strokeWidth="2" fill="none" />
        <path d="M120 100 L 90 130" stroke="#333" strokeWidth="2" fill="none" />
        {/* Clouds outline */}
        <path d="M40 80 C 40 70, 60 70, 60 80" stroke="#666" strokeWidth="1" fill="none" />
        <path d="M140 60 C 140 50, 160 50, 160 60" stroke="#666" strokeWidth="1" fill="none" />
    </svg>
);

const SinusSVG = () => (
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mt-8 mb-6">
        <path d="M60 150 C 60 90, 140 90, 140 150" stroke="#333" strokeWidth="2" fill="#FFEFEF" />
        <circle cx="100" cy="70" r="25" fill="#222" />
        {/* Hands holding nose */}
        <path d="M85 90 C 85 70, 115 70, 115 90" stroke="#333" strokeWidth="2" fill="#FFEFEF" />
        <path d="M90 150 L 90 100" stroke="#333" strokeWidth="2" fill="none" />
        <path d="M110 150 L 110 100" stroke="#333" strokeWidth="2" fill="none" />
        {/* Trees in background */}
        <path d="M30 150 L 30 100 L 25 100 L 30 80 L 35 100 L 30 100" stroke="#666" strokeWidth="1" fill="none" />
        <path d="M170 150 L 170 100 L 165 100 L 170 80 L 175 100 L 170 100" stroke="#666" strokeWidth="1" fill="none" />
    </svg>
);

const ColdSVG = () => (
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mt-8 mb-6">
        <path d="M60 150 C 60 90, 140 90, 140 150" stroke="#333" strokeWidth="2" fill="#FFEFEF" />
        <circle cx="100" cy="70" r="25" fill="#222" />
        {/* Hand to mouth */}
        <path d="M100 80 C 70 80, 80 120, 100 120" stroke="#333" strokeWidth="2" fill="#FFEFEF" />
        {/* Cough lines */}
        <path d="M120 70 L 140 60 M 125 80 L 145 80 M 120 90 L 140 100" stroke="#666" strokeWidth="1" fill="none" />
        <path d="M40 70 Q 50 60, 60 70" stroke="#666" strokeWidth="1" fill="none" />
    </svg>
);


// The massive data structure containing all the copy from the screenshots
const healthData: ConditionData[] = [
    {
        id: "asthma",
        label: "Asthma",
        tabIcon: (
            <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 11h5V6h-5v5z" /><path d="M15 15v5h4a2 2 0 0 0 2-2v-1" /><path d="M15 15H9v5h6v-5z" /><path d="M11 11H6V6h5v5z" /><path d="M5 21l-3-3l3-3" /><path d="M5 21v-6" /></svg>
        ),
        getDynamicSeverity: (aqi: number) => {
            // Logic mirrored from the image "Mild when AQI is Unhealthy (50-150)"
            if (aqi <= 50) return { level: "Low", aqiLabel: "Good", aqiRange: "(0-50)", colorHex: "#8BC53F", bgColor: "#f0fae6", textColor: "#618f29" };
            if (aqi <= 150) return { level: "Mild", aqiLabel: "Unhealthy", aqiRange: "(50-150)", colorHex: "#EAB308", bgColor: "#fef9c3", textColor: "#a16207" };
            return { level: "High", aqiLabel: "Severe/Hazardous", aqiRange: "(150+)", colorHex: "#DC2626", bgColor: "#fee2e2", textColor: "#991b1b" };
        },
        symptoms: "Moderate symptoms including frequent wheezing, noticeable shortness of breath, chest tightness, and persistent cough.",
        dos: [
            "Limit outdoor activities when AQI is poor.",
            "Clean indoor air with an air purifier to reduce exposure.",
            "Soothe the respiratory tract with herbal teas or warm water to help alleviate symptoms."
        ],
        donts: [
            "Exercise outdoors without a mask.",
            "Stay in smoky areas with strong fumes."
        ],
        illustration: <AsthmaSVG />
    },
    {
        id: "heart",
        label: "Heart Issues",
        tabIcon: (
            <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /><path d="M12 8v4l3 3" /></svg>
        ),
        getDynamicSeverity: (aqi: number) => {
            // Logic mirrored from image "High when AQI is Unhealthy (150-301)"
            if (aqi <= 150) return { level: "Mild", aqiLabel: "Moderate/Poor", aqiRange: "(50-150)", colorHex: "#EAB308", bgColor: "#fef9c3", textColor: "#a16207" };
            return { level: "High", aqiLabel: "Unhealthy", aqiRange: "(150-301)", colorHex: "#b91c1c", bgColor: "#eeb4b4", textColor: "#991b1b" }; // Specific pink background from screenshot
        },
        symptoms: "Severe symptoms including intense chest pain, severe fatigue, irregular heartbeats, difficulty breathing, and symptoms that worsen with minimal physical activity.",
        dos: [
            "Stay indoors and avoid outdoor activities to minimize exposure.",
            "Keep prescribed medications readily available and take them.",
            "Maintain a calm environment and avoid stressful activities."
        ],
        donts: [
            "Perform heavy lifting or exercise.",
            "Ignore symptoms like chest pain, shortness of breath, or palpitations.",
            "Smoke or expose yourself to pollutants."
        ],
        illustration: <HeartSVG />
    },
    {
        id: "allergies",
        label: "Allergies",
        tabIcon: (
            <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>
        ),
        getDynamicSeverity: (aqi: number) => {
            if (aqi <= 100) return { level: "Low", aqiLabel: "Moderate", aqiRange: "(0-100)", colorHex: "#8BC53F", bgColor: "#f0fae6", textColor: "#618f29" };
            if (aqi <= 150) return { level: "Mild", aqiLabel: "Poor", aqiRange: "(101-150)", colorHex: "#EAB308", bgColor: "#fef9c3", textColor: "#a16207" };
            return { level: "High", aqiLabel: "Unhealthy", aqiRange: "(150-301)", colorHex: "#b91c1c", bgColor: "#eeb4b4", textColor: "#991b1b" };
        },
        symptoms: "Severe symptoms including intense coughing, throat soreness, airway irritation, significant nasal congestion, chest tightness, and itchy eyes.",
        dos: [
            "Keep windows closed and avoid going outside when AQI is high.",
            "Take allergy medications as prescribed by your doctor.",
            "Use air purifiers and regularly vacuum with HEPA-filter vacuums to reduce indoor allergens."
        ],
        donts: [
            "Go outside without a mask.",
            "Burn firewood or use smoky appliances.",
            "Leave windows open during high pollen seasons."
        ],
        illustration: <AllergiesSVG />
    },
    {
        id: "sinus",
        label: "Sinus",
        tabIcon: (
            <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4h2c0 1.1.9 2 2 2s2-.9 2-2h2c0 2.21-1.79 4-4 4z" /></svg>
        ),
        getDynamicSeverity: (aqi: number) => {
            if (aqi <= 100) return { level: "Mild", aqiLabel: "Moderate", aqiRange: "(0-100)", colorHex: "#EAB308", bgColor: "#fef9c3", textColor: "#a16207" };
            return { level: "High", aqiLabel: "Unhealthy", aqiRange: "(150-301)", colorHex: "#b91c1c", bgColor: "#eeb4b4", textColor: "#991b1b" };
        },
        symptoms: "Severe symptoms, such as a runny nose with thick mucus, facial pressure, teeth pain, fever, cough, headache, and tiredness.",
        dos: [
            "Check the air quality index regularly to make decisions.",
            "Use a humidifier to add moisture to the air and help clear sinuses.",
            "Stay indoors and avoid outdoor air pollution exposure."
        ],
        donts: [
            "Smoke or expose yourself to outdoor smoke.",
            "Skip your prescribed medicines for symptoms."
        ],
        illustration: <SinusSVG />
    },
    {
        id: "cold",
        label: "Cold/Flu",
        tabIcon: (
            <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        ),
        getDynamicSeverity: (aqi: number) => {
            if (aqi <= 100) return { level: "Mild", aqiLabel: "Moderate", aqiRange: "(0-100)", colorHex: "#EAB308", bgColor: "#fef9c3", textColor: "#a16207" };
            return { level: "High", aqiLabel: "Unhealthy", aqiRange: "(150-301)", colorHex: "#b91c1c", bgColor: "#eeb4b4", textColor: "#991b1b" };
        },
        symptoms: "Severe symptoms including persistent cough, significant nasal congestion, high fever, chills, fatigue, sore throat, and headaches.",
        dos: [
            "Stay indoors as much as possible and keep windows and doors closed.",
            "Use saline nasal sprays to clear nasal passages and reduce congestion.",
            "Seek medical advice if symptoms worsen or do not improve within a week."
        ],
        donts: [
            "Ignore severe symptoms or delay seeking medical attention.",
            "Use alcohol-based mouthwash excessively.",
            "Open windows for ventilation when AQI is high."
        ],
        illustration: <ColdSVG />
    },
    {
        id: "copd",
        label: "Chronic (COPD)",
        tabIcon: (
            <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
        ),
        getDynamicSeverity: (aqi: number) => {
            if (aqi <= 150) return { level: "Mild", aqiLabel: "Moderate", aqiRange: "(0-150)", colorHex: "#EAB308", bgColor: "#fef9c3", textColor: "#a16207" };
            return { level: "High", aqiLabel: "Unhealthy", aqiRange: "(150-301)", colorHex: "#b91c1c", bgColor: "#eeb4b4", textColor: "#991b1b" };
        },
        symptoms: "Critical symptoms including severe shortness of breath, chronic cough, extreme fatigue, and chest tightness that limits any physical activity.",
        dos: [
            "Stay indoors in a clean environment with filtered air.",
            "Keep inhalers and oxygen therapy equipment nearby and use as directed.",
            "Contact your healthcare provider immediately if breathing worsens."
        ],
        donts: [
            "Attempt any strenuous physical activity.",
            "Expose yourself to any smoke, chemical fumes, or strong odors.",
            "Delay seeking emergency care if symptoms escalate rapidly."
        ],
        illustration: <AsthmaSVG /> // Reusing asthma lungs for COPD
    }
];

export default function HealthRisks({ aqi, city }: HealthRisksProps) {
    const [activeTab, setActiveTab] = useState<ConditionKey>("asthma");

    const currentData = healthData.find(d => d.id === activeTab)!;
    const severity = currentData.getDynamicSeverity(aqi);

    // If Aqi is 0 or loading, mock it to 155 to default to the red "High Risk" states requested
    const safeAqi = aqi || 155;
    const appliedSeverity = currentData.getDynamicSeverity(safeAqi);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-24 relative z-20">

            {/* Header section */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-neutral-900 leading-tight">Prevent Health Problems: Understand Your Risks</h2>
                <span className="text-xl font-bold text-[#1a5f98]">{city || "Select a location"}</span>
            </div>

            {/* Responsive Tab Bar */}
            <div className="flex overflow-x-auto gap-2 sm:gap-4 pb-4 mb-4 scrollbar-hide py-1">
                {healthData.map((condition) => {
                    const isActive = activeTab === condition.id;
                    return (
                        <button
                            key={condition.id}
                            onClick={() => setActiveTab(condition.id)}
                            className={`flex items-center whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${isActive
                                ? "bg-[#3B82F6] text-white shadow-md border border-transparent"
                                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                                }`}
                        >
                            <span className={isActive ? "text-white opacity-90" : "text-neutral-400"}>
                                {condition.tabIcon}
                            </span>
                            {condition.label}
                        </button>
                    );
                })}
            </div>

            {/* Main Content Box */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-neutral-100 flex flex-col lg:flex-row gap-8">

                {/* Left Side: Illustration Card */}
                <div
                    className="w-full lg:w-[400px] shrink-0 rounded-[28px] overflow-hidden flex flex-col items-center justify-between p-6 transition-colors duration-500"
                    style={{ backgroundColor: appliedSeverity.bgColor }}
                >
                    {/* SVG Container */}
                    <div className="flex-1 flex items-center justify-center w-full">
                        {currentData.illustration}
                    </div>

                    {/* Label Badge */}
                    <div
                        className="w-full py-3 px-4 rounded text-center text-sm font-black text-white shadow-sm mt-4 flex items-center justify-center gap-2"
                        style={{ backgroundColor: appliedSeverity.colorHex }}
                    >
                        <div className="w-3 h-3 rounded bg-white/40 border border-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                        </div>
                        {appliedSeverity.level} Chances of {currentData.label}
                    </div>
                </div>

                {/* Right Side: Text Information */}
                <div className="flex-1 flex flex-col">

                    <h3 className="text-xl font-bold text-neutral-900 mb-4">{currentData.label}</h3>

                    <p className="text-neutral-600 text-[15px] mb-8 leading-relaxed max-w-3xl">
                        Risk of <span className="font-bold text-neutral-900">{currentData.label}</span> symptoms is <span className="font-bold" style={{ color: appliedSeverity.colorHex }}>{appliedSeverity.level}</span> when AQI is <span className="font-bold" style={{ color: appliedSeverity.colorHex }}>{appliedSeverity.aqiLabel} {appliedSeverity.aqiRange}</span>.
                        <br /><br />
                        {currentData.symptoms}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Do's Column */}
                        <div>
                            <h4 className="font-bold text-neutral-900 mb-4">Do's :</h4>
                            <ul className="space-y-4">
                                {currentData.dos.map((item, idx) => (
                                    <li key={idx} className="flex items-start text-sm text-neutral-600">
                                        <Check className="w-5 h-5 text-[#22c55e] mr-3 shrink-0 stroke-[3]" />
                                        <span className="leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Don'ts Column */}
                        <div>
                            <h4 className="font-bold text-neutral-900 mb-4">Don'ts :</h4>
                            <ul className="space-y-4">
                                {currentData.donts.map((item, idx) => (
                                    <li key={idx} className="flex items-start text-sm text-neutral-600">
                                        <X className="w-5 h-5 text-[#ef4444] mr-3 shrink-0 stroke-[3]" />
                                        <span className="leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[#a5a5a5] italic text-[10px] mt-4 px-2 tracking-wide leading-relaxed">
                Disclaimer: The above health risks are precautionary suggestions based on current AQI levels. You may not feel the effects immediately, but prolonged exposure to air pollution can contribute to these health conditions over time. AQI.IN is neither a medical expert nor a provider of medical advice. Please consult a doctor if you experience any of the above similar symptoms.
            </p>

        </div>
    );
}
