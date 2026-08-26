export interface NavOption {
  id: "google" | "waze" | "osm";
  label: string;
  emoji: string;
  url: string;
}

export function buildNavOptions(
  destLat: number,
  destLng: number,
  origin: { lat: number; lng: number } | null,
): NavOption[] {
  const options: NavOption[] = [
    {
      id: "google",
      label: "Google Maps",
      emoji: "🗺️",
      url: `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`,
    },
    {
      id: "waze",
      label: "Waze",
      emoji: "🚗",
      url: `https://waze.com/ul?ll=${destLat},${destLng}&navigate=yes`,
    },
    {
      id: "osm",
      label: "OpenStreetMap",
      emoji: "🌍",
      url: origin
        ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${origin.lat}%2C${origin.lng}%3B${destLat}%2C${destLng}`
        : `https://www.openstreetmap.org/?mlat=${destLat}&mlon=${destLng}#map=18/${destLat}/${destLng}`,
    },
  ];
  return options;
}
