import { Code2, Database, Layout, Workflow } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";

const notes = [
  { icon: Layout, label: "Rasa ingin tahu sejak 2015", text: "Sekitar 2015, saya sering berkunjung ke warnet dan mulai tertarik pada komputer, meski belum memilikinya sendiri." },
  { icon: Database, label: "Awal belajar coding", text: "Selama pandemi, saya mencoba berbagai kegiatan online untuk mendapat penghasilan tambahan. Dari situ, saya mulai mengenal Python, scripts, dan WhatsApp bots." },
  { icon: Workflow, label: "Belajar lewat tantangan", text: "Pada 2025, saya mulai mengeksplorasi coding dan AI, lalu mengikuti LKS IT Software Solution For Business meski belum pernah belajar C#. Saya menjadi satu-satunya perwakilan sekolah dan meraih Juara I tingkat Kabupaten Agam." },
  { icon: Code2, label: "Terus berkembang", text: "Setelah LKS, saya memperdalam HTML, CSS, JavaScript, dan C#. Pada 2026, saya mengeksplorasi AI-assisted development dengan Replit Agent, TypeScript, dan Tailwind. Saya terus mengerjakan proyek di waktu luang dan ingin menjadi pengembang web full-stack dengan pemahaman AI yang kuat." },
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
              Saya Reyhan, pelajar TJKT di SMK Negeri 2 Lubuk Basung. Saya belajar dengan membangun proyek, mencoba ide, menemukan masalah, lalu memperbaikinya.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#77796e]">Dari rasa ingin tahu di warnet hingga proyek yang saya kerjakan sekarang, proses belajarnya terus berlanjut.</p>
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