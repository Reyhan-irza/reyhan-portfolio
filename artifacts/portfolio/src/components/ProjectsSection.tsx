import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ExternalLink, Github, X } from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger, SCENE } from "../lib/motion";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";
import Reveal from "./Reveal";

// Product previews are direct captures of the linked public sites, not recreated UI.
const projects = [
  {
    id: 1,
    short: "TJKT",
    title: "TJKT",
    type: "Department website",
    description:
      "Website pengenalan jurusan TJKT di SMK Negeri 2 Lubuk Basung, merangkum identitas jurusan dan kegiatannya.",
    live: "https://tjkt-tech.vercel.app",
    github: "https://github.com/Reyhan-irza/TJKT",
    tech: ["React", "TypeScript", "GSAP", "ScrollTrigger", "Lenis"],
    preview: {
      src: `${import.meta.env.BASE_URL}project-previews/tjkt-homepage.webp`,
      width: 1440,
      height: 1000,
      alt: "TJKT department website homepage with its school identity and networking-program information.",
    },
    accent: "TJKT",
  },
  {
    id: 2,
    short: "VR",
    title: "VIREON Library",
    type: "Digital library",
    description:
      "Perpustakaan digital untuk mengelola buku, anggota, peminjaman, dan laporan dalam satu alur.",
    live: "https://vireon-lib.vercel.app",
    github: "https://github.com/Reyhan-irza/Library",
    tech: ["React", "TypeScript", "Supabase", "GSAP"],
    preview: {
      src: `${import.meta.env.BASE_URL}project-previews/vireon-library.webp`,
      width: 1440,
      height: 857,
      alt: "VIREON Library landing page with a library-management dashboard preview and workflow summary.",
    },
    accent: "VIREON",
  },
  {
    id: 3,
    short: "WA",
    title: "Reyhan WhatsApp Portfolio",
    type: "Personal portfolio",
    description:
      "Portofolio personal yang merangkum karya dan eksperimen saya seputar WhatsApp.",
    live: "https://reyhan-watsap-portfolio.vercel.app",
    github: "https://github.com/Reyhan-irza/reyhan-portfolio",
    tech: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
    preview: {
      src: `${import.meta.env.BASE_URL}project-previews/reyhan-portfolio.webp`,
      width: 1440,
      height: 857,
      alt: "Reyhan Irza Alvano portfolio homepage captured from the public WhatsApp-related portfolio site.",
    },
    accent: "REYHAN",
  },
] as const;

type Project = (typeof projects)[number];

export default function ProjectsSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const skipFocusRestoreRef = useRef(false);
  const viewedRef = useRef(new Set<number>());
  const didAchieve = useRef(false);
  const activeProjectRef = useRef(0);
  const [activeProject, setActiveProject] = useState(0);
  const [modal, setModal] = useState<Project | null>(null);

  const updateActiveProject = (index: number) => {
    const next = Math.max(0, Math.min(projects.length - 1, index));
    if (activeProjectRef.current === next) return;
    activeProjectRef.current = next;
    setActiveProject(next);
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, ({ conditions }) => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-project-row]", section);
      rows.forEach((row, index) => {
        ScrollTrigger.create({
          trigger: row, start: "top 52%", end: "bottom 52%",
          onEnter: () => updateActiveProject(index), onEnterBack: () => updateActiveProject(index),
        });
        if (conditions?.reduced) return;
        const q = gsap.utils.selector(row);
        // Measure the stationary article. Only its inner presentation and mask planes move.
        const entry = gsap.timeline({ defaults: { ease: "sine.out" }, scrollTrigger: {
          id: `work-entry-${index + 1}`, trigger: row, start: "clamp(top 96%)",
          end: () => `+=${Math.min(row.offsetHeight * .90, document.documentElement.clientHeight * .80)}`,
          scrub: .30, invalidateOnRefresh: true,
        }});
        entry.fromTo(q("[data-project-lift]"), { y: () => Math.min(64, row.offsetHeight * .085) },
          { y: 0, duration: 1.06 }, 0)
          .fromTo(q("[data-project-name]"), { yPercent: 96 }, { yPercent: 0, duration: .53 }, .03)
          .fromTo(q(".project-type"), { x: -14, opacity: .4 }, { x: 0, opacity: 1, duration: .48 }, .02)
          .fromTo(q("[data-card-mask]"), { yPercent: 88 }, { yPercent: 0, duration: .81, ease: "sine.inOut" }, .08)
          .fromTo(q("[data-card-surface]"), { yPercent: -88 }, { yPercent: 0, duration: .81, ease: "sine.inOut" }, .08)
          .fromTo(q(".project-copy"), { y: 20, opacity: .4 }, { y: 0, opacity: 1, duration: .53 }, .40)
          .fromTo(q(".project-tech-list, .project-actions"), { y: 12, opacity: .62 },
            { y: 0, opacity: 1, duration: .39, stagger: .10 }, .56);
        gsap.fromTo(q("[data-project-depth]"), { yPercent: 4, scale: 1.085 },
          { yPercent: -4, scale: 1.015, ease: "none", scrollTrigger: { trigger: row,
            start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: SCENE.scrub, invalidateOnRefresh: true } });
      });
      if (progressFillRef.current && conditions?.motion) gsap.fromTo(progressFillRef.current,
        { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: section,
          start: "clamp(top center)", end: "clamp(bottom center)", scrub: true } });
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    if (!modal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const closeForSectionNavigation = () => {
      skipFocusRestoreRef.current = true;
      setModal(null);
    };
    const handleInPageNavigation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('a[href^="#"]')) return;
      closeForSectionNavigation();
    };
    document.addEventListener("click", handleInPageNavigation, true);
    window.addEventListener("hashchange", closeForSectionNavigation);
    window.addEventListener("popstate", closeForSectionNavigation);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleInPageNavigation, true);
      window.removeEventListener("hashchange", closeForSectionNavigation);
      window.removeEventListener("popstate", closeForSectionNavigation);

    };
  }, [modal]);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.to(marker, {
        y: activeProject * 31,
        duration: SCENE.detail,
        ease: "power3.out",
        overwrite: true,
      });
      return () => tween.kill();
    });

    return () => {
      media.revert();
    };
  }, [activeProject]);

  const markViewed = (project: Project) => {
    viewedRef.current.add(project.id);
    if (!didAchieve.current && viewedRef.current.size === projects.length) {
      didAchieve.current = true;
      unlockAchievement(ACHIEVEMENTS.PROJECT_READER);
    }
  };

  const openDetails = (project: Project, trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
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
    <LazyMotion features={domAnimation}>
    <section
      ref={sectionRef}
      id="projects"
      className="projects-section relative px-6 py-28 md:py-40"
      data-testid="section-projects"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal
          className="projects-heading mb-20 flex flex-col gap-8 md:mb-28 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="projects-kicker mb-5">Selected work</p>
            <h2 className="projects-title max-w-4xl">
              <span className="block overflow-hidden"><span data-heading-line className="block">Dari ide</span></span>
              <span className="block overflow-hidden"><span data-heading-line className="project-heading-accent text-[#a43f2d] block">jadi karya.</span></span>
            </h2>
          </div>
          <p data-project-intro className="projects-intro text-base md:mb-1 md:text-lg">
            Tiga proyek dengan tujuan berbeda: situs jurusan sekolah, perpustakaan digital, dan portofolio pribadi.
          </p>
        </Reveal>

        <div data-project-stage className="project-stage grid grid-cols-1 gap-8 lg:grid-cols-[7rem_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-32 flex items-start gap-5">
              <div className="project-rail relative h-24 w-px">
                <span
                  ref={progressFillRef}
                  className="project-story-progress-fill absolute inset-0 block w-px"
                  aria-hidden="true"
                />
                <span
                  ref={markerRef}
                  className="project-rail-marker absolute -left-[3px] top-0 block h-6 w-[5px]"
                  aria-hidden="true"
                />
              </div>
              <div className="project-index text-xs text-[#94978f]">
                <span className="text-[#e8e7dc]">0{activeProject + 1}</span>
                 <span className="mx-1 text-[#a43f2d]">/</span>
                0{projects.length}
              </div>
            </div>
          </aside>

          <div className="project-stage-content">
            <div data-project-track-viewport className="project-track-viewport">
              <div data-project-track className="project-track">
                {projects.map((project, index) => {
                  return (
                    <article
                      key={project.id}
                      data-project-row
                      data-reveal-group
                      data-project-index={index}
                      data-active-project={activeProject === index ? "true" : "false"}
                      className="project-row"
                      data-testid={`project-${project.id}`}
                      aria-labelledby={`project-title-${project.id}`}
                    >
                      <div data-project-lift className="project-presentation">
                        <header className="project-meta">
                          <p className="project-type">{project.type}</p>
                          <h3 id={`project-title-${project.id}`} className="project-name">
                            <span data-project-name>{project.title}</span>
                          </h3>
                        </header>
                        <div className="project-aperture min-w-0">
                          <div data-card-mask className="project-aperture__mask">
                            <div data-card-surface>
                              <div
                                data-project-visual
                                className="project-visual project-visual--screenshot"
                                onPointerMove={handlePointerMove}
                                data-testid={`project-visual-${project.id}`}
                              >
                                <div data-project-depth className="project-image-depth">
                                  <img
                                    className="project-screenshot"
                                    src={project.preview.src}
                                    alt={project.preview.alt}
                                    width={project.preview.width}
                                    height={project.preview.height}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                </div>
                                <div className="project-visual-grid" aria-hidden="true" />
                                <span className="project-stamp">Cuplikan situs</span>
                                <span className="project-number" aria-hidden="true">
                                  0{project.id}
                                </span>
                                <span className="project-wordmark" aria-hidden="true">
                                  <span data-project-wordmark-motion className="inline-block whitespace-nowrap">
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
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div data-project-copy className="min-w-0">
                          <p className="project-copy">{project.description}</p>
                          <ul className="project-tech-list" aria-label={`Teknologi ${project.title}`}>
                            {project.tech.map((technology) => (
                              <li key={technology} className="project-tech">
                                {technology}
                              </li>
                            ))}
                          </ul>
                          <div className="project-actions">
                            <m.a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-link"
                              data-testid={`link-live-${project.id}`}
                              whileHover={reduceMotion ? undefined : { y: -2 }}
                              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                              transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            >
                              Open live site <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </m.a>
                            <m.a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-link project-link--quiet project-github-link"
                              data-testid={`link-github-${project.id}`}
                              aria-label={`Open ${project.title} GitHub repository`}
                              whileHover={reduceMotion ? undefined : { y: -2 }}
                              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                              transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            >
                              <Github className="h-4 w-4" aria-hidden="true" />
                              <span>GitHub</span>
                            </m.a>
                            <m.button
                              type="button"
                              onClick={(event) => openDetails(project, event.currentTarget)}
                              className="project-link project-link--quiet"
                              data-testid={`button-details-${project.id}`}
                              aria-label={`Baca selengkapnya tentang ${project.title}`}
                              whileHover={reduceMotion ? undefined : { y: -2 }}
                              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                              transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            >
                              Detail <span aria-hidden="true">+</span>
                            </m.button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence onExitComplete={() => {
          if (skipFocusRestoreRef.current) { skipFocusRestoreRef.current = false; return; }
          if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
        }}>
        {modal && <m.div
          key="project-detail-overlay"
          className="project-detail-overlay"
          data-lenis-prevent
          role="presentation"
          onClick={() => setModal(null)}
          data-testid="project-detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <m.div
            ref={dialogRef}
            className="project-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-title"
            aria-describedby="project-detail-description"
            onClick={(event) => event.stopPropagation()}
            data-testid="project-detail-dialog"
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.995 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="project-detail-header">
              <div className="project-detail-heading">
                <p className="project-detail-label">Project / 0{modal.id}</p>
                <h3 id="project-detail-title">{modal.title}</h3>
                <p className="project-detail-type">{modal.type}</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="project-detail-close"
                onClick={() => setModal(null)}
                aria-label="Close project details"
                data-testid="button-close-project-detail"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <figure className="project-detail-preview">
              <div
                className="project-detail-image-frame"
                style={{ aspectRatio: `${modal.preview.width} / ${modal.preview.height}` }}
              >
                <img
                  src={modal.preview.src}
                  alt={modal.preview.alt}
                  width={modal.preview.width}
                  height={modal.preview.height}
                  decoding="async"
                />
                <span className="project-detail-image-index" aria-hidden="true">0{modal.id}</span>
              </div>
              <figcaption>
                <span>Site capture</span>
                <span aria-hidden="true">/</span>
                <span>{modal.title}</span>
              </figcaption>
            </figure>

            <div className="project-detail-content">
              <section className="project-detail-about">
                <p className="project-detail-label">About this project</p>
                <p id="project-detail-description">{modal.description}</p>
              </section>
              <section className="project-detail-stack" aria-label={`Technologies used in ${modal.title}`}>
                <p className="project-detail-label">Built with</p>
                <ul>
                  {modal.tech.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </section>
            </div>

            <footer className="project-detail-footer">
              <a
                href={modal.live}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                data-testid="modal-link-live"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Visit live site
                <ArrowUpRight className="project-detail-link-arrow" aria-hidden="true" />
              </a>
              <a
                href={modal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link project-link--quiet project-github-link"
                data-testid="modal-link-github"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </footer>
          </m.div>
        </m.div>}
        </AnimatePresence>,
        document.body,
      )}
    </section>
    </LazyMotion>
  );
}
