import { useEffect, useState } from "react";
import {
  Target, Music2, Rocket, Star, Flame,
  Trophy, MessageSquare, BookOpen, HelpCircle,
} from "lucide-react";
import type { Achievement, AchievementIcon } from "../lib/achievement";

const ICON_MAP: Record<AchievementIcon, React.ComponentType<{ className?: string }>> = {
  target:  Target,
  music:   Music2,
  rocket:  Rocket,
  star:    Star,
  flame:   Flame,
  trophy:  Trophy,
  message: MessageSquare,
  book:    BookOpen,
  help:    HelpCircle,
};

interface ToastItem extends Achievement {
  id: number;
  leaving: boolean;
}

let nextId = 0;

export default function AchievementToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Achievement>).detail;
      const id = nextId++;
      setToasts((prev) => [...prev, { ...detail, id, leaving: false }]);
      setTimeout(() => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 500);
      }, 4000);
    };
    window.addEventListener("achievement", handler);
    return () => window.removeEventListener("achievement", handler);
  }, []);

  return (
    <div className="fixed bottom-6 right-4 z-[200] flex flex-col gap-2.5 pointer-events-none max-w-[min(300px,calc(100vw-2rem))]">
      {toasts.map((t) => {
        const IconComp = ICON_MAP[t.icon] ?? Trophy;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl glass border border-white/10 bg-white/4 shadow-lg transition-all duration-500 ${
              t.leaving ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
            }`}
            style={{ animation: t.leaving ? "none" : "achievementIn 0.4s cubic-bezier(0.22,1,0.36,1)" }}
          >
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
              <IconComp className="w-4 h-4 text-violet-400" />
            </div>
            <div className="min-w-0">
              <p className="text-violet-300/80 text-[9px] font-semibold uppercase tracking-widest mb-0.5">
                Achievement
              </p>
              <p className="text-white text-xs font-medium leading-tight">{t.title}</p>
              <p className="text-white/40 text-[10px] truncate">{t.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
