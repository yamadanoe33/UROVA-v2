import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";
import UrovaAI from "@/components/urova-ai/UrovaAI";

export default function UrovaAIPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content urova-ai-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Asisten kesehatan digital</p>
            <h1>UROVA AI</h1>
          </div>
          <span className="phase-pill">Phase 7 · GPT</span>
        </header>
        <UrovaAI />
      </main>
      <MobileNav />
    </div>
  );
}
