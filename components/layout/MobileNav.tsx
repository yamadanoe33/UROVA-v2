"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Bot, HeartPulse, Home, MapPin } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/education", label: "Edukasi", icon: BookOpenText },
  { href: "/urova-ai", label: "AI", icon: Bot },
  { href: "/cek-keluhan", label: "Keluhan", icon: HeartPulse },
  { href: "/layanan-kesehatan", label: "Layanan", icon: MapPin },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-nav" aria-label="Navigasi mobile">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return <Link className={active ? "active" : ""} href={href} key={href}><Icon size={20}/><span>{label}</span></Link>;
      })}
    </nav>
  );
}
