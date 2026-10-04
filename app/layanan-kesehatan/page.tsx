import { Bell, Search } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import HealthServices from "@/components/health-services/HealthServices";

export default function HealthServicesPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div><p>Bantuan di sekitarmu</p><h2>Layanan Kesehatan</h2></div>
          <div className="topbar-actions"><div className="search-button"><Search size={17}/> Cari fasilitas terdekat</div><button className="icon-button" aria-label="Notifikasi"><Bell size={17}/></button><div className="avatar">UR</div></div>
        </header>
        <HealthServices />
        <footer className="footer"><div><strong>UROVA</strong> · Urology & Reproductive Health</div><div>Informasi lokasi dipakai untuk pencarian saat ini · Bukan pengganti layanan darurat</div></footer>
      </main>
      <MobileNav />
    </div>
  );
}
