import { useLayoutEffect, useRef } from "react";
import gsap from "../lib/gsap";
import { ScrollTrigger } from "../lib/gsap";

gsap.registerPlugin(ScrollTrigger);

interface Options {
  threshold?: number;
  delay?: number;
}

/** Scroll-triggered editorial reveal shared by section headings and groups. */
export function useScrollAnim<T extends HTMLElement = HTMLDivElement>(
  { threshold = 0.2, delay = 0 }: Options = {}
) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: reduce)", () => {
      el.classList.add("show");
      return () => el.classList.remove("show");
    });
    media.add("(prefers-reduced-motion: no-preference)", () => {
      el.classList.remove("show");
      const context = gsap.context(() => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            delay: Math.max(0, delay) / 1000,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: `top ${Math.round((1 - threshold) * 100)}%`,
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          },
        );
      }, el);
      return () => context.revert();
    });

    return () => {
      media.revert();
    };
  }, [threshold, delay]);

  return ref;
}
