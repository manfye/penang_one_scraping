import type { CategoryId } from "./types";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  unitLabel: string;
  emoji: string;
  file: string;
  /** Solid marker color for the map. */
  accentHex: string;
  /** Gradient endpoints for the in-app locate ring. */
  accentGradient: [string, string];
  /** Full static tailwind class strings — kept literal so the JIT compiler can find them. */
  classes: {
    chipActive: string;
    chipIdle: string;
    badge: string;
    ring: string;
    text: string;
    dot: string;
    button: string;
  };
}

export const CATEGORY_ORDER: CategoryId[] = ["ev_charger", "aed", "cctv"];

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  ev_charger: {
    id: "ev_charger",
    label: "EV Charger",
    unitLabel: "charge point",
    emoji: "⚡",
    file: "/data/ev_charger.json",
    accentHex: "#10b981",
    accentGradient: ["#10b981", "#22d3ee"],
    classes: {
      chipActive: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
      chipIdle: "bg-emerald-50 text-emerald-700",
      badge: "bg-emerald-100 text-emerald-700",
      ring: "ring-emerald-400",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
      button: "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700",
    },
  },
  aed: {
    id: "aed",
    label: "AED",
    unitLabel: "AED unit",
    emoji: "❤️",
    file: "/data/aed.json",
    accentHex: "#f43f5e",
    accentGradient: ["#fb923c", "#f43f5e"],
    classes: {
      chipActive: "bg-rose-500 text-white shadow-lg shadow-rose-500/30",
      chipIdle: "bg-rose-50 text-rose-700",
      badge: "bg-rose-100 text-rose-700",
      ring: "ring-rose-400",
      text: "text-rose-600",
      dot: "bg-rose-500",
      button: "bg-rose-500 hover:bg-rose-600 active:bg-rose-700",
    },
  },
  cctv: {
    id: "cctv",
    label: "CCTV",
    unitLabel: "camera",
    emoji: "📷",
    file: "/data/cctv.json",
    accentHex: "#8b5cf6",
    accentGradient: ["#818cf8", "#8b5cf6"],
    classes: {
      chipActive: "bg-violet-500 text-white shadow-lg shadow-violet-500/30",
      chipIdle: "bg-violet-50 text-violet-700",
      badge: "bg-violet-100 text-violet-700",
      ring: "ring-violet-400",
      text: "text-violet-600",
      dot: "bg-violet-500",
      button: "bg-violet-500 hover:bg-violet-600 active:bg-violet-700",
    },
  },
};
