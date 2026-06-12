export type AqiLevel = 'Good' | 'Moderate' | 'Poor' | 'Unhealthy' | 'Severe' | 'Hazardous' | 'Unknown';

export function getAqiInfo(aqi: number) {
    if (aqi >= 0 && aqi <= 50) return { level: 'Good' as AqiLevel, color: 'text-emerald-500', bg: 'bg-emerald-50', gradient: 'from-emerald-400 to-emerald-600', advice: 'Air quality is considered satisfactory, and air pollution poses little or no risk.', range: '0-50' };
    if (aqi >= 51 && aqi <= 100) return { level: 'Moderate' as AqiLevel, color: 'text-yellow-500', bg: 'bg-yellow-50', gradient: 'from-yellow-400 to-yellow-600', advice: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.', range: '51-100' };
    if (aqi >= 101 && aqi <= 150) return { level: 'Poor' as AqiLevel, color: 'text-orange-500', bg: 'bg-orange-50', gradient: 'from-orange-400 to-orange-600', advice: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.', range: '101-150' };
    if (aqi >= 151 && aqi <= 200) return { level: 'Unhealthy' as AqiLevel, color: 'text-red-500', bg: 'bg-red-50', gradient: 'from-red-500 to-red-700', advice: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.', range: '151-200' };
    if (aqi >= 201 && aqi <= 300) return { level: 'Severe' as AqiLevel, color: 'text-purple-600', bg: 'bg-purple-50', gradient: 'from-purple-500 to-purple-800', advice: 'Health warnings of emergency conditions. The entire population is more likely to be affected.', range: '201-300' };
    if (aqi > 300) return { level: 'Hazardous' as AqiLevel, color: 'text-rose-900', bg: 'bg-rose-50', gradient: 'from-rose-700 to-rose-950', advice: 'Health alert: everyone may experience more serious health effects.', range: '301+' };

    return { level: 'Unknown' as AqiLevel, color: 'text-gray-500', bg: 'bg-gray-50', gradient: 'from-gray-400 to-gray-600', advice: 'Data not available.', range: '-' };
}
