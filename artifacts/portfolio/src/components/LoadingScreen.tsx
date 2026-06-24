import { useState, useEffect, useRef } from "react";

const PHOTO = "https://i.imgur.com/3jKgiUW.jpeg";

const STATUS_MSGS = [
  "Initializing...",
  "Loading Assets...",
  "Fetching Data...",
  "Almost Ready...",
  "Preparing Experience...",
];

interface Props { onFinish: () => void }

interface RunState {
  lAX: number; lAY: number;
  rAX: number; rAY: number;
  lLX: number; lLY: number;
  rLX: number; rLY: number;
  vB: number;
}

export default function LoadingScreen({ onFinish }: Props) {
  const [showFig,  setShowFig]  = useState(false);
  const [showText, setShowText] = useState(false);
  const [showBar,  setShowBar]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase,    setPhase]    = useState<"in" | "progress" | "out">("in");

  const phaseRef = useRef(0);
  const [rs, setRs] = useState<RunState>({
    lAX: 36, lAY: 68, rAX: 64, rAY: 68,
    lLX: 44, lLY: 106, rLX: 56, rLY: 106,
    vB: 0,
  });

  useEffect(() => {
    let raf: number;
    const tick = () => {
      phaseRef.current += 0.10;
      const t  = phaseRef.current;
      const s  = Math.sin(t);
      const legA = s * 0.48;
      const armA = -s * 0.42;
      const ARM  = 20, LEG = 28;
      const lAX = 36 + ARM * Math.sin(armA);
      const lAY = 50 + ARM * Math.cos(armA);
      const rAX = 64 + ARM * Math.sin(-armA);
      const rAY = 50 + ARM * Math.cos(-armA);
      const lLX = 44 + LEG * Math.sin(legA);
      const lLY = 78 + LEG * Math.cos(legA);
      const rLX = 56 + LEG * Math.sin(-legA);
      const rLY = 78 + LEG * Math.cos(-legA);
      const vB  = -Math.abs(Math.cos(t)) * 2.5;
      setRs({ lAX, lAY, rAX, rAY, lLX, lLY, rLX, rLY, vB });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setShowFig(true),  100);
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

        {/* Running stick figure */}
        <div style={{
          opacity:    showFig ? 1 : 0,
          transform:  showFig ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <svg viewBox="0 0 100 125" width="80" height="100" aria-label="Loading" style={{ overflow: "visible" }}>
            <defs>
              <clipPath id="ls-head">
                <circle cx="50" cy="20" r="18" />
              </clipPath>
            </defs>
            <g transform={`translate(0, ${rs.vB})`}>
              <circle cx="50" cy="20" r="20" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
              <image href={PHOTO} x="32" y="2" width="36" height="36"
                clipPath="url(#ls-head)" preserveAspectRatio="xMidYMid slice" />
              <line x1="50" y1="38" x2="50" y2="78" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="36" y1="50" x2="64" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="36" y1="50" x2={rs.lAX} y2={rs.lAY} stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="64" y1="50" x2={rs.rAX} y2={rs.rAY} stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="44" y1="78" x2={rs.lLX} y2={rs.lLY} stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="56" y1="78" x2={rs.rLX} y2={rs.rLY} stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </svg>
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
