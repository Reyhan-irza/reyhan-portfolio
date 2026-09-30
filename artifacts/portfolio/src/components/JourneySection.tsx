import { useEffect, useRef } from "react";
import { Atom, BriefcaseBusiness, Code2, Leaf, Sparkles } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

const milestones = [
  ["2022", "The beginning", "Started learning HTML, CSS, and JavaScript from scratch. Built a first webpage — a simple profile page.", Leaf],
  ["2023", "Falling for React", "Fell in love with React and TypeScript. Began learning component architecture, state management, and the modern frontend ecosystem.", Atom],
  ["2024", "Full-stack journey", "Explored backend development with Node.js, Express, and PostgreSQL. Built a first full-stack REST API and end-to-end applications.", Code2],
  ["2025", "Real projects", "Worked on projects for first clients. Learned about communication, deadlines, and the importance of great UX.", BriefcaseBusiness],
  ["2026", "Premium portfolio", "Built this premium personal brand platform: modern, interactive, and crafted with precision.", Sparkles],
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
          <div><p className="section-kicker">The record / 2022—26</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.07em] md:text-6xl">Learning by making.</h2></div>
          <p className="max-w-sm text-sm leading-relaxed text-[#65675f]">A personal chronology of tools learned, projects attempted and lessons carried forward.</p>
        </div>
        <div className="mt-10 divide-y divide-[rgba(27,28,24,.16)]">
          {milestones.map(([year, title, desc, Icon]) => (
            <article key={year} className="grid gap-5 py-7 md:grid-cols-[7rem_1fr_1.15fr] md:gap-10">
             <p className="font-mono text-xs uppercase tracking-[.16em] text-[#a43f2d]">{year}</p>
              <div className="flex items-start gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1b1c18]" aria-hidden="true" /><h3 className="text-xl font-semibold tracking-[-.04em]">{title}</h3></div>
              <p className="max-w-lg text-sm leading-relaxed text-[#65675f]">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}