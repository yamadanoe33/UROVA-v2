"use client";

import type { SymptomId } from "@/types/cycle";
import { Activity, CircleDot, CloudSun, MoonStar, Sparkles, Zap } from "lucide-react";

const symptoms: { id: SymptomId; label: string; Icon: typeof Activity }[] = [
  { id: "cramps", label: "Kram", Icon: Activity },
  { id: "headache", label: "Sakit kepala", Icon: Zap },
  { id: "bloating", label: "Kembung", Icon: CircleDot },
  { id: "mood", label: "Mood", Icon: CloudSun },
  { id: "fatigue", label: "Lelah", Icon: MoonStar },
  { id: "acne", label: "Jerawat", Icon: Sparkles },
];

type Props = { selected: SymptomId[]; onToggle: (id: SymptomId) => void };

export default function SymptomTracker({ selected, onToggle }: Props) {
  return (
    <section className="cycle-symptom-card">
      <div className="cycle-section-head">
        <div><span>HARI INI</span><h3>Apa yang kamu rasakan?</h3></div>
        <p>Ketuk untuk mencatat</p>
      </div>
      <div className="cycle-symptom-grid">
        {symptoms.map(({ id, label, Icon }) => {
          const active = selected.includes(id);
          return (
            <button key={id} type="button" className={active ? "active" : ""} onClick={() => onToggle(id)}>
              <Icon size={19}/><span>{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
