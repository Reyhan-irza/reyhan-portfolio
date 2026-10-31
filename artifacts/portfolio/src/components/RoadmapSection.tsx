import { Circle, BookOpen, Blocks, Compass } from "lucide-react";
import Reveal from "./Reveal";

const roadmap = [
  { label: "Practice", title: "Learn by making", desc: "Saya terus memperdalam HTML, CSS, JavaScript, C#, TypeScript, dan Tailwind sambil mengubah hal yang dipelajari menjadi proyek.", Icon: BookOpen },
  { label: "Projects", title: "Try, then refine", desc: "Di waktu luang, saya mengerjakan proyek untuk mendapat lebih banyak pengalaman praktik.", Icon: Blocks },
  { label: "Goal", title: "Full-stack, with AI fluency", desc: "Saya ingin menjadi pengembang web full-stack dengan pemahaman praktis AI yang kuat.", Icon: Compass },
] as const;

export default function RoadmapSection() {

  return (
    <section id="roadmap" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="story-intro grid gap-8 border-b border-[rgba(255,255,255,.12)] pb-10 md:grid-cols-[1fr_1fr]">
          <div><p className="section-kicker">What I’m working on</p><h2 className="portfolio-section-heading mt-5 font-semibold tracking-[-.07em]">Learning as I go.</h2></div>
          <p className="story-aside max-w-md text-base leading-relaxed">Saya belum sampai di tujuan. Untuk sekarang, langkah berikutnya tetap sederhana: belajar sesuatu, lalu mencoba memakainya.</p>
        </Reveal>
        <ol className="story-roadmap mt-5 divide-y divide-[rgba(255,255,255,.12)] border-b border-[rgba(255,255,255,.12)]">
          {roadmap.map(({ label, title, desc, Icon }, index) => (
            <Reveal key={title} as="li" staggerIndex={index} className="grid gap-4 py-6 md:grid-cols-[6rem_1fr_1.2fr_auto] md:items-start md:gap-8">
               <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#a43f2d]">{label}</span>
              <div className="flex items-start gap-3">
                <Icon className="mt-1 h-4 w-4 shrink-0 text-[#65675f]" aria-hidden="true" />
                <h3 className="text-lg font-semibold tracking-[-.035em]">{title}</h3>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-[#65675f]">{desc}</p>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#65675f] md:justify-self-end">
                  <Circle className="h-2.5 w-2.5" aria-hidden="true" />
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}