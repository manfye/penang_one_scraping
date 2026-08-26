"use client";

import type { LocationItemWithDistance } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import {
  compassLabel,
  directionHint,
  formatDistance,
  relativeBearing,
  type DirectionHint,
} from "@/lib/geo";
import { CompassArrow } from "./CompassArrow";

const HINT_LABEL: Record<DirectionHint, string> = {
  left: "◀ Left",
  right: "Right ▶",
  ahead: "Ahead",
  behind: "Behind",
};

export function NearbyCard({
  item,
  heading,
  onNavigate,
}: {
  item: LocationItemWithDistance;
  heading: number | null;
  onNavigate: () => void;
}) {
  const meta = CATEGORIES[item.category];
  const isAed = item.category === "aed";

  const hint =
    heading != null ? directionHint(relativeBearing(item.bearingDeg, heading)) : null;

  return (
    <button
      type="button"
      onClick={onNavigate}
      className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm ring-1 ring-zinc-100 transition-colors active:bg-zinc-50"
    >
      <div className="flex w-12 shrink-0 flex-col items-center gap-1">
        <CompassArrow
          bearing={item.bearingDeg}
          heading={heading}
          pulse={isAed}
          className="h-11 w-11"
        />
        <span className="text-center text-[10px] font-bold uppercase leading-tight text-zinc-400">
          {hint ? HINT_LABEL[hint] : compassLabel(item.bearingDeg)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm ${isAed ? "inline-block animate-heartbeat" : ""}`}>
            {meta.emoji}
          </span>
          <h3 className="truncate text-sm font-bold text-zinc-900">{item.name}</h3>
        </div>
        {item.address && (
          <p className="mt-0.5 truncate text-xs text-zinc-500">{item.address}</p>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.classes.badge}`}>
            {formatDistance(item.distanceMeters)}
          </span>
          {item.unitCount > 1 && (
            <span className="text-[11px] font-medium text-zinc-400">
              {item.unitCount} {meta.unitLabel}s
            </span>
          )}
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold text-white ${meta.classes.button}`}
      >
        Go
      </span>
    </button>
  );
}
