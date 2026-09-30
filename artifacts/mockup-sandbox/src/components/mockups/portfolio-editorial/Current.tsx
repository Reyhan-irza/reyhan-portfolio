import "./_group.css";
import { useEffect, useRef } from "react";
import MusicController from "./_shared/components/MusicController";
import AuroraBackground from "./_shared/components/AuroraBackground";
import Navbar from "./_shared/components/Navbar";
import HeroSection from "./_shared/components/HeroSection";
import AboutSection from "./_shared/components/AboutSection";
import JourneySection from "./_shared/components/JourneySection";
import AwardSection from "./_shared/components/AwardSection";
import RoadmapSection from "./_shared/components/RoadmapSection";
import NewsSection from "./_shared/components/NewsSection";
import MusicSection from "./_shared/components/MusicSection";
import ProjectsSection from "./_shared/components/ProjectsSection";
import GitHubSection from "./_shared/components/GitHubSection";
import ContactSection from "./_shared/components/ContactSection";
import CommentsSection from "./_shared/components/CommentsSection";
import Footer from "./_shared/components/Footer";
import AchievementToast from "./_shared/components/AchievementToast";
import RoastButton from "./_shared/components/RoastButton";
import TerminalMode from "./_shared/components/TerminalMode";
import { unlockAchievement, ACHIEVEMENTS } from "./_shared/lib/achievement";
import { recordVisit } from "./_shared/lib/adminAuth";
import { useLenis } from "./_shared/hooks/useLenis";

const Divider = () => <div className="editorial-divider mx-auto max-w-6xl" aria-hidden="true" />;

export default function Home() {
  useLenis();

  const footerRef   = useRef<HTMLDivElement>(null);
  const bottomFired = useRef(false);
  const visitFired  = useRef(false);

  /* Footer achievement */
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !bottomFired.current) {
        bottomFired.current = true;
        unlockAchievement(ACHIEVEMENTS.SCROLL_BOTTOM);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Music section achievement */
  useEffect(() => {
    const el = document.getElementById("music");
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { unlockAchievement(ACHIEVEMENTS.MUSIC_LOVER); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
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
        <Divider />
        <AboutSection />
        <ProjectsSection />
        <Divider />
        <JourneySection />
        <AwardSection />
        <RoadmapSection />
        <Divider />
        <GitHubSection />
        <NewsSection />
        <MusicSection />
        <Divider />
        <ContactSection />
        <CommentsSection />
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
