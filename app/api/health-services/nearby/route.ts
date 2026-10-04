import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import type { HealthFacilityCategory, NearbyFacility } from "@/types/health-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedCategories: HealthFacilityCategory[] = ["all", "hospital", "clinic", "puskesmas"];

type PlaceCitation = { type?: string; name?: string; url?: string };
type ParsedPlace = {
  name?: string;
  category?: string;
  address?: string;
  distance_km?: number | string | null;
  phone?: string | null;
  website?: string | null;
  note?: string | null;
};

function modelChain() {
  return Array.from(new Set([
    process.env.GEMINI_MAPS_MODEL || process.env.GEMINI_MODEL || "gemini-3.8-flash",
    ...(process.env.GEMINI_FALLBACK_MODELS || "gemini-3.5-flash,gemini-3.5-flash-lite")
      .split(",").map((v) => v.trim()).filter(Boolean),
  ]));
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error ?? "Unknown Gemini error");
}

function canFallback(error: unknown) {
  const text = errorText(error).toLowerCase();
  return ["429", "503", "unavailable", "high demand", "overloaded", "resource_exhausted", "rate limit", "404", "not found"]
    .some((token) => text.includes(token));
}

function categoryPrompt(category: HealthFacilityCategory) {
  if (category === "hospital") return "Only hospitals.";
  if (category === "clinic") return "Only clinics or medical clinics.";
  if (category === "puskesmas") return "Prioritize Indonesian community health centers (Puskesmas / Pusat Kesehatan Masyarakat).";
  return "Include hospitals, clinics, and Indonesian community health centers (Puskesmas).";
}

function normalizeCategory(raw: string | undefined, name: string): NearbyFacility["category"] {
  const text = `${raw ?? ""} ${name}`.toLowerCase();
  if (text.includes("puskesmas") || text.includes("community health")) return "puskesmas";
  if (text.includes("hospital") || text.includes("rumah sakit")) return "hospital";
  return "clinic";
}

function extractJson(text: string): ParsedPlace[] {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start < 0 || end < start) return [];
  try {
    const value = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function normalizeDistance(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return Number(value.toFixed(1));
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", ".").match(/[\d.]+/)?.[0]);
    if (Number.isFinite(parsed) && parsed >= 0) return Number(parsed.toFixed(1));
  }
  return undefined;
}

function citationFor(name: string, citations: PlaceCitation[], used: Set<number>) {
  const needle = name.toLowerCase();
  let index = citations.findIndex((c, i) => !used.has(i) && c.name && (c.name.toLowerCase().includes(needle) || needle.includes(c.name.toLowerCase())));
  if (index < 0) index = citations.findIndex((_, i) => !used.has(i));
  if (index >= 0) used.add(index);
  return index >= 0 ? citations[index] : undefined;
}

async function searchWithModel(ai: GoogleGenAI, model: string, latitude: number, longitude: number, category: HealthFacilityCategory) {
  const input = `Find up to 8 real healthcare facilities near the provided user location. ${categoryPrompt(category)}
Use Google Maps grounding. Prefer the closest and currently relevant places. Do not invent places.
Return ONLY a valid JSON array, no markdown and no explanation. Each item must use this exact shape:
{"name":"...","category":"hospital|clinic|puskesmas","address":"...","distance_km":1.2,"phone":null,"website":null,"note":"short factual note or null"}
If a field is unavailable, use null. distance_km may be an approximate straight-line or Maps-informed distance. Keep names and addresses exactly as supported by Google Maps data.`;

  // Grounding with Google Maps is currently exposed through the Interactions API in @google/genai >= 2.0.
  const interaction = await (ai as any).interactions.create({
    model,
    input,
    tools: [{ type: "google_maps", latitude, longitude }],
  });

  let text = "";
  const citations: PlaceCitation[] = [];
  for (const step of interaction?.steps ?? []) {
    if (step?.type !== "model_output") continue;
    for (const block of step?.content ?? []) {
      if (block?.type !== "text") continue;
      text += `${block.text ?? ""}\n`;
      for (const annotation of block.annotations ?? []) {
        if (annotation?.type === "place_citation" && annotation?.url) citations.push(annotation);
      }
    }
  }

  const parsed = extractJson(text);
  const used = new Set<number>();
  let facilities: NearbyFacility[] = parsed
    .filter((item) => item?.name)
    .slice(0, 8)
    .map((item, index) => {
      const name = String(item.name).trim();
      const citation = citationFor(name, citations, used);
      return {
        id: `gemini-maps-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
        name,
        address: item.address ? String(item.address) : "Alamat tersedia melalui Google Maps",
        category: normalizeCategory(item.category, name),
        distanceKm: normalizeDistance(item.distance_km),
        phone: item.phone ? String(item.phone) : undefined,
        website: item.website ? String(item.website) : undefined,
        googleMapsUri: citation?.url,
        note: item.note ? String(item.note) : undefined,
      };
    });

  // If JSON formatting failed, still surface verified Maps citations rather than an empty screen.
  if (!facilities.length && citations.length) {
    facilities = citations.slice(0, 8).map((citation, index) => ({
      id: `gemini-maps-citation-${index}`,
      name: citation.name || "Fasilitas kesehatan",
      address: "Buka Google Maps untuk melihat alamat dan detail terbaru.",
      category: normalizeCategory(undefined, citation.name || ""),
      googleMapsUri: citation.url,
    }));
  }

  if (category !== "all") facilities = facilities.filter((f) => f.category === category);
  facilities.sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY));
  return facilities;
}

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get("lat"));
  const longitude = Number(request.nextUrl.searchParams.get("lng"));
  const category = (request.nextUrl.searchParams.get("category") ?? "all") as HealthFacilityCategory;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ error: "Koordinat lokasi tidak valid." }, { status: 400 });
  }
  if (!allowedCategories.includes(category)) {
    return NextResponse.json({ error: "Kategori tidak valid." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY belum diisi di .env.local." }, { status: 503 });
  }

  const ai = new GoogleGenAI({ apiKey });
  const models = modelChain();
  let lastError: unknown;

  for (let i = 0; i < models.length; i += 1) {
    try {
      const facilities = await searchWithModel(ai, models[i], latitude, longitude, category);
      return NextResponse.json({
        facilities,
        source: "gemini-maps",
        model: models[i],
        message: "Hasil dicari menggunakan Gemini Grounding with Google Maps berdasarkan lokasi perangkat. Buka Google Maps untuk memverifikasi alamat, jam buka, dan petunjuk arah terbaru.",
      });
    } catch (error) {
      lastError = error;
      console.warn(`[UROVA health services] Gemini Maps model ${models[i]} gagal:`, errorText(error));
      if (!canFallback(error) || i === models.length - 1) break;
    }
  }

  const lower = errorText(lastError).toLowerCase();
  let message = "Layanan pencarian fasilitas melalui Gemini + Google Maps sedang tidak tersedia. Coba lagi beberapa saat.";
  if (lower.includes("api key") || lower.includes("401") || lower.includes("403") || lower.includes("permission")) {
    message = "Gemini API key tidak valid atau fitur Google Maps grounding belum tersedia untuk key/project ini.";
  } else if (lower.includes("429") || lower.includes("quota") || lower.includes("resource_exhausted")) {
    message = "Kuota Gemini/Maps grounding sedang mencapai batas. Tunggu sebentar lalu coba lagi.";
  }
  console.error("[UROVA health services / Gemini Maps]", lastError);
  return NextResponse.json({ error: message }, { status: 502 });
}
