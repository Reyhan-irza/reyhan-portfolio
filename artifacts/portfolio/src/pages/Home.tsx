import { useEffect, useRef } from "react";
import MusicController from "@/components/MusicController";
import AuroraBackground from "@/components/AuroraBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import JourneySection from "@/components/JourneySection";
import AwardSection from "@/components/AwardSection";
import RoadmapSection from "@/components/RoadmapSection";
import NewsSection from "@/components/NewsSection";
import MusicSection from "@/components/MusicSection";
import ProjectsSection from "@/components/ProjectsSection";
import GitHubSection from "@/components/GitHubSection";
import ContactSection from "@/components/ContactSection";
import CommentsSection from "@/components/CommentsSection";
import Footer from "@/components/Footer";
import AchievementToast from "@/components/AchievementToast";
import RoastButton from "@/components/RoastButton";
import TerminalMode from "@/components/TerminalMode";
import { unlockAchievement, ACHIEVEMENTS } from "@/lib/achievement";
import { recordVisit } from "@/lib/adminAuth";
import { useLenis } from "../hooks/useLenis";

const Divider = () => <div className="editorial-divider max-w-6xl mx-auto" aria-hidden="true" />;

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
        <div className="relative z-10">
          <Navbar />
          <HeroSection />
          <Divider />
          <AboutSection />
          <Divider />
          <JourneySection />
          <Divider />
          <AwardSection />
          <Divider />
          <RoadmapSection />
          <Divider />
          <NewsSection />
          <Divider />
          <MusicSection />
          <Divider />
          <ProjectsSection />
          <Divider />
          <GitHubSection />
          <Divider />
          <ContactSection />
          <Divider />
          <CommentsSection />
          <div ref={footerRef}>
            <Footer />
          </div>
        </div>
      <AchievementToast />
      <RoastButton />
      <TerminalMode />
      <MusicController />
    </div>
  );
}
