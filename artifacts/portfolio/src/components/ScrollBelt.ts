import { gsap } from "../lib/motion";

/** Call inside the owner's gsap.matchMedia context. The duplicate group covers the trailing edge. */
export function scrubBelt(track: HTMLElement, trigger: HTMLElement, reverse: boolean) {
  const group = track.firstElementChild;
  if (!group) return;
  const cycle = () => group.getBoundingClientRect().width;
  return gsap.fromTo(track, { x: () => reverse ? -cycle() : 0 }, {
    x: () => reverse ? 0 : -cycle(),
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "clamp(top bottom)",
      end: "clamp(bottom top)",
      scrub: .16,
      invalidateOnRefresh: true,
    },
  });
}
