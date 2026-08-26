"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationItemWithDistance } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";

const ACCENT_HEX: Record<string, string> = {
  ev_charger: "#10b981",
  aed: "#f43f5e",
  cctv: "#8b5cf6",
};

function markerIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#2563eb;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,.25)"></div>`,
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

  const center = useMemo<[number, number]>(
    () => (origin ? [origin.lat, origin.lng] : [5.4141, 100.3288]),
    [origin],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center,
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

  useEffect(() => {
    mapRef.current?.setView(center);
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    if (origin) {
      L.marker([origin.lat, origin.lng], { icon: userIcon }).addTo(layer);
    }

    for (const item of items) {
      const color = ACCENT_HEX[item.category] ?? "#3f3f46";
      const marker = L.marker([item.lat, item.lng], { icon: markerIcon(color) });
      marker.on("click", () => onSelect(item));
      marker.bindTooltip(`${CATEGORIES[item.category].emoji} ${item.name}`, {
        direction: "top",
        offset: [0, -8],
      });
      marker.addTo(layer);
    }
  }, [items, origin, onSelect]);

  return <div ref={containerRef} className="h-full w-full" />;
}
