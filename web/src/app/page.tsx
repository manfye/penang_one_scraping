"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { CategoryTabs } from "@/components/CategoryTabs";
import { NearbyCard } from "@/components/NearbyCard";
import { NavSheet } from "@/components/NavSheet";
import { LocateView } from "@/components/LocateView";
import { LocationGate } from "@/components/LocationGate";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useHeading } from "@/hooks/useHeading";
import { useNearby } from "@/hooks/useNearby";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryId, LocationItemWithDistance } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
});

const VIEWS = ["list", "map"] as const;
type View = (typeof VIEWS)[number];

export default function Home() {
  const [category, setCategory] = useState<CategoryId>("aed");
  const [view, setView] = useState<View>("list");
  const [target, setTarget] = useState<LocationItemWithDistance | null>(null);
  const [locating, setLocating] = useState<LocationItemWithDistance | null>(null);

  const geo = useGeolocation();
  const { heading, needsPermission, enable } = useHeading();
  const { sorted, loading } = useNearby(category, geo.position);
  const meta = CATEGORIES[category];

  const nearest = useMemo(() => sorted?.slice(0, 30) ?? [], [sorted]);

  return (
    <div className="flex h-dvh flex-col bg-gradient-to-b from-zinc-50 to-white">
      <header className="px-4 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">
              Terdekat<span className="text-emerald-500">.</span>
            </h1>
            <p className="text-xs font-medium text-zinc-400">
              Find what&rsquo;s nearby in Penang
            </p>
          </div>
          <div className="flex overflow-hidden rounded-full bg-zinc-100 p-1 text-xs font-bold">
            {VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-3.5 py-1.5 capitalize transition-colors ${
                  view === v ? "bg-zinc-900 text-white" : "text-zinc-500"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-3">
        <CategoryTabs active={category} onChange={setCategory} counts={{}} />
      </div>

      {geo.status === "ready" && needsPermission && (
        <button
          onClick={enable}
          className="mx-4 mt-3 rounded-2xl bg-zinc-100 px-4 py-2.5 text-left text-xs font-semibold text-zinc-600 active:bg-zinc-200"
        >
          🧭 Tap to enable compass — cards will point toward each spot as you turn
        </button>
      )}

      <main className="mt-3 flex-1 overflow-hidden">
        {geo.status !== "ready" ? (
          <LocationGate status={geo.status} meta={meta} onRequest={geo.request} />
        ) : view === "list" ? (
          <div className="h-full overflow-y-auto px-4 pb-6">
            {loading && (
              <p className="py-8 text-center text-sm text-zinc-400">Loading {meta.pluralLabel}…</p>
            )}
            {!loading && nearest.length === 0 && (
              <p className="py-8 text-center text-sm text-zinc-400">Nothing found nearby.</p>
            )}
            <div className="flex flex-col gap-2">
              {nearest.map((item) => (
                <NearbyCard
                  key={item.id}
                  item={item}
                  heading={heading}
                  onNavigate={() => setTarget(item)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full">
            <MapView
              items={nearest.length ? nearest : (sorted ?? [])}
              origin={geo.position}
              onSelect={setTarget}
            />
          </div>
        )}
      </main>

      {target && (
        <NavSheet
          destLat={target.lat}
          destLng={target.lng}
          destName={target.name}
          origin={geo.position}
          onWalk={() => {
            setLocating(target);
            setTarget(null);
          }}
          onClose={() => setTarget(null)}
        />
      )}

      {locating && (
        <LocateView
          item={locating}
          origin={geo.position}
          heading={heading}
          onClose={() => setLocating(null)}
          onOpenExternal={() => {
            setTarget(locating);
            setLocating(null);
          }}
        />
      )}
    </div>
  );
}
