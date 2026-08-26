"use client";

import type { GeoStatus } from "@/hooks/useGeolocation";
import type { CategoryMeta } from "@/lib/categories";

export function LocationGate({
  status,
  meta,
  onRequest,
}: {
  status: GeoStatus;
  meta: CategoryMeta;
  onRequest: () => void;
}) {
  const isLoading = status === "loading";
  const isDenied = status === "denied";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="relative grid h-24 w-24 place-items-center">
        {isLoading && (
          <span className="absolute inset-0 animate-locate-pulse rounded-full bg-emerald-400" />
        )}
        <div
          className={`relative grid h-24 w-24 place-items-center rounded-full text-4xl ${
            isDenied ? "bg-zinc-100" : meta.classes.chipIdle
          }`}
        >
          {isDenied ? "🚫" : "📍"}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-900">
          {isDenied
            ? "Location access denied"
            : isLoading
              ? "Finding you…"
              : "Where are you?"}
        </h2>
        <p className="mx-auto mt-2 max-w-[280px] text-sm font-medium text-zinc-500">
          {isDenied
            ? "Enable location for this site in your browser settings, then try again."
            : isLoading
              ? "Getting a lock on your GPS — one sec."
              : `Turn on location to see the nearest ${meta.label.toLowerCase()}s and get pointed straight there.`}
        </p>
      </div>

      {!isLoading && (
        <button
          onClick={onRequest}
          className="w-full max-w-xs rounded-2xl bg-zinc-900 py-4 text-base font-bold text-white shadow-lg shadow-zinc-900/20 transition-transform active:scale-95"
        >
          {isDenied ? "Try again" : "Enable location"}
        </button>
      )}

      <p className="max-w-[260px] text-xs text-zinc-400">
        Used only on your device to sort results — nothing is sent anywhere.
      </p>
    </div>
  );
}
