"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

export type GeoStatus = "idle" | "loading" | "ready" | "denied" | "error";

export function useGeolocation() {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [position, setPosition] = useState<GeoPosition | null>(null);
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
  }, [request]);

  useEffect(() => {
    return () => {
      if (watchId.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return { status, position, request };
}
