import { useState, useEffect, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import IntroPage from "@/components/IntroPage";
import MusicController from "@/components/MusicController";
import AuroraBackground from "@/components/AuroraBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import JourneySection from "@/components/JourneySection";
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

const Divider = () => <div className="rgb-divider max-w-6xl mx-auto px-6" />;

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [introDone,   setIntroDone]   = useState(false);

  const footerRef   = useRef<HTMLDivElement>(null);
  const bottomFired = useRef(false);
  const visitFired  = useRef(false);

  /* Footer achievement */
  useEffect(() => {
    const el = footerRef.current;
    if (!el || !introDone) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !bottomFired.current) {
        bottomFired.current = true;
        unlockAchievement(ACHIEVEMENTS.SCROLL_BOTTOM);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [introDone]);

  /* Music section achievement */
  useEffect(() => {
    if (!introDone) return;
    const el = document.getElementById("music");
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { unlockAchievement(ACHIEVEMENTS.MUSIC_LOVER); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [introDone]);

  /* Record visitor to Supabase once per session */
  useEffect(() => {
    if (introDone && !visitFired.current) {
      visitFired.current = true;
      recordVisit();
    }
  }, [introDone]);

  /* Enter from intro: start music */
  const handleIntroEnter = () => {
    setIntroDone(true);
    window.dispatchEvent(new Event("music:play"));
  };

  return (
    <>
      {!loadingDone && <LoadingScreen onFinish={() => setLoadingDone(true)} />}
      {loadingDone && !introDone && <IntroPage onEnter={handleIntroEnter} />}

      <div className={`relative min-h-screen ${introDone ? "main-fade-in" : "opacity-0 pointer-events-none"}`}>
        <AuroraBackground />
        <div className="relative z-10">
          <Navbar />
          <HeroSection />
          <Divider />
          <StatsSection />
          <Divider />
          <AboutSection />
          <Divider />
          <JourneySection />
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
      </div>

      {/*
        ─── Global overlays OUTSIDE animated wrapper ───
        transform on parent breaks `position: fixed` children.
      */}
      <AchievementToast />
      {introDone && <RoastButton />}
      {introDone && <TerminalMode />}
      {loadingDone && <MusicController />}
    </>
  );
}
