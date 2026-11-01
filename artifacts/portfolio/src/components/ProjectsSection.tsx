import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FocusEvent, PointerEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ExternalLink, Github, X } from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "../lib/motion";
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
      "A website introducing the TJKT department at SMK Negeri 2 Lubuk Basung, including its activities and identity.",
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
      "A digital library system for managing books, members, loans, and reports.",
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
      "A personal portfolio built around my WhatsApp-related work and experiments.",
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
  const focusRestoreTimerRef = useRef<number | null>(null);
  const focusRestoreFrameRef = useRef<number | null>(null);
  const viewedRef = useRef(new Set<number>());
  const didAchieve = useRef(false);
  const activeProjectRef = useRef(0);
  const [activeProject, setActiveProject] = useState(0);
  const [pinnedStoryActive, setPinnedStoryActive] = useState(false);
  const [focusedProject, setFocusedProject] = useState<number | null>(null);
  const [modal, setModal] = useState<Project | null>(null);

  const updatePinnedStoryActive = (active: boolean) => {
    setPinnedStoryActive(active);
  };

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
    let restoreProjectFrame = 0;
    media.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        wide: "(min-width: 768px)",
        desktop: "(min-width: 1024px)",
      },
      (mediaContext) => {
        if (mediaContext.conditions?.reduced) return;
        let resizeObserver: ResizeObserver | undefined;
        let refreshFrame = 0;
        let sizedTrack: HTMLElement | null = null;
        let horizontalStoryPinned = false;
        const context = gsap.context(() => {
          const rows = gsap.utils.toArray<HTMLElement>("[data-project-row]", section);
          const viewport = section.querySelector<HTMLElement>("[data-project-track-viewport]");
          const track = section.querySelector<HTMLElement>("[data-project-track]");
          const stage = section.querySelector<HTMLElement>("[data-project-stage]");
          const hasHorizontalStory = Boolean(
            mediaContext.conditions?.desktop && viewport && track && stage && rows.length > 1,
          );

          if (hasHorizontalStory && viewport && track && stage) {
            sizedTrack = track;
            const setSlideWidth = () => {
              track.style.setProperty("--project-slide-width", `${viewport.clientWidth}px`);
            };
            setSlideWidth();

            const slideWidth = () => viewport.clientWidth;
            const travelDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
            const panelStep = 1 / (rows.length - 1);
            const horizontalStory = gsap.to(track, {
              x: () => -travelDistance(),
              ease: "none",
              scrollTrigger: {
                id: "portfolio-project-story",
                trigger: stage,
                start: "top top+=96",
                end: () => `+=${travelDistance() + window.innerWidth * 0.22}`,
                pin: stage,
                pinSpacing: true,
                scrub: 0.8,
                snap: {
                  snapTo: (progress) => {
                    const focusedRow = document.activeElement instanceof HTMLElement
                      ? document.activeElement.closest<HTMLElement>("[data-project-row]")
                      : null;
                    const focusedIndex = Number(focusedRow?.dataset.projectIndex);
                    if (
                      section.contains(focusedRow) &&
                      Number.isInteger(focusedIndex) &&
                      focusedIndex >= 0 &&
                      focusedIndex < rows.length
                    ) {
                      return focusedIndex * panelStep;
                    }
                    return Math.round(progress / panelStep) * panelStep;
                  },
                  directional: false,
                  inertia: false,
                  delay: 0.12,
                  duration: { min: 0.2, max: 0.48 },
                  ease: "power2.inOut",
                },
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onEnter: () => {
                  horizontalStoryPinned = true;
                  updatePinnedStoryActive(true);
                },
                onEnterBack: () => {
                  horizontalStoryPinned = true;
                  updatePinnedStoryActive(true);
                },
                onUpdate: (self) => {
                  progressFillRef.current?.style.setProperty(
                    "--project-story-progress",
                    String(self.progress),
                  );
                  const progressAcrossSlides = self.progress * travelDistance();
                  const nextIndex = Math.min(
                    rows.length - 1,
                    Math.round(progressAcrossSlides / slideWidth()),
                  );
                  updateActiveProject(nextIndex);
                },
                onLeaveBack: () => {
                  progressFillRef.current?.style.setProperty("--project-story-progress", "0");
                  horizontalStoryPinned = false;
                  updatePinnedStoryActive(false);
                  updateActiveProject(0);
                },
                onLeave: () => {
                  horizontalStoryPinned = false;
                  updatePinnedStoryActive(false);
                },
              },
            });

            resizeObserver = new ResizeObserver(() => {
              setSlideWidth();
              if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
              refreshFrame = window.requestAnimationFrame(() => {
                refreshFrame = 0;
                ScrollTrigger.refresh();
              });
            });
            resizeObserver.observe(viewport);
          }

          if (!hasHorizontalStory) {
            rows.forEach((row) => {
              const visual = row.querySelector<HTMLElement>("[data-project-visual]");
              const copy = row.querySelector<HTMLElement>("[data-project-copy]");
              if (!visual || !copy) return;
              const projectIndex = Number(row.dataset.projectIndex);
              gsap.fromTo(copy, { y: 38 }, { y: 0, ease: "none",
                scrollTrigger: { trigger: row, start: "top 90%", end: "center 55%", scrub: .85 },
              });
              // The screenshot settles into its frame while the description stays still.
              // Separate targets prevent the Reveal wrapper and ScrollTrigger competing.
              const screenshot = visual.querySelector(".project-screenshot");
              if (screenshot) gsap.fromTo(screenshot, { scale: 1.18, yPercent: 6 }, {
                scale: 1, yPercent: 0, ease: "none",
                scrollTrigger: { trigger: visual, start: "top 95%", end: "bottom 35%", scrub: .9 },
              });
              ScrollTrigger.create({
                trigger: row,
                start: "top center",
                end: "bottom center",
                onEnter: () => updateActiveProject(projectIndex),
                onEnterBack: () => updateActiveProject(projectIndex),
                onLeaveBack: () => {
                  if (projectIndex === 0) updateActiveProject(0);
                },
              });
            });
          }

        }, section);
        return () => {
          if (restoreProjectFrame) window.cancelAnimationFrame(restoreProjectFrame);
          const shouldRestoreProject = Boolean(
            sizedTrack &&
            horizontalStoryPinned &&
            (window.innerWidth < 1024 || window.matchMedia("(prefers-reduced-motion: reduce)").matches),
          );
          const projectIndex = activeProjectRef.current;
          resizeObserver?.disconnect();
          if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
          sizedTrack?.style.removeProperty("--project-slide-width");
          progressFillRef.current?.style.removeProperty("--project-story-progress");
          updatePinnedStoryActive(false);
          context.revert();
          if (shouldRestoreProject) {
            const activeRow = section.querySelector<HTMLElement>(
              `[data-project-row][data-project-index="${projectIndex}"]`,
            );
            if (activeRow) {
              restoreProjectFrame = window.requestAnimationFrame(() => {
                restoreProjectFrame = 0;
                if (!activeRow.isConnected) return;
                const targetTop = activeRow.getBoundingClientRect().top + window.scrollY - 96;
                window.scrollTo({ top: Math.max(0, targetTop), behavior: "instant" });
                ScrollTrigger.refresh();
              });
            }
          }
        };
      },
    );

    return () => {
      if (restoreProjectFrame) window.cancelAnimationFrame(restoreProjectFrame);
      media.revert();
    };
  }, []);

  useEffect(() => {
    if (!modal) return;

    if (focusRestoreTimerRef.current !== null) {
      window.clearTimeout(focusRestoreTimerRef.current);
      focusRestoreTimerRef.current = null;
    }
    if (focusRestoreFrameRef.current !== null) {
      window.cancelAnimationFrame(focusRestoreFrameRef.current);
      focusRestoreFrameRef.current = null;
    }

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
      if (skipFocusRestoreRef.current) {
        skipFocusRestoreRef.current = false;
        return;
      }
      const opener = openerRef.current;
      focusRestoreTimerRef.current = window.setTimeout(() => {
        focusRestoreTimerRef.current = null;
        focusRestoreFrameRef.current = window.requestAnimationFrame(() => {
          focusRestoreFrameRef.current = null;
          if (opener?.isConnected) opener.focus({ preventScroll: true });
        });
      }, reduceMotion ? 0 : 240);
    };
  }, [modal]);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.to(marker, {
        y: activeProject * 31,
        duration: 0.28,
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

  const focusedElementIndex =
    document.activeElement instanceof HTMLElement
      ? Number(document.activeElement.closest<HTMLElement>("[data-project-row]")?.dataset.projectIndex)
      : Number.NaN;

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
          className="mb-20 flex flex-col gap-8 md:mb-28 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="projects-kicker mb-5">Selected work</p>
            <h2 className="projects-title max-w-4xl">
              <span className="block overflow-hidden"><span className="block">Dari ide</span></span>
              <span className="block overflow-hidden"><span className="text-[#a43f2d] block">jadi karya.</span></span>
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
                  const focusWithinRow =
                    focusedProject === index || focusedElementIndex === index;
                  return (
                    <article
                      key={project.id}
                      data-project-row
                      data-project-index={index}
                      data-active-project={activeProject === index ? "true" : "false"}
                      tabIndex={0}
                      className="project-row"
                      onFocus={(event: FocusEvent<HTMLElement>) => {
                        const row = event.currentTarget;
                        setFocusedProject(index);
                        const story = ScrollTrigger.getById("portfolio-project-story");
                        if (story?.isActive && row.dataset.activeProject !== "true") {
                          const panelProgress = index / (projects.length - 1);
                          window.scrollTo({
                            top: story.start + (story.end - story.start) * panelProgress,
                            behavior: "auto",
                          });
                        }
                      }}
                      onBlur={(event: FocusEvent<HTMLElement>) => {
                        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
                        if (dialogRef.current?.contains(event.relatedTarget as Node | null)) return;
                        setFocusedProject((current) => current === index ? null : current);
                      }}
                      data-testid={`project-${project.id}`}
                      aria-labelledby={`project-title-${project.id}`}
                      aria-hidden={pinnedStoryActive && activeProject !== index && !focusWithinRow}
                      inert={pinnedStoryActive && activeProject !== index && !focusWithinRow}
                    >
                <Reveal className="min-w-0" media>
                <div
                  data-project-visual
                  className="project-visual project-visual--screenshot"
                  onPointerMove={handlePointerMove}
                  data-testid={`project-visual-${project.id}`}
                >
                  <img
                    className="project-screenshot"
                    src={project.preview.src}
                    alt={project.preview.alt}
                    width={project.preview.width}
                    height={project.preview.height}
                    loading="lazy"
                    decoding="async"
                  />
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
                </Reveal>

                <Reveal className="min-w-0" tall>
                <div data-project-copy>
                  <p className="project-type">{project.type}</p>
                  <h3 id={`project-title-${project.id}`} className="project-name">
                    {project.title}
                  </h3>
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
                      className="project-link project-link--quiet"
                      data-testid={`link-github-${project.id}`}
                      aria-label={`Open ${project.title} GitHub repository`}
                      whileHover={reduceMotion ? undefined : { y: -2 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    >
                      <Github className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Repositori GitHub</span>
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
                </Reveal>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
        {modal && <m.div
          key="project-detail-overlay"
          className="project-detail-overlay"
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
                className="project-link project-link--quiet"
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
