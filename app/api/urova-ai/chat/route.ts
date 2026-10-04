import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTIONS = `
Kamu adalah UROVA AI, asisten edukasi kesehatan untuk platform UROVA yang hanya berfokus pada:
- urologi
- kesehatan ginjal dan saluran kemih
- kesehatan reproduksi
- menstruasi
- pubertas
- kesehatan organ reproduksi
- pencegahan dan pemulihan terkait urologi/reproduksi

Aturan utama:
- Jawab dalam bahasa Indonesia yang ramah, jelas, ringkas, dan tidak menghakimi.
- Jangan memberikan diagnosis pasti.
- Gunakan bahasa seperti "dapat berkaitan dengan", "salah satu kemungkinan", atau "perlu dinilai lebih lanjut".
- Jangan mengklaim menggantikan dokter atau pemeriksaan langsung.
- Jangan memberi resep obat atau dosis obat resep.
- Jika dibutuhkan pemeriksaan fisik, tes, atau riwayat lebih lengkap, jelaskan keterbatasan tersebut.
- Jika ada tanda bahaya seperti nyeri sangat berat/mendadak, pingsan, perdarahan banyak, tidak bisa buang air kecil, nyeri testis mendadak berat, demam tinggi dengan kondisi memburuk, atau muntah terus-menerus, prioritaskan saran mencari pertolongan medis segera.
- Untuk kesehatan seksual/reproduksi, jawab secara ilmiah, edukatif, sensitif, dan sesuai usia.
- Bila informasi kurang, boleh ajukan maksimal 2 pertanyaan klarifikasi penting.
- Jangan meminta nama lengkap, alamat, nomor identitas, atau data pribadi yang tidak diperlukan.

Jika pengguna bertanya di luar topik UROVA, jangan jawab substansi pertanyaan tersebut.
Arahkan pengguna dengan ramah untuk kembali ke topik urologi atau kesehatan reproduksi.

Format jawaban:
1. Jawab inti pertanyaan lebih dulu.
2. Bila relevan, gunakan bagian singkat seperti:
   - Yang bisa dilakukan
   - Perlu diperhatikan
   - Segera cari bantuan jika
3. Hindari jawaban terlalu panjang.
`;

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type GeminiContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

const UROVA_TOPIC_KEYWORDS = [
  "urologi",
  "ginjal",
  "urin",
  "urine",
  "pipis",
  "kencing",
  "buang air kecil",
  "bak",
  "saluran kemih",
  "kandung kemih",
  "uretra",
  "ureter",
  "batu ginjal",
  "gagal ginjal",
  "isk",
  "infeksi saluran kemih",
  "anyang-anyangan",
  "nyeri saat kencing",
  "nyeri saat pipis",
  "urine keruh",
  "darah dalam urine",
  "sering buang air kecil",
  "sulit kencing",
  "tidak bisa kencing",
  "reproduksi",
  "kesehatan reproduksi",
  "organ reproduksi",
  "kesuburan",
  "fertilitas",
  "infertilitas",
  "menstruasi",
  "haid",
  "datang bulan",
  "siklus menstruasi",
  "telat haid",
  "nyeri haid",
  "dismenore",
  "ovulasi",
  "masa subur",
  "rahim",
  "uterus",
  "ovarium",
  "indung telur",
  "vagina",
  "vulva",
  "serviks",
  "keputihan",
  "pcos",
  "endometriosis",
  "testis",
  "buah zakar",
  "skrotum",
  "penis",
  "prostat",
  "sperma",
  "air mani",
  "ereksi",
  "ejakulasi",
  "varikokel",
  "pubertas",
  "mimpi basah",
  "ims",
  "infeksi menular seksual",
  "gonore",
  "klamidia",
  "sifilis",
  "hpv",
  "herpes genital",
  "nyeri testis",
  "testis bengkak",
  "nyeri pinggang",
  "nyeri panggul",
  "nyeri perut bawah",
  "gatal genital",
  "iritasi genital",
];

const FOLLOW_UP_PHRASES = [
  "terus gimana",
  "lalu gimana",
  "terus bagaimana",
  "lalu bagaimana",
  "kenapa bisa begitu",
  "kenapa begitu",
  "apa penyebabnya",
  "apa yang harus dilakukan",
  "harus gimana",
  "harus bagaimana",
  "apakah berbahaya",
  "bahaya nggak",
  "bahaya gak",
  "cara mencegahnya",
  "cara mengatasinya",
  "berapa lama",
  "normal nggak",
  "normal gak",
];

const GREETING_PHRASES = [
  "halo",
  "hai",
  "hi",
  "hello",
  "pagi",
  "siang",
  "sore",
  "malam",
];

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsUrovaTopic(text: string): boolean {
  const normalized = normalizeText(text);
  return UROVA_TOPIC_KEYWORDS.some((keyword) =>
    normalized.includes(keyword),
  );
}

function isGreeting(text: string): boolean {
  const normalized = normalizeText(text);

  return (
    normalized.length <= 30 &&
    GREETING_PHRASES.some(
      (phrase) =>
        normalized === phrase ||
        normalized.startsWith(`${phrase} `),
    )
  );
}

function isFollowUp(text: string): boolean {
  const normalized = normalizeText(text);

  return (
    normalized.length <= 120 &&
    FOLLOW_UP_PHRASES.some((phrase) =>
      normalized.includes(phrase),
    )
  );
}

function previousUserTopicIsAllowed(
  messages: IncomingMessage[],
): boolean {
  return messages
    .slice(0, -1)
    .filter((message) => message.role === "user")
    .reverse()
    .slice(0, 3)
    .some((message) => containsUrovaTopic(message.content));
}

function isAllowedConversation(
  messages: IncomingMessage[],
): boolean {
  const latest = messages[messages.length - 1];

  if (!latest || latest.role !== "user") {
    return false;
  }

  if (containsUrovaTopic(latest.content)) {
    return true;
  }

  if (isGreeting(latest.content)) {
    return true;
  }

  if (
    isFollowUp(latest.content) &&
    previousUserTopicIsAllowed(messages)
  ) {
    return true;
  }

  return false;
}

function isValidMessage(
  value: unknown,
): value is IncomingMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Record<string, unknown>;

  return (
    (message.role === "user" ||
      message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= 4000
  );
}

function wait(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  );
}

function getErrorText(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

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
  return models
    .map((model) => model.trim())
    .filter(Boolean)
    .filter(
      (model, index, all) =>
        all.indexOf(model) === index,
    );
}

function getModelChain() {
  const primary =
    process.env.GEMINI_MODEL || "gemini-3.8-flash";

  const configuredFallbacks = (
    process.env.GEMINI_FALLBACK_MODELS ||
    "gemini-3.5-flash,gemini-3.5-flash-lite"
  )
    .split(",")
    .map((model) => model.trim());

  return uniqueModels([
    primary,
    ...configuredFallbacks,
  ]);
}

async function generateOnModel(
  ai: GoogleGenAI,
  model: string,
  contents: GeminiContent[],
) {
  let lastError: unknown;

  const maxAttempts = 2;

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt += 1
  ) {
    try {
      return await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS,
          maxOutputTokens: 900,
          temperature: 0.4,
        },
      });
    } catch (error) {
      lastError = error;

      if (
        !isCapacityError(error) ||
        attempt === maxAttempts - 1
      ) {
        throw error;
      }

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

  for (
    let index = 0;
    index < models.length;
    index += 1
  ) {
    const model = models[index];

    try {
      const response = await generateOnModel(
        ai,
        model,
        contents,
      );

      return {
        response,
        model,
      };
    } catch (error) {
      lastError = error;

      const canTryNext =
        isCapacityError(error) ||
        isModelAvailabilityError(error);

      console.warn(
        `[UROVA AI] Model ${model} gagal${
          canTryNext && index < models.length - 1
            ? ", mencoba fallback"
            : ""
        }:`,
        getErrorText(error),
      );

      if (
        !canTryNext ||
        index === models.length - 1
      ) {
        throw error;
      }

      await wait(350);
    }
  }

  throw lastError;
}

export async function POST(
  request: NextRequest,
) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY belum diisi.",
        },
        {
          status: 503,
        },
      );
    }

    const body: unknown = await request
      .json()
      .catch(() => null);

    const incoming: unknown[] =
      body &&
      typeof body === "object" &&
      "messages" in body &&
      Array.isArray(
        (
          body as {
            messages?: unknown;
          }
        ).messages,
      )
        ? (
            body as {
              messages: unknown[];
            }
          ).messages
        : [];

    const messages: IncomingMessage[] =
      incoming
        .filter(isValidMessage)
        .slice(-12);

    if (
      !messages.length ||
      messages[messages.length - 1].role !==
        "user"
    ) {
      return NextResponse.json(
        {
          error:
            "Pesan pengguna tidak ditemukan.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isAllowedConversation(messages)) {
      return NextResponse.json({
        reply:
          "Maaf, UROVA AI hanya difokuskan untuk edukasi kesehatan urologi dan reproduksi. Kamu bisa bertanya tentang ginjal, saluran kemih, menstruasi, pubertas, kesehatan organ reproduksi, kesuburan, atau keluhan terkait.",
        model: "topic-guard",
        provider: "urova",
        fallbackUsed: false,
        restricted: true,
        sources: [],
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const models = getModelChain();

    const contents: GeminiContent[] =
      messages.map(
        (
          message: IncomingMessage,
        ): GeminiContent => ({
          role:
            message.role === "assistant"
              ? "model"
              : "user",
          parts: [
            {
              text: message.content,
            },
          ],
        }),
      );

    const { response, model } =
      await generateWithFallback(
        ai,
        models,
        contents,
      );

    const reply =
      response.text?.trim();

    if (!reply) {
      return NextResponse.json(
        {
          error:
            "Gemini tidak mengembalikan jawaban teks.",
        },
        {
          status: 502,
        },
      );
    }

    return NextResponse.json({
      reply,
      model,
      provider: "gemini",
      fallbackUsed:
        model !== models[0],
      restricted: false,
      sources: [],
    });
  } catch (error) {
    console.error(
      "[UROVA AI / Gemini]",
      error,
    );

    const message =
      getErrorText(error);

    const lower =
      message.toLowerCase();

    let publicMessage =
      "UROVA AI sedang mengalami gangguan. Coba lagi beberapa saat.";

    if (
      lower.includes("api key") ||
      lower.includes("authentication") ||
      lower.includes("unauthenticated") ||
      lower.includes("401") ||
      lower.includes("403")
    ) {
      publicMessage =
        "Gemini API key tidak valid atau akses API belum aktif.";
    } else if (
      lower.includes("429") ||
      lower.includes("resource_exhausted") ||
      lower.includes("rate limit") ||
      lower.includes("quota")
    ) {
      publicMessage =
        "Gemini sedang mencapai batas kuota/rate limit. Tunggu sebentar lalu coba lagi.";
    } else if (
      lower.includes("503") ||
      lower.includes("unavailable") ||
      lower.includes("high demand") ||
      lower.includes("overloaded")
    ) {
      publicMessage =
        "Gemini sedang sibuk. UROVA sudah mencoba model utama dan model cadangan otomatis; silakan coba lagi beberapa saat.";
    } else if (
      lower.includes("model") ||
      lower.includes("not found") ||
      lower.includes("404")
    ) {
      publicMessage =
        "Model Gemini yang tersedia untuk API key ini belum bisa digunakan.";
    }

    return NextResponse.json(
      {
        error: publicMessage,
      },
      {
        status: 500,
      },
    );
  }
}