import { useLayoutEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/motion";
import BrandLogo from "./BrandLogo";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        compact: "(max-width: 767px)",
        wide: "(min-width: 768px)",
      },
      (context) => {
        if (context.conditions?.reduced) return;
        const compact = Boolean(context.conditions?.compact);
        const cleanups: Array<() => void> = [];
        const scope = gsap.context(() => {
          const opening = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.08 });
          opening
            .fromTo("[data-hero-item]", { y: compact ? 10 : 19, opacity: 0 }, {
              y: 0, opacity: 1, duration: compact ? 0.48 : 0.7, stagger: compact ? 0.045 : 0.07,
              clearProps: "transform,opacity",
            })
            .fromTo("[data-hero-rule]", { scaleX: 0 }, {
              scaleX: 1, transformOrigin: "left center", duration: 0.8, clearProps: "transform",
            }, 0.12);
          const scrollRange = {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: compact ? 0.35 : 0.7,
            invalidateOnRefresh: true,
          };
          const title = section.querySelector<HTMLElement>("[data-hero-title-depth]");
          const lead = section.querySelector<HTMLElement>("[data-hero-lead-depth]");
          const grid = section.querySelector<HTMLElement>(".hero-grid");

          if (title) {
            gsap.to(title, {
              y: compact ? -10 : -30,
              scale: compact ? 0.985 : 0.95,
              opacity: 0.88,
              transformOrigin: "left center",
              ease: "none",
              scrollTrigger: { ...scrollRange, scrub: compact ? 0.3 : 0.62 },
            });
          }
          if (lead) {
            gsap.to(lead, {
              y: compact ? -5 : -14,
              opacity: 0.78,
              ease: "none",
              scrollTrigger: { ...scrollRange, scrub: compact ? 0.25 : 0.5 },
            });
          }
          if (grid) {
            gsap.to(grid, {
              yPercent: compact ? 5 : 15,
              opacity: compact ? 0.28 : 0.62,
              ease: "none",
              scrollTrigger: { ...scrollRange, scrub: compact ? 0.35 : 0.75 },
            });
          }
          if (markRef.current && !compact) {
            gsap.to(markRef.current, {
              y: -28,
              rotate: 5,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            });
          }
          gsap.fromTo("[data-hero-orbit]", { rotate: -5 }, {
            rotate: 24,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
          gsap.fromTo("[data-hero-axis-x]", { scaleX: 0.12, opacity: 0.2 }, {
            scaleX: 1,
            opacity: 1,
            transformOrigin: "center center",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: compact ? 0.3 : 0.65,
              invalidateOnRefresh: true,
            },
          });
          gsap.fromTo("[data-hero-axis-y]", { scaleY: 0.12, opacity: 0.2 }, {
            scaleY: 1,
            opacity: 1,
            transformOrigin: "center center",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: compact ? 0.3 : 0.65,
              invalidateOnRefresh: true,
            },
          });
          if (!compact && window.matchMedia("(pointer: fine)").matches) {
            section.querySelectorAll<HTMLElement>("[data-hero-magnetic]").forEach((button) => {
              const moveX = gsap.quickTo(button, "x", { duration: 0.24, ease: "power3.out" });
              const moveY = gsap.quickTo(button, "y", { duration: 0.24, ease: "power3.out" });
              const onMove = (event: PointerEvent) => {
                const bounds = button.getBoundingClientRect();
                moveX((event.clientX - bounds.left - bounds.width / 2) * 0.07);
                moveY((event.clientY - bounds.top - bounds.height / 2) * 0.07);
              };
              const reset = () => { moveX(0); moveY(0); };
              button.addEventListener("pointermove", onMove);
              button.addEventListener("pointerleave", reset);
              button.addEventListener("blur", reset);
              cleanups.push(() => {
                button.removeEventListener("pointermove", onMove);
                button.removeEventListener("pointerleave", reset);
                button.removeEventListener("blur", reset);
              });
            });
          }
        }, section);
        return () => {
          cleanups.forEach((cleanup) => cleanup());
          scope.revert();
        };
      },
    );
    return () => media.revert();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <section ref={sectionRef} id="home" className="hero-section relative min-h-[100svh] overflow-hidden px-5 pb-16 pt-32 md:px-10 md:pt-40">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-content relative z-10 mx-auto grid min-h-[calc(100svh-11rem)] max-w-[1440px] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.66fr)]">
        <div className="relative z-10 pb-6">
          <p data-hero-item className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.2em] text-[#aab2c2] md:text-xs">
            <span className="h-1.5 w-1.5 bg-[#7586ff]" aria-hidden="true" />
            Student Developer <span className="text-white/20">/</span> Lubuk Basung, Indonesia
          </p>
          <div data-hero-title-depth>
            <h1 data-hero-item className="max-w-[950px] text-[clamp(3.7rem,11.1vw,10.5rem)] font-extrabold leading-[.78] tracking-[-.095em] text-[#f5f7fa]">
              REYHAN
              <br />
              IRZA
              <br />
              <span className="hero-name-accent">ALVANO<span className="text-[#8b6cff]">.</span></span>
            </h1>
          </div>
          <div data-hero-rule className="hero-rule mt-9 h-px w-full origin-left bg-white/15 md:mt-12" />
          <div className="mt-7 grid gap-8 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
            <div data-hero-lead-depth>
              <p data-hero-item className="max-w-[660px] text-[clamp(1.15rem,2vw,1.65rem)] leading-[1.45] tracking-[-.045em] text-[#c9d0dc]">
                I’m a student developer who learns by building. I make websites, digital tools, and small experiments, then improve them as I go.
              </p>
            </div>
            <p data-hero-item className="max-w-[220px] border-l border-[#667cff]/55 pl-4 text-xs leading-relaxed text-[#8b93a3]">
              I mostly work with React and TypeScript while learning more about systems, networking, and how things work behind the interface.
            </p>
          </div>
          <div data-hero-item className="mt-9 flex flex-wrap items-center gap-3">
            <button type="button" data-hero-magnetic onClick={() => scrollTo("#projects")} className="hero-primary inline-flex min-h-12 items-center gap-3 px-5 text-xs font-bold uppercase tracking-[.11em]">
              Explore my work <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" data-hero-magnetic onClick={() => scrollTo("#contact")} className="hero-secondary inline-flex min-h-12 items-center gap-2 px-5 text-xs uppercase tracking-[.1em] text-white/70 transition-colors hover:text-white">
              Say hello <MoveUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <a data-hero-item href="https://github.com/Reyhan-irza" target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.15em] text-white/40 transition-colors hover:text-[#9da9ff]">
            GitHub <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <aside className="hero-mark-stage relative mx-auto hidden aspect-square w-full max-w-[520px] lg:block" aria-label="RV geometric identity">
          <div className="hero-mark-frame absolute inset-[8%] border border-white/[.08]" />
          <div className="hero-mark-frame hero-mark-frame-inner absolute inset-[20%] border border-[#667cff]/20" />
          <div data-hero-axis-y className="hero-mark-cross absolute left-1/2 top-[5%] h-[90%] w-px bg-white/[.08]" />
          <div data-hero-axis-x className="hero-mark-cross absolute left-[5%] top-1/2 h-px w-[90%] bg-white/[.08]" />
          <div data-hero-orbit className="hero-orbit absolute inset-[14%] border border-dashed border-white/[.14]" />
          <div ref={markRef} className="hero-mark-image absolute inset-[13%]">
            <BrandLogo
              size="custom"
              alt="Metallic silver RV monogram with cool-blue edge lighting"
              fetchPriority="high"
              className="h-full w-full"
            />
          </div>
          <div className="absolute bottom-[9%] left-[8%] font-mono text-[9px] uppercase tracking-[.18em] text-white/35">Identity / 01</div>
          <div className="absolute right-[8%] top-[9%] font-mono text-[9px] uppercase tracking-[.18em] text-[#8a98ff]">Vierlykirk</div>
          <span className="hero-corner hero-corner-a" aria-hidden="true" />
          <span className="hero-corner hero-corner-b" aria-hidden="true" />
        </aside>
      </div>
      <a href="#technology-bands" className="hero-scroll-cue absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 font-mono text-[9px] uppercase tracking-[.2em] text-white/40 transition-colors hover:text-white/80">
        Scroll to explore <span className="h-7 w-px bg-gradient-to-b from-[#8190ff] to-transparent" aria-hidden="true" />
      </a>
    </section>
  );
}
