import type { CSSProperties } from "react";

const projects = [
  {
    title: "TJKT",
    description: "A website introducing the TJKT department at SMK Negeri 2 Lubuk Basung, including its activities and identity.",
    live: "https://tjkt-tech.vercel.app",
    source: "https://github.com/Reyhan-irza/TJKT",
  },
  {
    title: "VIREON Library",
    description: "A digital library system for managing books, members, loans, and reports.",
    live: "https://vireon-lib.vercel.app",
    source: "https://github.com/Reyhan-irza/Library",
  },
  {
    title: "Reyhan WhatsApp Portfolio",
    description: "A personal portfolio built around my WhatsApp-related work and experiments.",
    live: "https://reyhan-watsap-portfolio.vercel.app",
    source: "https://github.com/Reyhan-irza/reyhan-portfolio",
  },
];

const education = [
  ["2014–2015", "TK", "Taman Kanak-kanak"],
  ["2015–2021", "SD", "Sekolah Dasar"],
  ["2021–2024", "SMP", "Sekolah Menengah Pertama"],
    ["2024–sekarang", "SMK", "Sekolah Menengah Kejuruan · SMK Negeri 2 Lubuk Basung · TJKT"],
];

const contacts = [
  ["Email", "mailto:irzanour@gmail.com"],
  ["WhatsApp · ReyhanWhatsap", "https://wa.me/62881385242876"],
  ["Instagram · @irzalvano_", "https://www.instagram.com/irzalvano_?igsh=ZXRqM2lvY3EyY2Nj"],
  ["TikTok · @rehanwatsav", "https://www.tiktok.com/@rehanwatsav?_r=1&_t=ZS-95Kk0Lxdw5B"],
];

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "clamp(1rem, 4vw, 3rem)",
  background: "#05070b",
  color: "#f5f7fa",
  fontFamily: "Manrope, system-ui, sans-serif",
  lineHeight: 1.6,
};

const contentStyle: CSSProperties = {
  width: "min(100%, 64rem)",
  marginInline: "auto",
  overflowWrap: "anywhere",
};

const sectionStyle: CSSProperties = {
  paddingBlock: "2rem",
  borderBottom: "1px solid rgba(255,255,255,.12)",
  scrollMarginTop: "1rem",
};

const linkStyle: CSSProperties = {
  color: "#aab4ff",
  textUnderlineOffset: "0.2em",
  overflowWrap: "anywhere",
};

export default function MotionFallback() {
  const certificateBase = import.meta.env.BASE_URL;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <header style={sectionStyle}>
          <p role="status" style={{ color: "#aab4ff", fontSize: ".875rem" }}>
            Motion is unavailable. This static portfolio version is still usable.
          </p>
          <nav aria-label="Portfolio sections" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBlock: "1.5rem" }}>
            <a href="#home" style={linkStyle}>Home</a>
            <a href="#about" style={linkStyle}>About</a>
            <a href="#projects" style={linkStyle}>Projects</a>
            <a href="#journey" style={linkStyle}>Journey</a>
            <a href="#achievement" style={linkStyle}>Awards</a>
            <a href="#contact" style={linkStyle}>Contact</a>
          </nav>
          <section id="home" aria-labelledby="fallback-title">
            <p style={{ color: "#aab4ff", fontSize: ".8rem", letterSpacing: ".12em" }}>
              STUDENT DEVELOPER / LUBUK BASUNG, INDONESIA
            </p>
            <h1 id="fallback-title" style={{ fontSize: "clamp(2.25rem, 9vw, 5rem)", lineHeight: 1.05, marginBlock: ".75rem" }}>
              Reyhan Irza Alvano
            </h1>
            <p>Student Developer · SMK</p>
            <p>Halo, saya Reyhan. Cerita saya dengan komputer dimulai sekitar 2015, dari kunjungan-kunjungan ke warnet. Sekarang, saya belajar web dengan membangun proyek, mencoba, lalu memperbaikinya.</p>
          </section>
        </header>

        <main>
          <section id="about" aria-labelledby="fallback-about-title" style={sectionStyle}>
            <h2 id="fallback-about-title">About</h2>
            <p>Sekitar 2015, saya sering mampir ke warnet. Dari sana tumbuh rasa penasaran pada komputer, meski waktu itu saya belum punya komputer sendiri.</p>
            <p>Selama pandemi, saya mencoba berbagai kegiatan online untuk mendapat penghasilan tambahan. Di perjalanan itu saya berkenalan dengan Python, scripts, dan WhatsApp bots.</p>
            <p>Pada 2025, saya mulai mengeksplorasi coding dan AI, lalu mengikuti LKS IT Software Solution For Business tanpa pengalaman belajar C#. Saya menjadi satu-satunya perwakilan sekolah dan meraih Juara I tingkat Kabupaten Agam.</p>
            <p>Setelah LKS, saya memperdalam HTML, CSS, JavaScript, dan C#. Pada 2026, saya mulai mengeksplorasi AI-assisted development dengan Replit Agent, TypeScript, dan Tailwind. Saya terus membangun proyek di waktu luang, dengan tujuan menjadi pengembang web full-stack yang punya pemahaman AI kuat.</p>
          </section>

          <section id="projects" aria-labelledby="fallback-projects-title" style={sectionStyle}>
            <h2 id="fallback-projects-title">Selected work</h2>
            {projects.map((project) => (
              <article key={project.title} style={{ paddingBlock: "1rem", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  <a href={project.live} target="_blank" rel="noreferrer" style={linkStyle}>Open project</a>
                  <a href={project.source} target="_blank" rel="noreferrer" style={linkStyle}>Source code</a>
                </p>
              </article>
            ))}
          </section>

          <section id="journey" aria-labelledby="fallback-journey-title" style={sectionStyle}>
            <h2 id="fallback-journey-title">Education timeline</h2>
            <ol style={{ paddingInlineStart: "1.5rem" }}>
              {education.map(([period, level, detail]) => (
                <li key={level} style={{ paddingBlock: ".5rem" }}>
                  <strong>{period} · {level}</strong>
                  <div>{detail}</div>
                </li>
              ))}
            </ol>
          </section>

          <section id="achievement" aria-labelledby="fallback-awards-title" style={sectionStyle}>
            <h2 id="fallback-awards-title">Achievements and certificates</h2>
            <article>
              <h3>LKS IT Software Solution For Business</h3>
              <p>Satu-satunya perwakilan sekolah · Juara I · Kabupaten Agam · 2025</p>
              <a href={`${certificateBase}sertifikat-lks-it-software-solution-2025.pdf`} target="_blank" rel="noreferrer" style={linkStyle}>
                View 2025 certificate (PDF)
              </a>
            </article>
            <article style={{ marginBlockStart: "1rem" }}>
              <h3>Aplikasi Pustaka Digital</h3>
              <p>Sertifikat penghargaan · SMK Negeri 2 Lubuk Basung · Agustus 2026</p>
              <a href={`${certificateBase}sertifikat-apresiasi-inovasi-digital-2026.webp`} target="_blank" rel="noreferrer" style={linkStyle}>
                View 2026 certificate
              </a>
            </article>
            <ul>
              <li>Posisi kedua · CTF Competition</li>
              <li>VIREON Library · a digital library system for managing books, members, loans, and reports</li>
            </ul>
          </section>

          <section id="contact" aria-labelledby="fallback-contact-title" style={sectionStyle}>
            <h2 id="fallback-contact-title">Contact</h2>
            <p>Untuk proyek, kolaborasi, atau pertanyaan seputar karya saya, silakan hubungi saya.</p>
            <ul>
              {contacts.map(([label, href]) => (
                <li key={label} style={{ paddingBlock: ".3rem" }}>
                  <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" style={linkStyle}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <footer style={{ paddingBlock: "2rem" }}>
          <nav aria-label="Footer navigation" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <a href="#home" style={linkStyle}>Home</a>
            <a href="#projects" style={linkStyle}>Projects</a>
            <a href="#journey" style={linkStyle}>Journey</a>
            <a href="#achievement" style={linkStyle}>Awards</a>
            <a href="#contact" style={linkStyle}>Contact</a>
          </nav>
          <p>© {new Date().getFullYear()} Reyhan Irza Alvano. All rights reserved.</p>
          <p>Built with React · TypeScript · Tailwind</p>
        </footer>
      </div>
    </div>
  );
}
