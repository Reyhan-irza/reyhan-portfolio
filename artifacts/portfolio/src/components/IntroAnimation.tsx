import { useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";
import { gsap } from "../lib/motion";

interface IntroAnimationProps {
  onFinish: () => void;
}

export default function IntroAnimation({ onFinish }: IntroAnimationProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const element = introRef.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onFinish();
      return;
    }
    skipRef.current?.focus();
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        delay: 0.12,
        onComplete: onFinish,
        defaults: { overwrite: "auto" },
      });
      timeline
        .fromTo("[data-intro-orbit]", { autoAlpha: 0, scale: 0.78, rotation: -22 }, {
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          duration: 0.72,
          ease: "power3.out",
        })
        .fromTo("[data-intro-frame]", { autoAlpha: 0, scale: 0.82, rotation: 45 }, {
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          duration: 0.72,
          ease: "power2.out",
        }, 0.12)
        .fromTo("[data-intro-mark]", {
          clipPath: "inset(42% 42% 42% 42%)",
          scale: 0.9,
          opacity: 0,
          rotation: -3,
        }, {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.86,
          ease: "power3.inOut",
        }, 0.24)
        .fromTo("[data-intro-scan]", { scaleX: 0, autoAlpha: 0 }, {
          scaleX: 1,
          autoAlpha: 1,
          duration: 0.55,
          ease: "power3.inOut",
        }, 0.48)
        .fromTo("[data-intro-rule]", { scaleX: 0 }, {
          scaleX: 1,
          duration: 0.52,
          ease: "power2.inOut",
        }, 0.86)
        .fromTo("[data-intro-copy]", { y: 14, opacity: 0, filter: "blur(4px)" }, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.075,
          ease: "power3.out",
        }, 0.98)
        .to(
          ["[data-intro-mark]", "[data-intro-frame]", "[data-intro-orbit]", "[data-intro-scan]", "[data-intro-rule]", "[data-intro-copy]", ".rv-intro-skip"],
          { autoAlpha: 0, y: -10, scale: 0.985, duration: 0.28, ease: "power2.inOut" },
          1.9,
        )
        .to(element, { autoAlpha: 0, duration: 0.34, ease: "power2.inOut" }, 2.04);
    }, element);
    return () => context.revert();
  }, [onFinish]);

  return (
    <div
      ref={introRef}
      className="rv-intro fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-name"
      onKeyDown={(event) => {
        if (event.key === "Escape") onFinish();
        if (event.key === "Tab") {
          event.preventDefault();
          skipRef.current?.focus();
        }
      }}
    >
      <div className="rv-intro-backdrop absolute inset-0" aria-hidden="true" />
      <button ref={skipRef} type="button" className="rv-intro-skip absolute right-5 top-5 inline-flex min-h-11 items-center gap-2 px-3 text-xs text-white/65 hover:text-white" onClick={onFinish} aria-label="Skip introduction">
        Skip <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <div className="relative z-10 flex w-[min(88vw,28rem)] flex-col items-center px-6 text-center">
        <div className="rv-intro-stage relative mb-2 grid h-36 w-36 place-items-center md:h-40 md:w-40" aria-hidden="true">
          <span data-intro-orbit className="rv-intro-orbit absolute inset-[3%]" />
          <span data-intro-frame className="rv-intro-frame absolute inset-[15%]" />
          <span data-intro-scan className="rv-intro-scan absolute left-[17%] right-[17%] top-1/2" />
          <img data-intro-mark src={`${import.meta.env.BASE_URL}rv-mark.webp`} alt="" className="relative z-10 h-24 w-24 object-contain md:h-28 md:w-28" />
        </div>
        <div data-intro-rule className="my-6 h-px w-full origin-center bg-gradient-to-r from-transparent via-[#8491ff]/70 to-transparent" />
        <p data-intro-copy className="font-mono text-[10px] uppercase tracking-[.2em] text-[#aab4ff]">Vierlykirk / personal record</p>
        <h1 id="intro-name" data-intro-copy className="mt-3 text-xl font-semibold tracking-[-.035em] text-white md:text-2xl">Reyhan Irza Alvano</h1>
        <p data-intro-copy className="mt-2 text-xs tracking-[.08em] text-white/48">Student Developer · SMK</p>
      </div>
    </div>
  );
}
