"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationItemWithDistance } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";

function markerIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

// Two layers: a calm expanding "locate" ring (plain CSS animation, driven by
// the .animate-locate-pulse class in globals.css) behind a solid dot.
const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:16px;height:16px;">
      <span class="animate-locate-pulse" style="position:absolute;inset:-10px;border-radius:9999px;background:#2563eb;"></span>
      <div style="position:relative;width:16px;height:16px;border-radius:9999px;background:#2563eb;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>
    </div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export function MapView({
  items,
  origin,
  onSelect,
}: {
  items: LocationItemWithDistance[];
  origin: { lat: number; lng: number } | null;
  onSelect: (item: LocationItemWithDistance) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const hasCenteredRef = useRef(false);
  const [justRecentered, setJustRecentered] = useState(false);

  const fallbackCenter = useMemo<[number, number]>(() => [5.4141, 100.3288], []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: origin ? [origin.lat, origin.lng] : fallbackCenter,
      zoom: 15,
      zoomControl: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Snap to the user's location once it's first acquired, but don't fight
  // the user's panning on every subsequent GPS update — that's what the
  // recenter button below is for.
  useEffect(() => {
    if (!origin || hasCenteredRef.current || !mapRef.current) return;
    mapRef.current.setView([origin.lat, origin.lng], 16);
    hasCenteredRef.current = true;
  }, [origin]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    if (origin) {
      L.marker([origin.lat, origin.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(layer);
    }

    for (const item of items) {
      const color = CATEGORIES[item.category]?.accentHex ?? "#3f3f46";
      const marker = L.marker([item.lat, item.lng], { icon: markerIcon(color) });
      marker.on("click", () => onSelect(item));
      marker.bindTooltip(`${CATEGORIES[item.category].emoji} ${item.name}`, {
        direction: "top",
        offset: [0, -8],
      });
      marker.addTo(layer);
    }
  }, [items, origin, onSelect]);

  const recenter = () => {
    if (!origin || !mapRef.current) return;
    mapRef.current.flyTo([origin.lat, origin.lng], Math.max(mapRef.current.getZoom(), 16), {
      duration: 0.6,
    });
    setJustRecentered(true);
    setTimeout(() => setJustRecentered(false), 700);
  };

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <button
        onClick={recenter}
        disabled={!origin}
        aria-label="Recenter on my location"
        className={`absolute bottom-24 right-3 z-[1000] grid h-11 w-11 place-items-center rounded-full bg-white text-blue-600 shadow-lg ring-1 ring-black/5 transition-transform active:scale-90 disabled:opacity-40 ${
          justRecentered ? "scale-110" : ""
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
          <path
            strokeLinecap="round"
            d="M12 2v3M12 19v3M22 12h-3M5 12H2"
          />
          <circle cx="12" cy="12" r="7" />
        </svg>
      </button>
    </div>
  );
}
