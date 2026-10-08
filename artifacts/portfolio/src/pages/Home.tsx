import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import AuroraBackground from "@/components/AuroraBackground";
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
import Footer from "@/components/Footer";
import AchievementToast from "@/components/AchievementToast";
import { unlockAchievement, ACHIEVEMENTS } from "@/lib/achievement";
import { recordVisit } from "@/lib/adminAuth";
import { gsap, ScrollTrigger } from "../lib/motion";
import { useLenis } from "../hooks/useLenis";
import { useScrollAnim } from "../hooks/useScrollAnim";
import IntroAnimation from "@/components/IntroAnimation";

const SecondaryArchive = lazy(() => import("@/components/SecondaryArchive"));

const Divider = () => <div className="editorial-divider mx-auto max-w-6xl" aria-hidden="true" />;

export default function Home() {
  useLenis();
  const [introFinished, setIntroFinished] = useState(false);
  const [archiveVisited, setArchiveVisited] = useState(false);
  const finishIntro = useCallback(() => setIntroFinished(true), []);

  const proofRef = useScrollAnim<HTMLDivElement>({ threshold: 0.12, stagger: 0.09, distance: 16 });
  const footerRef   = useRef<HTMLDivElement>(null);
  const bottomFired = useRef(false);
  const visitFired  = useRef(false);

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
    <div className="portfolio-shell relative min-h-[100dvh]">
      <AuroraBackground />
      <a className="skip-to-content" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="relative z-10">
        <HeroSection />
        <TechnologyBands />
        <section id="proof" className="proof-strip px-6" aria-label="Portfolio overview">
          <div ref={proofRef} className="mx-auto grid max-w-6xl grid-cols-1 border-y border-[rgba(33,31,27,.16)] sm:grid-cols-3">
            <div className="proof-item" data-motion-item>
              <span className="proof-index">01</span>
              <strong>Three projects I’ve built</strong>
              <span>TJKT, VIREON Library and Reyhan WhatsApp Portfolio.</span>
            </div>
            <div className="proof-item" data-motion-item>
              <span className="proof-index">02</span>
              <strong>React / TypeScript practice</strong>
              <span>Web projects and experiments built as I learn.</span>
            </div>
            <div className="proof-item" data-motion-item>
              <span className="proof-index">03</span>
              <strong>Competition results</strong>
              <span>CTF Competition · 2nd place; LKS IT Software Solution For Business · Juara I.</span>
            </div>
          </div>
        </section>
        <Divider />
        <AboutSection />
        <ProjectsSection />
        <Divider />
        <JourneySection />
        <AwardSection />
        <RoadmapSection />
        <Divider />
        <GitHubSection />
        <Divider />
        <ContactSection />
        <details className="secondary-archive mx-auto max-w-6xl" onToggle={(event) => {
          if (event.currentTarget.open) setArchiveVisited(true);
        }}>
          <summary data-testid="button-open-secondary-archive">
            <span>Secondary archive</span>
            <span>Updates · music · comments</span>
          </summary>
          {archiveVisited && (
            <Suspense fallback={<div className="secondary-archive-content space-y-4 py-8" role="status" aria-label="Loading updates and community features">
              <div className="h-2 w-28 animate-pulse bg-white/10" />
              <div className="h-28 animate-pulse border border-white/[.07] bg-white/[.025]" />
            </div>}>
              <SecondaryArchive />
            </Suspense>
          )}
        </details>
      </main>
      <div className="relative z-10" ref={footerRef}>
        <Footer />
        </div>
      <AchievementToast />
      {!introFinished && <IntroAnimation onFinish={finishIntro} />}
    </div>
  );
}
