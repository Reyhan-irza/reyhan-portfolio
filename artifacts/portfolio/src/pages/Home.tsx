import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TechnologyBands from "@/components/TechnologyBands";
import AboutSection from "@/components/AboutSection";
import JourneySection from "@/components/JourneySection";
import AwardSection from "@/components/AwardSection";
import RoadmapSection from "@/components/RoadmapSection";
import ProjectsSection from "@/components/ProjectsSection";
import GitHubSection from "@/components/GitHubSection";
import ContactSection from "@/components/ContactSection";
import PortfolioRatingSection from "@/components/PortfolioRatingSection";
import Footer from "@/components/Footer";
import AchievementToast from "@/components/AchievementToast";
import { unlockAchievement, ACHIEVEMENTS } from "@/lib/achievement";
import { recordVisit } from "@/lib/adminAuth";
import { gsap, ScrollTrigger } from "../lib/motion";
import { useLenis } from "../hooks/useLenis";
import IntroAnimation from "@/components/IntroAnimation";
import SectionBoundary from "@/components/SectionBoundary";
import { LazyMotion, domAnimation } from "framer-motion";
import Reveal from "@/components/Reveal";

const SecondaryArchive = lazy(() => import("@/components/SecondaryArchive"));

export default function Home() {
  useLenis();
  const [introFinished, setIntroFinished] = useState(false);
  const [archiveVisited, setArchiveVisited] = useState(false);
  const finishIntro = useCallback(() => setIntroFinished(true), []);

  const footerRef   = useRef<HTMLDivElement>(null);
  const bottomFired = useRef(false);
  const visitFired  = useRef(false);

  useLayoutEffect(() => {
    if (!introFinished) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        document.querySelectorAll<HTMLElement>(".portfolio-section-heading, .projects-title").forEach((heading) => {
          gsap.fromTo(heading, { x: -16 }, {
            x: 0, ease: "none",
            scrollTrigger: { trigger: heading, start: "top bottom", end: "top 65%", scrub: .35 },
          });
        });
      });
      return () => context.revert();
    });
    return () => media.revert();
  }, [introFinished]);

  /* Keep the existing bottom-of-page achievement, but let GSAP own the trigger. */
  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 82%",
        onEnter: () => {
          if (bottomFired.current) return;
          bottomFired.current = true;
          unlockAchievement(ACHIEVEMENTS.SCROLL_BOTTOM);
        },
      });
    }, el);
    return () => context.revert();
  }, []);

  /* Record visitor to Supabase once per session */
  useEffect(() => {
    if (!visitFired.current) {
      visitFired.current = true;
      recordVisit();
    }
  }, []);

  return (
    <LazyMotion features={domAnimation}>
    <div className="portfolio-shell relative min-h-[100dvh]">
      <a className="skip-to-content" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="relative z-10">
        <HeroSection ready={introFinished} />
        <TechnologyBands />
        <section id="proof" className="proof-strip px-6" aria-label="Portfolio overview">
          <Reveal className="mx-auto grid max-w-6xl grid-cols-1 border-y border-[rgba(33,31,27,.16)] sm:grid-cols-3">
            <div className="proof-item">
              <span className="proof-index">01</span>
              <strong>Tiga proyek, tiga kebutuhan</strong>
              <span>TJKT, VIREON Library and Reyhan WhatsApp Portfolio.</span>
            </div>
            <div className="proof-item">
              <span className="proof-index">02</span>
              <strong>Belajar lewat eksperimen</strong>
              <span>Kode, AI, dan teknologi web dalam proyek sehari-hari.</span>
            </div>
            <div className="proof-item">
              <span className="proof-index">03</span>
              <strong>Pengalaman kompetisi</strong>
              <span>Juara 2 CTF; Juara 1 LKS IT Software Solution For Business.</span>
            </div>
          </Reveal>
        </section>
        <SectionBoundary variant="trace" />
        <AboutSection />
        <ProjectsSection />
        <SectionBoundary variant="return" />
        <JourneySection />
        <AwardSection />
        <RoadmapSection />
        <SectionBoundary variant="trace" />
        <GitHubSection />
        <SectionBoundary variant="resolve" />
        <div className="portfolio-closing-zone">
          <ContactSection />
          <PortfolioRatingSection />
          <details className="secondary-archive mx-auto max-w-6xl" onToggle={(event) => {
            if (event.currentTarget.open) setArchiveVisited(true);
          }}>
            <summary data-testid="button-open-secondary-archive">
              <span>Arsip lainnya</span>
              <span>News · music · comments</span>
            </summary>
            {archiveVisited && (
              <Suspense fallback={<div className="secondary-archive-content space-y-4 py-8" role="status" aria-label="Loading news and community features">
                <div className="h-2 w-28 animate-pulse bg-white/10" />
                <div className="h-28 animate-pulse border border-white/[.07] bg-white/[.025]" />
              </div>}>
                <SecondaryArchive />
              </Suspense>
            )}
          </details>
        </div>
      </main>
      <div className="relative z-10" ref={footerRef}>
        <Footer />
        </div>
      <AchievementToast />
      {!introFinished && <IntroAnimation onFinish={finishIntro} />}
    </div>
    </LazyMotion>
  );
}
