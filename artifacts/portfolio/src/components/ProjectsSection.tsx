import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FocusEvent, PointerEvent } from "react";
import { ArrowUpRight, ExternalLink, Github, X } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { cubicBezierEase, gsap, ScrollTrigger } from "../lib/motion";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

// Product previews are direct captures of the linked public sites, not recreated UI.
const projects = [
  {
    id: 1,
    short: "TJKT",
    title: "TJKT",
    type: "Situs jurusan",
    description:
      "Situs yang memperkenalkan jurusan TJKT di SMK Negeri 2 Lubuk Basung, termasuk kegiatan dan identitasnya.",
    live: "https://tjkt-tech.vercel.app",
    github: "https://github.com/Reyhan-irza/TJKT",
    tech: ["React", "TypeScript", "GSAP", "ScrollTrigger", "Lenis"],
    preview: {
      src: `${import.meta.env.BASE_URL}project-previews/tjkt-homepage.webp`,
      width: 1440,
      height: 1000,
      alt: "Halaman utama situs jurusan TJKT dengan identitas sekolah dan informasi program jaringan.",
    },
    accent: "TJKT",
  },
  {
    id: 2,
    short: "VR",
    title: "VIREON Library",
    type: "Perpustakaan digital",
    description:
      "Sistem perpustakaan digital untuk mengelola buku, anggota, peminjaman, dan laporan.",
    live: "https://vireon-lib.vercel.app",
    github: "https://github.com/Reyhan-irza/Library",
    tech: ["React", "TypeScript", "Supabase", "GSAP"],
    preview: {
      src: `${import.meta.env.BASE_URL}project-previews/vireon-library.webp`,
      width: 1440,
      height: 857,
      alt: "Halaman utama VIREON Library dengan pratinjau dasbor pengelolaan perpustakaan dan ringkasan alur kerja.",
    },
    accent: "VIREON",
  },
  {
    id: 3,
    short: "WA",
    title: "Reyhan WhatsApp Portfolio",
    type: "Portofolio pribadi",
    description:
      "Portofolio pribadi yang menampilkan karya dan eksperimen terkait WhatsApp.",
    live: "https://reyhan-watsap-portfolio.vercel.app",
    github: "https://github.com/Reyhan-irza/reyhan-portfolio",
    tech: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
    preview: {
      src: `${import.meta.env.BASE_URL}project-previews/reyhan-portfolio.webp`,
      width: 1440,
      height: 857,
      alt: "Halaman utama portofolio Reyhan Irza Alvano dari situs portofolio terkait WhatsApp.",
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
        compact: "(max-width: 767px)",
        wide: "(min-width: 768px)",
        desktop: "(min-width: 1024px)",
      },
      (mediaContext) => {
        if (mediaContext.conditions?.reduced) return;
        const compact = Boolean(mediaContext.conditions?.compact);
        let resizeObserver: ResizeObserver | undefined;
        let refreshFrame = 0;
        let sizedTrack: HTMLElement | null = null;
        let horizontalStoryPinned = false;
        const context = gsap.context(() => {
          const rows = gsap.utils.toArray<HTMLElement>("[data-project-row]", section);
          const revealProject = (
            row: HTMLElement,
            visual: HTMLElement,
            copy: HTMLElement,
            containerAnimation?: gsap.core.Animation,
          ) => {
            const screenshot = visual.querySelector<HTMLElement>(".project-screenshot");
            const technologies = gsap.utils.toArray<HTMLElement>(".project-tech", copy);
            const actions = copy.querySelector<HTMLElement>(".project-actions");
            const scrollTrigger = {
              trigger: row,
              start: compact ? "top 86%" : "top 80%",
              once: true,
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
              ...(containerAnimation ? { containerAnimation, start: "left 86%" } : {}),
            };
            const timeline = gsap.timeline({ scrollTrigger });

            timeline.fromTo(visual, {
              y: 12,
              opacity: 0,
              scaleX: 0.97,
              transformOrigin: "left center",
            }, {
              y: 0,
              opacity: 1,
              scaleX: 1,
              duration: 0.62,
              ease: cubicBezierEase(0.16, 1, 0.3, 1),
            });
            if (screenshot) {
              timeline.fromTo(screenshot, {
                scale: compact ? 1.035 : 1.08,
                x: compact ? 0 : 18,
                y: compact ? 8 : 0,
              }, {
                scale: 1,
                x: 0,
                y: 0,
                duration: compact ? 0.72 : 1,
                ease: cubicBezierEase(0.22, 1, 0.36, 1),
              }, 0);
            }
            timeline.fromTo(copy, {
              x: compact ? 10 : 16,
              opacity: 0,
            }, {
              x: 0,
              opacity: 1,
              duration: 0.52,
              ease: cubicBezierEase(0.16, 1, 0.3, 1),
            }, 0.1);
            if (technologies.length > 0) {
              timeline.fromTo(technologies, {
                y: 10,
                opacity: 0,
              }, {
                y: 0,
                opacity: 1,
                duration: 0.38,
                stagger: 0.05,
                ease: cubicBezierEase(0.16, 1, 0.3, 1),
              }, 0.28);
            }
            if (actions) {
              timeline.fromTo(actions, { y: 10, opacity: 0 }, {
                y: 0,
                opacity: 1,
                duration: 0.42,
                ease: cubicBezierEase(0.16, 1, 0.3, 1),
              }, 0.28 + technologies.length * 0.05);
            }
          };

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

            rows.forEach((row) => {
              const visual = row.querySelector<HTMLElement>("[data-project-visual]");
              const copy = row.querySelector<HTMLElement>("[data-project-copy]");
              if (!visual || !copy) return;
              revealProject(row, visual, copy, horizontalStory);
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
              revealProject(row, visual, copy);
              const projectIndex = Number(row.dataset.projectIndex);
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

          const headingTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              once: true,
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          });
          headingTimeline
            .fromTo("[data-project-title-line]", { yPercent: 110, opacity: 0 }, {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: cubicBezierEase(0.16, 1, 0.3, 1),
            })
            .fromTo("[data-project-intro]", { y: 12, opacity: 0 }, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: cubicBezierEase(0.16, 1, 0.3, 1),
            }, "-=0.24");
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

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      const opener = openerRef.current;
      focusRestoreTimerRef.current = window.setTimeout(() => {
        focusRestoreTimerRef.current = null;
        focusRestoreFrameRef.current = window.requestAnimationFrame(() => {
          focusRestoreFrameRef.current = null;
          if (opener?.isConnected) opener.focus({ preventScroll: true });
        });
      }, 120);
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
        <div
          data-project-heading
          className="mb-20 flex flex-col gap-8 md:mb-28 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="projects-kicker mb-5">Proyek pilihan</p>
            <h2 className="projects-title max-w-4xl">
              <span className="block overflow-hidden"><span data-project-title-line className="block">Yang benar-benar</span></span>
              <span className="block overflow-hidden"><span data-project-title-line className="text-[#a43f2d] block">saya bangun.</span></span>
            </h2>
          </div>
          <p data-project-intro className="projects-intro text-sm md:mb-1 md:text-base">
            Tiga proyek dengan tujuan berbeda: situs jurusan sekolah, perpustakaan digital, dan portofolio pribadi.
          </p>
        </div>

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
                      Buka situs <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </m.a>
                    <m.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link project-link--quiet"
                      data-testid={`link-github-${project.id}`}
                      aria-label={`Buka repositori GitHub ${project.title}`}
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
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div
           className="fixed inset-0 z-[150] flex items-center justify-center bg-[#211f1b]/35 p-5 backdrop-blur-sm"
          role="presentation"
          onClick={() => setModal(null)}
          data-testid="project-detail-overlay"
        >
          <div
            ref={dialogRef}
            className="project-detail-dialog modal-enter w-full max-w-xl p-6 md:p-9"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-title"
            aria-describedby="project-detail-description"
            onClick={(event) => event.stopPropagation()}
            data-testid="project-detail-dialog"
            tabIndex={-1}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="project-detail-label">Proyek / 0{modal.id}</p>
                 <h3 id="project-detail-title" className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#211f1b] md:text-5xl">
                  {modal.title}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                 className="flex h-10 w-10 shrink-0 items-center justify-center border border-[rgba(33,31,27,.16)] text-[#6d6a62] transition-colors hover:text-[#211f1b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a43f2d]"
                onClick={() => setModal(null)}
                aria-label="Tutup catatan proyek"
                data-testid="button-close-project-detail"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

             <div className="mt-8 border-t border-[rgba(33,31,27,.16)] pt-6">
              <p className="project-detail-label">Tentang proyek ini</p>
               <p id="project-detail-description" className="mt-3 text-base leading-7 text-[#6d6a62]">{modal.description}</p>
            </div>

            <div className="mt-7">
              <p className="project-detail-label">Dibuat dengan</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {modal.tech.map((technology) => (
                   <span key={technology} className="text-sm text-[#211f1b]">
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
    </LazyMotion>
  );
}