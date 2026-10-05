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
      const timeline = gsap.timeline({ delay: 0.08, onComplete: onFinish });
      timeline
        .fromTo("[data-intro-mark]", { scale: 0.88, opacity: 0, rotate: -6 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.42, ease: "power3.out" })
        .fromTo("[data-intro-rule]", { scaleX: 0 }, { scaleX: 1, duration: 0.38, ease: "power2.inOut" }, 0.16)
        .fromTo("[data-intro-copy]", { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38, stagger: 0.06, ease: "power2.out" }, 0.22)
        .to(element, { opacity: 0, duration: 0.24, ease: "power1.out" }, 0.9);
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
        <img data-intro-mark src={`${import.meta.env.BASE_URL}rv-mark.webp`} alt="RV geometric monogram" className="h-24 w-24 object-contain md:h-28 md:w-28" />
        <div data-intro-rule className="my-6 h-px w-full origin-center bg-gradient-to-r from-transparent via-[#8491ff]/70 to-transparent" />
        <p data-intro-copy className="font-mono text-[10px] uppercase tracking-[.2em] text-[#aab4ff]">Vierlykirk / personal record</p>
        <h1 id="intro-name" data-intro-copy className="mt-3 text-xl font-semibold tracking-[-.035em] text-white md:text-2xl">Reyhan Irza Alvano</h1>
        <p data-intro-copy className="mt-2 text-xs tracking-[.08em] text-white/48">Student Developer · SMK</p>
      </div>
    </div>
  );
}
