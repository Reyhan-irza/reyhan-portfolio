import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";
import Reveal from "./Reveal";

const educationPeriods = [
  { period: "2014–2015", level: "TK", label: "Taman Kanak-kanak" },
  { period: "2015–2021", level: "SD", label: "Sekolah Dasar" },
  { period: "2021–2024", level: "SMP", label: "Sekolah Menengah Pertama" },
  {
    period: "2024–sekarang",
    level: "SMK",
    label: "Sekolah Menengah Kejuruan",
    school: "SMK Negeri 2 Lubuk Basung",
    major: "TJKT",
    current: true,
  },
] as const;

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const educationProgressRef = useRef<HTMLSpanElement>(null);
  const didFire = useRef(false);

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

        const education = educationRef.current;
        const educationProgress = educationProgressRef.current;
        if (!mediaContext.conditions?.reduced && education && educationProgress) {
          const compact = Boolean(mediaContext.conditions?.compact);
          const educationRows = gsap.utils.toArray<HTMLElement>("[data-education-row]", education);
          const setActiveMilestone = (progress: number) => {
            const activeIndex = Math.min(
              educationRows.length - 1,
              Math.floor(Math.min(progress, 0.999999) * educationRows.length),
            );
            educationRows.forEach((row, index) => {
              if (index === activeIndex) {
                row.setAttribute("data-education-active", "true");
                row.setAttribute("aria-current", "step");
              } else {
                row.removeAttribute("data-education-active");
                row.removeAttribute("aria-current");
              }
            });
          };
          setActiveMilestone(0);
          const educationStory = gsap.timeline({
            defaults: { ease: "none" },
            onUpdate: () => setActiveMilestone(educationStory.progress()),
            scrollTrigger: {
              trigger: education,
              start: "top 70%",
              end: "bottom 34%",
              scrub: compact ? 0.18 : 0.55,
              invalidateOnRefresh: true,
            },
          });

          educationStory.fromTo(educationProgress, {
            scaleY: 0,
            transformOrigin: "top center",
          }, {
            scaleY: 1,
            duration: 1,
          }, 0);

        }

      }, el);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="journey" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col justify-between gap-6 border-b border-[rgba(27,28,24,.16)] pb-9 md:flex-row md:items-end">
          <div><p className="section-kicker">Personal journey</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.07em] md:text-6xl">My journey so far.</h2></div>
          <p className="story-aside max-w-sm text-sm leading-relaxed">Saya masih di awal perjalanan. Sejauh ini, sekolah, proyek, dan tantangan baru ikut membentuk cara saya belajar.</p>
        </Reveal>

        <section className="mt-10" aria-labelledby="education-timeline-title">
          <div className="flex flex-col gap-2 border-b border-[rgba(27,28,24,.16)] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">The path so far</p>
              <h3 id="education-timeline-title" className="mt-3 text-2xl font-semibold tracking-[-.05em] text-white md:text-3xl">Education Timeline</h3>
            </div>
          </div>
          <div ref={educationRef} className="education-timeline relative mt-8 pl-9 md:pl-12">
            <span className="education-timeline-track" aria-hidden="true" />
            <span ref={educationProgressRef} className="education-timeline-progress" aria-hidden="true" />
                    <div className="space-y-3">
              {educationPeriods.map((entry, index) => {
                const isCurrent = "current" in entry && entry.current;
                return (
                  <Reveal
                    key={entry.level}
                    as="article"
                    staggerIndex={index}
                    className={`education-item grid gap-2 py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6 ${isCurrent ? "education-item-current" : ""}`}
                    data-education-row
                    data-education-current={isCurrent || undefined}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <span className={`education-node ${isCurrent ? "education-node-current" : ""}`} data-education-node aria-hidden="true" />
                    <div className="education-period">
                      <p className="font-mono text-xs tracking-[.05em] text-[#aab4ff]">{entry.period}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[.15em] text-white/45">{entry.level}</p>
                    </div>
                    <div data-education-content>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <p className="text-xs uppercase tracking-[.11em] text-white/50">{entry.label}</p>
                        {isCurrent ? <span className="education-current-badge">Saat ini</span> : null}
                      </div>
                      {"school" in entry ? (
                        <>
                          <h4 className="mt-2 text-lg font-semibold tracking-[-.035em] text-white md:text-xl">{entry.school}</h4>
                          <p className="mt-1 text-sm text-[#c9d0dc]">Jurusan {entry.major}</p>
                        </>
                      ) : null}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </section>
  );
}