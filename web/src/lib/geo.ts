const EARTH_RADIUS_M = 6371000;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

/** Initial compass bearing (0-360, 0 = north) from point 1 to point 2. */
export function bearingDeg(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lng2 - lng1));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)} km`;
}

const COMPASS_POINTS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

export function compassLabel(bearing: number): string {
  const index = Math.round(bearing / 22.5) % 16;
  return COMPASS_POINTS[index];
}

/** Bearing to target relative to the direction the phone is facing, in (-180, 180]. Positive = target is to the right. */
export function relativeBearing(targetBearing: number, heading: number): number {
  const diff = ((targetBearing - heading + 180) % 360 + 360) % 360 - 180;
  return diff;
}

export type DirectionHint = "ahead" | "behind" | "left" | "right";

export function directionHint(relative: number): DirectionHint {
  const abs = Math.abs(relative);
  if (abs <= 20) return "ahead";
  if (abs >= 160) return "behind";
  return relative < 0 ? "left" : "right";
}

export const DIRECTION_LABEL: Record<DirectionHint, string> = {
  ahead: "Straight ahead",
  behind: "Behind you",
  left: "Turn left",
  right: "Turn right",
};
