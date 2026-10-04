import type { NearbyFacility } from "@/types/health-service";

export function makeDemoFacilities(latitude: number, longitude: number): NearbyFacility[] {
  const rows = [
    { name: "Rumah Sakit Demo UROVA", category: "hospital" as const, lat: latitude + 0.009, lng: longitude + 0.004, rating: 4.6 },
    { name: "Puskesmas Demo Sehat", category: "puskesmas" as const, lat: latitude - 0.006, lng: longitude + 0.007, rating: 4.4 },
    { name: "Klinik Demo Keluarga", category: "clinic" as const, lat: latitude + 0.004, lng: longitude - 0.008, rating: 4.5 },
  ];
  return rows.map((row, index) => ({
    id: `demo-${index + 1}`,
    name: row.name,
    address: "Data demo — tambahkan GOOGLE_MAPS_API_KEY untuk hasil fasilitas nyata.",
    latitude: row.lat,
    longitude: row.lng,
    distanceKm: 0,
    category: row.category,
    rating: row.rating,
    userRatingCount: 0,
    googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${row.lat},${row.lng}`)}`,
  }));
}
