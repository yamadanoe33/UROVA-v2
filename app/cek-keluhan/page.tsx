import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import SymptomChecker from "@/components/symptom-check/SymptomChecker";
import { Bell, Search } from "lucide-react";

export default function SymptomCheckPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content symptom-page">
        <header className="topbar">
          <div><p>Skrining awal bersama UROVA</p><h2>Cek Keluhan</h2></div>
          <div className="topbar-actions"><div className="search-button"><Search size={17}/> Cari topik kesehatan...</div><button className="icon-button" aria-label="Notifikasi"><Bell size={17}/></button><div className="avatar">UR</div></div>
        </header>
        <SymptomChecker />
        <footer className="footer"><div><strong>UROVA</strong> — Urology & Reproductive Health</div><div>Skrining awal bersifat edukatif · Bukan pengganti diagnosis tenaga kesehatan</div></footer>
      </main>
      <MobileNav />
    </div>
  );
}
