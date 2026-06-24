import { useScrollAnim } from "../hooks/useScrollAnim";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";
import { useEffect, useRef } from "react";
import { Leaf, Atom, Rocket, Briefcase, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const milestones = [
  {
    year: "2022",
    title: "The Beginning",
    desc: "Started learning HTML, CSS, and JavaScript from scratch. Built my first webpage — a simple profile page that became my first source of pride.",
    Icon: Leaf,
    isCurrent: false,
  },
  {
    year: "2023",
    title: "Falling for React",
    desc: "Fell in love with React and TypeScript. Began understanding component architecture, state management, and the modern frontend ecosystem.",
    Icon: Atom,
    isCurrent: false,
  },
  {
    year: "2024",
    title: "Full-Stack Journey",
    desc: "Explored backend development with Node.js, Express, and PostgreSQL. Built my first full-stack REST API and end-to-end applications.",
    Icon: Rocket,
    isCurrent: false,
  },
  {
    year: "2025",
    title: "Real Projects",
    desc: "Worked on projects for my first clients. Learned a great deal about communication, deadlines, and the importance of great UX.",
    Icon: Briefcase,
    isCurrent: false,
  },
  {
    year: "2026",
    title: "Premium Portfolio",
    desc: "Built this premium personal brand platform — modern, interactive, and crafted with precision. Ready for bigger opportunities.",
    Icon: Sparkles,
    isCurrent: true,
  },
] satisfies {
  year: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  isCurrent?: boolean;
}[];

export default function JourneySection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });
  const didFire   = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !didFire.current) {
        didFire.current = true;
        unlockAchievement(ACHIEVEMENTS.JOURNEY_READER);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    const el = document.getElementById("journey");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="journey" className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div ref={headerRef} className="fade-up text-center mb-16">
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-4">My Story</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
            My <span className="gradient-text">Journey</span>
          </h2>
          <div className="rgb-divider w-20 mx-auto mb-6" />
          <p className="text-[#9CA3AF] max-w-md mx-auto text-base leading-relaxed">
            A developer's path from zero to building premium digital experiences.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px timeline-line opacity-25 md:-translate-x-px" />

          <div className="flex flex-col gap-8">
            {milestones.map((m, i) => {
              const isRight = i % 2 !== 0;
              return <TimelineItem key={m.year} item={m} isRight={isRight} delay={i * 100} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  item, isRight, delay,
}: {
  item: (typeof milestones)[0];
  isRight: boolean;
  delay: number;
}) {
  const ref = useScrollAnim<HTMLDivElement>({ threshold: 0.2, delay });
  const { Icon } = item;

  return (
    <div className={`relative flex items-start gap-6 md:gap-0 ${isRight ? "md:flex-row-reverse" : "md:flex-row"}`}>
      {/* Dot */}
      <div
        className="absolute left-6 md:left-1/2 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-[#050816] -translate-x-1 md:-translate-x-1.5 mt-5 z-10 flex-shrink-0"
      />

      {/* Card */}
      <div className={`pl-14 md:pl-0 md:w-[calc(50%-2rem)] ${isRight ? "md:pl-8" : "md:pr-8"}`}>
        <div
          ref={ref}
          className={`${isRight ? "fade-right" : "fade-left"} rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 ${
            item.isCurrent
              ? "border-violet-500/30 ring-1 ring-violet-500/10"
              : "border-white/7 hover:border-violet-500/15"
          }`}
          style={{ background: "#111827" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/8 border border-violet-500/15 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4.5 h-4.5 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">{item.year}</span>
              <h3 className="text-white font-semibold text-sm leading-tight">{item.title}</h3>
            </div>
            {item.isCurrent && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-semibold flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Now
              </span>
            )}
          </div>
          <p className="text-[#9CA3AF] text-xs leading-relaxed">{item.desc}</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
    </div>
  );
}
