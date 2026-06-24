import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MessageSquare, X, Sparkles, Music, Coffee, Home, Bug, Download, ArrowRight } from "lucide-react";
import { SiReact, SiTypescript, SiNodedotjs, SiNextdotjs, SiTailwindcss, SiSupabase } from "react-icons/si";
import { useScrollAnim } from "../hooks/useScrollAnim";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";
import GuessMyAge from "./GuessMyAge";

const CV_URL = "/cv.pdf";
const PROFILE_PHOTO_URL = "/profile.jpg";

const PHRASES = [
  "Frontend Developer",
  "Full-Stack Developer",
  "Digital Builder",
  "Future Real Estate Investor",
];

const techSkills = [
  { label: "React",       Icon: SiReact,       color: "text-cyan-400"    },
  { label: "TypeScript",  Icon: SiTypescript,  color: "text-blue-400"    },
  { label: "Node.js",     Icon: SiNodedotjs,   color: "text-green-400"   },
  { label: "Next.js",     Icon: SiNextdotjs,   color: "text-white/70"    },
  { label: "TailwindCSS", Icon: SiTailwindcss, color: "text-sky-400"     },
  { label: "Supabase",    Icon: SiSupabase,    color: "text-emerald-400" },
];

export default function HeroSection() {
  /* ── Typing animation ── */
  const [phraseIdx,  setPhraseIdx]  = useState(0);
  const [displayed,  setDisplayed]  = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const target = PHRASES[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting) {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 65);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
      } else {
        setIsDeleting(false);
        setPhraseIdx((i) => (i + 1) % PHRASES.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, phraseIdx]);

  /* ── Easter egg ── */
  const [clickCount, setClickCount] = useState(0);
  const [showEaster, setShowEaster] = useState(false);
  const [shaking,    setShaking]    = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAvatarClick = useCallback(() => {
    setClickCount((n) => {
      const next = n + 1;
      if (next >= 5) {
        setShowEaster(true);
        unlockAchievement(ACHIEVEMENTS.EASTER_EGG);
        return 0;
      }
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(() => setClickCount(0), 3000);
      return next;
    });
  }, []);

  /* ── Achievement on first scroll ── */
  const didFire = useRef(false);
  const badgeRef = useScrollAnim({ threshold: 0.1, delay: 0   });
  const nameRef  = useScrollAnim({ threshold: 0.1, delay: 100 });
  const subRef   = useScrollAnim({ threshold: 0.1, delay: 180 });
  const descRef  = useScrollAnim({ threshold: 0.1, delay: 260 });
  const btnsRef  = useScrollAnim({ threshold: 0.1, delay: 340 });

  useEffect(() => {
    const onScroll = () => {
      if (!didFire.current && window.scrollY > 100) {
        didFire.current = true;
        unlockAchievement(ACHIEVEMENTS.FIRST_SCROLL);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-x-hidden"
    >
      {/* Subtle grid overlay */}
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Soft center glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      {/* ── Avatar ── */}
      <div
        className={`float-anim relative mb-8 cursor-pointer select-none ${shaking ? "easter-shake" : ""}`}
        onClick={handleAvatarClick}
        title={clickCount > 0 ? `${5 - clickCount} more clicks...` : "Click me!"}
      >
        <div className="profile-glow w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95">
          {PROFILE_PHOTO_URL ? (
            <img src={PROFILE_PHOTO_URL} alt="Reyhan Irza Alvano" className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-600 to-violet-900 flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-bold text-white select-none">R</span>
            </div>
          )}
        </div>
        {/* Online indicator */}
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-[#050816] rounded-full animate-pulse" />
        {clickCount > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold animate-bounce">
            {clickCount}
          </span>
        )}
      </div>

      {/* ── Badge ── */}
      <div ref={badgeRef} className="fade-up mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-violet-500/25 bg-violet-500/8 text-violet-300">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Digital Builder
        </span>
      </div>

      {/* ── Headline ── */}
      <div ref={nameRef} className="fade-up text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight" data-testid="text-hero-name">
          <span className="text-white">Building Digital Products,</span>
          <br />
          <span className="text-white">Experiences </span>
          <span className="gradient-text">&amp; Systems.</span>
        </h1>
      </div>

      {/* ── Typing animation ── */}
      <div ref={subRef} className="fade-in mt-5 h-9 flex items-center justify-center px-6">
        <span className="text-base md:text-lg font-medium text-violet-300/90">{displayed}</span>
        <span className="typing-cursor" />
      </div>

      {/* ── Subheadline ── */}
      <p
        ref={descRef}
        className="fade-up text-[#9CA3AF] text-sm md:text-base leading-relaxed max-w-xl text-center px-6 mt-4"
      >
        Modern web experiences, automation solutions, and digital products
        crafted with precision.
      </p>

      {/* ── Marquee ── */}
      <div className="marquee-container w-full mt-8 py-1.5">
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #050816, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #050816, transparent)" }}
        />
        <div className="marquee-track">
          {[...techSkills, ...techSkills].map(({ label, Icon, color }, i) => (
            <span
              key={i}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/55 rounded-full border border-white/8 bg-white/3 hover:border-violet-500/30 hover:text-white/80 transition-colors duration-200 cursor-default mx-2"
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── CTA Buttons ── */}
      <div ref={btnsRef} className="fade-up flex flex-wrap justify-center gap-3 mt-8 px-6">
        <button
          className="btn-neon px-6 py-3 rounded-xl text-sm flex items-center gap-2"
          onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
          data-testid="button-view-projects"
        >
          View Projects
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/75 hover:text-white hover:border-violet-500/35 hover:bg-violet-500/6 transition-all duration-200 flex items-center gap-2"
          onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
          data-testid="button-contact"
        >
          <MessageSquare className="w-4 h-4" />
          Contact Me
        </button>
        <a
          href={CV_URL}
          download="Reyhan-Irza-Alvano-CV.pdf"
          className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/8 text-white/55 hover:text-white/80 hover:border-white/20 hover:bg-white/4 transition-all duration-200 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download CV
        </a>
      </div>

      {/* ── Fun row ── */}
      <div className="flex justify-center mt-5">
        <GuessMyAge />
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/25">
        <span className="text-[10px] tracking-widest uppercase mb-1">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>

    {/* ── Easter Egg Modal ── */}
    {showEaster && createPortal(
      <div
        className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={() => setShowEaster(false)}
      >
        <div
          className="modal-enter border border-violet-500/25 rounded-2xl p-7 max-w-sm w-full text-center relative shadow-2xl shadow-violet-900/40"
          style={{ background: "#111827" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors"
            onClick={() => setShowEaster(false)}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-violet-500/12 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-violet-400" />
          </div>
          <h3 className="text-lg font-bold gradient-text mb-2">Developer Secret Found!</h3>
          <p className="text-white/50 text-sm mb-5 leading-relaxed">
            You found the hidden easter egg. You're clearly someone who's curious!
          </p>
          <div className="border border-white/6 rounded-xl p-4 text-left space-y-2.5 text-sm" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-white/60 flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" /> Fav music: Avenged Sevenfold &amp; SZA
            </p>
            <p className="text-white/60 flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5 text-amber-400/70 flex-shrink-0" /> Coffee/day: minimum 3 cups
            </p>
            <p className="text-white/60 flex items-center gap-2">
              <Home className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Biggest dream: Real Estate Investor
            </p>
            <p className="text-white/60 flex items-center gap-2">
              <Bug className="w-3.5 h-3.5 text-red-400/70 flex-shrink-0" /> Most hated bug: off-by-one error
            </p>
          </div>
          <button
            className="btn-neon mt-5 w-full py-2.5 rounded-xl text-sm"
            onClick={() => setShowEaster(false)}
          >
            Close Secret
          </button>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
