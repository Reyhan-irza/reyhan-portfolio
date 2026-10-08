import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ArrowUpRight, ExternalLink, Github, X } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const viewedRef = useRef(new Set<number>());
  const didAchieve = useRef(false);
  const activeProjectRef = useRef(0);
  const [activeProject, setActiveProject] = useState(0);
  const [pinnedStoryActive, setPinnedStoryActive] = useState(false);
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
        const context = gsap.context(() => {
          const rows = gsap.utils.toArray<HTMLElement>("[data-project-row]", section);

          const viewport = section.querySelector<HTMLElement>("[data-project-track-viewport]");
          const track = section.querySelector<HTMLElement>("[data-project-track]");
          const stage = section.querySelector<HTMLElement>("[data-project-stage]");
          const hasHorizontalStory = Boolean(
            mediaContext.conditions?.desktop && viewport && track && stage && rows.length > 1,
          );

          if (hasHorizontalStory && viewport && track && stage) {
            const setSlideWidth = () => {
              track.style.setProperty("--project-slide-width", `${viewport.clientWidth}px`);
            };
            setSlideWidth();

            const slideWidth = () => viewport.clientWidth;
            const travelDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
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
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onEnter: () => setPinnedStoryActive(true),
                onEnterBack: () => setPinnedStoryActive(true),
                onUpdate: (self) => {
                  const progressAcrossSlides = self.progress * travelDistance();
                  const nextIndex = Math.min(
                    rows.length - 1,
                    Math.floor(progressAcrossSlides / slideWidth()),
                  );
                  updateActiveProject(nextIndex);
                },
                onLeaveBack: () => {
                  setPinnedStoryActive(false);
                  updateActiveProject(0);
                },
              },
            });

            rows.forEach((row) => {
              const visual = row.querySelector<HTMLElement>("[data-project-visual]");
              const copy = row.querySelector<HTMLElement>("[data-project-copy]");
              const wordmark = row.querySelector<HTMLElement>("[data-project-wordmark-motion]");
              if (!visual || !copy) return;

              gsap.fromTo(visual, {
                clipPath: "inset(7% 8% 7% 0%)",
                scale: 0.94,
              }, {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  containerAnimation: horizontalStory,
                  start: "left 86%",
                  end: "left 28%",
                  scrub: 0.55,
                  invalidateOnRefresh: true,
                },
              });

              gsap.fromTo(copy, {
                x: 34,
                opacity: 0.18,
              }, {
                x: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  containerAnimation: horizontalStory,
                  start: "left 82%",
                  end: "left 30%",
                  scrub: 0.45,
                  invalidateOnRefresh: true,
                },
              });

              const geometry = visual.querySelector<HTMLElement>(".project-visual-grid");
              if (geometry) {
                gsap.to(geometry, {
                  yPercent: -5,
                  xPercent: 3,
                  ease: "none",
                  scrollTrigger: {
                    trigger: row,
                    containerAnimation: horizontalStory,
                    start: "left right",
                    end: "right left",
                    scrub: 0.7,
                    invalidateOnRefresh: true,
                  },
                });
              }

              if (wordmark) {
                gsap.fromTo(wordmark, { xPercent: 12 }, {
                  xPercent: -9,
                  ease: "none",
                  scrollTrigger: {
                    trigger: row,
                    containerAnimation: horizontalStory,
                    start: "left right",
                    end: "right left",
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                  },
                });
              }
            });

            resizeObserver = new ResizeObserver(() => {
              setSlideWidth();
              ScrollTrigger.refresh();
            });
            resizeObserver.observe(viewport);
          }

          if (!hasHorizontalStory) {
            rows.forEach((row) => {
              const visual = row.querySelector<HTMLElement>("[data-project-visual]");
              const copy = row.querySelector<HTMLElement>("[data-project-copy]");
              if (!visual || !copy) return;

              const entrance = gsap.timeline({
                scrollTrigger: {
                  trigger: row,
                  start: compact ? "top 86%" : "top 80%",
                  toggleActions: "play none play reverse",
                  invalidateOnRefresh: true,
                },
              });

              entrance
                .fromTo(
                  visual,
                  { x: compact ? 10 : 18, opacity: 0, scale: compact ? 1 : 0.992 },
                  {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: compact ? 0.48 : 0.62,
                    ease: "power3.out",
                  },
                )
                .fromTo(
                  copy,
                  { y: compact ? 8 : 16, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: compact ? 0.42 : 0.56,
                    ease: "power3.out",
                  },
                  compact ? 0.06 : 0.1,
                );

              const geometry = visual.querySelector<HTMLElement>(".project-visual-grid");
              if (geometry) {
                gsap.to(geometry, {
                  yPercent: compact ? -3 : -9,
                  xPercent: compact ? 0 : 2,
                  ease: "none",
                  scrollTrigger: {
                    trigger: row,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: compact ? 0.45 : 0.8,
                    invalidateOnRefresh: true,
                  },
                });
              }
            });
          }

          gsap.fromTo(
            "[data-project-heading]",
            { y: compact ? 10 : 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: compact ? 0.5 : 0.68,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 84%",
                toggleActions: "play none play reverse",
                invalidateOnRefresh: true,
              },
            },
          );
        }, section);
        return () => {
          resizeObserver?.disconnect();
          setPinnedStoryActive(false);
          context.revert();
        };
      },
    );

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

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      openerRef.current?.focus();
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
            <p className="projects-kicker mb-5">Selected work / three builds</p>
            <h2 className="projects-title max-w-4xl">
              Built to be
              <br />
               <span className="text-[#a43f2d]">used.</span>
            </h2>
          </div>
          <p className="projects-intro text-sm md:mb-1 md:text-base">
            Three real products, each with a different job to do. Follow the
            thread from a school department introduction to a working library
            system and a personal interface.
          </p>
        </div>

        <div data-project-stage className="project-stage grid grid-cols-1 gap-8 lg:grid-cols-[7rem_1fr] lg:gap-12">
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
                 <span className="mx-1 text-[#a43f2d]">/</span>
                0{projects.length}
              </div>
            </div>
          </aside>

          <div className="project-stage-content">
            <div data-project-track-viewport className="project-track-viewport">
              <div data-project-track className="project-track">
                {projects.map((project, index) => (
                  <article
                key={project.id}
                data-project-row
                tabIndex={0}
                className="project-row"
                onMouseEnter={() => updateActiveProject(index)}
                onFocus={() => updateActiveProject(index)}
                onTouchStart={() => updateActiveProject(index)}
                data-testid={`project-${project.id}`}
                aria-labelledby={`project-title-${project.id}`}
                aria-hidden={pinnedStoryActive && activeProject !== index}
                inert={pinnedStoryActive && activeProject !== index}
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
                      onClick={(event) => openDetails(project, event.currentTarget)}
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
                <p className="project-detail-label">Project note / 0{modal.id}</p>
                 <h3 id="project-detail-title" className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#211f1b] md:text-5xl">
                  {modal.title}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                 className="flex h-10 w-10 shrink-0 items-center justify-center border border-[rgba(33,31,27,.16)] text-[#6d6a62] transition-colors hover:text-[#211f1b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a43f2d]"
                onClick={() => setModal(null)}
                aria-label="Close project note"
                data-testid="button-close-project-detail"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

             <div className="mt-8 border-t border-[rgba(33,31,27,.16)] pt-6">
              <p className="project-detail-label">What it is</p>
               <p id="project-detail-description" className="mt-3 text-base leading-7 text-[#6d6a62]">{modal.description}</p>
            </div>

            <div className="mt-7">
              <p className="project-detail-label">Built with</p>
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
  );
}