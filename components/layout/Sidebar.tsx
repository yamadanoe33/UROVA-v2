"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Bot, CalendarDays, HeartPulse, Home, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import Brand from "./Brand";

const items = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/education", label: "Edukasi", icon: BookOpenText },
  { href: "/urova-ai", label: "UROVA AI", icon: Bot },
  { href: "/cycle-tracker", label: "Cycle Tracker", icon: CalendarDays },
  { href: "/cek-keluhan", label: "Cek Keluhan", icon: HeartPulse },
  { href: "/mitos-fakta", label: "Mitos & Fakta", icon: Sparkles },
  { href: "/layanan-kesehatan", label: "Layanan", icon: MapPin },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Brand />
      <nav className="side-nav" aria-label="Navigasi utama">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link className={`side-link ${active ? "active" : ""}`} href={href} key={href}>
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-note">
        <ShieldCheck size={20} />
        <div><strong>Privasi dijaga</strong><span>Informasi kesehatanmu tidak ditampilkan ke publik.</span></div>
      </div>
    </aside>
  );
}
