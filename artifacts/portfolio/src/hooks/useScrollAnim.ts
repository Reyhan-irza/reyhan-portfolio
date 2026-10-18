import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";

interface Options {
  threshold?: number;
  delay?: number;
  stagger?: number;
  distance?: number;
  scale?: number;
  refreshKey?: string | number;
  reversibleOnCompact?: boolean;
  story?: boolean;
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
    reversibleOnCompact = false,
    story = false,
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
          const itemDepth = [0.78, 1, 0.86] as const;
          const timeline = gsap.timeline({
            delay: Math.max(0, delay) / 1000,
            scrollTrigger: {
              trigger: el,
              start: `top ${Math.round((1 - threshold) * 100)}%`,
              toggleActions: compact && !reversibleOnCompact
                ? "play none none none"
                : "play none play reverse",
              invalidateOnRefresh: true,
            },
          });

          timeline.fromTo(
            el,
            {
              autoAlpha: 0,
              y: compact ? 12 : motionDistance,
              scale: compact ? 0.985 : scale,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: compact ? 0.58 : 0.68,
              ease: "power3.out",
            },
          );

          if (targets.length > 0) {
            timeline.fromTo(
              targets,
              {
                autoAlpha: 0,
                x: (index) => story
                  ? (index % 2 === 0 ? -14 : 14)
                  : compact
                    ? (index % 2 === 0 ? -10 : 10)
                    : 0,
                y: (index) => compact
                  ? story ? 4 : 2
                  : Math.min(motionDistance * itemDepth[index % itemDepth.length] * 0.7, 14),
                scale: story ? 0.992 : compact ? 0.99 : 1,
              },
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: story ? 0.58 : 0.48,
                stagger: story ? (compact ? 0.075 : 0.13) : compact ? Math.min(stagger, 0.06) : stagger,
                ease: story ? "power2.out" : compact ? "power3.out" : "power2.out",
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
  }, [threshold, delay, stagger, distance, scale, refreshKey, reversibleOnCompact, story]);

  return ref;
}
