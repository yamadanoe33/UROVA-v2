import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import MythFactGame from "@/components/myth-fact/MythFactGame";
import { Bell, Search } from "lucide-react";

export default function MythFactPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content myth-page">
        <header className="topbar">
          <div>
            <p>Belajar interaktif bersama UROVA</p>
            <h2>Mitos &amp; Fakta</h2>
          </div>
          <div className="topbar-actions">
            <div className="search-button"><Search size={17} /> Cari topik kesehatan...</div>
            <button className="icon-button" aria-label="Notifikasi"><Bell size={17} /></button>
            <div className="avatar">UR</div>
          </div>
        </header>

        <MythFactGame />

        <footer className="footer">
          <div><strong>UROVA</strong> — Urology &amp; Reproductive Health</div>
          <div>Edukasi interaktif · Bukan pengganti diagnosis tenaga kesehatan</div>
        </footer>
      </main>
      <MobileNav />
    </div>
  );
}
