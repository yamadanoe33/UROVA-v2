import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UROVA | Sahabat Kesehatan Urologi & Reproduksi",
  description: "Platform edukasi dan pendampingan kesehatan urologi dan reproduksi untuk remaja.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
