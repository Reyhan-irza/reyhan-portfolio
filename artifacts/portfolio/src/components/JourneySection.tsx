import { useEffect, useRef } from "react";
import { Atom, BriefcaseBusiness, Code2, Leaf, Rocket } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

const milestones = [
  ["2022", "The first page", "Started with HTML, CSS and JavaScript; a simple profile page made the idea of building feel tangible.", Leaf],
  ["2023", "Falling for React", "Moved into React and TypeScript, learning components, state and the habits that make interfaces easier to change.", Atom],
  ["2024", "Full-stack direction", "Explored Node.js, Express and PostgreSQL while building end-to-end applications and REST APIs.", Code2],
  ["2025", "Products with a purpose", "Built the TJKT education site, VIREON Library and a personal WhatsApp portfolio; the work became more specific and more accountable.", BriefcaseBusiness],
  ["Next", "Keep shipping", "A plan to keep learning through smaller, clearer products and better documentation of the decisions behind them.", Rocket],
] as const;

export default function JourneySection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });
  const didFire = useRef(false);
  useEffect(() => {
    const el = document.getElementById("journey");
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !didFire.current) {
        didFire.current = true;
        unlockAchievement(ACHIEVEMENTS.JOURNEY_READER);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="journey" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="fade-up flex flex-col justify-between gap-6 border-b border-[rgba(27,28,24,.16)] pb-9 md:flex-row md:items-end">
          <div><p className="section-kicker">02 / Progression</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.07em] md:text-6xl">Learning in public.</h2></div>
          <p className="max-w-sm text-sm leading-relaxed text-[#65675f]">Past milestones are written as past. “Next” is a plan, not a promise.</p>
        </div>
        <div className="mt-10 divide-y divide-[rgba(27,28,24,.16)]">
          {milestones.map(([year, title, desc, Icon], index) => (
            <article key={year} className="grid gap-5 py-7 md:grid-cols-[7rem_1fr_1.15fr] md:gap-10">
              <p className="font-mono text-xs uppercase tracking-[.16em] text-[#e8836b]">{year}</p>
              <div className="flex items-start gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1b1c18]" aria-hidden="true" /><h3 className="text-xl font-semibold tracking-[-.04em]">{title}</h3></div>
              <p className="max-w-lg text-sm leading-relaxed text-[#65675f]">{desc}</p>
              <span className="hidden font-mono text-[10px] text-[#77796e] md:block">record / {String(index + 1).padStart(2, "0")}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}