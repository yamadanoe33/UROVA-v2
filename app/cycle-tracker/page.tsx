import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import CycleTracker from "@/components/cycle-tracker/CycleTracker";
import { Bell, Search } from "lucide-react";

export default function CycleTrackerPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content cycle-page">
        <header className="topbar">
          <div><p>Pantau siklus bersama UROVA</p><h2>Cycle Tracker</h2></div>
          <div className="topbar-actions">
            <div className="search-button"><Search size={17}/> Cari topik kesehatan...</div>
            <button className="icon-button" aria-label="Notifikasi"><Bell size={17}/></button>
            <div className="avatar">UR</div>
          </div>
        </header>
        <CycleTracker />
        <footer className="footer"><div><strong>UROVA</strong> — Urology & Reproductive Health</div><div>Perkiraan siklus bersifat edukatif · Bukan alat diagnosis atau kontrasepsi</div></footer>
      </main>
      <MobileNav />
    </div>
  );
}
