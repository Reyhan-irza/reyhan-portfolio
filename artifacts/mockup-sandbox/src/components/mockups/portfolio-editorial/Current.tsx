import "./_group.css";
import { useEffect, useLayoutEffect, useRef } from "react";
import MusicController from "./_shared/components/MusicController";
import AuroraBackground from "./_shared/components/AuroraBackground";
import Navbar from "./_shared/components/Navbar";
import HeroSection from "./_shared/components/HeroSection";
import AboutSection from "./_shared/components/AboutSection";
import JourneySection from "./_shared/components/JourneySection";
import AwardSection from "./_shared/components/AwardSection";
import RoadmapSection from "./_shared/components/RoadmapSection";
import ProjectsSection from "./_shared/components/ProjectsSection";
import GitHubSection from "./_shared/components/GitHubSection";
import ContactSection from "./_shared/components/ContactSection";
import NewsSection from "./_shared/components/NewsSection";
import MusicSection from "./_shared/components/MusicSection";
import CommentsSection from "./_shared/components/CommentsSection";
import Footer from "./_shared/components/Footer";
import AchievementToast from "./_shared/components/AchievementToast";
import RoastButton from "./_shared/components/RoastButton";
import TerminalMode from "./_shared/components/TerminalMode";
import { unlockAchievement, ACHIEVEMENTS } from "./_shared/lib/achievement";
import { recordVisit } from "./_shared/lib/adminAuth";
import { gsap, ScrollTrigger } from "./_shared/lib/motion";
import { useLenis } from "./_shared/hooks/useLenis";
import { useScrollAnim } from "./_shared/hooks/useScrollAnim";

const Divider = () => <div className="editorial-divider mx-auto max-w-6xl" aria-hidden="true" />;

export default function Current() {
  useLenis();

  const proofRef = useScrollAnim<HTMLDivElement>({ threshold: 0.12, stagger: 0.09, distance: 16 });
  const footerRef = useRef<HTMLDivElement>(null);
  const bottomFired = useRef(false);
  const visitFired = useRef(false);

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

  /* Visitor recording is intentionally disabled in this standalone mockup. */
  useEffect(() => {
    if (!visitFired.current) {
      visitFired.current = true;
      recordVisit();
    }
  }, []);

  return (
    <div className="portfolio-shell relative min-h-screen min-h-[100dvh]">
      <AuroraBackground />
      <a className="skip-to-content" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="relative z-10">
        <HeroSection />
        <section id="proof" className="proof-strip px-6" aria-label="Portfolio record">
          <div ref={proofRef} className="mx-auto grid max-w-6xl grid-cols-1 border-y border-[rgba(33,31,27,.16)] sm:grid-cols-3">
            <div className="proof-item" data-motion-item>
              <span className="proof-index">01</span>
              <strong>Three shipped builds</strong>
              <span>TJKT, VIREON Library and Reyhan WhatsApp Portfolio.</span>
            </div>
            <div className="proof-item" data-motion-item>
              <span className="proof-index">02</span>
              <strong>React / TypeScript practice</strong>
              <span>Interfaces, connected flows and documented iteration.</span>
            </div>
            <div className="proof-item" data-motion-item>
              <span className="proof-index">03</span>
              <strong>Recognition on record</strong>
              <span>Juara I, LKS IT Software Solution For Business.</span>
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
        <details className="secondary-archive mx-auto max-w-6xl">
          <summary data-testid="button-open-secondary-archive">
            <span>Secondary archive</span>
            <span>Updates · music · comments</span>
          </summary>
          <div className="secondary-archive-content">
            <NewsSection />
            <MusicSection />
            <CommentsSection />
            <div className="secondary-archive-tools" aria-label="Portfolio extras">
              <span className="secondary-archive-tools-label">Small extras</span>
              <RoastButton />
              <TerminalMode />
              <MusicController />
            </div>
          </div>
        </details>
      </main>
      <div className="relative z-10" ref={footerRef}>
        <Footer />
      </div>
      <AchievementToast />
    </div>
  );
}
