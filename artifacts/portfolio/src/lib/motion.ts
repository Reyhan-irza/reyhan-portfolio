import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
// Keep the logo film and Lenis on elapsed time, including during slow frames.
gsap.ticker.lagSmoothing(0);

// Mobile browser chrome changes viewport height during a swipe. Recalculating
// every trigger then resets scrubbed poses mid-gesture; real width/orientation
// changes and content resizes still refresh normally.
ScrollTrigger.config({ ignoreMobileResize: true });

export function cubicBezierEase(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (progress: number) => number {
  const sample = (t: number, first: number, second: number) =>
    3 * (1 - t) ** 2 * t * first + 3 * (1 - t) * t ** 2 * second + t ** 3;

  return (progress) => {
    let low = 0;
    let high = 1;
    let t = progress;
    for (let iteration = 0; iteration < 12; iteration += 1) {
      const x = sample(t, x1, x2);
      if (Math.abs(x - progress) < 0.00001) break;
      if (x < progress) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return sample(t, y1, y2);
  };
}

// SplitText reflows lines after its own resize observer settles. Notify the home
// lifecycle once the new line boxes and their animations exist.
export function afterLineSplit<T extends gsap.core.Animation>(animation: T): T {
  window.dispatchEvent(new Event("portfolio:lines-changed"));
  return animation;
}

export { gsap, ScrollTrigger, SplitText };
/** Shared PRD motion tokens; phase-specific exceptions live beside their timelines. */
export const MOTION = {
  ease: "power3.out", menuEase: "power4.inOut", reveal: 0.9, text: 0.7,
  menu: 0.9, y: 40, cardY: 60, stagger: 0.07, start: "top 88%", lerp: 0.1,
} as const;

/** Scene timings fitted visually; these are not claimed to be IbraCode source values. */
export const SCENE = { title: 1.25, lineStagger: .13, detail: .78, menu: .85, menuStagger: .065, scrub: .32, ease: "power2.out", curtainEase: "power4.inOut" } as const;
