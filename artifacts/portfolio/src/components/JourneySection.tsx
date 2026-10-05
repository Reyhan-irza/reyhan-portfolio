import { useLayoutEffect, useRef } from "react";
import { Award, Code2, FolderKanban, School } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { useScrollAnim } from "../hooks/useScrollAnim";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

const milestones = [
  ["STUDY", "SMK Negeri 2 Lubuk Basung", "TJKT — the education context behind this portfolio and its technical projects.", School],
  ["PROJECTS", "Learning through builds", "Explore the TJKT information site, VIREON Library and Reyhan WhatsApp Portfolio. Each project has its own scope and links.", FolderKanban],
  ["2025", "Juara I · Kabupaten Agam", "LKS IT Software Solution For Business. Recognition is shown separately from its certificate below.", Award],
  ["ONGOING", "Keep the record honest", "More learning and work can be added here as it becomes real and verifiable.", Code2],
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
        <div data-motion-item><p className="section-kicker">Education / projects / recognition</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.07em] md:text-6xl">A record, still in motion.</h2></div>
          <p className="max-w-sm text-sm leading-relaxed text-[#65675f]" data-motion-item>Only confirmed milestones are dated. The next entries belong to what happens next.</p>
        </div>
        <div ref={milestonesRef} className="journey-timeline relative mt-10 divide-y divide-[rgba(27,28,24,.16)]">
          <span ref={progressRef} className="journey-timeline-progress" aria-hidden="true" />
          {milestones.map(([year, title, desc, Icon]) => (
            <article key={title} className="grid gap-5 py-7 md:grid-cols-[7rem_1fr_1.15fr] md:gap-10" data-motion-item>
             <p className="journey-year relative font-mono text-[10px] uppercase tracking-[.13em] text-[#a43f2d]">
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