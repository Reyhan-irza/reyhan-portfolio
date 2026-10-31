import { Code2, Database, Layout, Workflow } from "lucide-react";
import Reveal from "./Reveal";

const notes = [
  { icon: Layout, label: "Mulanya, dari warnet", text: "Sekitar 2015, saya sering mampir ke warnet. Dari sana tumbuh rasa penasaran pada komputer, meski waktu itu saya belum punya komputer sendiri." },
  { icon: Database, label: "Mencoba hal pertama", text: "Selama pandemi, saya mencoba berbagai kegiatan online untuk mendapat penghasilan tambahan. Di perjalanan itu saya berkenalan dengan Python, scripts, dan WhatsApp bots." },
  { icon: Workflow, label: "Berani belajar sambil jalan", text: "Pada 2025, saya mulai mengeksplorasi coding dan AI, lalu mengikuti LKS IT Software Solution For Business tanpa pengalaman belajar C#. Saya menjadi satu-satunya perwakilan sekolah dan meraih Juara I tingkat Kabupaten Agam." },
  { icon: Code2, label: "Masih banyak yang ingin dipelajari", text: "Setelah LKS, saya memperdalam HTML, CSS, JavaScript, dan C#. Pada 2026, saya mulai mengeksplorasi AI-assisted development dengan Replit Agent, TypeScript, dan Tailwind. Saya terus membangun proyek di waktu luang, dengan tujuan menjadi pengembang web full-stack yang punya pemahaman AI kuat." },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="story-intro grid gap-8 md:grid-cols-[.72fr_1fr] md:gap-20">
          <div>
            <p className="section-kicker">01 / About</p>
            <h2 className="portfolio-section-heading mt-5 max-w-md font-semibold tracking-[-.07em] text-[#1b1c18]">Still learning. Still building.</h2>
          </div>
          <div>
            <p className="story-lead max-w-2xl text-lg leading-relaxed md:text-xl">
              Saya Reyhan, pelajar TJKT di SMK Negeri 2 Lubuk Basung. Saya belajar lewat proyek: mencoba ide, menemukan masalah, lalu memperbaikinya—satu langkah kecil setiap kali.
            </p>
            <p className="story-aside mt-5 max-w-2xl text-base leading-relaxed">Kalau kamu suka melihat proses di balik sebuah karya, semoga cerita ini menyenangkan untuk diikuti.</p>
          </div>
        </Reveal>
        <div className="story-notes mt-16 grid gap-px border-y border-[rgba(255,255,255,.12)] bg-[rgba(255,255,255,.12)] md:grid-cols-2">
          {notes.map(({ icon: Icon, label, text }, index) => (
            <Reveal key={label} as="article" className="story-note p-7 md:p-9" staggerIndex={index}>
              <div className="flex items-start justify-between gap-5">
                 <Icon className="h-5 w-5 text-[#a43f2d]" aria-hidden="true" />
                <span className="font-mono text-[10px] text-[#77796e]">0{index + 1}</span>
              </div>
              <h3 className="mt-12 text-xl font-semibold tracking-[-.04em]">{label}</h3>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-[#65675f]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}