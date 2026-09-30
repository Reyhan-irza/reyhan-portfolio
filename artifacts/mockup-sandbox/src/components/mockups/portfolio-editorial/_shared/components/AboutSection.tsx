import { Code2, Database, Layout, Workflow } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";

const notes = [
  { icon: Layout, label: "Interfaces", text: "React and TypeScript interfaces with a strong sense of hierarchy, responsive behavior and readable states." },
  { icon: Database, label: "Connected products", text: "Supabase-backed flows for collections, members, borrowing, reports, news and community comments." },
  { icon: Workflow, label: "Motion with a job", text: "GSAP, ScrollTrigger and Lenis used to explain a page, not to decorate every surface." },
  { icon: Code2, label: "Tools in the record", text: "React, TypeScript, Tailwind CSS, GSAP, ScrollTrigger, Lenis and Supabase appear across the shipped work below." },
];

export default function AboutSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="fade-up grid gap-8 md:grid-cols-[.72fr_1fr] md:gap-20">
          <div>
            <p className="section-kicker">01 / Working notes</p>
            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[.95] tracking-[-.07em] text-[#1b1c18] md:text-6xl">The work is the proof.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-[#4e5149] md:text-xl">
              I am a software-solution builder focused on the part between an idea and something a person can actually use. This portfolio keeps the claims close to the artifacts: what I made, which tools are named in the project, and where it can be opened.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#77796e]">The list below describes my current practice, not proficiency ratings.</p>
          </div>
        </div>
        <div className="mt-16 grid gap-px border-y border-[rgba(27,28,24,.16)] bg-[rgba(27,28,24,.16)] md:grid-cols-2">
          {notes.map(({ icon: Icon, label, text }, index) => (
            <article key={label} className="bg-[#f3f0e8] p-7 md:p-9">
              <div className="flex items-start justify-between gap-5">
                <Icon className="h-5 w-5 text-[#e8836b]" aria-hidden="true" />
                <span className="font-mono text-[10px] text-[#77796e]">0{index + 1}</span>
              </div>
              <h3 className="mt-12 text-xl font-semibold tracking-[-.04em]">{label}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#65675f]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}