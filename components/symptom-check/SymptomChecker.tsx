"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, HeartPulse, MapPin, RotateCcw, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { durationOptions, symptomOptions } from "@/lib/symptom-check/data";
import { assessSymptoms } from "@/lib/symptom-check/engine";
import type { AssessmentInput, DurationOption, Severity } from "@/types/symptom-check";

const initial: AssessmentInput = {
  symptoms: [], duration: "today", severity: 2, fever: false, blood: false, vomiting: false,
  fainting: false, unableToUrinate: false, suddenSevereTesticularPain: false,
};

const steps = ["Keluhan", "Detail", "Tanda bahaya", "Hasil"];
const categoryNames: Record<string, string> = {
  urinary: "Saluran kemih", kidney: "Ginjal", menstrual: "Menstruasi",
  genital: "Area genital", testicular: "Testis", general: "Keluhan umum",
};

export default function SymptomChecker() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AssessmentInput>(initial);
  const result = useMemo(() => assessSymptoms(data), [data]);

  const toggleSymptom = (id: string) => setData((prev) => ({
    ...prev,
    symptoms: prev.symptoms.includes(id) ? prev.symptoms.filter((x) => x !== id) : [...prev.symptoms, id],
  }));

  const grouped = useMemo(() => Object.entries(categoryNames)
    .map(([category, label]) => ({ category, label, items: symptomOptions.filter((s) => s.category === category) }))
    .filter((g) => g.items.length), []);

  const canNext = step !== 0 || data.symptoms.length > 0;
  const reset = () => { setData(initial); setStep(0); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const next = () => { if (canNext) { setStep((s) => Math.min(3, s + 1)); window.scrollTo({ top: 140, behavior: "smooth" }); } };
  const back = () => { setStep((s) => Math.max(0, s - 1)); window.scrollTo({ top: 140, behavior: "smooth" }); };

  return (
    <div className="symptom-dashboard">
      <section className="symptom-hero">
        <div>
          <span className="symptom-eyebrow"><HeartPulse size={14}/> UROVA Symptom Guide</span>
          <h1>Ceritakan keluhanmu,<br/><em>temukan langkah berikutnya.</em></h1>
          <p>Isi gejala yang sedang kamu rasakan. UROVA membantu menyusun langkah pencegahan, pemulihan awal, dan tanda kapan kamu perlu mencari bantuan.</p>
        </div>
        <div className="symptom-hero-note"><ShieldCheck size={22}/><div><strong>Bukan diagnosis</strong><span>Hasil bersifat edukatif dan skrining awal.</span></div></div>
      </section>

      <div className="symptom-stepper" aria-label="Tahapan skrining">
        {steps.map((label, index) => (
          <div className={`symptom-step ${index === step ? "active" : ""} ${index < step ? "done" : ""}`} key={label}>
            <span>{index < step ? <Check size={14}/> : index + 1}</span><b>{label}</b>
          </div>
        ))}
      </div>

      {step === 0 && <section className="symptom-panel">
        <div className="symptom-panel-head"><div><span>LANGKAH 1</span><h2>Apa yang sedang kamu rasakan?</h2><p>Pilih satu atau beberapa keluhan yang paling sesuai.</p></div><div className="symptom-count">{data.symptoms.length} dipilih</div></div>
        <div className="symptom-groups">
          {grouped.map((group) => <div className="symptom-group" key={group.category}><h3>{group.label}</h3><div className="symptom-option-grid">{group.items.map((item) => (
            <button type="button" onClick={() => toggleSymptom(item.id)} className={`symptom-option ${data.symptoms.includes(item.id) ? "active" : ""}`} key={item.id}>
              <span className="symptom-emoji">{item.icon}</span><span className="symptom-option-copy"><strong>{item.label}</strong><small>{item.description}</small></span>{data.symptoms.includes(item.id) && <Check className="symptom-check" size={16}/>}            </button>
          ))}</div></div>)}
        </div>
      </section>}

      {step === 1 && <section className="symptom-panel">
        <div className="symptom-panel-head"><div><span>LANGKAH 2</span><h2>Seberapa lama dan berat keluhannya?</h2><p>Detail ini membantu menentukan apakah cukup dipantau atau sebaiknya diperiksa.</p></div></div>
        <div className="symptom-detail-grid">
          <div className="symptom-question"><h3>Sudah berapa lama?</h3><div className="duration-grid">{durationOptions.map((opt) => <button className={data.duration === opt.value ? "active" : ""} onClick={() => setData((p) => ({ ...p, duration: opt.value as DurationOption }))} key={opt.value}>{opt.label}</button>)}</div></div>
          <div className="symptom-question"><h3>Seberapa mengganggu?</h3><p>1 = sangat ringan · 5 = sangat berat</p><div className="severity-row">{([1,2,3,4,5] as Severity[]).map((n) => <button key={n} onClick={() => setData((p) => ({ ...p, severity: n }))} className={data.severity === n ? "active" : ""}>{n}</button>)}</div><div className="severity-caption"><span>Ringan</span><span>Berat</span></div></div>
        </div>
        <div className="symptom-mini-checks"><Toggle label="Demam" checked={data.fever} onChange={(v)=>setData(p=>({...p,fever:v}))}/><Toggle label="Muntah berulang" checked={data.vomiting} onChange={(v)=>setData(p=>({...p,vomiting:v}))}/></div>
      </section>}

      {step === 2 && <section className="symptom-panel redflag-panel">
        <div className="symptom-panel-head"><div><span>LANGKAH 3</span><h2>Cek tanda bahaya</h2><p>Jawab sesuai kondisi sekarang. Beberapa tanda membutuhkan pertolongan lebih cepat.</p></div><AlertTriangle size={31}/></div>
        <div className="redflag-grid">
          <ToggleCard title="Ada darah pada urine / perdarahan tidak biasa" description="Pilih ya bila darah terlihat jelas atau perdarahan terasa berbeda jauh dari biasanya." checked={data.blood} onChange={(v)=>setData(p=>({...p,blood:v}))}/>
          <ToggleCard title="Pingsan atau hampir pingsan" description="Termasuk lemas berat, berkunang sangat kuat, atau sulit berdiri." checked={data.fainting} onChange={(v)=>setData(p=>({...p,fainting:v}))}/>
          <ToggleCard title="Tidak bisa buang air kecil sama sekali" description="Terutama bila kandung kemih terasa penuh atau perut bawah sakit." checked={data.unableToUrinate} onChange={(v)=>setData(p=>({...p,unableToUrinate:v}))}/>
          <ToggleCard title="Nyeri testis mendadak sangat berat" description="Nyeri muncul tiba-tiba, berat, atau disertai bengkak cepat." checked={data.suddenSevereTesticularPain} onChange={(v)=>setData(p=>({...p,suddenSevereTesticularPain:v}))}/>
        </div>
        <div className="redflag-note"><AlertTriangle size={18}/><p>Bila saat ini kamu mengalami nyeri sangat berat, pingsan, sulit bernapas, atau kondisi memburuk cepat, jangan menunggu hasil web—minta bantuan orang dewasa tepercaya dan cari pertolongan medis.</p></div>
      </section>}

      {step === 3 && <section className="result-stack">
        <div className={`result-summary ${result.urgency}`}><div className="result-summary-icon">{result.urgency === "urgent" ? <AlertTriangle size={26}/> : result.urgency === "soon" ? <Stethoscope size={26}/> : <ShieldCheck size={26}/>}</div><div><span>HASIL SKRINING AWAL</span><h2>{result.urgencyTitle}</h2><p>{result.urgencyDescription}</p></div></div>
        <div className="result-grid">
          <ResultCard icon={<Sparkles size={18}/>} kicker="POLA KELUHAN" title="Apa yang mungkin perlu diperhatikan" items={result.possiblePatterns}/>
          <ResultCard icon={<ShieldCheck size={18}/>} kicker="PENCEGAHAN" title="Kurangi risiko keluhan memburuk" items={result.prevention}/>
          <ResultCard icon={<HeartPulse size={18}/>} kicker="PEMULIHAN AWAL" title="Langkah aman yang bisa dilakukan" items={result.recovery}/>
          <ResultCard icon={<AlertTriangle size={18}/>} kicker="TANDA BAHAYA" title="Jangan abaikan kondisi ini" items={result.redFlags.length ? result.redFlags : ["Belum ada tanda bahaya utama dari jawabanmu. Tetap pantau perubahan kondisi."]} danger/>
        </div>
        <div className="result-followup"><div><strong>Langkah berikutnya</strong><p>{result.followUp}</p></div><Link href="/layanan-kesehatan"><MapPin size={16}/> Cari layanan kesehatan</Link></div>
        <button className="result-reset" onClick={reset}><RotateCcw size={15}/> Isi ulang skrining</button>
      </section>}

      {step < 3 && <div className="symptom-navigation">{step > 0 ? <button className="symptom-back" onClick={back}><ArrowLeft size={16}/> Kembali</button> : <span/>}<button disabled={!canNext} className="symptom-next" onClick={next}>{step === 2 ? "Lihat hasil" : "Lanjut"}<ArrowRight size={16}/></button></div>}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label:string; checked:boolean; onChange:(v:boolean)=>void }) {
  return <button type="button" className={`symptom-toggle ${checked ? "active" : ""}`} onClick={()=>onChange(!checked)}><span>{checked ? <Check size={13}/> : null}</span>{label}</button>;
}
function ToggleCard({ title, description, checked, onChange }: { title:string; description:string; checked:boolean; onChange:(v:boolean)=>void }) {
  return <button type="button" className={`redflag-card ${checked ? "active" : ""}`} onClick={()=>onChange(!checked)}><span className="redflag-box">{checked ? <Check size={15}/> : null}</span><div><strong>{title}</strong><p>{description}</p></div></button>;
}
function ResultCard({ icon, kicker, title, items, danger=false }: { icon:ReactNode; kicker:string; title:string; items:string[]; danger?:boolean }) {
  return <article className={`result-card ${danger ? "danger" : ""}`}><div className="result-card-head"><span>{icon}</span><div><small>{kicker}</small><h3>{title}</h3></div></div><ul>{items.map((item,i)=><li key={i}>{item}</li>)}</ul></article>;
}
