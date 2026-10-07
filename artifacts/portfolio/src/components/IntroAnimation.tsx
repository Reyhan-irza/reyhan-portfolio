import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";
import { BRAND_LOGO_INTRO_SRC } from "./BrandLogo";

interface IntroAnimationProps {
  onFinish: () => void;
}

export default function IntroAnimation({ onFinish }: IntroAnimationProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const element = introRef.current;
    if (!element) return;
    const pieces = Array.from(element.querySelectorAll<HTMLImageElement>("[data-intro-piece]"));
    const finalLogo = element.querySelector<HTMLElement>("[data-intro-final]");
    const sweep = element.querySelector<HTMLElement>("[data-intro-sweep]");
    const identity = Array.from(element.querySelectorAll<HTMLElement>("[data-intro-copy]"));
    const identityGroup = element.querySelector<HTMLElement>("[data-intro-identity]");
    const orbit = element.querySelector<HTMLElement>("[data-intro-orbit]");
    const frame = element.querySelector<HTMLElement>("[data-intro-frame]");
    const scan = element.querySelector<HTMLElement>("[data-intro-scan]");
    if (!finalLogo || !sweep || !identityGroup || !orbit || !frame || !scan || pieces.length !== 3) return;

    element.focus({ preventScroll: true });
    const media = gsap.matchMedia();
    media.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        standard: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const isReduced = Boolean(context.conditions?.reduced);
        const compact = window.matchMedia("(max-width: 640px)").matches;
        const distance = Math.min(compact ? 76 : 142, Math.max(compact ? 36 : 76, element.clientWidth * 0.16));

        gsap.set(element, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(pieces, { autoAlpha: 0, x: 0, y: 0, rotation: 0, scale: 1 });
        gsap.set(finalLogo, { autoAlpha: 0, scale: 0.97 });
        gsap.set(sweep, { autoAlpha: 0, xPercent: -130 });
        gsap.set(identity, { autoAlpha: 0, y: 14, filter: "blur(4px)" });
        gsap.set([orbit, frame], { autoAlpha: 0, scale: 0.92 });
        gsap.set(scan, { autoAlpha: 0, scaleX: 0, transformOrigin: "left center" });

        if (isReduced) {
          gsap.set(finalLogo, { autoAlpha: 1, scale: 1 });
          gsap.set(identity, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
          const reducedTimeline = gsap.timeline({ onComplete: onFinish });
          reducedTimeline.to(element, {
            autoAlpha: 0,
            delay: 0.9,
            duration: 0.16,
            ease: "none",
          });
          return () => reducedTimeline.kill();
        }

        const timeline = gsap.timeline({
          delay: 0.12,
          onComplete: onFinish,
          defaults: { overwrite: "auto" },
        });

        timeline
          .to(orbit, { autoAlpha: 1, scale: 1, duration: 0.62, ease: "power3.out" }, 0)
          .to(frame, { autoAlpha: 1, scale: 1, duration: 0.66, ease: "power2.out" }, 0.1)
          .fromTo(pieces[0], {
            x: -distance,
            y: -distance * 0.58,
            rotation: -16,
            scale: 0.82,
            autoAlpha: 0,
          }, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
          }, 0.24)
          .fromTo(pieces[1], {
            x: -distance * 0.76,
            y: distance * 0.62,
            rotation: 15,
            scale: 0.84,
            autoAlpha: 0,
          }, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
          }, 0.56)
          .fromTo(pieces[2], {
            x: distance,
            y: -distance * 0.2,
            rotation: 17,
            scale: 0.82,
            autoAlpha: 0,
          }, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.72,
            ease: "power3.out",
          }, 0.88)
          .to(scan, { autoAlpha: 0.8, scaleX: 1, duration: 0.42, ease: "power2.inOut" }, 1.22)
          .to(pieces, { scale: 0.985, duration: 0.22, ease: "power2.inOut" }, 1.72)
          .to(pieces, { scale: 1, duration: 0.2, ease: "power3.out" }, 1.94)
          .to(pieces, { autoAlpha: 0, duration: 0.2, ease: "power2.inOut" }, 2.2)
          .to(finalLogo, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.34,
            ease: "power2.out",
          }, 2.2)
          .fromTo(sweep, { xPercent: -130, autoAlpha: 0 }, {
            xPercent: 130,
            autoAlpha: 1,
            duration: 0.56,
            ease: "power2.inOut",
          }, 2.48)
          .to(sweep, { autoAlpha: 0, duration: 0.1 }, 2.94)
          .to(scan, { autoAlpha: 0, duration: 0.18, ease: "power2.inOut" }, 2.2)
          .to(identity, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.44,
            stagger: 0.08,
            ease: "power3.out",
          }, 2.72)
          .to(identityGroup, { y: -18, scale: 0.97, duration: 0.55, ease: "power2.inOut" }, 3.82)
          .to(element, {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.62,
            ease: "power3.inOut",
          }, 3.82)
          .to(element, { autoAlpha: 0, duration: 0.02 }, 4.42);

        return () => timeline.kill();
      },
    );

    return () => media.revert();
  }, [onFinish]);

  return (
    <div
      ref={introRef}
      className="rv-intro fixed inset-0 z-[100] flex items-center justify-center"
      tabIndex={-1}
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
      <button ref={skipRef} type="button" className="rv-intro-skip absolute inline-flex min-h-11 items-center" onClick={onFinish} aria-label="Skip introduction">
        Skip
      </button>
      <div className="rv-intro-content z-10 text-center">
        <div className="rv-intro-stage grid place-items-center" aria-hidden="true">
          <span data-intro-orbit className="rv-intro-orbit absolute inset-[8%]" />
          <span data-intro-frame className="rv-intro-frame absolute inset-0" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="50,1 99,50 50,99 1,50" />
            </svg>
          </span>
          <span data-intro-scan className="rv-intro-scan absolute left-[17%] right-[17%] top-1/2" />
          <div className="rv-intro-assembly">
            <img
              data-intro-piece
              className="rv-intro-piece rv-intro-piece--one"
              src={`${import.meta.env.BASE_URL}brand/rv-piece-01.webp`}
              alt=""
              draggable={false}
            />
            <img
              data-intro-piece
              className="rv-intro-piece rv-intro-piece--two"
              src={`${import.meta.env.BASE_URL}brand/rv-piece-02.webp`}
              alt=""
              draggable={false}
            />
            <img
              data-intro-piece
              className="rv-intro-piece rv-intro-piece--three"
              src={`${import.meta.env.BASE_URL}brand/rv-piece-03.webp`}
              alt=""
              draggable={false}
            />
            <div data-intro-final className="rv-intro-final">
              <img
                className="rv-intro-final-mark"
                src={BRAND_LOGO_INTRO_SRC}
                width={568}
                height={347}
                alt=""
                draggable={false}
              />
              <span
                data-intro-sweep
                className="rv-intro-light-sweep"
                style={{
                  maskImage: `url("${BRAND_LOGO_INTRO_SRC}")`,
                  WebkitMaskImage: `url("${BRAND_LOGO_INTRO_SRC}")`,
                }}
              />
            </div>
          </div>
        </div>
        <div data-intro-identity className="rv-intro-identity">
          <p data-intro-copy className="font-mono text-[10px] uppercase tracking-[.2em] text-[#aab4ff]">Vierlykirk / personal record</p>
          <h1 id="intro-name" data-intro-copy className="mt-3 text-xl font-semibold tracking-[-.035em] text-white md:text-2xl">Reyhan Irza Alvano</h1>
          <p data-intro-copy className="mt-2 text-xs tracking-[.08em] text-white/60">Student Developer · SMK</p>
        </div>
      </div>
    </div>
  );
}
