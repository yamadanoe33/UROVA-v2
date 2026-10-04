export type HealthFacilityCategory = "all" | "hospital" | "clinic" | "puskesmas";

export type NearbyFacility = {
  id: string;
  name: string;
  address: string;
  category: Exclude<HealthFacilityCategory, "all">;
  distanceKm?: number;
  phone?: string;
  website?: string;
  googleMapsUri?: string;
  note?: string;
};

export type NearbyFacilitiesResponse = {
  facilities: NearbyFacility[];
  source: "gemini-maps";
  model?: string;
  message?: string;
};
