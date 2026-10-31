import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";
import { BRAND_LOGO_INTRO_SRC } from "./BrandLogo";

interface IntroAnimationProps {
  onFinish: () => void;
}

export default function IntroAnimation({ onFinish }: IntroAnimationProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const finishHandlerRef = useRef(onFinish);
  finishHandlerRef.current = onFinish;

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
    const flash = element.querySelector<HTMLElement>("[data-intro-flash]");
    if (!finalLogo || !sweep || !identityGroup || !orbit || !frame || !scan || !flash || pieces.length !== 3) return;

    let finished = false;
    let safetyTimer: number | undefined;
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

        if (isReduced) {
          finishIntro();
          return;
        }

        try {
          gsap.set(element, compact
            ? { autoAlpha: 1 }
            : { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(pieces, { autoAlpha: 0, x: 0, y: 0, rotation: 0, scale: 1 });
          gsap.set(finalLogo, compact
            ? { autoAlpha: 0, scale: 0.985, rotation: 0 }
            : { autoAlpha: 0, scale: 0.94, rotation: -2 });
          gsap.set(sweep, { autoAlpha: 0, xPercent: -130 });
          gsap.set(identity, compact
            ? { autoAlpha: 0, y: 8 }
            : { autoAlpha: 0, y: 22, filter: "blur(7px)" });
          gsap.set(orbit, { autoAlpha: 0, scale: 0.82, rotation: -18 });
          gsap.set(frame, { autoAlpha: 0, scale: 0.92, rotation: 8 });
          gsap.set(scan, { autoAlpha: 0, scaleX: 0, transformOrigin: "left center" });
          gsap.set(flash, { autoAlpha: 0, scale: 0.7 });

          const timeline = gsap.timeline({
            delay: compact ? 0.04 : 0.08,
            onComplete: finishIntro,
            defaults: { overwrite: "auto", ease: "power3.out" },
          });

          if (compact) {
            timeline
              .fromTo(pieces, { autoAlpha: 0, y: 8, scale: 0.985 }, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.48,
                stagger: 0.12,
                ease: "power2.out",
              }, 0)
              .to(pieces, {
                autoAlpha: 0,
                scale: 0.99,
                duration: 0.28,
                ease: "sine.inOut",
              }, 0.76)
              .to(finalLogo, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.42,
                ease: "power2.out",
              }, 0.76)
              .to(identity[0], {
                autoAlpha: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              }, 1.02)
              .to(identity[1], {
                autoAlpha: 1,
                y: 0,
                duration: 0.38,
                ease: "power2.out",
              }, 1.16)
              .to(identity.slice(2), {
                autoAlpha: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.12,
                ease: "power2.out",
              }, 1.48)
              .to(element, {
                autoAlpha: 0,
                duration: 0.42,
                ease: "power2.inOut",
              }, 2.04);
          } else {
            timeline
              .addLabel("signal", 0)
              .to(orbit, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.9 }, "signal")
              .to(frame, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.74, ease: "power2.out" }, 0.1)
              .addLabel("assembly", 0.18)
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
                ease: "power4.out",
              }, "assembly")
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
                ease: "power4.out",
              }, "assembly+=0.3")
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
                ease: "power4.out",
              }, "assembly+=0.56")
              .addLabel("lockup", 1.48)
              .to(scan, { autoAlpha: 0.8, scaleX: 1, duration: 0.42, ease: "power2.inOut" }, "lockup-=0.14")
              .to(pieces, { scale: 1.035, duration: 0.18, ease: "power2.out" }, "lockup")
              .to(flash, { autoAlpha: 0.72, scale: 1.08, duration: 0.1, ease: "power2.out" }, "lockup+=0.08")
              .to(flash, { autoAlpha: 0, scale: 1.3, duration: 0.36, ease: "power2.out" }, "lockup+=0.18")
              .to(pieces, { autoAlpha: 0, scale: 0.985, duration: 0.22, ease: "power2.inOut" }, "lockup+=0.18")
              .to(finalLogo, {
                autoAlpha: 1,
                scale: 1,
                rotation: 0,
                duration: 0.46,
                ease: "power2.out",
              }, "lockup+=0.18")
              .fromTo(sweep, { xPercent: -130, autoAlpha: 0 }, {
                xPercent: 130,
                autoAlpha: 1,
                duration: 0.62,
                ease: "power2.inOut",
              }, "lockup+=0.38")
              .to(sweep, { autoAlpha: 0, duration: 0.1 }, "lockup+=0.9")
              .to(scan, { autoAlpha: 0, duration: 0.18, ease: "power2.inOut" }, "lockup+=0.2")
              .addLabel("introduction", "lockup+=0.48")
              .to(identity[0], {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.42,
              }, "introduction")
              .to(identity.slice(1), {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.5,
                stagger: 0.1,
              }, "introduction+=0.12")
              .to(finalLogo, { scale: 1.025, duration: 0.26, ease: "power1.inOut" }, "introduction+=0.62")
              .to(finalLogo, { scale: 1, duration: 0.26, ease: "power2.out" }, "introduction+=0.88")
              .addLabel("reveal", "introduction+=1.2")
              .to(identityGroup, { y: -16, scale: 0.97, duration: 0.5, ease: "power2.inOut" }, "reveal")
              .to(element, {
                clipPath: "inset(0% 0% 100% 0%)",
                duration: 0.5,
                ease: "power3.inOut",
              }, "reveal")
              .to(element, { autoAlpha: 0, duration: 0.02 }, "reveal+=0.5");

            timeline.timeScale(1.15);
          }

          const clearSafetyTimer = () => {
            if (safetyTimer !== undefined) {
              window.clearTimeout(safetyTimer);
              safetyTimer = undefined;
            }
          };
          const scheduleSafetyTimer = () => {
            clearSafetyTimer();
            if (!document.hidden) {
              safetyTimer = window.setTimeout(finishIntro, compact ? 3600 : 5200);
            }
          };
          const resumeWhenVisible = () => {
            if (document.hidden) {
              timeline.pause();
              clearSafetyTimer();
            } else if (timeline.progress() < 1) {
              timeline.play();
              scheduleSafetyTimer();
            }
          };
          document.addEventListener("visibilitychange", resumeWhenVisible);
          if (document.hidden) timeline.pause();
          else scheduleSafetyTimer();
          return () => {
            document.removeEventListener("visibilitychange", resumeWhenVisible);
            clearSafetyTimer();
            timeline.kill();
          };
        } catch {
          finishIntro();
          return;
        }
      },
    );

    return () => {
      media.revert();
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new CustomEvent("portfolio:scroll-lock", { detail: false }));
      finishHandlerRef.current = onFinish;
    };
  }, [onFinish]);

  const requestFinish = () => finishHandlerRef.current();

  return (
    <div
      ref={introRef}
      className="rv-intro fixed inset-0 z-[100] flex items-center justify-center"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-name"
      onKeyDown={(event) => {
        if (event.key === "Escape") requestFinish();
        if (event.key === "Tab") {
          event.preventDefault();
          skipRef.current?.focus();
        }
      }}
    >
      <div className="rv-intro-backdrop absolute inset-0" aria-hidden="true" />
      <button ref={skipRef} type="button" className="rv-intro-skip absolute inline-flex min-h-11 items-center" onClick={requestFinish} aria-label="Skip introduction">
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
          <span data-intro-flash className="rv-intro-flash absolute inset-0" />
          <span data-intro-scan className="rv-intro-scan absolute left-[17%] right-[17%] top-1/2" />
          <div className="rv-intro-assembly">
            <img
              data-intro-piece
              className="rv-intro-piece rv-intro-piece--one"
              src={`${import.meta.env.BASE_URL}brand/rv-piece-01.webp`}
              alt=""
              decoding="async"
              fetchPriority="high"
              onError={requestFinish}
              draggable={false}
            />
            <img
              data-intro-piece
              className="rv-intro-piece rv-intro-piece--two"
              src={`${import.meta.env.BASE_URL}brand/rv-piece-02.webp`}
              alt=""
              decoding="async"
              fetchPriority="high"
              onError={requestFinish}
              draggable={false}
            />
            <img
              data-intro-piece
              className="rv-intro-piece rv-intro-piece--three"
              src={`${import.meta.env.BASE_URL}brand/rv-piece-03.webp`}
              alt=""
              decoding="async"
              fetchPriority="high"
              onError={requestFinish}
              draggable={false}
            />
            <div data-intro-final className="rv-intro-final">
              <img
                className="rv-intro-final-mark"
                src={BRAND_LOGO_INTRO_SRC}
                width={568}
                height={347}
                alt=""
                decoding="async"
                fetchPriority="high"
                onError={requestFinish}
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
          <p data-intro-copy className="rv-intro-kicker">STUDENT DEVELOPER / LUBUK BASUNG, INDONESIA</p>
          <h1 id="intro-name" data-intro-copy className="rv-intro-name">Reyhan Irza Alvano</h1>
          <p data-intro-copy className="rv-intro-role">Student Developer · SMK</p>
          <p data-intro-copy className="rv-intro-story">Selamat datang di portofolio saya.</p>
        </div>
      </div>
    </div>
  );
}
