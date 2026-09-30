import { useLayoutEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, MessageSquare } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const opening = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.08,
        });
        opening
          .from("[data-hero-item]", {
            y: 22,
            autoAlpha: 0,
            duration: 0.72,
            stagger: 0.075,
          })
          .fromTo(
            "[data-hero-rule]",
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: "left center", duration: 0.9 },
            0.12,
          );

        gsap.to("[data-hero-mark]", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }, section);
      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <section ref={sectionRef} id="home" className="relative px-6 pb-24 pt-32 md:pb-36 md:pt-44">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_18rem] lg:items-end">
        <div>
          <div data-hero-item className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#77796e]">
             <span className="h-2 w-2 rounded-full bg-[#a43f2d]" aria-hidden="true" />
            Personal software-solution builder / Indonesia
          </div>
          <h1 data-hero-item className="max-w-5xl text-[clamp(3.5rem,9vw,8.9rem)] font-semibold leading-[.86] tracking-[-.09em] text-[#1b1c18]">
            Reyhan Irza
            <br />
             <span className="text-[#a43f2d]">Alvano.</span>
          </h1>
          <div data-hero-rule className="mt-9 h-px w-full origin-left scale-x-0 bg-[rgba(27,28,24,.2)]" />
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_18rem] md:items-start">
            <p data-hero-item className="max-w-xl text-xl leading-[1.3] tracking-[-.025em] text-[#4e5149] md:text-2xl">
              I learn by making things real: interfaces people can open, systems people can use, and notes that show what changed along the way.
            </p>
             <div data-hero-item className="flex flex-col gap-3 text-sm leading-relaxed text-[#6d6a62]">
               <p><span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#a43f2d]">Now</span><br />Developing web products with React, TypeScript and Supabase.</p>
               <p><span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#a43f2d]">Based in</span><br />Lubuk Basung, West Sumatra.</p>
            </div>
          </div>
          <div data-hero-item className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollTo("#projects")} className="btn-neon inline-flex items-center gap-2 px-5 py-3 text-sm">
              Read the work <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </button>
             <button type="button" onClick={() => scrollTo("#contact")} className="inline-flex items-center gap-2 border border-[rgba(33,31,27,.22)] px-5 py-3 text-sm text-[#211f1b] transition-colors hover:border-[#a43f2d]">
              Start a conversation <MessageSquare className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <aside data-hero-item className="relative hidden min-h-64 border-l border-[rgba(27,28,24,.2)] pl-7 lg:block">
           <div data-hero-mark className="absolute -left-3 top-6 h-6 w-6 rounded-full border-4 border-[#f3efe6] bg-[#a43f2d]" />
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#77796e]">A short record</p>
          <p className="mt-10 max-w-[13rem] text-lg leading-tight tracking-[-.03em] text-[#1b1c18]">
            From a first HTML page to shipped school, library and portfolio products.
          </p>
           <a href="https://github.com/Reyhan-irza" target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[.16em] text-[#6d6a62] hover:text-[#a43f2d]">
            GitHub evidence <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </aside>
      </div>
    </section>
  );
}