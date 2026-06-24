import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface Props {
  onEnter: () => void;
}

export default function IntroPage({ onEnter }: Props) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 650);
  };

  return (
    <div
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden
        transition-all duration-650 ${exiting ? "opacity-0 scale-[1.02] pointer-events-none" : "opacity-100 scale-100"}`}
      style={{ background: "#050816" }}
    >
      {/* Aurora blobs — multi-color premium */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-[-15%] left-[-8%] w-[72%] h-[65%] rounded-[60%_40%_55%_45%]"
          style={{ background: "radial-gradient(ellipse at 40% 40%, rgba(139,92,246,0.26) 0%, rgba(109,40,217,0.14) 35%, transparent 70%)", filter: "blur(60px)", animation: "aurora-1 14s ease-in-out infinite" }} />
        <div className="absolute top-[-8%] right-[-12%] w-[62%] h-[55%] rounded-[45%_55%_40%_60%]"
          style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(79,70,229,0.20) 0%, rgba(59,130,246,0.12) 38%, transparent 72%)", filter: "blur(68px)", animation: "aurora-2 18s ease-in-out infinite" }} />
        <div className="absolute top-[8%] left-[18%] w-[64%] h-[38%] rounded-[50%_50%_60%_40%]"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.13) 0%, rgba(14,165,233,0.08) 40%, transparent 75%)", filter: "blur(75px)", animation: "aurora-3 24s ease-in-out infinite" }} />
        <div className="absolute bottom-[-10%] right-[-8%] w-[52%] h-[50%] rounded-[40%_60%_45%_55%]"
          style={{ background: "radial-gradient(ellipse at 55% 55%, rgba(20,184,166,0.10) 0%, rgba(6,182,212,0.06) 45%, transparent 78%)", filter: "blur(85px)", animation: "aurora-4 20s ease-in-out infinite" }} />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">

        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/6 text-violet-300 text-xs tracking-widest uppercase mb-8 intro-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span>Digital Builder · 2026</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-5 leading-[1.08] tracking-tight intro-title">
          <span className="text-white">Building Digital</span>
          <br />
          <span className="gradient-text">Products &amp; Systems.</span>
        </h1>

        {/* Subline */}
        <p className="text-[#9CA3AF] text-base md:text-lg mb-12 leading-relaxed intro-sub max-w-xl">
          Modern web experiences, automation solutions, and digital products crafted with precision.
        </p>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          className="group btn-neon px-8 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 intro-btn hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
        >
          Enter Portfolio
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>

        {/* Hint */}
        <p className="mt-6 text-white/18 text-xs intro-hint tracking-wide">
          Click above to begin the experience
        </p>
      </div>
    </div>
  );
}
