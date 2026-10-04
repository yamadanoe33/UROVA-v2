import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTIONS = `
Kamu adalah UROVA AI, asisten edukasi kesehatan untuk platform UROVA yang HANYA berfokus pada:
- urologi
- kesehatan ginjal dan saluran kemih
- kesehatan reproduksi
- menstruasi
- pubertas
- kesehatan organ reproduksi
- pencegahan dan pemulihan terkait urologi/reproduksi

Jika pengguna meminta topik yang jelas-jelas berada di luar cakupan UROVA, jangan menjawab topik tersebut.
Arahkan pengguna dengan ramah agar bertanya mengenai urologi atau kesehatan reproduksi.

Contoh respons untuk topik di luar cakupan:
"Maaf, UROVA AI difokuskan untuk edukasi kesehatan urologi dan reproduksi. Kamu bisa bertanya tentang ginjal, saluran kemih, menstruasi, pubertas, kesehatan organ reproduksi, atau keluhan terkait."

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
- Untuk fakta medis, prioritaskan sumber tepercaya seperti WHO, Kementerian Kesehatan RI, NHS, CDC, NIDDK/NIH, ACOG, EAU, dan organisasi/pedoman klinis resmi.
- Jika Google Search grounding digunakan, jangan mengarang sumber. Gunakan informasi yang benar-benar didukung hasil grounding.
- Bila ada perbedaan antar-sumber, jelaskan dengan hati-hati dan prioritaskan pedoman resmi/terbaru.

Format jawaban:
1. Jawab inti pertanyaan terlebih dahulu.
2. Bila relevan, gunakan bagian singkat seperti "Yang bisa dilakukan", "Perlu diperhatikan", dan "Segera cari bantuan jika".
3. Hindari jawaban terlalu panjang. Prioritaskan tindakan yang praktis dan aman.
4. Jika pengguna hanya meminta definisi/edukasi, jangan menambahkan peringatan darurat secara berlebihan.
`;

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type GeminiContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

type GroundedSource = {
  title: string;
  url: string;
};

/* =========================================================
   TOPIC GUARD
   ========================================================= */

const UROVA_TOPIC_KEYWORDS = [
  // Urologi umum
  "urologi",
  "urologis",
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

  // Ginjal
  "ginjal",
  "batu ginjal",
  "gagal ginjal",
  "fungsi ginjal",
  "dialisis",
  "cuci darah",
  "nefritis",
  "hidrasi",
  "dehidrasi",

  // Infeksi / keluhan saluran kemih
  "isk",
  "infeksi saluran kemih",
  "anyang-anyangan",
  "nyeri saat kencing",
  "nyeri saat pipis",
  "sakit saat pipis",
  "sakit saat kencing",
  "urine keruh",
  "urin keruh",
  "darah dalam urine",
  "darah dalam urin",
  "hematuria",
  "sering kencing",
  "sering buang air kecil",
  "sulit kencing",
  "tidak bisa kencing",
  "menahan kencing",
  "menahan bak",

  // Reproduksi umum
  "reproduksi",
  "kesehatan reproduksi",
  "organ reproduksi",
  "sistem reproduksi",
  "kesuburan",
  "fertilitas",
  "infertilitas",
  "mandul",
  "hormon reproduksi",

  // Perempuan
  "menstruasi",
  "haid",
  "datang bulan",
  "siklus menstruasi",
  "siklus haid",
  "telat haid",
  "terlambat menstruasi",
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
  "leher rahim",
  "keputihan",
  "pcos",
  "endometriosis",

  // Laki-laki
  "testis",
  "buah zakar",
  "skrotum",
  "penis",
  "prostat",
  "sperma",
  "spermatozoa",
  "air mani",
  "ereksi",
  "ejakulasi",
  "varikokel",

  // Pubertas
  "pubertas",
  "mimpi basah",
  "perubahan pubertas",
  "remaja",

  // Infeksi / kesehatan seksual
  "ims",
  "infeksi menular seksual",
  "penyakit menular seksual",
  "gonore",
  "klamidia",
  "sifilis",
  "hpv",
  "herpes genital",

  // Keluhan yang relevan
  "nyeri testis",
  "testis bengkak",
  "nyeri pinggang",
  "nyeri panggul",
  "nyeri perut bawah",
  "gatal genital",
  "iritasi genital",
  "benjolan testis",
  "benjolan di testis",
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
  "bagaimana mencegahnya",
  "cara mencegahnya",
  "cara mengatasinya",
  "bagaimana mengatasinya",
  "berapa lama",
  "normal nggak",
  "normal gak",
  "itu normal",
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
  // Abaikan pesan user terakhir.
  const previousUserMessages = messages
    .slice(0, -1)
    .filter((message) => message.role === "user")
    .reverse();

  // Cukup periksa beberapa pesan sebelumnya agar konteks
  // tidak terlalu jauh memengaruhi pembatasan topik.
  return previousUserMessages
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

  // Topik jelas berkaitan dengan UROVA.
  if (containsUrovaTopic(latest.content)) {
    return true;
  }

  // Sapaan tetap diizinkan agar UROVA bisa memperkenalkan diri.
  if (isGreeting(latest.content)) {
    return true;
  }

  // Pertanyaan lanjutan singkat diizinkan jika pembicaraan
  // sebelumnya memang berkaitan dengan UROVA.
  if (
    isFollowUp(latest.content) &&
    previousUserTopicIsAllowed(messages)
  ) {
    return true;
  }

  return false;
}

/* =========================================================
   GROUNDING SOURCES
   ========================================================= */

function extractGroundedSources(
  response: unknown,
): GroundedSource[] {
  try {
    const candidates = (
      response as {
        candidates?: Array<{
          groundingMetadata?: {
            groundingChunks?: Array<{
              web?: {
                uri?: string;
                title?: string;
              };
            }>;
          };
        }>;
      }
    )?.candidates;

    const chunks =
      candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

    const seen = new Set<string>();
    const sources: GroundedSource[] = [];

    for (const chunk of chunks) {
      const url = chunk?.web?.uri?.trim();

      if (!url || seen.has(url)) continue;

      seen.add(url);

      let title =
        chunk?.web?.title?.trim() || "Sumber web";

      try {
        const hostname = new URL(url).hostname.replace(
          /^www\./,
          "",
        );

        if (!title || title === "Sumber web") {
          title = hostname;
        }
      } catch {}

      sources.push({
        title,
        url,
      });

      if (sources.length >= 5) {
        break;
      }
    }

    return sources;
  } catch {
    return [];
  }
}

/* =========================================================
   MESSAGE VALIDATION
   ========================================================= */

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

/* =========================================================
   GEMINI HELPERS
   ========================================================= */

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
          maxOutputTokens: 1200,
          temperature: 0.5,

          // Google Search grounding untuk sumber web.
          tools: [
            {
              googleSearch: {},
            },
          ],
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

/* =========================================================
   API ROUTE
   ========================================================= */

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
            "GEMINI_API_KEY belum diisi. Tambahkan key ke file .env.local lalu restart npm run dev.",
        },
        {
          status: 503,
        },
      );
    }

    /*
     * request.json() dianggap unknown terlebih dahulu.
     * Ini mencegah messages berubah menjadi any[] dan
     * menghindari TS7006 saat production build.
     */
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

    /* =====================================================
       UROVA TOPIC RESTRICTION
       ===================================================== */

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

    const sources =
      extractGroundedSources(response);

    return NextResponse.json({
      reply,
      model,
      provider: "gemini",
      fallbackUsed:
        model !== models[0],
      sources,
      restricted: false,
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
    } else if (
      lower.includes("model") ||
      lower.includes("not found") ||
      lower.includes("404")
    ) {
      publicMessage =
        "Model Gemini yang tersedia untuk API key ini belum bisa digunakan. Periksa GEMINI_MODEL dan GEMINI_FALLBACK_MODELS di .env.local.";
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