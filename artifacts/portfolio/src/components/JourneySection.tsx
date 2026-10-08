import { useLayoutEffect, useRef } from "react";
import { Award, Code2, FolderKanban, School, Trophy } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { useScrollAnim } from "../hooks/useScrollAnim";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

const milestones = [
  ["STUDY", "SMK Negeri 2 Lubuk Basung", "I study TJKT here, learning networking, systems, and technical fundamentals alongside web development.", School],
  ["BUILD", "VIREON Library", "I built VIREON as a digital library for my school and learned a lot while turning the idea into a working system.", FolderKanban],
  ["2025", "Juara I · Kabupaten Agam", "I placed 1st in LKS IT Software Solution For Business.", Award],
  ["ACHIEVEMENT", "CTF Competition", "I finished 2nd.", Trophy],
  ["ONGOING", "Keep learning", "I’m still building my skills and figuring out what I want to make next.", Code2],
] as const;

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useScrollAnim({ threshold: 0.2 });
  const milestonesRef = useRef<HTMLDivElement>(null);
  const didFire = useRef(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
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

        const milestones = milestonesRef.current;
        if (!mediaContext.conditions?.reduced && progressRef.current && milestones) {
          const compact = Boolean(mediaContext.conditions?.compact);

          gsap.fromTo(progressRef.current, { scaleY: 0 }, {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: milestones,
              start: "top 70%",
              end: "bottom 38%",
              scrub: compact ? 0.25 : 0.55,
              invalidateOnRefresh: true,
            },
          });

          gsap.utils.toArray<HTMLElement>("[data-journey-row]", milestones).forEach((row) => {
            const year = row.querySelector<HTMLElement>("[data-journey-year]");
            const heading = row.querySelector<HTMLElement>("[data-journey-heading]");
            const copy = row.querySelector<HTMLElement>("[data-journey-copy]");
            const node = row.querySelector<HTMLElement>("[data-journey-node]");
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: row,
                start: compact ? "top 88%" : "top 84%",
                end: compact ? "top 48%" : "top 46%",
                scrub: compact ? 0.2 : 0.42,
                invalidateOnRefresh: true,
              },
            });

            if (year) {
              timeline.fromTo(year, {
                x: compact ? -4 : -10,
                opacity: 0.62,
              }, {
                x: 0,
                opacity: 1,
                ease: "none",
              }, 0);
            }
            if (heading) {
              timeline.fromTo(heading, {
                x: compact ? 7 : 16,
                opacity: 0.5,
              }, {
                x: 0,
                opacity: 1,
                ease: "none",
              }, 0);
            }
            if (copy) {
              timeline.fromTo(copy, {
                y: compact ? 5 : 12,
                opacity: 0.52,
              }, {
                y: 0,
                opacity: 1,
                ease: "none",
              }, 0.04);
            }
            if (node) {
              timeline.fromTo(node, {
                scale: 0.62,
                opacity: 0.2,
                boxShadow: "0 0 0 rgba(132,145,255,0)",
              }, {
                scale: 1,
                opacity: 1,
                boxShadow: "0 0 14px rgba(132,145,255,.48)",
                ease: "none",
              }, 0);
            }
          });
        }
      }, el);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="journey" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="fade-up flex flex-col justify-between gap-6 border-b border-[rgba(27,28,24,.16)] pb-9 md:flex-row md:items-end">
        <div data-motion-item><p className="section-kicker">Education / projects / competitions</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.07em] md:text-6xl">What I’ve done so far.</h2></div>
          <p className="max-w-sm text-sm leading-relaxed text-[#65675f]" data-motion-item>I’m still early in the journey, but a few projects and achievements have already shaped how I learn.</p>
        </div>
        <div ref={milestonesRef} className="journey-timeline relative mt-10 divide-y divide-[rgba(27,28,24,.16)]">
          <span ref={progressRef} className="journey-timeline-progress" aria-hidden="true" />
          {milestones.map(([year, title, desc, Icon]) => {
            const isFeatured = year === "ACHIEVEMENT";
            return (
            <article key={title} className={`grid gap-5 py-7 md:grid-cols-[7rem_1fr_1.15fr] md:gap-10 ${isFeatured ? "border-l-2 border-[#667cff] bg-[#0a0e15] px-4" : ""}`} data-journey-row data-journey-highlight={isFeatured || undefined}>
             <p className={`journey-year relative font-mono text-[10px] uppercase tracking-[.13em] ${isFeatured ? "text-[#aab4ff]" : "text-[#a43f2d]"}`} data-journey-year>
               <span className="journey-node" data-journey-node aria-hidden="true" />
               {year}
             </p>
               <div className="flex items-start gap-3" data-journey-heading><Icon className={`mt-0.5 h-4 w-4 shrink-0 ${isFeatured ? "text-[#aab4ff]" : "text-[#1b1c18]"}`} aria-hidden="true" /><h3 className={`text-xl font-semibold tracking-[-.04em] ${isFeatured ? "text-white" : ""}`}>{title}</h3></div>
               <p className={`max-w-lg text-sm leading-relaxed ${isFeatured ? "text-[#c9d0dc]" : "text-[#65675f]"}`} data-journey-copy>{desc}</p>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}