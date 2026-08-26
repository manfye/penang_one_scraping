export type CategoryId = "ev_charger" | "aed" | "cctv";

export interface LocationItem {
  id: string;
  category: CategoryId;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  /** Number of individual units (cameras / AED devices / charge points) at this site. */
  unitCount: number;
  extra: Record<string, unknown>;
}

export interface LocationItemWithDistance extends LocationItem {
  distanceMeters: number;
  bearingDeg: number;
}
