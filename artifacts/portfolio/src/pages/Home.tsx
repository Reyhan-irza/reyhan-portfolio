import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MusicController from "@/components/MusicController";
import AuroraBackground from "@/components/AuroraBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import JourneySection from "@/components/JourneySection";
import AwardSection from "@/components/AwardSection";
import RoadmapSection from "@/components/RoadmapSection";
import ProjectsSection from "@/components/ProjectsSection";
import GitHubSection from "@/components/GitHubSection";
import ContactSection from "@/components/ContactSection";
import NewsSection from "@/components/NewsSection";
import MusicSection from "@/components/MusicSection";
import CommentsSection from "@/components/CommentsSection";
import Footer from "@/components/Footer";
import AchievementToast from "@/components/AchievementToast";
import RoastButton from "@/components/RoastButton";
import TerminalMode from "@/components/TerminalMode";
import { unlockAchievement, ACHIEVEMENTS } from "@/lib/achievement";
import { recordVisit } from "@/lib/adminAuth";
import { useLenis } from "../hooks/useLenis";

gsap.registerPlugin(ScrollTrigger);

const Divider = () => <div className="editorial-divider mx-auto max-w-6xl" aria-hidden="true" />;

export default function Home() {
  useLenis();

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
        <section id="proof" className="proof-strip px-6" aria-label="Portfolio record">
          <div className="mx-auto grid max-w-6xl grid-cols-1 border-y border-[rgba(33,31,27,.16)] sm:grid-cols-3">
            <div className="proof-item">
              <span className="proof-index">01</span>
              <strong>Three shipped builds</strong>
              <span>TJKT, VIREON Library and Reyhan WhatsApp Portfolio.</span>
            </div>
            <div className="proof-item">
              <span className="proof-index">02</span>
              <strong>React / TypeScript practice</strong>
              <span>Interfaces, connected flows and documented iteration.</span>
            </div>
            <div className="proof-item">
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
          </div>
        </details>
      </main>
      <div className="relative z-10" ref={footerRef}>
        <Footer />
        </div>
      <AchievementToast />
      <RoastButton />
      <TerminalMode />
      <MusicController />
    </div>
  );
}
