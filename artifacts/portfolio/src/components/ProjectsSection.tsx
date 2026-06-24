import { useState, useEffect, useRef } from "react";
import { ExternalLink, Github, ArrowUpRight, X, Calendar, Zap, Target } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "Full-Stack",
    status: "Completed",
    desc: "Modern online store with cart, payment processing, and admin dashboard.",
    tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
    demo: "#", github: "#",
    challenge: "Integrating the Stripe payment gateway with proper handling for various payment failure edge cases.",
    solution: "Implemented Stripe webhooks + idempotency keys to ensure transaction consistency.",
    timeline: "6 weeks",
  },
  {
    id: 2,
    title: "Task Management App",
    category: "Full-Stack",
    status: "Completed",
    desc: "Task management app with drag-and-drop, real-time team collaboration, and notifications.",
    tech: ["Next.js", "TypeScript", "Prisma", "WebSocket"],
    demo: "#", github: "#",
    challenge: "Real-time synchronization between users with conflict resolution during simultaneous edits.",
    solution: "Simple Operational Transform algorithm + WebSocket with room-based broadcasting.",
    timeline: "8 weeks",
  },
  {
    id: 3,
    title: "AI Chat Interface",
    category: "Frontend",
    status: "Completed",
    desc: "AI-powered chat interface with multi-modal capabilities, chat history, and document processing.",
    tech: ["React", "OpenAI API", "TailwindCSS", "Express"],
    demo: "#", github: "#",
    challenge: "Streaming OpenAI responses while keeping the UI responsive and smooth.",
    solution: "Server-Sent Events (SSE) for streaming + optimistic UI updates with React state.",
    timeline: "4 weeks",
  },
  {
    id: 4,
    title: "Portfolio Generator",
    category: "Tool",
    status: "Completed",
    desc: "Online tool for creating professional portfolios with various modern templates.",
    tech: ["Vue.js", "Firebase", "Figma API", "PDF.js"],
    demo: "#", github: "#",
    challenge: "Generating pixel-perfect PDFs from complex HTML/CSS templates.",
    solution: "Puppeteer headless browser for screenshot → PDF conversion with custom CSS media print.",
    timeline: "5 weeks",
  },
  {
    id: 5,
    title: "Social Media Dashboard",
    category: "Analytics",
    status: "Completed",
    desc: "Social media analytics dashboard with data visualization and content scheduling.",
    tech: ["React", "Chart.js", "Python", "REST API"],
    demo: "#", github: "#",
    challenge: "Rate limiting across various social media APIs and caching data to prevent expiry.",
    solution: "Redis-based caching with different TTLs per platform + queue-based API request throttling.",
    timeline: "7 weeks",
  },
  {
    id: 6,
    title: "Mobile Banking UI",
    category: "Mobile",
    status: "Completed",
    desc: "Modern mobile banking UI/UX design with smooth animations and intuitive UX.",
    tech: ["React Native", "Figma", "Lottie", "Expo"],
    demo: "#", github: "#",
    challenge: "Ensuring Lottie animations don't drop frames on low-end Android devices.",
    solution: "Conditional animation rendering based on device capability + static asset fallbacks.",
    timeline: "3 weeks",
  },
];

const categoryColor: Record<string, string> = {
  "Full-Stack": "text-violet-400 bg-violet-500/8 border-violet-500/20",
  "Frontend":   "text-blue-400 bg-blue-500/8 border-blue-500/20",
  "Tool":       "text-emerald-400 bg-emerald-500/8 border-emerald-500/20",
  "Analytics":  "text-amber-400 bg-amber-500/8 border-amber-500/20",
  "Mobile":     "text-sky-400 bg-sky-500/8 border-sky-500/20",
};

export default function ProjectsSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });
  const [modal, setModal] = useState<(typeof projects)[0] | null>(null);
  const viewedRef = useRef(new Set<number>());
  const didAchieve = useRef(false);

  const handleDetail = (project: (typeof projects)[0]) => {
    setModal(project);
    viewedRef.current.add(project.id);
    if (!didAchieve.current && viewedRef.current.size >= projects.length) {
      didAchieve.current = true;
      unlockAchievement(ACHIEVEMENTS.PROJECT_READER);
    }
  };

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  return (
    <section id="projects" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="fade-up text-center mb-16">
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-4">Selected Work</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
            My <span className="gradient-text">Projects</span>
          </h2>
          <div className="rgb-divider w-20 mx-auto mb-6" />
          <p className="text-[#9CA3AF] max-w-xl mx-auto text-base">
            A selection of projects I've built. Click Detail to explore the story behind each one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} delay={i * 70} onDetail={() => handleDetail(p)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setModal(null)}
        >
          <div
            className="modal-enter border border-white/8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/60"
            style={{ background: "#111827" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="relative p-6 pb-5 border-b border-white/6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${categoryColor[modal.category] ?? "text-violet-400 bg-violet-500/8 border-violet-500/20"}`}>
                      {modal.category}
                    </span>
                    <span className="text-white/30 text-[10px] uppercase tracking-wide">#{modal.id}</span>
                  </div>
                  <h3 className="text-white text-xl font-bold">{modal.title}</h3>
                </div>
                <button
                  className="flex-shrink-0 w-8 h-8 rounded-xl border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-200"
                  onClick={() => setModal(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-[#9CA3AF] text-sm leading-relaxed">{modal.desc}</p>

              {/* Tech stack */}
              <div>
                <h4 className="text-white/35 text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {modal.tech.map((t) => (
                    <span key={t} className="px-3 py-1 text-xs rounded-full border border-white/8 text-white/60 font-medium"
                      style={{ background: "rgba(255,255,255,0.03)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl p-4 border border-red-500/12 bg-red-500/4">
                  <h4 className="text-red-400/80 text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Target className="w-3 h-3" /> Challenge
                  </h4>
                  <p className="text-[#9CA3AF] text-xs leading-relaxed">{modal.challenge}</p>
                </div>
                <div className="rounded-xl p-4 border border-emerald-500/12 bg-emerald-500/4">
                  <h4 className="text-emerald-400/80 text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Zap className="w-3 h-3" /> Solution
                  </h4>
                  <p className="text-[#9CA3AF] text-xs leading-relaxed">{modal.solution}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Calendar className="w-4 h-4 text-violet-400/60" />
                <span>Timeline: <span className="text-violet-300/80 font-medium">{modal.timeline}</span></span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <a
                  href={modal.demo}
                  className="btn-neon flex-1 py-3 rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
                <a
                  href={modal.github}
                  className="w-12 h-12 rounded-xl border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ProjectCard({
  project, delay, onDetail,
}: {
  project: (typeof projects)[0];
  delay: number;
  onDetail: () => void;
}) {
  const ref = useScrollAnim<HTMLDivElement>({ threshold: 0.12, delay });

  return (
    <div
      ref={ref}
      className="fade-scale rounded-2xl overflow-hidden border border-white/7 flex flex-col group hover:-translate-y-1 hover:border-violet-500/18 hover:shadow-lg hover:shadow-black/40 transition-all duration-300"
      style={{ background: "#111827" }}
      data-testid={`card-project-${project.id}`}
    >
      {/* Top accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      {/* Thumbnail */}
      <div className="h-24 flex items-center justify-center relative overflow-hidden border-b border-white/5"
        style={{ background: "rgba(139,92,246,0.04)" }}>
        <span className="text-5xl font-black text-white/6 select-none tabular-nums">
          {String(project.id).padStart(2, "0")}
        </span>
        <div className="absolute bottom-2 right-2 flex gap-1">
          {project.tech.slice(0, 2).map((t) => (
            <span key={t} className="px-1.5 py-0.5 text-[10px] rounded border border-white/8 text-white/35"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              {t}
            </span>
          ))}
        </div>
        <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${categoryColor[project.category] ?? "text-violet-400 bg-violet-500/8 border-violet-500/20"}`}>
          {project.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-sm mb-1.5 group-hover:text-violet-300 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-[#9CA3AF] text-xs leading-relaxed flex-1 mb-4">{project.desc}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => (
            <span key={t} className="px-2 py-0.5 text-xs rounded-full border border-white/7 text-white/45"
              style={{ background: "rgba(255,255,255,0.025)" }}>
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <a
            href={project.demo}
            className="btn-neon flex-1 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3 h-3" /> Demo
          </a>
          <button
            onClick={onDetail}
            className="flex-shrink-0 px-3 py-2 rounded-xl border border-white/8 text-white/45 hover:text-violet-300 hover:border-violet-500/30 transition-all duration-200 text-xs flex items-center gap-1"
            style={{ background: "rgba(255,255,255,0.025)" }}
            data-testid={`link-demo-${project.id}`}
          >
            <ArrowUpRight className="w-3 h-3" /> Detail
          </button>
          <a
            href={project.github}
            className="flex-shrink-0 w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.025)" }}
            data-testid={`link-github-${project.id}`}
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
