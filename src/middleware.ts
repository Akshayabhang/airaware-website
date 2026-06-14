import { type NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@/utils/supabase/middleware";

// Regular expression to identify automated bots, scrapers, and web tools
const BOT_USER_AGENTS = /bot|crawler|spider|scrape|curl|wget|python|java|perl|php|go-http-client|axios|httpclient|postman|insomnia|headlesschrome|playwright|puppeteer|selenium/i;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";

  // 1. Bot Protection on API endpoints
  if (pathname.startsWith("/api/") && BOT_USER_AGENTS.test(userAgent)) {
    // Return 403 Forbidden for automated scrapers accessing internal APIs
    return new NextResponse(
      JSON.stringify({ error: "Access Denied: Automated tools are not permitted on this API." }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 2. Supabase Cookie Refresh (invokes Supabase middleware helper)
  let response = createSupabaseClient(request);

  if (!response) {
    response = NextResponse.next();
  }

  // 3. Security Headers
  // We configure a safe but strict Content-Security-Policy supporting:
  // - Self-hosted assets
  // - Map tiles and assets (Leaflet, OpenStreetMap, Waqi markers, Windy tiles)
  // - Supabase DB client and APIs
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.windy.com https://*.windy.org https://unpkg.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;
    img-src 'self' blob: data: https://*.openstreetmap.org https://*.tile.openstreetmap.org https://*.tile.osm.org https://*.waqi.info https://*.openweathermap.org https://*.windy.com https://*.windy.org https://*.indianapi.in https://*.googleapis.com https://*.gstatic.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self'
      https://*.supabase.co wss://*.supabase.co
      https://api.waqi.info https://*.waqi.info
      https://api.openweathermap.org https://*.openweathermap.org
      https://weather.indianapi.in
      https://*.windy.com https://*.windy.org
      https://api.weatherapi.com
      https://identitytoolkit.googleapis.com
      https://securetoken.googleapis.com
      https://*.firebaseapp.com
      https://*.googleapis.com
      wss://*.firebaseio.com;
    frame-src 'self' https://*.windy.com https://*.windy.org https://*.firebaseapp.com https://accounts.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();


  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY"); // Prevent Clickjacking
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(self), camera=(), microphone=(), interest-cohort=()"); // Strict feature limits
  response.headers.set("X-Content-Type-Options", "nosniff"); // Prevent MIME type sniffing

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any static assets (svg, png, jpg, woff, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$).*)",
  ],
};
