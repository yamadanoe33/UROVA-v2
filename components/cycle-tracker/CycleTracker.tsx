"use client";

import { useState } from "react";
import { CalendarDays, HeartPulse, Settings2, ShieldCheck, Sparkles } from "lucide-react";
import CalendarStrip from "./CalendarStrip";
import LogPeriodModal from "./LogPeriodModal";
import StatCard from "./StatCard";
import SymptomTracker from "./SymptomTracker";
import { useCycleData } from "@/hooks/useCycleData";
import { formatLongDate, formatShortDate } from "@/lib/cycle";

export default function CycleTracker() {
  const { ready, settings, summary, todaySymptoms, updateSettings, toggleSymptom } = useCycleData();
  const [modalMode, setModalMode] = useState<"log" | "edit" | null>(null);

  const headline = summary.isPeriodWindow
    ? `Hari ke-${summary.cycleDay} menstruasi`
    : summary.daysUntilNextPeriod === 0
      ? "Menstruasi diperkirakan hari ini"
      : `${summary.daysUntilNextPeriod} hari lagi`;

  const fertilityHint = summary.isFertileWindow
    ? "Kamu mungkin sedang berada dalam perkiraan masa subur."
    : "Saat ini berada di luar perkiraan masa subur.";

  return (
    <div className="cycle-dashboard">
      <section className="cycle-hero">
        <div className="cycle-hero-copy">
          <span className="cycle-eyebrow"><CalendarDays size={15}/> Cycle Tracker UROVA</span>
          <h1>Pahami pola siklusmu,<br/><em>lebih tenang setiap hari.</em></h1>
          <p>Catat menstruasi dan gejala harian untuk melihat perkiraan siklus secara praktis. Semua data tersimpan lokal di perangkatmu.</p>
          <div className="cycle-hero-actions">
            <button type="button" className="cycle-primary-btn" onClick={() => setModalMode("log")}><HeartPulse size={17}/> Catat menstruasi</button>
            <button type="button" className="cycle-secondary-btn" onClick={() => setModalMode("edit")}><Settings2 size={17}/> Atur siklus</button>
          </div>
        </div>
        <div className="cycle-privacy-card"><ShieldCheck size={20}/><div><strong>Data tetap di perangkat</strong><span>Catatan tracker ini disimpan melalui penyimpanan lokal browser.</span></div></div>
      </section>

      <div className="cycle-layout">
        <section className="cycle-main-card">
          <div className="cycle-date-heading"><span>{formatLongDate(new Date())}</span><b>{summary.isPeriodWindow ? "Sedang menstruasi" : "Perkiraan siklus"}</b></div>
          <CalendarStrip />
          <div className="cycle-status">
            <p>{summary.isPeriodWindow ? "Status saat ini" : "Menstruasi berikutnya"}</p>
            <h2>{ready ? headline : "Memuat..."}</h2>
            <span>{fertilityHint}</span>
          </div>
          <div className="cycle-stat-grid">
            <StatCard title="Hari siklus" value={ready ? summary.cycleDay : "—"} caption={`dari ~${settings.cycleLength} hari`} tone="teal" />
            <StatCard title="Menstruasi berikut" value={ready ? formatShortDate(summary.nextPeriodDate) : "—"} tone="rose" />
            <StatCard title="Masa subur" value={ready ? formatShortDate(summary.fertileStart) : "—"} caption={ready ? `s.d. ${formatShortDate(summary.fertileEnd)}` : undefined} tone="violet" />
          </div>
        </section>

        <aside className="cycle-side-column">
          <SymptomTracker selected={todaySymptoms} onToggle={toggleSymptom} />
          <section className="cycle-insight-card">
            <div className="cycle-insight-icon"><Sparkles size={20}/></div>
            <span>INSIGHT SIKLUS</span><h3>Perkiraan ovulasi</h3>
            <p>Sekitar <strong>{formatShortDate(summary.ovulationDate)}</strong> berdasarkan siklus rata-rata {settings.cycleLength} hari.</p>
          </section>
          <section className="cycle-safe-note"><ShieldCheck size={18}/><p>Tanggal menstruasi dan masa subur hanya perkiraan dan dapat berubah. Jangan gunakan tracker ini sebagai satu-satunya metode kontrasepsi atau diagnosis medis.</p></section>
        </aside>
      </div>

      <LogPeriodModal open={modalMode !== null} mode={modalMode ?? "log"} settings={settings} onClose={() => setModalMode(null)} onSave={updateSettings}/>
    </div>
  );
}
