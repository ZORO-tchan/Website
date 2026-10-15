import { Header } from "@/components/Header";
import { ExplodedHero } from "@/components/ExplodedHero";
import { TechnicalSpecs } from "@/components/TechnicalSpecs";
import { MacroPhotographyBand } from "@/components/MacroPhotographyBand";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060606] text-[#EDE8E0] relative selection:bg-[#C9A05C]/20 selection:text-[#EDE8E0]">
      {/* Subtle fine film grain */}
      <div className="grain-overlay" />

      {/* Whisper-thin fixed header */}
      <Header />

      {/* The Hero Mechanic: Pinned ~350vh Interactive Canvas Scrubbing */}
      <div id="the-device">
        <ExplodedHero totalFrames={192} />
      </div>

      {/* Post-Pin Scroll Sections */}
      {/* 1. جدول الأعطال الفنية (مكتبة الأعطال) */}
      <TechnicalSpecs />

      {/* 2. شريط التواصل الفني والصورة المقربة مع أزرار واتساب والمحمول المباشرة */}
      <MacroPhotographyBand />

      {/* Footer */}
      <Footer />
    </main>
  );
}
