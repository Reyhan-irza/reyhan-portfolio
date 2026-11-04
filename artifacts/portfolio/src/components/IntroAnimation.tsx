import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";
import { BRAND_LOGO_INTRO_SRC } from "./BrandLogo";
import "./IntroAnimation.css";

interface IntroAnimationProps {
  onFinish: () => void;
}

const INTRO_COPY = [
  "STUDENT DEVELOPER / LUBUK BASUNG, INDONESIA",
  "Reyhan Irza Alvano",
  "Student Developer · SMK",
  "Selamat datang di portofolio saya.",
];

export default function IntroAnimation({ onFinish }: IntroAnimationProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const finishHandlerRef = useRef(onFinish);
  finishHandlerRef.current = onFinish;

  useLayoutEffect(() => {
    const element = introRef.current;
    if (!element) return;

    const pieces = Array.from(element.querySelectorAll<HTMLElement>("[data-intro-piece]"));
    const logo = element.querySelector<HTMLElement>("[data-intro-final]");
    const sheen = element.querySelector<HTMLElement>("[data-intro-sheen]");
    const copy = Array.from(element.querySelectorAll<HTMLElement>("[data-intro-copy]"));
    const glow = element.querySelector<HTMLElement>("[data-intro-glow]");
    if (!logo || !sheen || !glow || pieces.length !== 3 || copy.length !== 4) return;

    let finished = false;
    let safetyTimer: number | undefined;
    let timeline: ReturnType<typeof gsap.timeline> | undefined;
    let onVisibilityChange: (() => void) | undefined;
    const finishIntro = () => {
      if (finished) return;
      finished = true;
      onFinish();
    };
    finishHandlerRef.current = finishIntro;

    element.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("portfolio:scroll-lock", { detail: true }));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      finishIntro();
    } else {
      try {
        gsap.set(pieces, { autoAlpha: 0, x: 0, y: 0, rotation: 0, scale: 1 });
        gsap.set(logo, { autoAlpha: 0, scale: 0.94, rotation: -2 });
        gsap.set(sheen, { autoAlpha: 0, xPercent: -130 });
        gsap.set(copy, { autoAlpha: 0, y: 16, filter: "blur(5px)" });
        gsap.set(glow, { autoAlpha: 0, scale: 0.8 });

        timeline = gsap.timeline({
          delay: 0.06,
          onComplete: finishIntro,
          defaults: { overwrite: "auto", ease: "power3.out" },
        });
        timeline
          .to(glow, { autoAlpha: 1, scale: 1, duration: 0.72 }, 0)
          .fromTo(pieces[0], { autoAlpha: 0, x: -72, y: -35, rotation: -12, scale: 0.88 }, {
            autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.7, ease: "power4.out",
          }, 0.12)
          .fromTo(pieces[1], { autoAlpha: 0, x: -44, y: 40, rotation: 12, scale: 0.88 }, {
            autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.68, ease: "power4.out",
          }, 0.38)
          .fromTo(pieces[2], { autoAlpha: 0, x: 70, y: -20, rotation: 14, scale: 0.88 }, {
            autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.7, ease: "power4.out",
          }, 0.58)
          .to(pieces, { autoAlpha: 0, scale: 0.985, duration: 0.24, ease: "power2.inOut" }, 1.18)
          .to(logo, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.48, ease: "power2.out" }, 1.18)
          .fromTo(sheen, { xPercent: -130, autoAlpha: 0 }, {
            xPercent: 130, autoAlpha: 1, duration: 0.64, ease: "power2.inOut",
          }, 1.45)
          .to(sheen, { autoAlpha: 0, duration: 0.12 }, 2.0)
          .to(copy, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.38, stagger: 0.12 }, 1.68)
          .to(logo, { scale: 1.025, duration: 0.22, ease: "power1.inOut" }, 2.08)
          .to(logo, { scale: 1, duration: 0.22, ease: "power2.out" }, 2.3)
          .to(element, { autoAlpha: 0, duration: 0.48, ease: "power2.inOut" }, 2.48);

        const scheduleSafetyTimer = () => {
          if (safetyTimer !== undefined) window.clearTimeout(safetyTimer);
          if (!document.hidden) safetyTimer = window.setTimeout(finishIntro, 3600);
        };
        onVisibilityChange = () => {
          if (document.hidden) {
            timeline?.pause();
            if (safetyTimer !== undefined) window.clearTimeout(safetyTimer);
            safetyTimer = undefined;
          } else if (timeline && timeline.progress() < 1) {
            timeline.play();
            scheduleSafetyTimer();
          }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);
        if (document.hidden) timeline.pause();
        else scheduleSafetyTimer();
      } catch {
        finishIntro();
      }
    }

    return () => {
      timeline?.kill();
      if (safetyTimer !== undefined) window.clearTimeout(safetyTimer);
      if (onVisibilityChange) document.removeEventListener("visibilitychange", onVisibilityChange);
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new CustomEvent("portfolio:scroll-lock", { detail: false }));
      finishHandlerRef.current = onFinish;
    };
  }, [onFinish]);

  const requestFinish = () => finishHandlerRef.current();

  return (
    <div
      ref={introRef}
      id="rv-intro"
      className="rv-intro"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Reyhan Irza Alvano — logo intro"
      onKeyDown={(event) => {
        if (event.key === "Escape") requestFinish();
        if (event.key === "Tab") {
          event.preventDefault();
          skipRef.current?.focus();
        }
      }}
    >
      <div className="rv-intro-backdrop" aria-hidden="true" />
      <div className="rv-intro-vignette" aria-hidden="true" />
      <div className="rv-intro-hairline" aria-hidden="true" />
      <div className="rv-intro-controls">
        <button ref={skipRef} type="button" className="rv-intro-button" onClick={requestFinish} aria-label="Skip introduction">
          Skip
        </button>
        <button type="button" className="rv-intro-button rv-intro-button--primary" onClick={requestFinish}>
          Enter
        </button>
      </div>
      <div className="rv-intro-logo" aria-hidden="true">
        <div className="rv-intro-stage">
          <div className="rv-intro-glow" data-intro-glow />
          <img data-intro-piece className="rv-intro-piece rv-intro-piece--one" src={`${import.meta.env.BASE_URL}brand/rv-piece-01.webp`} alt="" decoding="async" fetchPriority="high" onError={requestFinish} draggable={false} />
          <img data-intro-piece className="rv-intro-piece rv-intro-piece--two" src={`${import.meta.env.BASE_URL}brand/rv-piece-02.webp`} alt="" decoding="async" fetchPriority="high" onError={requestFinish} draggable={false} />
          <img data-intro-piece className="rv-intro-piece rv-intro-piece--three" src={`${import.meta.env.BASE_URL}brand/rv-piece-03.webp`} alt="" decoding="async" fetchPriority="high" onError={requestFinish} draggable={false} />
          <div data-intro-final className="rv-intro-final">
            <img className="rv-intro-final-mark" src={BRAND_LOGO_INTRO_SRC} width={568} height={347} alt="" decoding="async" fetchPriority="high" onError={requestFinish} draggable={false} />
            <span data-intro-sheen className="rv-intro-sheen" style={{ maskImage: `url("${BRAND_LOGO_INTRO_SRC}")`, WebkitMaskImage: `url("${BRAND_LOGO_INTRO_SRC}")` }} />
          </div>
        </div>
      </div>
      <div className="rv-intro-identity">
        <p data-intro-copy className="rv-intro-kicker">{INTRO_COPY[0]}</p>
        <h1 data-intro-copy className="rv-intro-name">{INTRO_COPY[1]}</h1>
        <p data-intro-copy className="rv-intro-role">{INTRO_COPY[2]}</p>
        <p data-intro-copy className="rv-intro-story">{INTRO_COPY[3]}</p>
      </div>
    </div>
  );
}
