import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";

interface Options {
  threshold?: number;
  delay?: number;
  stagger?: number;
  distance?: number;
  scale?: number;
  refreshKey?: string | number;
}

/** Reversible, responsive reveal shared by section content and card groups. */
export function useScrollAnim<T extends HTMLElement = HTMLDivElement>(
  {
    threshold = 0.16,
    delay = 0,
    stagger = 0.075,
    distance = 20,
    scale = 1,
    refreshKey,
  }: Options = {},
) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = gsap.matchMedia();
    media.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        compact: "(max-width: 767px)",
        wide: "(min-width: 768px)",
      },
      (mediaContext) => {
        if (mediaContext.conditions?.reduced) {
          el.classList.add("show");
          return () => el.classList.remove("show");
        }

        el.classList.remove("show");
        const gsapContext = gsap.context(() => {
          const compact = Boolean(mediaContext.conditions?.compact);
          const motionDistance = compact ? Math.min(distance, 10) : distance;
          const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-motion-item]"));
          const timeline = gsap.timeline({
            delay: Math.max(0, delay) / 1000,
            scrollTrigger: {
              trigger: el,
              start: `top ${Math.round((1 - threshold) * 100)}%`,
              toggleActions: "play none play reverse",
              invalidateOnRefresh: true,
            },
          });

          timeline.fromTo(
            el,
            {
              opacity: 0,
              y: motionDistance,
              scale: compact ? 1 : scale,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: compact ? 0.46 : 0.68,
              ease: "power3.out",
            },
          );

          if (targets.length > 0) {
            timeline.fromTo(
              targets,
              {
                opacity: 0,
                y: compact ? Math.min(motionDistance * 0.6, 6) : Math.min(motionDistance * 0.7, 14),
              },
              {
                opacity: 1,
                y: 0,
                duration: compact ? 0.36 : 0.48,
                stagger: compact ? Math.min(stagger, 0.045) : stagger,
                ease: "power2.out",
              },
              compact ? 0.04 : 0.08,
            );
          }
        }, el);
        return () => gsapContext.revert();
      },
    );

    return () => {
      media.revert();
    };
  }, [threshold, delay, stagger, distance, scale, refreshKey]);

  return ref;
}
