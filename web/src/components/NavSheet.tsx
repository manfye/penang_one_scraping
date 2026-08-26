"use client";

import { buildNavOptions } from "@/lib/navLinks";

export function NavSheet({
  destLat,
  destLng,
  destName,
  origin,
  onClose,
}: {
  destLat: number;
  destLng: number;
  destName: string;
  origin: { lat: number; lng: number } | null;
  onClose: () => void;
}) {
  const options = buildNavOptions(destLat, destLng, origin);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full animate-slide-up rounded-t-3xl bg-white p-5 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-zinc-200" />
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Navigate to
        </p>
        <h3 className="mb-4 text-lg font-bold text-zinc-900">{destName}</h3>
        <div className="flex flex-col gap-2">
          {options.map((opt) => (
            <a
              key={opt.id}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-4 py-3.5 text-base font-semibold text-zinc-900 transition-colors active:bg-zinc-100"
            >
              <span className="text-xl">{opt.emoji}</span>
              {opt.label}
            </a>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-3 w-full rounded-2xl py-3 text-base font-semibold text-zinc-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
