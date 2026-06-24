import { useState, useEffect } from "react";
import { Code2, User, Briefcase } from "lucide-react";
import AuroraBackground from "./AuroraBackground";

interface IntroAnimationProps {
  onFinish: () => void;
}

export default function IntroAnimation({ onFinish }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"entering" | "showing" | "leaving">("entering");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("showing"), 100);
    const t2 = setTimeout(() => setPhase("leaving"), 2600);
    const t3 = setTimeout(() => onFinish(), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-600 ${
        phase === "leaving" ? "intro-fade-out" : ""
      }`}
    >
      <AuroraBackground />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Welcome text */}
        <div
          className={`transition-all duration-800 ${
            phase !== "entering"
              ? "animate-slide-in-left opacity-100"
              : "opacity-0 -translate-x-20"
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center leading-tight">
            <span className="gradient-text">Welcome to</span>
            <br />
            <span className="text-white/90">My Portfolio</span>
          </h1>
        </div>

        {/* Sub text */}
        <div
          className={`transition-all delay-300 duration-700 ${
            phase !== "entering" ? "animate-fade-in opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-white/50 text-base md:text-lg font-light tracking-widest uppercase">
            Reyhan Irza Alvano
          </p>
        </div>

        {/* Icons */}
        <div className="flex gap-8 mt-4">
          <div
            className={`${
              phase !== "entering" ? "animate-drop-bounce" : "opacity-0"
            } flex flex-col items-center gap-2`}
          >
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center border border-violet-500/30">
              <Code2 className="w-7 h-7 text-violet-400" />
            </div>
            <span className="text-white/40 text-xs font-light">Code</span>
          </div>

          <div
            className={`${
              phase !== "entering" ? "animate-drop-bounce-delay-1" : "opacity-0"
            } flex flex-col items-center gap-2`}
          >
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center border border-pink-500/30">
              <User className="w-7 h-7 text-pink-400" />
            </div>
            <span className="text-white/40 text-xs font-light">Profile</span>
          </div>

          <div
            className={`${
              phase !== "entering" ? "animate-drop-bounce-delay-2" : "opacity-0"
            } flex flex-col items-center gap-2`}
          >
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center border border-blue-500/30">
              <Briefcase className="w-7 h-7 text-blue-400" />
            </div>
            <span className="text-white/40 text-xs font-light">Work</span>
          </div>
        </div>
      </div>
    </div>
  );
}
