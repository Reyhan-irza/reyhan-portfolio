import { ArrowUpRight, Circle, Home, Laptop, Rocket } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";

const plans = [
  ["Near term", "Keep refining shipped work", "Improve the clarity of case notes, accessibility and the small details that make products easier to trust.", Laptop],
  ["Later", "Build for local needs", "Explore a focused software solution for an Indonesian small business or community workflow.", Rocket],
  ["Long view", "Learn beyond the screen", "Keep the real-estate-investor ambition as a personal direction while building the skills and discipline to support it.", Home],
] as const;

export default function RoadmapSection() {
  const ref = useScrollAnim({ threshold: 0.2 });
  return (
    <section id="roadmap" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className="fade-up grid gap-8 border-b border-[rgba(27,28,24,.16)] pb-10 md:grid-cols-[1fr_1fr]">
          <div><p className="section-kicker">04 / Plans</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.07em] md:text-6xl">Still becoming.</h2></div>
          <p className="max-w-md text-lg leading-relaxed text-[#65675f]">These are aspirations in my own words. They are deliberately not presented as completed outcomes.</p>
        </div>
        <div className="mt-10 grid gap-0 border-b border-[rgba(27,28,24,.16)] md:grid-cols-3 md:divide-x md:divide-[rgba(27,28,24,.16)]">
          {plans.map(([label, title, desc, Icon], index) => (
            <article key={label} className="border-t border-[rgba(27,28,24,.16)] py-7 md:border-t-0 md:px-7 md:first:pl-0 md:last:pr-0">
              <div className="flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#e8836b]">{label}</span><Icon className="h-4 w-4 text-[#77796e]" aria-hidden="true" /></div>
              <h3 className="mt-16 text-2xl font-semibold tracking-[-.05em]">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#65675f]">{desc}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-[#77796e]">plan / 0{index + 1} <ArrowUpRight className="h-3 w-3" aria-hidden="true" /></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}