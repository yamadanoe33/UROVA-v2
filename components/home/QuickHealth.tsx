import Link from "next/link";
import { ArrowRight, Droplet, Moon, ShieldAlert, Stethoscope } from "lucide-react";

export default function QuickHealth() {
  return (
    <section className="quick-grid">
      <article className="quick-card hydration"><div className="quick-icon"><Droplet size={22}/></div><div><span>Pengingat sederhana</span><h3>Cukupi hidrasi hari ini</h3><p>Kebutuhan cairan tiap orang berbeda. Dengarkan tubuhmu dan perhatikan warna urine.</p></div></article>
      <article className="quick-card sleep"><div className="quick-icon"><Moon size={22}/></div><div><span>Kebiasaan sehat</span><h3>Tidur juga bagian dari pemulihan</h3><p>Istirahat cukup mendukung kesehatan fisik dan keseimbangan tubuh.</p></div></article>
      <article className="danger-card"><div className="danger-title"><ShieldAlert size={22}/><div><span>Butuh perhatian?</span><h3>Kenali tanda bahaya</h3></div></div><p>Nyeri hebat tiba-tiba, perdarahan tidak biasa, demam tinggi, sulit BAK, atau pembengkakan akut perlu evaluasi tenaga kesehatan.</p><Link href="/cek-keluhan">Lihat panduan <ArrowRight size={16}/></Link></article>
      <article className="doctor-card"><div><Stethoscope size={24}/><span>Bantuan profesional</span><h3>Perlu diperiksa langsung?</h3><p>Cari layanan kesehatan di sekitar lokasi kamu.</p></div><Link href="/layanan-kesehatan">Cari layanan <ArrowRight size={16}/></Link></article>
    </section>
  );
}
