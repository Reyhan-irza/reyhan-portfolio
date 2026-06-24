import { useRef, useState, useEffect } from "react";
import { Rocket, Clock, Cpu, Star } from "lucide-react";
import { useCounter } from "../hooks/useCounter";

const stats = [
  { icon: Rocket, label: "Projects Completed", value: 15,  suffix: "+", color: "text-violet-400" },
  { icon: Clock,  label: "Hours of Learning",  value: 500, suffix: "+", color: "text-white/80"  },
  { icon: Cpu,    label: "Technologies",        value: 10,  suffix: "+", color: "text-white/80"  },
  { icon: Star,   label: "Client Satisfaction", value: 100, suffix: "%", color: "text-violet-300" },
];

export default function StatsSection() {
  return (
    <section className="relative py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => <StatCard key={s.label} stat={s} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, delay }: { stat: (typeof stats)[0]; delay: number }) {
  const elRef  = useRef<HTMLDivElement>(null);
  const [vis,   setVis]   = useState(false);
  const [start, setStart] = useState(false);
  const count = useCounter(stat.value, 1600, start);
  const Icon  = stat.icon;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { setVis(true); setStart(true); }, delay);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={elRef}
      className={`fade-scale rounded-2xl p-6 text-center border border-white/6 hover:border-violet-500/15 transition-all duration-400 hover:-translate-y-1 group ${vis ? "show" : ""}`}
      style={{ background: "#111827" }}
    >
      <div className="w-9 h-9 rounded-xl bg-violet-500/8 border border-violet-500/12 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
        <Icon className={`w-4 h-4 ${stat.color}`} />
      </div>
      <div className={`text-3xl md:text-4xl font-bold stat-glow mb-1 ${stat.color}`}>
        {start ? count : 0}{stat.suffix}
      </div>
      <div className="text-[#9CA3AF] text-xs">{stat.label}</div>
    </div>
  );
}
