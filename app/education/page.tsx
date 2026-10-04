import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import EducationHub from "@/components/education/EducationHub";
import { Search, Bell } from "lucide-react";

export default function EducationPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div><p>Belajar bersama UROVA</p><h2>Education Hub</h2></div>
          <div className="topbar-actions"><div className="search-button"><Search size={17}/> Cari topik kesehatan...</div><button className="icon-button"><Bell size={17}/></button><div className="avatar">UR</div></div>
        </header>
        <EducationHub />
        <footer className="footer"><div><strong>UROVA</strong> — Urology & Reproductive Health</div><div>Materi edukasi umum · Bukan pengganti diagnosis medis</div></footer>
      </main>
      <MobileNav />
    </div>
  );
}
