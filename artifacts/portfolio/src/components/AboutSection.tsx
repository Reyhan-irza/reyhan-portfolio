import { Code2, Database, Layout, Workflow } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";

const notes = [
  { icon: Layout, label: "Where I’m starting from", text: "I study TJKT at SMK Negeri 2 Lubuk Basung, where I’m learning about networking, systems, and web development." },
  { icon: Database, label: "What I like building", text: "I started with school projects and gradually moved into department websites, digital libraries, and personal web projects. I like making things that have an actual use, even when they start as a simple idea." },
  { icon: Workflow, label: "Build it. See what breaks. Fix it.", text: "I learn a lot from the parts that don’t work the first time. Building a project, finding the problem, and figuring out how to fix it usually teaches me more than just reading about it." },
  { icon: Code2, label: "Why Vierlykirk?", text: "Vierlykirk is the name I use for my creative work. The RV mark became the visual identity behind this portfolio and the projects I put here." },
];

export default function AboutSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });
  const notesRef = useScrollAnim({ threshold: 0.1, stagger: 0.09, distance: 16, scale: 0.996 });
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="fade-up grid gap-8 md:grid-cols-[.72fr_1fr] md:gap-20">
          <div data-motion-item>
            <p className="section-kicker">01 / About</p>
            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[.95] tracking-[-.07em] text-[#1b1c18] md:text-6xl">Still learning. Still building.</h2>
          </div>
          <div data-motion-item>
            <p className="max-w-2xl text-lg leading-relaxed text-[#4e5149] md:text-xl">
              I’m Reyhan, a student at SMK Negeri 2 Lubuk Basung studying TJKT. I learn by building things, testing ideas, breaking them, fixing them, and trying again.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#77796e]">Most of what you see here came from that process.</p>
          </div>
        </div>
        <div ref={notesRef} className="mt-16 grid gap-px border-y border-[rgba(27,28,24,.16)] bg-[rgba(27,28,24,.16)] md:grid-cols-2">
          {notes.map(({ icon: Icon, label, text }, index) => (
            <article key={label} className="bg-[#f3f0e8] p-7 md:p-9" data-motion-item data-motion-card>
              <div className="flex items-start justify-between gap-5">
                 <Icon className="h-5 w-5 text-[#a43f2d]" aria-hidden="true" />
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