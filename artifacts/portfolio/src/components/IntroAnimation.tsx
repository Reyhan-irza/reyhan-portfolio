import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";
import { BRAND_LOGO_SRC } from "./BrandLogo";
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

const BRAND = `${import.meta.env.BASE_URL}brand/`;

// Timeline map (seconds). Total ≈ 4.15s.
const T = { fragments: 0.15, tension: 0.75, assemble: 1.0, impact: 1.6, type: 1.95, exit: 3.3 };

export default function IntroAnimation({ onFinish }: IntroAnimationProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const onFinishRef = useRef(onFinish);
  const finishedRef = useRef(false);
  const finishRef = useRef<() => void>(() => {});

  // Always call the latest onFinish without re-running the animation effect.
  useLayoutEffect(() => {
    onFinishRef.current = onFinish;
  });

  useLayoutEffect(() => {
    const root = introRef.current;
    if (!root) return;

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinishRef.current();
    };
    finishRef.current = finish;

    root.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("portfolio:scroll-lock", { detail: true }));
    const unlock = () => {
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new CustomEvent("portfolio:scroll-lock", { detail: false }));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return unlock;
    }

    const q = <E extends HTMLElement>(selector: string) => root.querySelector<E>(selector);
    const pieces = Array.from(root.querySelectorAll<HTMLElement>("[data-intro-piece]"));
    const copy = Array.from(root.querySelectorAll<HTMLElement>("[data-intro-copy]"));
    const [p1, p2, p3] = pieces;
    const logo = q(".rv-intro-logo");
    const stage = q(".rv-intro-stage");
    const backdrop = q(".rv-intro-backdrop");
    const vignette = q(".rv-intro-vignette");
    const hairline = q(".rv-intro-hairline");
    const glow = q("[data-intro-glow]");
    const final = q("[data-intro-final]");
    const sheen = q("[data-intro-sheen]");
    const bar = q("[data-intro-sheen-bar]");
    const target = document.querySelector<HTMLElement>(".portfolio-nav-logo");

    if (!p1 || !p2 || !p3 || !logo || !stage || !backdrop || !vignette || !hairline || !glow || !final || !sheen || !bar || copy.length !== 4) {
      finish();
      return unlock;
    }

    let cancelled = false;
    let started = false;
    let failsafe: number | undefined;
    let tl: ReturnType<typeof gsap.timeline> | undefined;

    const armFailsafe = () => {
      window.clearTimeout(failsafe);
      if (!tl) return;
      failsafe = window.setTimeout(finish, (tl.duration() - tl.time() + 3) * 1000);
    };
    const onVisibility = () => {
      if (!started || !tl) return;
      if (document.hidden) {
        tl.pause();
        window.clearTimeout(failsafe);
      } else {
        tl.play();
        armFailsafe();
      }
    };

    try {
      // Initial state. Pieces start far away along their own diagonals (percent of own size → responsive).
      gsap.set(pieces, { opacity: 0 });
      gsap.set(p1, { xPercent: -46, yPercent: -26 });
      gsap.set(p2, { xPercent: -34, yPercent: 60 });
      gsap.set(p3, { xPercent: 46, yPercent: -40 });
      gsap.set([final, glow, sheen, vignette], { opacity: 0 });
      gsap.set(bar, { xPercent: -150 });
      gsap.set(hairline, { scaleX: 0, opacity: 1, transformOrigin: "50% 50%" });
      gsap.set(copy, { opacity: 0, y: 14 });
      gsap.set(logo, { x: 0, y: 0, yPercent: 0, scale: 1 });
      gsap.set(stage, { scale: 1 });

      tl = gsap.timeline({ paused: true, onComplete: finish, defaults: { overwrite: false } });
      Object.entries(T).forEach(([label, time]) => tl!.addLabel(label, time));

      // 1 · anticipation
      tl.to(vignette, { opacity: 1, duration: 1, ease: "power1.out" }, 0)
        .to(hairline, { scaleX: 1, duration: 0.7, ease: "expo.inOut" }, 0.05);

      // 2 · fragment entrance: decelerate into a hover offset on the same line they will lock along
      const enter = (el: HTMLElement, x: number, y: number, at: string) =>
        tl!
          .to(el, { xPercent: x, yPercent: y, duration: 0.75, ease: "power3.out" }, at)
          .to(el, { opacity: 1, duration: 0.3, ease: "none" }, at);
      enter(p1, -10, -6, "fragments");
      enter(p2, -8, 12, "fragments+=.08");
      enter(p3, 10, -8, "fragments+=.16");
      tl.to(hairline, { opacity: 0, duration: 0.35, ease: "power1.in" }, "tension")
        .to(stage, { scale: 1.02, duration: T.impact - T.tension, ease: "power1.in" }, "tension");

      // 3 · precision assembly: continue the same direction, accelerating into lock
      const lock = (el: HTMLElement, at: string) =>
        tl!.to(el, { xPercent: 0, yPercent: 0, duration: 0.5, ease: "power4.in" }, at);
      lock(p2, "assemble");
      lock(p1, "assemble+=.05");
      lock(p3, "assemble+=.1");

      // 4 · impact: the complete logo replaces the pieces on the exact frame of the last lock
      tl.set(final, { opacity: 1 }, "impact")
        .set(pieces, { opacity: 0 }, "impact")
        .fromTo(stage, { scale: 1.045 }, { scale: 1, duration: 0.9, ease: "power3.out", immediateRender: false }, "impact")
        .to(glow, { opacity: 0.9, duration: 0.08, ease: "power2.out" }, "impact")
        .to(glow, { opacity: 0.3, duration: 1.3, ease: "power2.out" }, "impact+=.08")
        .set(sheen, { opacity: 1 }, "impact")
        .fromTo(bar, { xPercent: -150 }, { xPercent: 420, duration: 0.7, ease: "power2.inOut", immediateRender: false }, "impact")
        .to(sheen, { opacity: 0, duration: 0.12 }, "impact+=.68");

      // 5 · identity (opacity + translate only, no blur filters).
      // The logo shift uses pixels (not yPercent) so the handoff can measure it exactly.
      tl.to(logo, { y: () => -logo.offsetHeight * 0.07, scale: 0.9, duration: 1, ease: "power3.inOut" }, "type")
        .to(copy, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.1 }, "type+=.2");

      // 6 · handoff: the logo flies onto the real navbar logo. Both are the same square image,
      // so square-to-square gives an exact landing. Measured at the moment the flight starts.
      const fly = () => {
        const m = logo.getBoundingClientRect();
        const n = target ? target.getBoundingClientRect() : null;
        if (!n || !n.width || !m.width) return { dx: 0, dy: 0, k: 1 };
        return {
          dx: n.left + n.width / 2 - (m.left + m.width / 2),
          dy: n.top + n.height / 2 - (m.top + m.height / 2),
          k: n.width / m.width,
        };
      };
      tl.to(copy, { opacity: 0, y: -10, duration: 0.35, ease: "power2.in" }, "exit")
        .to(glow, { opacity: 0, duration: 0.5, ease: "power2.out" }, "exit")
        .to(logo, {
          x: () => Number(gsap.getProperty(logo, "x")) + fly().dx,
          y: () => Number(gsap.getProperty(logo, "y")) + fly().dy,
          scale: () => Number(gsap.getProperty(logo, "scale")) * fly().k,
          duration: 0.8,
          ease: "power3.inOut",
        }, "exit")
        .to([backdrop, vignette], { opacity: 0, duration: 0.7, ease: "power2.inOut" }, "exit+=.15")
        .set(root, { pointerEvents: "none" }, "exit+=.3");

      document.addEventListener("visibilitychange", onVisibility);

      // Wait for decoded images (max 1.5s) so decoding never happens mid-animation.
      const images = Array.from(root.querySelectorAll("img"));
      Promise.race([
        Promise.all(images.map((img) => img.decode().catch(() => undefined))),
        new Promise((resolve) => window.setTimeout(resolve, 1500)),
      ]).then(() => {
        if (cancelled || finishedRef.current || !tl) return;
        started = true;
        if (document.hidden) return; // onVisibility starts it when the tab returns
        tl.play(0);
        armFailsafe();
      });
    } catch {
      finish();
    }

    return () => {
      cancelled = true;
      tl?.kill();
      window.clearTimeout(failsafe);
      document.removeEventListener("visibilitychange", onVisibility);
      unlock();
    };
  }, []);

  const requestFinish = () => finishRef.current();

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
          <img data-intro-piece className="rv-intro-piece rv-intro-piece--one" src={`${BRAND}rv-piece-01.webp`} alt="" decoding="async" fetchPriority="high" onError={requestFinish} draggable={false} />
          <img data-intro-piece className="rv-intro-piece rv-intro-piece--two" src={`${BRAND}rv-piece-02.webp`} alt="" decoding="async" fetchPriority="high" onError={requestFinish} draggable={false} />
          <img data-intro-piece className="rv-intro-piece rv-intro-piece--three" src={`${BRAND}rv-piece-03.webp`} alt="" decoding="async" fetchPriority="high" onError={requestFinish} draggable={false} />
          <div data-intro-final className="rv-intro-final">
            <img className="rv-intro-final-mark" src={BRAND_LOGO_SRC} width={640} height={640} alt="" decoding="async" fetchPriority="high" onError={requestFinish} draggable={false} />
            <span data-intro-sheen className="rv-intro-sheen" style={{ maskImage: `url("${BRAND_LOGO_SRC}")`, WebkitMaskImage: `url("${BRAND_LOGO_SRC}")` }}>
              <span data-intro-sheen-bar className="rv-intro-sheen-bar" />
            </span>
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