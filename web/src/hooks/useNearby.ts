"use client";

import { useEffect, useState } from "react";
import type { CategoryId } from "@/lib/types";
import type { LocationItem, LocationItemWithDistance } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { bearingDeg, distanceMeters } from "@/lib/geo";

const cache = new Map<CategoryId, LocationItem[]>();

export function useNearby(
  category: CategoryId,
  origin: { lat: number; lng: number } | null,
) {
  // Bumping this forces a re-render once an uncached fetch resolves into `cache`.
  const [, bump] = useState(0);

  useEffect(() => {
    if (cache.has(category)) return;
    let cancelled = false;
    fetch(CATEGORIES[category].file)
      .then((r) => r.json())
      .then((data: LocationItem[]) => {
        if (cancelled) return;
        cache.set(category, data);
        bump((x) => x + 1);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  const items = cache.get(category) ?? null;
  const loading = items == null;

  const sorted: LocationItemWithDistance[] | null =
    items && origin
      ? items
          .map((item) => ({
            ...item,
            distanceMeters: distanceMeters(origin.lat, origin.lng, item.lat, item.lng),
            bearingDeg: bearingDeg(origin.lat, origin.lng, item.lat, item.lng),
          }))
          .sort((a, b) => a.distanceMeters - b.distanceMeters)
      : null;

  return { items, sorted, loading };
}
