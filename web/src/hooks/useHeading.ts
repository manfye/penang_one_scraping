"use client";

import { useEffect, useState } from "react";

type OrientationEventWithWebkit = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

type RequestPermissionOrientation = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function detectsNeedsPermission() {
  if (typeof window === "undefined") return false;
  const ctor = window.DeviceOrientationEvent as unknown as RequestPermissionOrientation;
  return typeof ctor?.requestPermission === "function";
}

export function useHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  const [needsPermission, setNeedsPermission] = useState(detectsNeedsPermission);

  const handleOrientation = (e: Event) => {
    const evt = e as OrientationEventWithWebkit;
    const compass =
      evt.webkitCompassHeading ?? (evt.alpha != null ? 360 - evt.alpha : null);
    if (compass != null) setHeading(compass);
  };

  const enable = async () => {
    const ctor = window.DeviceOrientationEvent as unknown as RequestPermissionOrientation;
    if (ctor?.requestPermission) {
      try {
        const result = await ctor.requestPermission();
        if (result !== "granted") return;
      } catch {
        return;
      }
    }
    setNeedsPermission(false);
    window.addEventListener("deviceorientation", handleOrientation);
  };

  useEffect(() => {
    if (!needsPermission) {
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, [needsPermission]);

  return { heading, needsPermission, enable };
}
