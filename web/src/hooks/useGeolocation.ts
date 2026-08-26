"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

export type GeoStatus = "idle" | "loading" | "ready" | "denied" | "error";

/**
 * Dev/screenshot convenience: `?mockLat=5.4164&mockLng=100.3327` pins the
 * app to that spot instead of touching the real geolocation API — handy for
 * capturing screenshots from anywhere in Penang without OS-level GPS spoofing.
 * Dev-only: ignored in production builds so it can't be used to spoof
 * location on the live site.
 */
function readMockPosition(): GeoPosition | null {
  if (typeof window === "undefined") return null;
  if (process.env.NODE_ENV === "production") return null;
  const params = new URLSearchParams(window.location.search);
  const lat = parseFloat(params.get("mockLat") ?? "");
  const lng = parseFloat(params.get("mockLng") ?? "");
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng, accuracy: 5 };
}

export function useGeolocation() {
  const [mockPosition] = useState(readMockPosition);
  const [status, setStatus] = useState<GeoStatus>(mockPosition ? "ready" : "idle");
  const [position, setPosition] = useState<GeoPosition | null>(mockPosition);
  const watchId = useRef<number | null>(null);

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setStatus("ready");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  }, []);

  // The browser may already hold a granted (or denied) permission from a
  // previous visit — skip the "Enable location" prompt entirely in that
  // case instead of making the user tap it again every time.
  useEffect(() => {
    if (mockPosition) return;
    if (typeof navigator === "undefined" || !navigator.permissions) return;
    let subscription: PermissionStatus | null = null;

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        subscription = result;
        if (result.state === "granted") request();
        else if (result.state === "denied") setStatus("denied");
        result.onchange = () => {
          if (result.state === "granted") request();
          else if (result.state === "denied") setStatus("denied");
        };
      })
      .catch(() => {
        // Permissions API for "geolocation" isn't supported everywhere (e.g. Safari) — fall back to the manual button.
      });

    return () => {
      if (subscription) subscription.onchange = null;
    };
  }, [request, mockPosition]);

  useEffect(() => {
    return () => {
      if (watchId.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return { status, position, request };
}
