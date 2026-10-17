import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";

type BoundaryStyle = "trace" | "return" | "resolve";

interface SectionBoundaryProps {
  variant: BoundaryStyle;
}

const transitionSettings: Record<BoundaryStyle, {
  fromX: number;
  fromScale: number;
  origin: string;
  duration: number;
  ease: string;
}> = {
  trace: {
    fromX: -14,
    fromScale: 0.72,
    origin: "left center",
    duration: 0.68,
    ease: "power3.out",
  },
  return: {
    fromX: 14,
    fromScale: 0.78,
    origin: "right center",
    duration: 0.56,
    ease: "power2.out",
  },
  resolve: {
    fromX: 0,
    fromScale: 0,
    origin: "center center",
    duration: 0.78,
    ease: "power3.inOut",
  },
};

export default function SectionBoundary({ variant }: SectionBoundaryProps) {
  const boundaryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) return;

    const media = gsap.matchMedia();
    media.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        compact: "(max-width: 767px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (context.conditions?.reduced || !context.conditions?.motion) return;

        const settings = transitionSettings[variant];
        const compact = Boolean(context.conditions?.compact);
        const scope = gsap.context(() => {
          gsap.fromTo(
            boundary,
            {
              autoAlpha: 0.45,
              x: compact ? 0 : settings.fromX,
              scaleX: compact ? Math.max(settings.fromScale, 0.82) : settings.fromScale,
              transformOrigin: settings.origin,
            },
            {
              autoAlpha: 1,
              x: 0,
              scaleX: 1,
              duration: compact ? settings.duration * 0.72 : settings.duration,
              ease: settings.ease,
              scrollTrigger: {
                trigger: boundary,
                start: "top 84%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            },
          );
        }, boundary);

        return () => scope.revert();
      },
    );

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
