# UROVA V2 Phase 7 — Gemini Maps Grounding

Versi ini memakai **satu GEMINI_API_KEY** untuk:
1. UROVA AI
2. Layanan Kesehatan melalui Gemini Grounding with Google Maps

Tidak membutuhkan `GOOGLE_MAPS_API_KEY` dan tidak memakai Overpass/OpenStreetMap.

## Menjalankan
Masuk ke folder `UROVA_V2_PHASE_7_FINAL` (yang berisi `package.json`):

```powershell
npm install
npm run dev
```

## `.env.local`

```env
GEMINI_API_KEY=KEY_GEMINI_KAMU
GEMINI_MODEL=gemini-3.8-flash
GEMINI_FALLBACK_MODELS=gemini-3.5-flash,gemini-3.5-flash-lite
```

> Jangan pakai `NEXT_PUBLIC_GEMINI_API_KEY` dan jangan membagikan key.

## Catatan penting
- `@google/genai` dinaikkan ke versi `^2.0.0` karena Google Maps grounding pada Interactions API membutuhkan SDK > 2.0.0.
- Grounding with Google Maps saat ini memakai prompt internal bahasa Inggris; UI UROVA tetap bahasa Indonesia.
- Fitur Maps grounding mungkin tidak tersedia untuk semua key/project/region dan dapat memiliki kuota/biaya tersendiri.
- Hasil fasilitas dibatasi maksimal 8 agar kebutuhan API tetap terkontrol.
- Detail fasilitas perlu diverifikasi lewat tautan Google Maps.
