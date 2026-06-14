/**
 * Sanitizes and validates city names to prevent malicious inputs/injections
 */
export function validateCity(city: string | null | undefined): string | null {
  if (!city) return null;

  // Trim and remove control characters
  let cleaned = city.trim().replace(/[\x00-\x1F\x7F]/g, '');

  if (cleaned.length === 0 || cleaned.length > 100) {
    return null;
  }

  // Allow standard alphanumeric, spaces, dashes, commas, dots, and basic international characters
  // Reject characters often used in script injections or path traversals (<, >, ;, ", ', \, /, etc.)
  const isValid = /^[a-zA-Z0-9\s\-.,()'\u00C0-\u017F]+$/.test(cleaned);
  if (!isValid) {
    return null;
  }

  return cleaned;
}

/**
 * Validates coordinate inputs (latitude and longitude)
 */
export function validateCoords(
  latStr: string | null | undefined,
  lngStr: string | null | undefined
): { lat: number; lng: number } | null {
  if (!latStr || !lngStr) return null;

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }

  // Latitude range: -90 to 90
  // Longitude range: -180 to 180
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { lat, lng };
}

/**
 * Validates and limits timeframe parameter values
 */
export function validateTimeframe(timeframe: string | null | undefined): '12h' | '24h' | '7d' | '30d' {
  const allowed = ['12h', '24h', '7d', '30d'];
  if (timeframe && allowed.includes(timeframe)) {
    return timeframe as '12h' | '24h' | '7d' | '30d';
  }
  return '24h';
}

/**
 * Validates year input
 */
export function validateYear(yearStr: string | null | undefined): number | null {
  if (!yearStr) return null;

  const year = parseInt(yearStr, 10);
  if (isNaN(year)) return null;

  // Keep it within reasonable calendar range for logs (e.g. 2000 to 2100)
  if (year < 2000 || year > 2100) {
    return null;
  }

  return year;
}

/**
 * Validates pollutant options to prevent SQL/field injection in Prisma queries
 */
export function validatePollutant(pollutant: string | null | undefined): 'aqi' | 'pm25' | 'pm10' | 'tvoc' | 'noise' {
  const allowed = ['aqi', 'pm25', 'pm10', 'tvoc', 'noise'];
  if (pollutant && allowed.includes(pollutant)) {
    return pollutant as 'aqi' | 'pm25' | 'pm10' | 'tvoc' | 'noise';
  }
  return 'aqi';
}
