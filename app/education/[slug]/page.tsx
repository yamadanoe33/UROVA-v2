import { notFound } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import EducationArticle from "@/components/education/EducationArticle";
import { educationArticles, getEducationArticle } from "@/lib/education-data";

export function generateStaticParams() {
  return educationArticles.map((article) => ({ slug: article.slug }));
}

export default async function EducationArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getEducationArticle(slug);
  if (!article) notFound();
  return <div className="app-shell"><Sidebar/><main className="main-content article-page"><EducationArticle article={article}/><footer className="footer"><div><strong>UROVA</strong> — Urology & Reproductive Health</div><div>Materi edukasi umum · Bukan pengganti diagnosis medis</div></footer></main><MobileNav/></div>;
}
