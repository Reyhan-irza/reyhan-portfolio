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
    description: "A personal portfolio built around WhatsApp-related work and experiments.",
    live: "https://reyhan-watsap-portfolio.vercel.app",
    source: "https://github.com/Reyhan-irza/reyhan-portfolio",
  },
];

const education = [
  ["2014–2015", "TK", "Kindergarten"],
  ["2015–2021", "SD", "Elementary School"],
  ["2021–2024", "SMP", "Junior High School"],
  ["2024–present", "SMK", "Vocational High School · SMK Negeri 2 Lubuk Basung · TJKT"],
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
            Motion is unavailable. This static portfolio view remains available.
          </p>
          <nav aria-label="Portfolio sections" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBlock: "1.5rem" }}>
            <a href="#home" style={linkStyle}>Home</a>
            <a href="#projects" style={linkStyle}>Projects</a>
            <a href="#journey" style={linkStyle}>Journey</a>
            <a href="#achievement" style={linkStyle}>Achievements</a>
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
            <p>I’m a student developer who learns by building. I make websites, digital tools, and small experiments.</p>
          </section>
        </header>

        <main>
          <section id="projects" aria-labelledby="fallback-projects-title" style={sectionStyle}>
            <h2 id="fallback-projects-title">Selected projects</h2>
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
              <p>Juara I · Kabupaten Agam · 2025</p>
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
              <li>2nd place · CTF Competition</li>
              <li>VIREON Library · digital library system for books, members, loans, and reports</li>
            </ul>
          </section>

          <section id="contact" aria-labelledby="fallback-contact-title" style={sectionStyle}>
            <h2 id="fallback-contact-title">Contact</h2>
            <p>For a project, a collaboration, or a question about something I built, you can reach me here.</p>
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
            <a href="#projects" style={linkStyle}>Work</a>
            <a href="#journey" style={linkStyle}>Journey</a>
            <a href="#achievement" style={linkStyle}>Award</a>
            <a href="#contact" style={linkStyle}>Contact</a>
          </nav>
          <p>© {new Date().getFullYear()} Reyhan Irza Alvano. All rights reserved.</p>
          <p>Stack: React · TypeScript · Tailwind</p>
        </footer>
      </div>
    </div>
  );
}
