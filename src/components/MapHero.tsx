"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import MapContainer to prevent SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false },
);

// We need a helper component to hook into the map instance and update the view dynamically
function MapEffect({ lat, lng }: { lat: number; lng: number }) {
  const mapHooks = require("react-leaflet"); // Workaround for dynamic import of hooks
  const map = mapHooks.useMap();

  useEffect(() => {
    if (map) {
      map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1.5 });
    }
  }, [lat, lng, map]);

  return null;
}

interface MapHeroProps {
  lat?: number;
  lng?: number;
  aqi?: number | null;
}

export default function MapHero({
  lat = 18.66,
  lng = 73.81,
  aqi = 134,
}: MapHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return <div className="w-full h-[60vh] bg-neutral-100 animate-pulse" />;

  const getMarkerColor = (val: number) => {
    if (val > 150) return "#EE4266";
    if (val > 100) return "#F58220";
    if (val > 50) return "#F9C31C";
    return "#8BC53F";
  };

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
      <div className="w-full h-full relative">
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Using a light, mute style to match screenshot
          />

          {aqi && (
            <CircleMarker
              center={[lat, lng]}
              radius={20}
              pathOptions={{
                color: getMarkerColor(aqi),
                fillColor: getMarkerColor(aqi),
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              {/* Note: Putting a number inside a CircleMarker in raw leaflet usually requires a Custom DivIcon, 
                                we will stick to a colored dot for simplicity here unless we need an exact pixel match */}
            </CircleMarker>
          )}

          <MapEffect lat={lat} lng={lng} />
        </MapContainer>

        {/* Inner glass shadow overlay for depth */}
        <div className="absolute inset-0 border-[4px] border-white/20 rounded-[40px] pointer-events-none z-[1000] mix-blend-overlay"></div>
      </div>
    </div>
  );
}
