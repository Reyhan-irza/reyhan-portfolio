import { useLayoutEffect, useRef } from "react";
import { Award, BookOpen, GraduationCap, Trophy } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { useScrollAnim } from "../hooks/useScrollAnim";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

const educationPeriods = [
  { period: "2014–2015", level: "TK", label: "Kindergarten" },
  { period: "2015–2021", level: "SD", label: "Elementary School" },
  { period: "2021–2024", level: "SMP", label: "Junior High School" },
  {
    period: "2024–sekarang",
    level: "SMK",
    label: "Vocational High School",
    school: "SMK Negeri 2 Lubuk Basung",
    major: "TJKT",
    current: true,
  },
] as const;

const achievements = [
  {
    index: "01",
    category: "COMPETITION",
    title: "Juara 1",
    detail: "LKS IT Software Solution for Business · Kabupaten Agam · 2025",
    Icon: Award,
  },
  {
    index: "02",
    category: "COMPETITION",
    title: "Juara 2",
    detail: "CTF Competition",
    Icon: Trophy,
  },
  {
    index: "03",
    category: "PROJECT",
    title: "VIREON Library",
    detail: "Proyek perpustakaan digital untuk lingkungan sekolah.",
    Icon: BookOpen,
  },
] as const;

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useScrollAnim({ threshold: 0.2 });
  const educationRef = useRef<HTMLDivElement>(null);
  const educationProgressRef = useRef<HTMLSpanElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
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
        const achievementCards = achievementsRef.current?.querySelectorAll<HTMLElement>("[data-achievement-card]");
        if (!mediaContext.conditions?.reduced && education && educationProgress) {
          const compact = Boolean(mediaContext.conditions?.compact);
          const educationRows = gsap.utils.toArray<HTMLElement>("[data-education-row]", education);
          const educationNodes = gsap.utils.toArray<HTMLElement>("[data-education-node]", education);
          const educationStory = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: education,
              start: "top 70%",
              end: "bottom 34%",
              scrub: compact ? 0.25 : 0.55,
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

          educationNodes.forEach((node, index) => {
            const position = educationNodes.length > 1
              ? (index / (educationNodes.length - 1)) * 0.84
              : 0;
            educationStory.fromTo(node, {
              scale: 0.7,
              opacity: 0.42,
            }, {
              scale: 1,
              opacity: 1,
              duration: 0.16,
            }, position);
          });

          educationRows.forEach((row, index) => {
            const content = row.querySelector<HTMLElement>("[data-education-content]");
            if (!content) return;
            const position = educationNodes.length > 1
              ? (index / (educationNodes.length - 1)) * 0.84
              : 0;
            educationStory.fromTo(content, {
              x: compact ? 4 : 10,
              opacity: 0.62,
            }, {
              x: 0,
              opacity: 1,
              duration: 0.16,
            }, position);
          });
        }

        if (!mediaContext.conditions?.reduced && achievementCards?.length) {
          gsap.fromTo(achievementCards, {
            y: mediaContext.conditions?.compact ? 12 : 20,
            opacity: 0,
          }, {
            y: 0,
            opacity: 1,
            duration: 0.48,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: achievementsRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
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
          <div data-motion-item><p className="section-kicker">Personal journey</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.07em] md:text-6xl">What I’ve done so far.</h2></div>
          <p className="max-w-sm text-sm leading-relaxed text-[#65675f]" data-motion-item>I’m still early in the journey, but a few projects and achievements have already shaped how I learn.</p>
        </div>

        <section className="mt-10" aria-labelledby="education-timeline-title">
          <div className="flex flex-col gap-2 border-b border-[rgba(27,28,24,.16)] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">Formal education</p>
              <h3 id="education-timeline-title" className="mt-3 text-2xl font-semibold tracking-[-.05em] text-white md:text-3xl">Education Timeline</h3>
            </div>
          </div>
          <div ref={educationRef} className="education-timeline relative mt-8 pl-9 md:pl-12">
            <span className="education-timeline-track" aria-hidden="true" />
            <span ref={educationProgressRef} className="education-timeline-progress" aria-hidden="true" />
            <div className="space-y-3">
              {educationPeriods.map((entry) => {
                const isCurrent = "current" in entry && entry.current;
                return (
                  <article
                    key={entry.level}
                    className={`education-item grid gap-2 py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6 ${isCurrent ? "education-item-current" : ""}`}
                    data-education-row
                    data-education-current={isCurrent || undefined}
                  >
                    <span className={`education-node ${isCurrent ? "education-node-current" : ""}`} data-education-node aria-hidden="true" />
                    <div className="education-period">
                      <p className="font-mono text-xs tracking-[.05em] text-[#aab4ff]">{entry.period}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[.15em] text-white/45">{entry.level}</p>
                    </div>
                    <div data-education-content>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <p className="text-xs uppercase tracking-[.11em] text-white/50">{entry.label}</p>
                        {isCurrent ? <span className="education-current-badge">Current</span> : null}
                      </div>
                      {"school" in entry ? (
                        <>
                          <h4 className="mt-2 text-lg font-semibold tracking-[-.035em] text-white md:text-xl">{entry.school}</h4>
                          <p className="mt-1 text-sm text-[#c9d0dc]">Jurusan {entry.major}</p>
                        </>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={achievementsRef} className="mt-16" aria-labelledby="achievement-milestones-title">
          <div className="flex flex-col gap-2 border-b border-[rgba(27,28,24,.16)] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">Verified milestones</p>
              <h3 id="achievement-milestones-title" className="mt-3 text-2xl font-semibold tracking-[-.05em] text-white md:text-3xl">Achievement &amp; Project Milestones</h3>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/55">Competitions and projects, kept separate from formal education.</p>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {achievements.map(({ index, category, title, detail, Icon }) => (
              <article key={index} className="achievement-milestone-card" data-achievement-card>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[.15em] text-[#aab4ff]">{index} / {category}</span>
                  <Icon className="h-4 w-4 text-[#91a0ff]" aria-hidden="true" />
                </div>
                <h4 className="mt-8 text-xl font-semibold tracking-[-.04em] text-white">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#c9d0dc]">{detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}