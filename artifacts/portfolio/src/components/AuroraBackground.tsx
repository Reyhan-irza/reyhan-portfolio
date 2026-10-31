import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";

export default function AuroraBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    const media = gsap.matchMedia();
    media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const ambientLayers = background.querySelectorAll<HTMLElement>("[data-aurora-drift]");
      const drift = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
      drift
        .to(ambientLayers[0], { x: 18, y: 12, scale: 1.045, opacity: 0.62, duration: 18 })
        .to(ambientLayers[1], { x: -14, y: -10, scale: 1.035, opacity: 0.44, duration: 22 }, 0);

      const syncVisibility = () => {
        if (document.hidden) drift.pause();
        else drift.play();
      };
      document.addEventListener("visibilitychange", syncVisibility);
      syncVisibility();

      return () => {
        document.removeEventListener("visibilitychange", syncVisibility);
        drift.kill();
      };
    });

    return () => media.revert();
  }, []);

  return (
    <div ref={backgroundRef} className="aurora-bg" aria-hidden="true">
      <div className="aurora-blob-1" />
      <div className="aurora-blob-2" />
      <div className="aurora-blob-3" />
      <div className="aurora-blob-4" />
      <div className="aurora-blob-5" />
      <div className="aurora-blob-6" />
      <div className="aurora-curtain" />
      <div className="aurora-mobile-drift aurora-mobile-drift--one" data-aurora-drift />
      <div className="aurora-mobile-drift aurora-mobile-drift--two" data-aurora-drift />
    </div>
  );
}
