import { Circle, Check, Globe, Laptop, Rocket, Home, Trophy } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";

const roadmap = [
  { year: "2026", title: "Portfolio Website Premium", desc: "Membangun portfolio personal yang modern, interaktif, dan memorable.", status: "done", Icon: Globe },
  { year: "2027", title: "Freelance Projects", desc: "Mengerjakan project freelance, membangun reputasi dan portofolio client.", status: "active", Icon: Laptop },
  { year: "2028", title: "Launch Startup", desc: "Mendirikan startup teknologi dengan fokus pada solusi digital UMKM Indonesia.", status: "future", Icon: Rocket },
  { year: "2030", title: "Real Estate Investment", desc: "Memulai investasi properti pertama dan mendiversifikasi sumber pendapatan.", status: "future", Icon: Home },
  { year: "2035", title: "Financial Freedom", desc: "Mencapai kebebasan finansial dan memberdayakan komunitas developer muda Indonesia.", status: "future", Icon: Trophy },
] as const;

export default function RoadmapSection() {
  const ref = useScrollAnim({ threshold: 0.2 });
  const roadmapRef = useScrollAnim({ threshold: 0.1, stagger: 0.08, distance: 14 });

  return (
    <section id="roadmap" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className="fade-up grid gap-8 border-b border-[rgba(27,28,24,.16)] pb-10 md:grid-cols-[1fr_1fr]">
          <div data-motion-item><p className="section-kicker">Intentions / not outcomes</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.07em] md:text-6xl">A direction, not a forecast.</h2></div>
          <p className="max-w-md text-base leading-relaxed text-[#65675f]" data-motion-item>Plans recorded here are personal aspirations. Only the 2026 portfolio milestone is marked complete.</p>
        </div>
        <ol ref={roadmapRef} className="mt-5 divide-y divide-[rgba(27,28,24,.16)] border-b border-[rgba(27,28,24,.16)]">
          {roadmap.map(({ year, title, desc, status, Icon }) => (
            <li key={year} className="grid gap-4 py-6 md:grid-cols-[6rem_1fr_1.2fr_auto] md:items-start md:gap-8" data-motion-item>
               <span className="font-mono text-sm tabular-nums text-[#a43f2d]">{year}</span>
              <div className="flex items-start gap-3">
                <Icon className="mt-1 h-4 w-4 shrink-0 text-[#65675f]" aria-hidden="true" />
                <h3 className="text-lg font-semibold tracking-[-.035em]">{title}</h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#65675f]">{desc}</p>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#65675f] md:justify-self-end">
                 {status === "done" ? <Check className="h-3.5 w-3.5 text-[#a43f2d]" aria-hidden="true" /> : <Circle className="h-2.5 w-2.5" aria-hidden="true" />}
                {status === "done" ? "Completed" : status === "active" ? "In view" : "Aspiration"}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}