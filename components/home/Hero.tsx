import Link from "next/link";
import { ArrowRight, Bot, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15}/> Kesehatan lebih mudah dipahami</div>
        <h1>Kenali tubuhmu.<br/><span>Jaga sehatmu.</span></h1>
        <p>UROVA membantu kamu belajar, mengenali keluhan awal, dan menemukan langkah selanjutnya untuk kesehatan urologi dan reproduksi.</p>
        <div className="hero-actions">
          <Link className="primary-btn" href="/cek-keluhan"><HeartPulse size={18}/> Cek Keluhan <ArrowRight size={17}/></Link>
          <Link className="ghost-btn" href="/urova-ai"><Bot size={18}/> Tanya UROVA AI</Link>
        </div>
        <div className="trust-row"><ShieldCheck size={17}/><span>Edukasi, bukan pengganti diagnosis tenaga kesehatan.</span></div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="health-card main-health-card">
          <div className="health-card-top"><span>Ringkasan Kesehatan</span><span className="status-dot">● Stabil</span></div>
          <div className="mini-wave"><svg viewBox="0 0 360 100"><path d="M0 66 C 40 25, 72 78, 108 48 S 170 35, 205 62 S 276 83, 360 38" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></div>
          <div className="mini-stats"><div><strong>6–8</strong><span>gelas/hari</span></div><div><strong>7+</strong><span>jam tidur</span></div><div><strong>10m</strong><span>belajar</span></div></div>
        </div>
        <div className="floating-card floating-ai"><Bot size={20}/><div><strong>UROVA AI</strong><span>Siap menjawab</span></div></div>
        <div className="floating-card floating-safe"><ShieldCheck size={20}/><div><strong>Safe Guide</strong><span>Tanda bahaya</span></div></div>
      </div>
    </section>
  );
}
