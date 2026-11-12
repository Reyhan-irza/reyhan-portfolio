import { useLayoutEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { gsap, SCENE } from "../lib/motion";
import { scrollToSection } from "../lib/scroll";
import BrandLogo from "./BrandLogo";
import HeroTypingLoop from "./HeroTypingLoop";

export default function HeroSection({ ready = true }: { ready?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!ready || !section) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: SCENE.ease } })
          .addLabel("image", 0).addLabel("name", .22).addLabel("details", .88)
          .fromTo(".hero-mark-image", { scale: 1.15, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.75, clearProps: "transform,opacity" }, "image")
          .fromTo("[data-hero-title-line]", { yPercent: 110, rotation: 3, transformOrigin: "0% 100%" },
            { yPercent: 0, rotation: 0, duration: SCENE.title, stagger: SCENE.lineStagger, clearProps: "transform" }, "name")
          .fromTo("[data-hero-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.1 }, "name+=0.2")
          .fromTo("[data-hero-kicker], [data-hero-bio], [data-hero-callout-copy], [data-hero-action], [data-hero-github]",
            { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: SCENE.detail, stagger: .06, clearProps: "transform,opacity" }, "details")
          .fromTo(document.querySelector(".editorial-nav"), { opacity: 0 },
            { opacity: 1, duration: .55, clearProps: "opacity" }, .15);
        gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: {
          id: "hero-depth", trigger: section, start: "top top", end: "bottom top",
          scrub: SCENE.scrub, invalidateOnRefresh: true,
        } }).fromTo("[data-hero-title-depth]", { y: 0 }, { y: () => -Math.min(90, section.clientHeight * .12) }, 0)
          .fromTo("[data-hero-bg]", { yPercent: 0, scale: 1 }, { yPercent: 24, scale: 1.06 }, 0)
          .to("[data-hero-scroll-cue]", { opacity: 0, y: -18, duration: .25 }, 0);
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, [ready]);

  return (
    <section ref={sectionRef} id="home" data-hero data-hero-ready={ready} inert={!ready} aria-hidden={!ready} className="hero-section relative min-h-[100svh] overflow-hidden px-5 pb-16 pt-32 md:px-10 md:pt-40">
      <div className="hero-content relative z-10 mx-auto grid min-h-[calc(100svh-11rem)] max-w-[1440px] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.66fr)]">
        <div className="relative z-10 pb-6">
          <div className="hero-editorial">
          <p data-hero-kicker className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.17em] text-[#aab2c2] md:text-sm">
            Student developer <span className="text-white/20">/</span> Lubuk Basung, Indonesia
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
                Saya Reyhan. Mengolah rasa penasaran menjadi website yang bisa dipakai, dari ide pertama sampai detail interaksinya.
              </p>
            </div>
            <p className="relative max-w-[250px] pl-4 text-sm leading-relaxed text-[#8b93a3] md:text-base">
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
          <div className="hero-action-row mt-9 flex flex-wrap items-center gap-3">
            <button type="button" data-hero-action onClick={() => scrollToSection("#projects")} className="hero-primary group inline-flex min-h-12 items-center gap-3 px-5 text-xs font-bold uppercase tracking-[.11em]">
              Lihat karya saya <ArrowDown className="hero-arrow-down h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
            <button type="button" data-hero-action onClick={() => scrollToSection("#contact")} className="hero-secondary group inline-flex min-h-12 items-center gap-2 px-5 text-xs uppercase tracking-[.1em] text-white/70 transition-colors hover:text-white">
              Hubungi saya <MoveUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </button>
            <a data-hero-github href="https://github.com/Reyhan-irza" target="_blank" rel="noopener noreferrer" className="hero-secondary inline-flex min-h-12 items-center gap-2 text-xs tracking-[.04em] text-white/50 transition-colors hover:text-[#9da9ff]">
              GitHub <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
          </div>
        </div>

        <div className="hero-identity-frame">
        <aside data-hero-bg data-hero-mark-stage className="hero-mark-stage relative mx-auto aspect-square w-full max-w-[520px]" aria-label="Identitas visual RV">
          <div className="hero-mark-image absolute inset-[13%]">
            <BrandLogo
              size="custom"
              alt="Monogram RV berwarna perak metalik dengan cahaya biru"
              fetchPriority="high"
              className="h-full w-full"
            />
          </div>
          <div className="absolute bottom-[9%] left-[8%] font-mono text-[9px] uppercase tracking-[.18em] text-white/35">Identitas / 01</div>
          <div className="absolute right-[8%] top-[9%] font-mono text-[9px] uppercase tracking-[.18em] text-[#8a98ff]">Vierlykirk</div>
        </aside>
        </div>
      </div>
      <a data-hero-scroll-cue href="#technology-bands" onClick={(event) => { event.preventDefault(); scrollToSection("#technology-bands"); }} className="hero-scroll-cue absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 font-mono text-[9px] uppercase tracking-[.2em] text-white/40 transition-colors hover:text-white/80">
        Kenali lebih dekat <span className="h-7 w-px bg-gradient-to-b from-[#8190ff] to-transparent" aria-hidden="true" />
      </a>
    </section>
  );
}
