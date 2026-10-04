import Link from "next/link";
import { ArrowUpRight, BookOpenText, Bot, CalendarDays, HeartPulse, MapPin, Sparkles } from "lucide-react";

const features = [
  { href: "/education", title: "Edukasi Kesehatan", desc: "Pelajari ginjal, saluran kemih, pubertas, menstruasi, dan kesehatan reproduksi.", icon: BookOpenText, tag: "Belajar" },
  { href: "/urova-ai", title: "UROVA AI", desc: "Tanyakan hal yang membuatmu bingung dalam bahasa yang mudah dipahami.", icon: Bot, tag: "AI" },
  { href: "/cycle-tracker", title: "Cycle Tracker", desc: "Catat menstruasi, gejala, dan pola siklus secara praktis.", icon: CalendarDays, tag: "Tracker" },
  { href: "/cek-keluhan", title: "Cek Keluhan", desc: "Pilih gejala untuk mendapatkan arahan pencegahan, pemulihan awal, dan tanda bahaya.", icon: HeartPulse, tag: "Screening" },
  { href: "/mitos-fakta", title: "Mitos atau Fakta?", desc: "Uji pengetahuanmu melalui kartu interaktif dan penjelasan singkat.", icon: Sparkles, tag: "Quiz" },
  { href: "/layanan-kesehatan", title: "Layanan Kesehatan", desc: "Temukan rumah sakit, klinik, atau puskesmas terdekat ketika dibutuhkan.", icon: MapPin, tag: "Nearby" },
];

export default function FeatureGrid() {
  return (
    <section className="section-block">
      <div className="section-heading"><div><span className="section-kicker">FITUR UROVA</span><h2>Satu tempat untuk perjalanan kesehatanmu</h2></div><p>Mulai dari belajar sampai mencari bantuan profesional.</p></div>
      <div className="feature-grid">
        {features.map(({ href, title, desc, icon: Icon, tag }) => (
          <Link className="feature-card" href={href} key={href}>
            <div className="feature-top"><div className="feature-icon"><Icon size={23}/></div><span className="feature-tag">{tag}</span></div>
            <h3>{title}</h3><p>{desc}</p>
            <div className="feature-open">Buka fitur <ArrowUpRight size={17}/></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
