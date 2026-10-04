"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bot,
  HeartPulse,
  LoaderCircle,
  MapPin,
  MessageCircleQuestion,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react";

type Role = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

const starterPrompts = [
  "Kenapa urine bisa berubah warna?",
  "Apa tanda yang perlu diperhatikan saat nyeri BAK?",
  "Bagaimana menjaga kesehatan ginjal setiap hari?",
  "Apa yang normal dan tidak normal saat menstruasi?",
];

const greeting: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hai! Aku UROVA AI. Aku bisa membantu menjelaskan kesehatan urologi dan reproduksi dengan bahasa yang mudah dipahami. Ceritakan pertanyaan atau keluhanmu, ya. Aku tidak menggantikan diagnosis dokter.",
};

export default function UrovaAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const conversationForApi = useMemo(
    () => messages.filter((m) => m.id !== "welcome").map(({ role, content }) => ({ role, content })),
    [messages]
  );

  async function sendMessage(rawText?: string) {
    const text = (rawText ?? input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    queueMicrotask(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));

    try {
      const response = await fetch("/api/urova-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...conversationForApi, { role: "user", content: text }],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "UROVA AI belum bisa merespons.");
      }

      setMessages([
        ...nextMessages,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghubungi UROVA AI.");
    } finally {
      setLoading(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 40);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage();
  }

  function resetConversation() {
    setMessages([greeting]);
    setInput("");
    setError("");
  }

  return (
    <div className="urova-ai-page">
      <section className="urova-ai-hero">
        <div>
          <span className="section-kicker"><Sparkles size={15} /> UROVA AI</span>
          <h1>Tanya kesehatan dengan lebih nyaman.</h1>
          <p>
            Asisten edukasi kesehatan berbasis Gemini API untuk membantu memahami topik urologi dan reproduksi,
            mengenali tanda bahaya, dan menentukan langkah selanjutnya.
          </p>
        </div>
        <div className="urova-ai-hero-badge">
          <Bot size={30} />
          <div><strong>AI untuk edukasi</strong><span>Bukan pengganti dokter</span></div>
        </div>
      </section>

      <div className="urova-ai-layout">
        <section className="urova-chat-card" aria-label="Percakapan UROVA AI">
          <div className="urova-chat-head">
            <div className="urova-chat-agent">
              <div className="urova-ai-avatar"><Bot size={23} /></div>
              <div><strong>UROVA AI</strong><span><i /> Siap membantu</span></div>
            </div>
            <button className="urova-reset-btn" onClick={resetConversation} type="button">
              <RotateCcw size={16} /> Mulai ulang
            </button>
          </div>

          <div className="urova-chat-messages">
            {messages.map((message) => (
              <div className={`urova-message-row ${message.role}`} key={message.id}>
                <div className="urova-message-icon">
                  {message.role === "assistant" ? <Bot size={16} /> : <UserRound size={16} />}
                </div>
                <div className="urova-message-bubble">
                  {message.content.split("\n").map((line, index) => (
                    <span key={`${message.id}-${index}`}>{line || "\u00a0"}</span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="urova-message-row assistant">
                <div className="urova-message-icon"><Bot size={16} /></div>
                <div className="urova-message-bubble urova-typing">
                  <LoaderCircle size={16} className="spin" /> Sedang menyusun jawaban…
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {messages.length === 1 && (
            <div className="urova-starters">
              <span>Coba tanyakan:</span>
              <div>
                {starterPrompts.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => void sendMessage(prompt)}>
                    <MessageCircleQuestion size={15} /> {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <div className="urova-ai-error"><AlertTriangle size={17} /> {error}</div>}

          <form className="urova-chat-form" onSubmit={handleSubmit}>
            <div className="urova-input-wrap">
              <textarea
                aria-label="Tulis pertanyaan untuk UROVA AI"
                maxLength={1600}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Contoh: Aku sering nyeri saat buang air kecil, apa yang perlu diperhatikan?"
                rows={2}
                value={input}
              />
              <span>{input.length}/1600</span>
            </div>
            <button className="urova-send-btn" disabled={!input.trim() || loading} type="submit">
              <Send size={18} /> Kirim
            </button>
          </form>
          <p className="urova-chat-footnote">Jangan masukkan nama lengkap, alamat, nomor identitas, atau data pribadi sensitif.</p>
        </section>

        <aside className="urova-ai-side">
          <div className="urova-ai-info-card teal">
            <div className="urova-ai-info-icon"><ShieldCheck size={21} /></div>
            <h2>Apa yang bisa dibantu?</h2>
            <ul>
              <li>Menjelaskan istilah kesehatan.</li>
              <li>Membantu memahami gejala secara umum.</li>
              <li>Memberikan langkah pencegahan dan self-care yang aman.</li>
              <li>Mengingatkan tanda bahaya dan kapan perlu mencari bantuan.</li>
            </ul>
          </div>

          <div className="urova-ai-info-card warning">
            <div className="urova-ai-info-icon"><AlertTriangle size={21} /></div>
            <h2>Untuk kondisi darurat</h2>
            <p>
              Bila ada nyeri sangat berat, pingsan, perdarahan banyak, tidak bisa BAK, sesak, atau kondisi memburuk cepat,
              jangan menunggu jawaban AI.
            </p>
            <Link href="/layanan-kesehatan"><MapPin size={16} /> Cari layanan kesehatan</Link>
          </div>

          <div className="urova-ai-shortcuts">
            <Link href="/cek-keluhan"><HeartPulse size={18} /><span><strong>Cek Keluhan</strong><small>Skrining awal terstruktur</small></span></Link>
            <Link href="/education"><Stethoscope size={18} /><span><strong>Pusat Edukasi</strong><small>Pelajari topik kesehatan</small></span></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
