import { Circle, BookOpen, Blocks, Compass } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";

const roadmap = [
  { label: "Practice", title: "Keep strengthening fundamentals", desc: "Continue learning by studying how interfaces, systems and connected product flows work.", Icon: BookOpen },
  { label: "Projects", title: "Make useful things", desc: "Keep building projects with a clear purpose, then document what is real and how to explore it.", Icon: Blocks },
  { label: "Direction", title: "Stay open to what comes next", desc: "Future plans belong here when they become specific. This is an intention, not a promised timeline.", Icon: Compass },
] as const;

export default function RoadmapSection() {
  const ref = useScrollAnim({ threshold: 0.2 });
  const roadmapRef = useScrollAnim<HTMLOListElement>({ threshold: 0.1, stagger: 0.08, distance: 14 });

  return (
    <section id="roadmap" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className="fade-up grid gap-8 border-b border-[rgba(27,28,24,.16)] pb-10 md:grid-cols-[1fr_1fr]">
          <div data-motion-item><p className="section-kicker">Intentions / not outcomes</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.07em] md:text-6xl">A direction, not a forecast.</h2></div>
          <p className="max-w-md text-base leading-relaxed text-[#65675f]" data-motion-item>These are open intentions, not dated goals or completed milestones. The record will change when the work does.</p>
        </div>
        <ol ref={roadmapRef} className="mt-5 divide-y divide-[rgba(27,28,24,.16)] border-b border-[rgba(27,28,24,.16)]">
          {roadmap.map(({ label, title, desc, Icon }) => (
            <li key={title} className="grid gap-4 py-6 md:grid-cols-[6rem_1fr_1.2fr_auto] md:items-start md:gap-8" data-motion-item>
               <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#a43f2d]">{label}</span>
              <div className="flex items-start gap-3">
                <Icon className="mt-1 h-4 w-4 shrink-0 text-[#65675f]" aria-hidden="true" />
                <h3 className="text-lg font-semibold tracking-[-.035em]">{title}</h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#65675f]">{desc}</p>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#65675f] md:justify-self-end">
                  <Circle className="h-2.5 w-2.5" aria-hidden="true" />
                 Intention
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}