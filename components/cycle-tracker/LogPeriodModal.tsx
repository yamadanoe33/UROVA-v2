"use client";

import { useEffect, useState } from "react";
import type { CycleSettings } from "@/types/cycle";
import { X } from "lucide-react";

type Mode = "log" | "edit";
type Props = { open: boolean; mode: Mode; settings: CycleSettings; onClose: () => void; onSave: (settings: CycleSettings) => void };

export default function LogPeriodModal({ open, mode, settings, onClose, onSave }: Props) {
  const [form, setForm] = useState(settings);
  const [error, setError] = useState("");

  useEffect(() => { setForm(settings); setError(""); }, [settings, open, mode]);
  if (!open) return null;

  function save() {
    if (!form.lastPeriodDate) return setError("Pilih hari pertama menstruasi terakhir.");
    if (form.cycleLength < 20 || form.cycleLength > 45) return setError("Panjang siklus harus antara 20–45 hari.");
    if (form.periodLength < 1 || form.periodLength > 10) return setError("Durasi menstruasi harus antara 1–10 hari.");
    onSave(form); onClose();
  }

  return (
    <div className="cycle-modal-backdrop" role="dialog" aria-modal="true">
      <div className="cycle-modal">
        <div className="cycle-modal-head">
          <div><span>{mode === "log" ? "CATAT MENSTRUASI" : "PENGATURAN SIKLUS"}</span><h3>{mode === "log" ? "Catat menstruasi terakhirmu" : "Atur siklusmu"}</h3></div>
          <button type="button" onClick={onClose} aria-label="Tutup"><X size={18}/></button>
        </div>
        <div className="cycle-form">
          <label><span>Hari pertama menstruasi terakhir</span><input type="date" value={form.lastPeriodDate} onChange={(e) => setForm({ ...form, lastPeriodDate: e.target.value })}/></label>
          {mode === "edit" && <>
            <label><span>Rata-rata panjang siklus</span><input type="number" min={20} max={45} value={form.cycleLength} onChange={(e) => setForm({ ...form, cycleLength: Number(e.target.value) })}/></label>
            <label><span>Durasi menstruasi biasanya</span><input type="number" min={1} max={10} value={form.periodLength} onChange={(e) => setForm({ ...form, periodLength: Number(e.target.value) })}/></label>
          </>}
        </div>
        {error && <p className="cycle-form-error">{error}</p>}
        <button type="button" className="cycle-save-btn" onClick={save}>{mode === "log" ? "Simpan tanggal menstruasi" : "Simpan pengaturan siklus"}</button>
      </div>
    </div>
  );
}
