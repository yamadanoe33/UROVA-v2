import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTIONS = `Kamu adalah UROVA AI, asisten edukasi kesehatan untuk platform UROVA yang berfokus pada urologi dan kesehatan reproduksi, terutama untuk remaja dan dewasa muda.

Tujuanmu:
- Menjelaskan informasi kesehatan dengan bahasa Indonesia yang ramah, jelas, ringkas, dan tidak menghakimi.
- Membantu pengguna memahami keluhan secara umum, pencegahan, self-care yang aman, dan kapan perlu mencari tenaga kesehatan.
- Jangan memberikan diagnosis pasti. Gunakan bahasa seperti "dapat berkaitan dengan", "salah satu kemungkinan", atau "perlu dinilai lebih lanjut".
- Jangan mengklaim menggantikan dokter atau pemeriksaan langsung.
- Jangan memberi resep obat, dosis obat resep, atau menyuruh pengguna memulai/menghentikan obat resep tanpa tenaga kesehatan.
- Jika pertanyaan membutuhkan pemeriksaan fisik, tes, atau riwayat lebih lengkap, jelaskan keterbatasan tersebut.
- Jika ada tanda bahaya seperti nyeri sangat berat/mendadak, pingsan, perdarahan banyak, tidak bisa buang air kecil, nyeri testis mendadak berat, demam tinggi dengan kondisi memburuk, muntah terus-menerus, atau pengguna tampak dalam keadaan gawat, prioritaskan saran mencari pertolongan medis segera.
- Untuk pertanyaan kesehatan seksual/reproduksi, jawab secara ilmiah, edukatif, sensitif, dan sesuai usia tanpa stigma.
- Bila informasi yang diberikan kurang, boleh ajukan paling banyak 2 pertanyaan klarifikasi yang benar-benar penting.
- Jangan meminta nama lengkap, alamat, nomor identitas, atau informasi pribadi yang tidak diperlukan.

Format jawaban:
1. Jawab inti pertanyaan terlebih dahulu.
2. Bila relevan, gunakan bagian singkat seperti "Yang bisa dilakukan", "Perlu diperhatikan", dan "Segera cari bantuan jika".
3. Hindari jawaban terlalu panjang. Prioritaskan tindakan yang praktis dan aman.
4. Jika pengguna hanya meminta definisi/edukasi, jangan menambahkan peringatan darurat secara berlebihan.`;

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type GeminiContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

function isValidMessage(value: unknown): value is IncomingMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= 4000
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorText(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error ?? "Unknown Gemini error");
}

function isCapacityError(error: unknown) {
  const lower = getErrorText(error).toLowerCase();
  return (
    lower.includes("503") ||
    lower.includes("unavailable") ||
    lower.includes("high demand") ||
    lower.includes("overloaded") ||
    lower.includes("429") ||
    lower.includes("resource_exhausted") ||
    lower.includes("rate limit")
  );
}

function isModelAvailabilityError(error: unknown) {
  const lower = getErrorText(error).toLowerCase();
  return (
    lower.includes("404") ||
    lower.includes("not found") ||
    lower.includes("model is not available") ||
    lower.includes("unsupported model")
  );
}

function uniqueModels(models: string[]) {
  return models.map((model) => model.trim()).filter(Boolean).filter((model, index, all) => all.indexOf(model) === index);
}

function getModelChain() {
  const primary = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const configuredFallbacks = (process.env.GEMINI_FALLBACK_MODELS || "gemini-3.5-flash,gemini-3.5-flash-lite")
    .split(",")
    .map((model) => model.trim());

  return uniqueModels([primary, ...configuredFallbacks]);
}

async function generateOnModel(
  ai: GoogleGenAI,
  model: string,
  contents: GeminiContent[],
) {
  let lastError: unknown;
  const maxAttempts = 2;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS,
          maxOutputTokens: 1200,
          temperature: 0.5,
        },
      });
    } catch (error) {
      lastError = error;
      if (!isCapacityError(error) || attempt === maxAttempts - 1) throw error;

      // Jeda pendek dengan backoff agar tidak langsung menabrak kapasitas lagi.
      await wait(900 * (attempt + 1));
    }
  }

  throw lastError;
}

async function generateWithFallback(
  ai: GoogleGenAI,
  models: string[],
  contents: GeminiContent[],
) {
  let lastError: unknown;

  for (let index = 0; index < models.length; index += 1) {
    const model = models[index];
    try {
      const response = await generateOnModel(ai, model, contents);
      return { response, model };
    } catch (error) {
      lastError = error;
      const canTryNext = isCapacityError(error) || isModelAvailabilityError(error);

      console.warn(
        `[UROVA AI] Model ${model} gagal${canTryNext && index < models.length - 1 ? ", mencoba fallback" : ""}:`,
        getErrorText(error),
      );

      if (!canTryNext || index === models.length - 1) throw error;
      await wait(350);
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY belum diisi. Tambahkan key ke file .env.local lalu restart npm run dev.",
        },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => null);
    const incoming = Array.isArray(body?.messages) ? body.messages : [];
    const messages = incoming.filter(isValidMessage).slice(-12);

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Pesan pengguna tidak ditemukan." }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const models = getModelChain();
    const contents: GeminiContent[] = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    const { response, model } = await generateWithFallback(ai, models, contents);
    const reply = response.text?.trim();

    if (!reply) {
      return NextResponse.json(
        { error: "Gemini tidak mengembalikan jawaban teks." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      reply,
      model,
      provider: "gemini",
      fallbackUsed: model !== models[0],
    });
  } catch (error) {
    console.error("[UROVA AI / Gemini]", error);

    const message = getErrorText(error);
    const lower = message.toLowerCase();

    let publicMessage = "UROVA AI sedang mengalami gangguan. Coba lagi beberapa saat.";
    if (
      lower.includes("api key") ||
      lower.includes("authentication") ||
      lower.includes("unauthenticated") ||
      lower.includes("401") ||
      lower.includes("403")
    ) {
      publicMessage =
        "Gemini API key tidak valid atau akses API belum aktif. Periksa GEMINI_API_KEY di .env.local lalu restart server.";
    } else if (
      lower.includes("429") ||
      lower.includes("resource_exhausted") ||
      lower.includes("rate limit") ||
      lower.includes("quota")
    ) {
      publicMessage =
        "Semua model Gemini yang tersedia sedang mencapai batas kuota/rate limit. Tunggu sebentar lalu coba lagi atau periksa kuota project Gemini API.";
    } else if (
      lower.includes("503") ||
      lower.includes("unavailable") ||
      lower.includes("high demand") ||
      lower.includes("overloaded")
    ) {
      publicMessage =
        "Gemini sedang sibuk. UROVA sudah mencoba model utama dan model cadangan otomatis; silakan coba lagi beberapa saat.";
    } else if (lower.includes("model") || lower.includes("not found") || lower.includes("404")) {
      publicMessage =
        "Model Gemini yang tersedia untuk API key ini belum bisa digunakan. Periksa GEMINI_MODEL dan GEMINI_FALLBACK_MODELS di .env.local.";
    }

    return NextResponse.json({ error: publicMessage }, { status: 500 });
  }
}
