"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Clock3, Search, ShieldCheck, Sparkles } from "lucide-react";
import { educationArticles, educationCategories, type EducationCategory } from "@/lib/education-data";

const allCategory = "Semua";

export default function EducationHub() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<typeof allCategory | EducationCategory>(allCategory);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return educationArticles.filter((article) => {
      const matchesCategory = category === allCategory || article.category === category;
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <>
      <section className="edu-hero">
        <div className="edu-hero-copy">
          <span className="edu-pill"><Sparkles size={15} /> UROVA Education Hub</span>
          <h1>Pahami tubuhmu,<br /><span>tanpa dibuat bingung.</span></h1>
          <p>Materi urologi dan reproduksi yang dibagi menjadi topik singkat, mudah dipahami, dan dilengkapi tanda bahaya agar kamu tahu kapan harus mencari bantuan.</p>
          <div className="edu-hero-stats">
            <div><strong>{educationArticles.length}</strong><span>materi</span></div>
            <div><strong>{educationCategories.length}</strong><span>kategori</span></div>
            <div><strong>5–8m</strong><span>rata-rata baca</span></div>
          </div>
        </div>
        <div className="edu-hero-art">
          <div className="edu-art-orb edu-art-one" />
          <div className="edu-art-orb edu-art-two" />
          <div className="edu-floating edu-float-a"><BookOpen size={20} /><div><strong>Materi ringkas</strong><span>Belajar per topik</span></div></div>
          <div className="edu-floating edu-float-b"><ShieldCheck size={20} /><div><strong>Safe guide</strong><span>Tanda bahaya jelas</span></div></div>
          <div className="edu-preview-card">
            <div className="edu-preview-top"><span>Hari ini</span><span>Belajar 10 menit</span></div>
            <h3>Topik populer</h3>
            <div className="edu-preview-row"><span>💧</span><div><strong>Hidrasi Sehat</strong><small>5 menit · Dasar</small></div><ArrowRight size={16}/></div>
            <div className="edu-preview-row"><span>🌸</span><div><strong>Siklus Menstruasi</strong><small>7 menit · Dasar</small></div><ArrowRight size={16}/></div>
            <div className="edu-preview-row"><span>🦠</span><div><strong>Infeksi Saluran Kemih</strong><small>7 menit · Menengah</small></div><ArrowRight size={16}/></div>
          </div>
        </div>
      </section>

      <section className="edu-section">
        <div className="edu-section-title">
          <div><span className="section-kicker">JELAJAHI</span><h2>Pilih jalur belajarmu</h2></div>
          <p>Mulai dari topik yang paling dekat dengan kebutuhanmu.</p>
        </div>
        <div className="edu-category-grid">
          {educationCategories.map((item) => {
            const count = educationArticles.filter((a) => a.category === item.name).length;
            return (
              <button key={item.name} onClick={() => setCategory(item.name)} className={`edu-category-card ${category === item.name ? "selected" : ""}`}>
                <span className="edu-category-icon">{item.icon}</span>
                <strong>{item.name}</strong>
                <p>{item.description}</p>
                <small>{count} materi</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="edu-section edu-library">
        <div className="edu-section-title edu-library-head">
          <div><span className="section-kicker">PERPUSTAKAAN</span><h2>Materi edukasi</h2></div>
          <div className="edu-search"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari: ginjal, menstruasi, ISK..." /></div>
        </div>
        <div className="edu-filter-row">
          {[allCategory, ...educationCategories.map((item) => item.name)].map((item) => (
            <button key={item} onClick={() => setCategory(item as typeof category)} className={category === item ? "active" : ""}>{item}</button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="edu-article-grid">
            {filtered.map((article) => (
              <Link href={`/education/${article.slug}`} key={article.slug} className="edu-article-card">
                <div className="edu-article-top"><span className="edu-article-icon">{article.icon}</span><span className="edu-level">{article.level}</span></div>
                <span className="edu-card-category">{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <div className="edu-card-bottom"><span><Clock3 size={14}/>{article.readTime}</span><strong>Baca materi <ArrowRight size={15}/></strong></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="edu-empty"><Search size={28}/><h3>Materi belum ditemukan</h3><p>Coba kata kunci lain atau pilih kategori “Semua”.</p></div>
        )}
      </section>

      <section className="edu-bottom-grid">
        <div className="edu-action-card teal">
          <span>🤖 PENDAMPING BELAJAR</span><h3>Masih ada yang membingungkan?</h3><p>Nanti kamu bisa lanjut bertanya ke UROVA AI dengan bahasa yang sederhana dan tetap diarahkan ke sumber edukasi yang relevan.</p><Link href="/urova-ai">Tanya UROVA AI <ArrowRight size={16}/></Link>
        </div>
        <div className="edu-action-card light">
          <span>⚠️ CATATAN PENTING</span><h3>Edukasi bukan diagnosis</h3><p>Materi ini membantu memahami tubuh dan gejala umum. Keluhan berat, memburuk, atau tanda bahaya tetap perlu dinilai tenaga kesehatan.</p><Link href="/cek-keluhan">Cek keluhan awal <ArrowRight size={16}/></Link>
        </div>
      </section>
    </>
  );
}
