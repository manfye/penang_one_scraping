"use client";

import { useState } from "react";
import { buildNavOptions, type NavOption } from "@/lib/navLinks";

export function NavSheet({
  destLat,
  destLng,
  destName,
  origin,
  onWalk,
  onClose,
}: {
  destLat: number;
  destLng: number;
  destName: string;
  origin: { lat: number; lng: number } | null;
  /** Open the in-app AirTag-style locate screen instead of handing off to an external app. */
  onWalk: () => void;
  onClose: () => void;
}) {
  const options = buildNavOptions(destLat, destLng, origin);
  const [opening, setOpening] = useState<NavOption | null>(null);

  const choose = (opt: NavOption) => {
    setOpening(opt);
    // Brief, deliberate pause so the tap reads as "found it, launching your
    // app" rather than an instant unexplained tab-switch.
    setTimeout(() => {
      window.open(opt.url, "_blank", "noopener,noreferrer");
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-[2px]"
      onClick={() => !opening && onClose()}
    >
      <div
        className="w-full animate-slide-up rounded-t-3xl bg-white p-5 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-zinc-200" />

        {opening ? (
          <div className="flex animate-fade-in flex-col items-center gap-3 py-6 text-center">
            <div className="relative grid h-14 w-14 place-items-center">
              <span className="absolute inset-0 animate-locate-pulse rounded-full bg-emerald-400" />
              <span className="relative text-3xl">{opening.emoji}</span>
            </div>
            <p className="text-sm font-bold text-zinc-900">
              Opening {opening.label}&hellip;
            </p>
            <p className="text-xs text-zinc-400">Taking you to {destName}</p>
          </div>
        ) : (
          <>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
              Navigate to
            </p>
            <h3 className="mb-4 text-lg font-bold text-zinc-900">{destName}</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={onWalk}
                className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-3.5 text-left text-base font-semibold text-white transition-colors active:bg-zinc-800"
              >
                <span className="text-xl">🧭</span>
                <span className="flex-1">Walk here</span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                  In app
                </span>
              </button>
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => choose(opt)}
                  className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-4 py-3.5 text-left text-base font-semibold text-zinc-900 transition-colors active:bg-zinc-100"
                >
                  <span className="text-xl">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="mt-3 w-full rounded-2xl py-3 text-base font-semibold text-zinc-400"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
