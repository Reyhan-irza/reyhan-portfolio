import { useLayoutEffect, useRef } from "react";
import { gsap, SCENE } from "../lib/motion";

type BoundaryStyle = "trace" | "return" | "resolve";

interface SectionBoundaryProps {
  variant: BoundaryStyle;
}

export default function SectionBoundary({ variant }: SectionBoundaryProps) {
  const boundaryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(boundary, { scaleX: 0, opacity: 0, transformOrigin: "center" }, {
          scaleX: 1, opacity: 1, ease: "none", scrollTrigger: {
            trigger: boundary, start: "clamp(top 95%)", end: "clamp(top 55%)", scrub: SCENE.scrub,
          },
        });
      }, boundary);
      return () => context.revert();
    });
    return () => media.revert();
  }, [variant]);

  return (
    <div
      ref={boundaryRef}
      className={`editorial-divider editorial-divider--${variant} mx-auto max-w-6xl`}
      aria-hidden="true"
    />
  );
}
