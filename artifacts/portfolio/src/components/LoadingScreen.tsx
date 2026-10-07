import { useState, useEffect } from "react";
import BrandLogo from "./BrandLogo";

const STATUS_MSGS = [
  "Initializing...",
  "Loading Assets...",
  "Fetching Data...",
  "Almost Ready...",
  "Preparing Experience...",
];

interface Props { onFinish: () => void }

export default function LoadingScreen({ onFinish }: Props) {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showBar,  setShowBar]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase,    setPhase]    = useState<"in" | "progress" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setShowLogo(true), 100);
    const t2 = setTimeout(() => setShowText(true), 500);
    const t3 = setTimeout(() => { setShowBar(true); setPhase("progress"); }, 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (phase !== "progress") return;
    let p = 0;
    const iv = setInterval(() => {
      p += 2.2;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => { setPhase("out"); setTimeout(onFinish, 480); }, 220);
      }
    }, 20);
    return () => clearInterval(iv);
  }, [phase, onFinish]);

  const msgIndex  = Math.min(Math.floor(progress / 21), STATUS_MSGS.length - 1);
  const statusMsg = STATUS_MSGS[msgIndex];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
        phase === "out" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "#050816" }}
    >
      {/* Aurora glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[60%] rounded-[60%_40%_55%_45%]"
          style={{ background: "radial-gradient(ellipse at 40% 40%, rgba(139,92,246,0.22) 0%, rgba(109,40,217,0.10) 40%, transparent 70%)", filter: "blur(60px)", animation: "aurora-1 14s ease-in-out infinite" }} />
        <div className="absolute top-[-5%] right-[-10%] w-[60%] h-[55%] rounded-[45%_55%_40%_60%]"
          style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(79,70,229,0.16) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)", filter: "blur(70px)", animation: "aurora-2 18s ease-in-out infinite" }} />
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[35%] rounded-[50%]"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.10) 0%, rgba(14,165,233,0.05) 50%, transparent 75%)", filter: "blur(80px)", animation: "aurora-3 22s ease-in-out infinite" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">

        {/* The same RV master mark is used across every loading surface. */}
        <div style={{
          opacity:    showLogo ? 1 : 0,
          transform:  showLogo ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <BrandLogo size="lg" alt="Reyhan Irza Alvano RV logo" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1 overflow-hidden">
          <div style={{
            opacity:    showText ? 1 : 0,
            transform:  showText ? "translateX(0)" : "translateX(-32px)",
            transition: "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}>
            <span className="text-white/30 text-[10px] tracking-[0.4em] uppercase font-light select-none">
              Welcome to
            </span>
          </div>
          <div style={{
            opacity:    showText ? 1 : 0,
            transform:  showText ? "translateX(0)" : "translateX(32px)",
            transition: "opacity 0.5s 0.08s cubic-bezier(0.22,1,0.36,1), transform 0.5s 0.08s cubic-bezier(0.22,1,0.36,1)",
          }}>
            <span className="text-2xl font-bold gradient-text select-none tracking-tight">
              my portfolio.
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-48" style={{ opacity: showBar ? 1 : 0, transition: "opacity 0.4s ease" }}>
          <div className="text-center mb-2.5 h-4">
            <span key={msgIndex} className="text-white/30 text-[10px] tracking-wide"
              style={{ animation: "fadeSlideUp 0.3s ease" }}>
              {statusMsg}
            </span>
          </div>
          <div className="h-[1.5px] bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #7C3AED, #8B5CF6, #A78BFA)",
                transition: "width 0.06s linear",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-white/15 text-[9px] tracking-widest uppercase">Loading</span>
            <span className="text-white/15 text-[9px] tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
