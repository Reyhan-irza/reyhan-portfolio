import { Code2, Database, Layout, Workflow } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";

const notes = [
  { icon: Layout, label: "A student record", text: "I study TJKT at SMK Negeri 2 Lubuk Basung, learning across web software, systems and networking as I build." },
  { icon: Database, label: "Products with a purpose", text: "From a department introduction to a library workspace, the projects below show distinct problems, interfaces and connected flows." },
  { icon: Workflow, label: "Build, inspect, refine", text: "I use the project itself as the evidence: its interface, linked build, repository and the details that can be checked." },
  { icon: Code2, label: "A personal signature", text: "Vierlykirk is the creative signature. The RV geometry is the mark used to connect this portfolio and the work presented here." },
];

export default function AboutSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });
  const notesRef = useScrollAnim({ threshold: 0.1, stagger: 0.09, distance: 16, scale: 0.996 });
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="fade-up grid gap-8 md:grid-cols-[.72fr_1fr] md:gap-20">
          <div data-motion-item>
            <p className="section-kicker">01 / Working notes</p>
            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[.95] tracking-[-.07em] text-[#1b1c18] md:text-6xl">The work is the proof.</h2>
          </div>
          <div data-motion-item>
            <p className="max-w-2xl text-lg leading-relaxed text-[#4e5149] md:text-xl">
              I’m Reyhan Irza Alvano, a student at SMK Negeri 2 Lubuk Basung in TJKT. I learn by building and experimenting across web software and technical systems, then keep the work and verified milestones visible here.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#77796e]">The project pages carry the specifics. Vierlykirk is my signature; the RV mark is the visual thread.</p>
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