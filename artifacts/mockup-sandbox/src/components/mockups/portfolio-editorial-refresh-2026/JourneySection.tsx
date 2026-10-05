import { useLayoutEffect, useRef } from "react";
import { Atom, BriefcaseBusiness, Code2, Leaf, Sparkles } from "lucide-react";
import { gsap, ScrollTrigger } from "../portfolio-editorial/_shared/lib/motion";
import { useScrollAnim } from "../portfolio-editorial/_shared/hooks/useScrollAnim";
import { unlockAchievement, ACHIEVEMENTS } from "../portfolio-editorial/_shared/lib/achievement";

const milestones = [
  ["2022", "The beginning", "Started learning HTML, CSS, and JavaScript from scratch. Built a first webpage — a simple profile page.", Leaf],
  ["2023", "Falling for React", "Fell in love with React and TypeScript. Began learning component architecture, state management, and the modern frontend ecosystem.", Atom],
  ["2024", "Full-stack journey", "Explored backend development with Node.js, Express, and PostgreSQL. Built a first full-stack REST API and end-to-end applications.", Code2],
  ["2025", "Real projects", "Worked on projects for first clients. Learned about communication, deadlines, and the importance of great UX.", BriefcaseBusiness],
  ["2026", "Premium portfolio", "Built this premium personal brand platform: modern, interactive, and crafted with precision.", Sparkles],
] as const;

export default function JourneySection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });
  const milestonesRef = useScrollAnim({ threshold: 0.1, stagger: 0.08, distance: 14 });
  const didFire = useRef(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = document.getElementById("journey");
    if (!el) return;
    const media = gsap.matchMedia();
    media.add({
      reduced: "(prefers-reduced-motion: reduce)",
      compact: "(max-width: 767px)",
      wide: "(min-width: 768px)",
    }, (mediaContext) => {
      const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 72%",
        onEnter: () => {
          if (didFire.current) return;
        didFire.current = true;
        unlockAchievement(ACHIEVEMENTS.JOURNEY_READER);
        },
      });
      if (!mediaContext.conditions?.reduced && progressRef.current && milestonesRef.current) {
        gsap.fromTo(progressRef.current, { scaleY: 0 }, {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: milestonesRef.current,
            start: "top 66%",
            end: "bottom 56%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-journey-node]", milestonesRef.current).forEach((node) => {
          gsap.to(node, {
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: node.closest("article"),
              start: "top 72%",
              end: "top 54%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      }
    }, el);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section id="journey" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="fade-up flex flex-col justify-between gap-6 border-b border-[rgba(27,28,24,.16)] pb-9 md:flex-row md:items-end">
          <div data-motion-item><p className="section-kicker">The record / 2022—26</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.07em] md:text-6xl">Learning by making.</h2></div>
          <p className="max-w-sm text-sm leading-relaxed text-[#65675f]" data-motion-item>A personal chronology of tools learned, projects attempted and lessons carried forward.</p>
        </div>
        <div ref={milestonesRef} className="journey-timeline relative mt-10 divide-y divide-[rgba(27,28,24,.16)]">
          <span ref={progressRef} className="journey-timeline-progress" aria-hidden="true" />
          {milestones.map(([year, title, desc, Icon]) => (
            <article key={year} className="grid gap-5 py-7 md:grid-cols-[7rem_1fr_1.15fr] md:gap-10" data-motion-item>
             <p className="journey-year relative font-mono text-xs uppercase tracking-[.16em] text-[#a43f2d]">
               <span className="journey-node" data-journey-node aria-hidden="true" />
               {year}
             </p>
              <div className="flex items-start gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1b1c18]" aria-hidden="true" /><h3 className="text-xl font-semibold tracking-[-.04em]">{title}</h3></div>
              <p className="max-w-lg text-sm leading-relaxed text-[#65675f]">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}