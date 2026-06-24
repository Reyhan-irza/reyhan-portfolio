import { useScrollAnim } from "../hooks/useScrollAnim";
import { Check, Circle, Clock, Globe, Laptop, Rocket, Home, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const roadmap = [
  {
    year: "2026",
    title: "Portfolio Website Premium",
    desc: "Membangun portfolio personal yang modern, interaktif, dan memorable.",
    status: "done" as const,
    Icon: Globe,
  },
  {
    year: "2027",
    title: "Freelance Projects",
    desc: "Mengerjakan 10+ project freelance, membangun reputasi dan portofolio client.",
    status: "active" as const,
    Icon: Laptop,
  },
  {
    year: "2028",
    title: "Launch Startup",
    desc: "Mendirikan startup teknologi dengan fokus pada solusi digital UMKM Indonesia.",
    status: "future" as const,
    Icon: Rocket,
  },
  {
    year: "2030",
    title: "Real Estate Investment",
    desc: "Memulai investasi properti pertama. Diversifikasi income stream menuju kebebasan finansial.",
    status: "future" as const,
    Icon: Home,
  },
  {
    year: "2035",
    title: "Financial Freedom",
    desc: "Mencapai kebebasan finansial dan memberdayakan komunitas developer muda Indonesia.",
    status: "future" as const,
    Icon: Trophy,
  },
] satisfies { year: string; title: string; desc: string; status: "done" | "active" | "future"; Icon: LucideIcon }[];

const statusConfig = {
  done:   { label: "Selesai",       className: "roadmap-done",   Icon: Check,  textColor: "text-violet-400" },
  active: { label: "Dalam Proses",  className: "roadmap-active", Icon: Clock,  textColor: "text-pink-400"   },
  future: { label: "Akan Datang",   className: "roadmap-future", Icon: Circle, textColor: "text-white/30"   },
};

export default function RoadmapSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });

  return (
    <section id="roadmap" className="relative py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div ref={headerRef} className="fade-up text-center mb-16">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Future Plans</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            My <span className="gradient-text">Roadmap</span>
          </h2>
          <div className="rgb-divider w-24 mx-auto mb-6" />
          <p className="text-white/45 max-w-md mx-auto text-base leading-relaxed">
            Mimpi besar dimulai dari langkah kecil yang konsisten.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {roadmap.map((item, i) => <RoadmapItem key={item.year} item={item} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}

function RoadmapItem({ item, delay }: { item: (typeof roadmap)[0]; delay: number }) {
  const ref = useScrollAnim<HTMLDivElement>({ threshold: 0.2, delay });
  const cfg = statusConfig[item.status];
  const StatusIcon = cfg.Icon;
  const { Icon: ItemIcon } = item;

  return (
    <div
      ref={ref}
      className={`fade-up glass border rounded-2xl p-4 flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5 ${cfg.className}`}
    >
      {/* Item icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        item.status === "done"   ? "bg-violet-500/12 border border-violet-500/20" :
        item.status === "active" ? "bg-pink-500/12 border border-pink-500/20"     :
                                   "bg-white/4 border border-white/8"
      }`}>
        <ItemIcon className={`w-4.5 h-4.5 ${cfg.textColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-xs font-bold uppercase tracking-widest ${cfg.textColor}`}>{item.year}</span>
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.className}`}>
            <StatusIcon className="w-2.5 h-2.5" />
            {cfg.label}
          </span>
        </div>
        <h3 className={`font-semibold text-sm mb-1 ${item.status === "future" ? "text-white/45" : "text-white"}`}>
          {item.title}
        </h3>
        <p className="text-white/35 text-xs leading-relaxed">{item.desc}</p>
      </div>

      {item.status === "done" && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-violet-400" />
        </div>
      )}
    </div>
  );
}
