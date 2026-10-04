import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, ShieldAlert, Sparkles } from "lucide-react";
import { getRelatedArticles, type EducationArticle as Article } from "@/lib/education-data";

type Props = { article: Article };

export default function EducationArticle({ article }: Props) {
  const related = getRelatedArticles(article);
  return (
    <>
      <section className="article-back"><Link href="/education"><ArrowLeft size={16}/> Kembali ke Education Hub</Link></section>
      <article className="article-shell">
        <header className="article-hero">
          <div className="article-icon">{article.icon}</div>
          <div className="article-meta"><span>{article.category}</span><span><Clock3 size={14}/>{article.readTime}</span><span>{article.level}</span></div>
          <h1>{article.title}</h1>
          <p>{article.introduction}</p>
        </header>

        <div className="article-layout">
          <div className="article-main">
            <section className="article-keypoints">
              <span className="section-kicker">RINGKASAN</span><h2>Yang perlu kamu ingat</h2>
              <div className="article-key-grid">{article.keyPoints.map((point) => <div key={point}><span>✓</span><p>{point}</p></div>)}</div>
            </section>

            {article.sections.map((section, index) => (
              <section className="article-section-card" key={`${section.title}-${index}`}>
                <span className="article-num">{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2>
                <div>{section.content.map((text) => <p key={text}>{text}</p>)}</div>
              </section>
            ))}

            {article.tips?.length ? <section className="article-tip-card"><span><Sparkles size={18}/> TIPS PRAKTIS</span><h2>Kebiasaan yang bisa dicoba</h2><ul>{article.tips.map((tip) => <li key={tip}><b>✓</b>{tip}</li>)}</ul></section> : null}

            {article.warningSigns?.length ? <section className="article-warning"><div className="article-warning-title"><ShieldAlert size={22}/><div><span>TANDA BAHAYA</span><h2>Jangan tunda mencari bantuan jika...</h2></div></div><div className="warning-list">{article.warningSigns.map((item) => <div key={item}>! <span>{item}</span></div>)}</div></section> : null}
          </div>

          <aside className="article-aside">
            <div className="aside-card"><span className="section-kicker">NAVIGASI</span><h3>Di halaman ini</h3>{article.sections.map((section, i) => <div key={section.title}><span>{i + 1}</span>{section.title}</div>)}</div>
            <div className="aside-card aside-safe"><strong>Ingat</strong><p>Informasi ini untuk edukasi umum dan tidak menggantikan diagnosis tenaga kesehatan.</p><Link href="/cek-keluhan">Cek keluhan awal <ArrowRight size={15}/></Link></div>
          </aside>
        </div>
      </article>

      {related.length ? <section className="related-section"><div className="edu-section-title"><div><span className="section-kicker">LANJUT BELAJAR</span><h2>Materi terkait</h2></div></div><div className="related-grid">{related.map((item) => <Link href={`/education/${item.slug}`} key={item.slug}><span>{item.icon}</span><div><small>{item.category}</small><h3>{item.title}</h3><p>{item.description}</p></div><ArrowRight size={17}/></Link>)}</div></section> : null}
    </>
  );
}
