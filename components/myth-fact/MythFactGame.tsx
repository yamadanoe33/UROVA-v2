"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Sparkles, Trophy, XCircle } from "lucide-react";
import { mythFactCategories, mythFactItems, type MythFactAnswer } from "@/lib/myth-fact/data";

type Result = { choice: MythFactAnswer; correct: boolean };

export default function MythFactGame() {
  const [category, setCategory] = useState("Semua");
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [flipped, setFlipped] = useState(false);

  const items = useMemo(() => category === "Semua" ? mythFactItems : mythFactItems.filter(i => i.category === category), [category]);
  const item = items[index] ?? items[0];
  const current = item ? results[item.id] : undefined;
  const answeredCount = Object.keys(results).length;
  const score = Object.values(results).filter(r => r.correct).length;
  const streak = useMemo(() => {
    let n = 0;
    for (const i of mythFactItems) {
      const r = results[i.id];
      if (!r) continue;
      if (r.correct) n += 1; else n = 0;
    }
    return n;
  }, [results]);

  function answer(choice: MythFactAnswer) {
    if (!item || current) return;
    setResults(prev => ({ ...prev, [item.id]: { choice, correct: choice === item.answer } }));
    setFlipped(true);
  }

  function next() {
    setFlipped(false);
    setIndex(i => (i + 1) % items.length);
  }

  function prev() {
    setFlipped(false);
    setIndex(i => (i - 1 + items.length) % items.length);
  }

  function changeCategory(value: string) {
    setCategory(value);
    setIndex(0);
    setFlipped(false);
  }

  function reset() {
    setResults({}); setIndex(0); setFlipped(false);
  }

  return (
      <div className="myth-page-content">
        <section className="myth-hero">
          <div>
            <div className="myth-eyebrow"><Sparkles size={14}/> EDUKASI INTERAKTIF</div>
            <h1>Mitos atau <em>Fakta?</em></h1>
            <p>Uji pengetahuanmu tentang kesehatan urologi dan reproduksi. Pilih jawaban, balik kartu, lalu pahami alasan medis di baliknya.</p>
          </div>
          <div className="myth-scoreboard">
            <div><span>SKOR</span><strong>{score}/{answeredCount || 0}</strong></div>
            <div><span>STREAK</span><strong>🔥 {streak}</strong></div>
            <div><span>TERJAWAB</span><strong>{answeredCount}</strong></div>
          </div>
        </section>

        <div className="myth-category-row">
          {mythFactCategories.map(c => <button key={c} onClick={() => changeCategory(c)} className={category === c ? "active" : ""}>{c}</button>)}
        </div>

        <section className="myth-game-grid">
          <div className="myth-game-card-wrap">
            <div className={`myth-flip-card ${flipped ? "flipped" : ""}`}>
              <div className="myth-flip-inner">
                <article className="myth-card-face myth-card-front">
                  <div className="myth-card-top"><span>{item.category}</span><b>{index + 1}/{items.length}</b></div>
                  <div className="myth-question-mark">?</div>
                  <h2>{item.statement}</h2>
                  <p>Pilih jawabanmu sebelum melihat penjelasan.</p>
                </article>
                <article className="myth-card-face myth-card-back">
                  <div className={`myth-answer-badge ${item.answer === "Fakta" ? "fact" : "myth"}`}>{item.answer === "Fakta" ? <CheckCircle2 size={18}/> : <XCircle size={18}/>} {item.answer.toUpperCase()}</div>
                  <h2>{current?.correct ? "Jawabanmu tepat!" : `Jawaban yang benar: ${item.answer}`}</h2>
                  <p>{item.explanation}</p>
                  <div className="myth-takeaway"><strong>Yang perlu diingat</strong><span>{item.takeaway}</span></div>
                </article>
              </div>
            </div>

            {!flipped ? (
              <div className="myth-choice-row">
                <button className="myth-choice myth" onClick={() => answer("Mitos")}><XCircle size={18}/> MITOS</button>
                <button className="myth-choice fact" onClick={() => answer("Fakta")}><CheckCircle2 size={18}/> FAKTA</button>
              </div>
            ) : (
              <div className="myth-nav-row">
                <button onClick={prev}><ArrowLeft size={16}/> Sebelumnya</button>
                <button className="primary" onClick={next}>Selanjutnya <ArrowRight size={16}/></button>
              </div>
            )}
          </div>

          <aside className="myth-side-card">
            <div className="myth-side-icon"><Trophy size={22}/></div>
            <span>PROGRESS BELAJAR</span>
            <h3>{score} jawaban benar</h3>
            <p>Semakin banyak kartu yang kamu jawab, semakin luas pemahamanmu tentang kesehatan urologi dan reproduksi.</p>
            <div className="myth-progress"><i style={{width:`${Math.min(100, (answeredCount / mythFactItems.length) * 100)}%`}} /></div>
            <small>{answeredCount} dari {mythFactItems.length} kartu terjawab</small>
            <button className="myth-reset" onClick={reset}><RotateCcw size={14}/> Ulangi permainan</button>
          </aside>
        </section>

        <section className="myth-disclaimer">
          <strong>Catatan edukasi</strong>
          <p>Fitur ini bertujuan meningkatkan literasi kesehatan dan bukan alat diagnosis. Keluhan yang berat, mendadak, atau menetap perlu dinilai oleh tenaga kesehatan.</p>
        </section>
      </div>
  );
}
