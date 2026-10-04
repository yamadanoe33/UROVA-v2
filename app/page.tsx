import FeatureGrid from "@/components/home/FeatureGrid";
import Hero from "@/components/home/Hero";
import QuickHealth from "@/components/home/QuickHealth";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";
import { Bell, Search } from "lucide-react";

export default function HomePage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div><p>Selamat datang di</p><h2>UROVA Health Space</h2></div>
          <div className="topbar-actions"><button className="search-button" aria-label="Cari"><Search size={19}/><span>Cari topik kesehatan...</span></button><button className="icon-button" aria-label="Notifikasi"><Bell size={19}/></button><div className="avatar">UR</div></div>
        </header>
        <Hero />
        <FeatureGrid />
        <QuickHealth />
        <footer className="footer"><strong>UROVA</strong><span>Informasi di UROVA bersifat edukatif dan bukan pengganti konsultasi medis.</span></footer>
      </main>
      <MobileNav />
    </div>
  );
}
