"use client";

import { CATEGORIES } from "@/lib/categories";
import {
  bearingDeg,
  compassLabel,
  directionHint,
  distanceMeters,
  formatDistance,
  relativeBearing,
} from "@/lib/geo";
import type { LocationItem } from "@/lib/types";

const HINT_TEXT: Record<string, string> = {
  left: "to your left",
  right: "to your right",
  ahead: "straight ahead",
  behind: "behind you",
};

export function LocateView({
  item,
  origin,
  heading,
  onClose,
  onOpenExternal,
}: {
  item: LocationItem;
  origin: { lat: number; lng: number } | null;
  heading: number | null;
  onClose: () => void;
  onOpenExternal: () => void;
}) {
  const meta = CATEGORIES[item.category];
  const distance = origin ? distanceMeters(origin.lat, origin.lng, item.lat, item.lng) : null;
  const bearing = origin ? bearingDeg(origin.lat, origin.lng, item.lat, item.lng) : null;
  const rotation = bearing != null ? (heading != null ? bearing - heading : bearing) : 0;

  const hintText =
    bearing != null
      ? heading != null
        ? HINT_TEXT[directionHint(relativeBearing(bearing, heading))]
        : `to the ${compassLabel(bearing)}`
      : null;

  const [from, to] = meta.accentGradient;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in flex-col bg-zinc-950 text-white">
      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {meta.emoji} {meta.label}
          </p>
          <h2 className="max-w-[75vw] truncate text-lg font-bold">{item.name}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white active:bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <div
          className="grid h-64 w-64 place-items-center rounded-full p-[6px] transition-transform duration-300 ease-out"
          style={{ background: `conic-gradient(from 0deg, ${from}, ${to}, ${from})` }}
        >
          <div className="grid h-full w-full place-items-center rounded-full bg-zinc-950">
            <div
              className="transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <svg viewBox="0 0 24 24" className="h-20 w-20 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M18 6H9M18 6V15" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center">
          {distance != null ? (
            <>
              <p className="text-4xl font-black tracking-tight">{formatDistance(distance)}</p>
              <p className="mt-1 text-sm font-medium text-zinc-400">{hintText}</p>
            </>
          ) : (
            <p className="text-sm font-medium text-zinc-400">Waiting for your location&hellip;</p>
          )}
          {heading == null && (
            <p className="mt-3 max-w-[220px] text-xs text-zinc-600">
              Enable compass access for a live left/right pointer — otherwise the arrow points using
              north as up.
            </p>
          )}
        </div>
      </div>

      <div className="px-6 pb-8 pt-2 text-center">
        <button onClick={onOpenExternal} className="text-sm font-semibold text-zinc-400 active:text-white">
          Can&rsquo;t find it? Open in Maps instead
        </button>
      </div>
    </div>
  );
}
