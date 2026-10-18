import { useLayoutEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { cubicBezierEase, gsap, ScrollTrigger } from "../lib/motion";
import BrandLogo from "./BrandLogo";
import HeroTypingLoop from "./HeroTypingLoop";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

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
      (context) => {
        if (context.conditions?.reduced) return;
        const compact = Boolean(context.conditions?.compact);
        const desktop = Boolean(context.conditions?.desktop);
        const scope = gsap.context(() => {
          const opening = gsap.timeline({
            defaults: { ease: cubicBezierEase(0.16, 1, 0.3, 1) },
            delay: 0.08,
          });
          const markStage = section.querySelector<HTMLElement>("[data-hero-mark-stage]");
          if (desktop && markStage && markRef.current) {
            opening
              .fromTo(markStage, { autoAlpha: 0, scale: 0.985 }, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.7,
              }, 0.1)
              .fromTo(markRef.current, {
                autoAlpha: 0,
                y: 9,
                scale: 0.965,
                rotation: -1.5,
              }, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                rotation: 0,
                duration: 0.72,
              }, 0.24);
          }
          opening
            .fromTo("[data-hero-indicator]", { scale: 0.65, opacity: 0 }, {
              scale: 1, opacity: 1, duration: 0.36,
            })
            .fromTo("[data-hero-kicker]", { y: 12, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.5,
            }, 0.12)
            .fromTo("[data-hero-title-line]", { yPercent: 110 }, {
              yPercent: 0, duration: 0.8, stagger: 0.08,
            }, 0.18)
            .fromTo("[data-hero-bio]", { y: 12, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.55,
            }, 0.47)
            .fromTo("[data-hero-callout-rule]", { scaleY: 0 }, {
              scaleY: 1, transformOrigin: "top center", duration: 0.6,
            }, 0.55)
            .fromTo("[data-hero-callout-copy]", { x: -10, opacity: 0 }, {
              x: 0, opacity: 1, duration: 0.55,
            }, 0.62)
            .fromTo("[data-hero-action]", { y: 12, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.5, stagger: 0.08,
            }, 1.1)
            .fromTo("[data-hero-github]", { y: 10, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.45,
            }, 1.38)
            .fromTo("[data-hero-rule]", { scaleX: 0 }, {
              scaleX: 1, transformOrigin: "left center", duration: 0.8,
            }, 0.52);
          const title = section.querySelector<HTMLElement>("[data-hero-title-depth]");
          const lead = section.querySelector<HTMLElement>("[data-hero-lead-depth]");
          const grid = section.querySelector<HTMLElement>(".hero-grid");
          const kicker = section.querySelector<HTMLElement>("[data-hero-kicker]");
          const orbit = section.querySelector<HTMLElement>("[data-hero-orbit]");
          const axisX = section.querySelector<HTMLElement>("[data-hero-axis-x]");
          const axisY = section.querySelector<HTMLElement>("[data-hero-axis-y]");
          const scrollCue = section.querySelector<HTMLElement>("[data-hero-scroll-cue]");
          const copyDepth = section.querySelector<HTMLElement>("[data-hero-copy-depth]");
          // The opening is a hand-off: the name holds while the personal note
          // moves forward, then the whole composition gently yields to the page.
          const story = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: compact ? 0.2 : 0.72,
              invalidateOnRefresh: true,
            },
          });

          story.addLabel("hold", 0);
          if (copyDepth) {
            story.to(copyDepth, {
              y: compact ? -3 : -8,
              opacity: compact ? 0.98 : 0.94,
              duration: 0.48,
            }, "hold");
          }
          if (title) {
            story.to(title, {
              y: compact ? -4 : -12,
              scale: compact ? 0.998 : 0.985,
              opacity: compact ? 0.98 : 0.94,
              transformOrigin: "left center",
              duration: 0.48,
            }, "hold");
          }
          if (lead) {
            story.to(lead, {
              y: compact ? -2 : -5,
              opacity: compact ? 0.98 : 0.92,
              duration: 0.48,
            }, "hold+=0.08");
          }
          if (kicker) {
            story.to(kicker, {
              x: compact ? -1 : -5,
              opacity: compact ? 0.98 : 0.88,
              duration: 0.48,
            }, "hold");
          }
          if (grid) {
            story.to(grid, {
              yPercent: compact ? 1 : 3,
              opacity: compact ? 0.5 : 0.58,
              duration: 0.48,
            }, "hold");
          }
          if (orbit && !compact) {
            story.fromTo(orbit, { rotate: -5 }, { rotate: 12, duration: 0.48 }, "hold");
          }
          if (axisX && !compact) {
            story.fromTo(axisX, {
              scaleX: 0.72,
              opacity: 0.5,
              transformOrigin: "center center",
            }, {
              scaleX: 1,
              opacity: 0.72,
              duration: 0.38,
            }, "hold+=0.06");
          }
          if (axisY && !compact) {
            story.fromTo(axisY, {
              scaleY: 0.72,
              opacity: 0.5,
              transformOrigin: "center center",
            }, {
              scaleY: 1,
              opacity: 0.72,
              duration: 0.34,
            }, "hold+=0.1");
          }

          story.addLabel("release", 0.56);
          if (title) {
            story.to(title, {
              y: compact ? -8 : -25,
              scale: compact ? 0.994 : 0.96,
              opacity: compact ? 0.92 : 0.76,
              duration: 0.44,
            }, "release");
          }
          if (lead) {
            story.to(lead, {
              y: compact ? -5 : -16,
              opacity: compact ? 0.94 : 0.78,
              duration: 0.44,
            }, "release");
          }
          if (kicker) {
            story.to(kicker, {
              x: compact ? -3 : -12,
              opacity: compact ? 0.92 : 0.68,
              duration: 0.44,
            }, "release");
          }
          if (grid) {
            story.to(grid, { yPercent: compact ? 3 : 10, opacity: 0.2, duration: 0.44 }, "release");
          }
          if (copyDepth) {
            story.to(copyDepth, {
              y: compact ? -7 : -18,
              opacity: compact ? 0.96 : 0.82,
              duration: 0.44,
            }, "release");
          }
          if (orbit && !compact) {
            story.to(orbit, { rotate: 28, opacity: 0.36, duration: 0.44 }, "release");
          }
          if (axisX && !compact) story.to(axisX, { opacity: 0.32, duration: 0.44 }, "release");
          if (axisY && !compact) story.to(axisY, { opacity: 0.32, duration: 0.44 }, "release");
          if (scrollCue) story.to(scrollCue, { opacity: 0, duration: 0.28 }, "release+=0.08");
        }, section);
        return () => {
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
        <div data-hero-copy-depth className="relative z-10 pb-6">
          <p data-hero-kicker className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.2em] text-[#aab2c2] md:text-xs">
            <span data-hero-indicator className="h-1.5 w-1.5 bg-[#7586ff]" aria-hidden="true" />
            SMK Student <span className="text-white/20">/</span> Lubuk Basung, Indonesia
          </p>
          <div data-hero-title-depth>
            <h1 className="max-w-[950px] text-[clamp(3.7rem,11.1vw,10.5rem)] font-extrabold leading-[.78] tracking-[-.095em] text-[#f5f7fa]">
              <span className="block overflow-hidden"><span data-hero-title-line className="block">REYHAN</span></span>
              <span className="block overflow-hidden"><span data-hero-title-line className="block">IRZA</span></span>
              <span className="block overflow-hidden"><span data-hero-title-line className="hero-name-accent block">ALVANO<span className="text-[#8b6cff]">.</span></span></span>
            </h1>
          </div>
          <div data-hero-rule className="hero-rule mt-9 h-px w-full origin-left bg-white/15 md:mt-12" />
          <div className="mt-7 grid gap-8 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
            <div data-hero-lead-depth>
              <p data-hero-bio className="max-w-[660px] text-[clamp(1.15rem,2vw,1.65rem)] leading-[1.45] tracking-[-.045em] text-[#c9d0dc]">
                Halo, saya Reyhan. Rasa penasaran saya pada komputer tumbuh saat sering mampir ke warnet sekitar 2015. Sekarang saya belajar web lewat proyek: mencoba ide, menemukan yang perlu diperbaiki, lalu mencoba lagi.
              </p>
            </div>
            <p className="relative max-w-[220px] pl-4 text-xs leading-relaxed text-[#8b93a3]">
              <span data-hero-callout-rule className="absolute inset-y-0 left-0 w-px origin-top bg-[#667cff]/55" aria-hidden="true" />
              <span data-hero-callout-copy className="block">
                <span aria-hidden="true">
                  Belakangan ini, saya juga mendalami:
                  <br />
                  <HeroTypingLoop />
                </span>
                <span className="sr-only">
                  Belakangan ini, saya juga mendalami web, TypeScript, Tailwind, dan AI lewat proyek di waktu luang.
                </span>
              </span>
            </p>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <LazyMotion features={domAnimation}>
              <m.button type="button" data-hero-action onClick={() => scrollTo("#projects")} className="hero-primary group inline-flex min-h-12 items-center gap-3 px-5 text-xs font-bold uppercase tracking-[.11em]" whileHover={reduceMotion ? undefined : { scale: 1.01 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                Explore my work <ArrowDown className="hero-arrow-down h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </m.button>
              <m.button type="button" data-hero-action onClick={() => scrollTo("#contact")} className="hero-secondary group inline-flex min-h-12 items-center gap-2 px-5 text-xs uppercase tracking-[.1em] text-white/70 transition-colors hover:text-white" whileHover={reduceMotion ? undefined : { scale: 1.01 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                Say hello <MoveUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </m.button>
            </LazyMotion>
          </div>
          <a data-hero-github href="https://github.com/Reyhan-irza" target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.15em] text-white/40 transition-colors hover:text-[#9da9ff]">
            GitHub <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <aside data-hero-mark-stage className="hero-mark-stage relative mx-auto hidden aspect-square w-full max-w-[520px] lg:block" aria-label="Identitas visual RV">
          <div className="hero-mark-frame absolute inset-[8%] border border-white/[.08]" />
          <div className="hero-mark-frame hero-mark-frame-inner absolute inset-[20%] border border-[#667cff]/20" />
          <div data-hero-axis-y className="hero-mark-cross absolute left-1/2 top-[5%] h-[90%] w-px bg-white/[.08]" />
          <div data-hero-axis-x className="hero-mark-cross absolute left-[5%] top-1/2 h-px w-[90%] bg-white/[.08]" />
          <div data-hero-orbit className="hero-orbit absolute inset-[14%] border border-dashed border-white/[.14]" />
          <div ref={markRef} className="hero-mark-image absolute inset-[13%]">
            <BrandLogo
              size="custom"
              alt="Monogram RV berwarna perak metalik dengan cahaya biru"
              fetchPriority="high"
              className="h-full w-full"
            />
          </div>
          <div className="absolute bottom-[9%] left-[8%] font-mono text-[9px] uppercase tracking-[.18em] text-white/35">Identitas / 01</div>
          <div className="absolute right-[8%] top-[9%] font-mono text-[9px] uppercase tracking-[.18em] text-[#8a98ff]">Vierlykirk</div>
          <span className="hero-corner hero-corner-a" aria-hidden="true" />
          <span className="hero-corner hero-corner-b" aria-hidden="true" />
        </aside>
      </div>
      <a data-hero-scroll-cue href="#technology-bands" className="hero-scroll-cue absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 font-mono text-[9px] uppercase tracking-[.2em] text-white/40 transition-colors hover:text-white/80">
        Scroll to explore <span className="h-7 w-px bg-gradient-to-b from-[#8190ff] to-transparent" aria-hidden="true" />
      </a>
    </section>
  );
}
