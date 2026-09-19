import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ArrowUpRight, ExternalLink, Github, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    short: "TJKT",
    title: "TJKT",
    type: "Information / education",
    description:
      "Website informasi dan pengenalan Jurusan Teknik Jaringan Komputer dan Telekomunikasi SMKN 2 Lubuk Basung.",
    live: "https://tjkt-tech.vercel.app",
    github: "https://github.com/Reyhan-irza/TJKT",
    tech: ["React", "TypeScript", "GSAP", "ScrollTrigger", "Lenis"],
    accent: "TJKT",
  },
  {
    id: 2,
    short: "VR",
    title: "VIREON Library",
    type: "Digital workspace",
    description:
      "Ruang kerja digital untuk koleksi, anggota, peminjaman, dan laporan perpustakaan.",
    live: "https://vireon-lib.vercel.app",
    github: "https://github.com/Reyhan-irza/Library",
    tech: ["React", "TypeScript", "Supabase", "GSAP"],
    accent: "VIREON",
  },
  {
    id: 3,
    short: "WA",
    title: "Reyhan WhatsApp Portfolio",
    type: "Personal portfolio",
    description:
      "Frontend portfolio personal yang modern dan interaktif.",
    live: "https://reyhan-watsap-portfolio.vercel.app",
    github: "https://github.com/Reyhan-irza/reyhan-portfolio",
    tech: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
    accent: "REYHAN",
  },
] as const;

type Project = (typeof projects)[number];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const viewedRef = useRef(new Set<number>());
  const didAchieve = useRef(false);
  const [activeProject, setActiveProject] = useState(0);
  const [modal, setModal] = useState<Project | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const context = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-project-row]", section);

      if (reducedMotion.matches) {
        gsap.set(rows, { clearProps: "all" });
        return;
      }

      rows.forEach((row) => {
        const visual = row.querySelector<HTMLElement>("[data-project-visual]");
        const copy = row.querySelector<HTMLElement>("[data-project-copy]");
        if (!visual || !copy) return;

        gsap.fromTo(
          visual,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 78%",
              toggleActions: "play reverse play reverse",
            },
          },
        );

        gsap.fromTo(
          copy,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.78,
            delay: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 72%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      gsap.fromTo(
        "[data-project-heading]",
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!modal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal]);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const tween = gsap.to(marker, {
      y: activeProject * 31,
      duration: 0.32,
      ease: "power3.out",
      overwrite: true,
    });

    return () => {
      tween.kill();
    };
  }, [activeProject]);

  const markViewed = (project: Project) => {
    viewedRef.current.add(project.id);
    if (!didAchieve.current && viewedRef.current.size === projects.length) {
      didAchieve.current = true;
      unlockAchievement(ACHIEVEMENTS.PROJECT_READER);
    }
  };

  const openDetails = (project: Project) => {
    markViewed(project);
    setModal(project);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--spot-x",
      `${((event.clientX - bounds.left) / bounds.width) * 100}%`,
    );
    event.currentTarget.style.setProperty(
      "--spot-y",
      `${((event.clientY - bounds.top) / bounds.height) * 100}%`,
    );
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="projects-section relative overflow-hidden px-6 py-28 md:py-40"
      data-testid="section-projects"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <div
          data-project-heading
          className="mb-20 flex flex-col gap-8 md:mb-28 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="projects-kicker mb-5">Selected work / three builds</p>
            <h2 className="projects-title max-w-4xl">
              Built to be
              <br />
              <span className="text-[#e8836b]">used.</span>
            </h2>
          </div>
          <p className="projects-intro text-sm md:mb-1 md:text-base">
            Three real products, each with a different job to do. Follow the
            thread from a school department introduction to a working library
            system and a personal interface.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7rem_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-32 flex items-start gap-5">
              <div className="project-rail relative h-24 w-px">
                <span
                  ref={markerRef}
                  className="project-rail-marker absolute -left-[3px] top-0 block h-6 w-[5px]"
                  aria-hidden="true"
                />
              </div>
              <div className="project-index text-xs text-[#94978f]">
                <span className="text-[#e8e7dc]">0{activeProject + 1}</span>
                <span className="mx-1 text-[#e8836b]">/</span>
                0{projects.length}
              </div>
            </div>
          </aside>

          <div>
            {projects.map((project, index) => (
              <article
                key={project.id}
                data-project-row
                tabIndex={0}
                className="project-row"
                onMouseEnter={() => setActiveProject(index)}
                onFocus={() => setActiveProject(index)}
                onTouchStart={() => setActiveProject(index)}
                data-testid={`project-${project.id}`}
                aria-labelledby={`project-title-${project.id}`}
              >
                <div
                  data-project-visual
                  className="project-visual"
                  onPointerMove={handlePointerMove}
                  data-testid={`project-visual-${project.id}`}
                >
                  <div className="project-visual-grid" aria-hidden="true" />
                  <span className="project-stamp">Live build</span>
                  <span className="project-number" aria-hidden="true">
                    0{project.id}
                  </span>
                  <span className="project-wordmark" aria-hidden="true">
                    {project.accent === "VIREON" ? (
                      <>
                        VI<em>RE</em>ON
                      </>
                    ) : project.accent === "REYHAN" ? (
                      <>
                        REY<em>HAN</em>
                      </>
                    ) : (
                      <>
                        T<em>JK</em>T
                      </>
                    )}
                  </span>
                </div>

                <div data-project-copy>
                  <p className="project-type">{project.type}</p>
                  <h3 id={`project-title-${project.id}`} className="project-name">
                    {project.title}
                  </h3>
                  <p className="project-copy">{project.description}</p>

                  <ul className="project-tech-list" aria-label={`${project.title} technologies`}>
                    {project.tech.map((technology) => (
                      <li key={technology} className="project-tech">
                        {technology}
                      </li>
                    ))}
                  </ul>

                  <div className="project-actions">
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      data-testid={`link-live-${project.id}`}
                    >
                      Open live site <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link project-link--quiet"
                      data-testid={`link-github-${project.id}`}
                      aria-label={`Open ${project.title} GitHub repository`}
                    >
                      <Github className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">GitHub repository</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => openDetails(project)}
                      className="project-link project-link--quiet"
                      data-testid={`button-details-${project.id}`}
                      aria-label={`Read more about ${project.title}`}
                    >
                      Note <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[#080a0b]/85 p-5 backdrop-blur-sm"
          role="presentation"
          onClick={() => setModal(null)}
          data-testid="project-detail-overlay"
        >
          <div
            className="project-detail-dialog modal-enter w-full max-w-xl p-6 md:p-9"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-title"
            onClick={(event) => event.stopPropagation()}
            data-testid="project-detail-dialog"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="project-detail-label">Project note / 0{modal.id}</p>
                <h3 id="project-detail-title" className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#e8e7dc] md:text-5xl">
                  {modal.title}
                </h3>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 text-[#94978f] transition-colors hover:text-[#e8e7dc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e8836b]"
                onClick={() => setModal(null)}
                aria-label="Close project note"
                data-testid="button-close-project-detail"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="project-detail-label">What it is</p>
              <p className="mt-3 text-base leading-7 text-[#b6b7ad]">{modal.description}</p>
            </div>

            <div className="mt-7">
              <p className="project-detail-label">Built with</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {modal.tech.map((technology) => (
                  <span key={technology} className="text-sm text-[#e8e7dc]">
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={modal.live}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                data-testid="modal-link-live"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Visit live site
              </a>
              <a
                href={modal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link project-link--quiet"
                data-testid="modal-link-github"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}