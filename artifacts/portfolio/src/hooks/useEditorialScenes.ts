import { useLayoutEffect } from "react";
import { gsap, SplitText, SCENE, afterLineSplit, prepareNearby } from "../lib/motion";

export function useEditorialScenes(enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const root = document.querySelector<HTMLElement>(".portfolio-shell");
    if (!root) return;
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 768px)" }, match => {
      if (!match.conditions?.motion) return;

      const releases: Array<() => void> = [];
      const prepare = (element: HTMLElement, setup: () => void) => {
        releases.push(prepareNearby(element, setup));
      };
      const contact = root.querySelector<HTMLElement>("#contact");
      const heading = contact?.querySelector("h2");
      if (contact && heading) prepare(contact, () => SplitText.create(heading, {
        type: "lines", mask: "lines", autoSplit: true, linesClass: "motion-heading-line",
        onSplit: split => afterLineSplit(gsap.timeline({ defaults: { ease: SCENE.ease }, scrollTrigger: {
          trigger: contact, start: "clamp(top 88%)", end: "clamp(top 38%)", scrub: .45,
        } }).fromTo(split.lines,
          { yPercent: 110, rotationX: 14, transformOrigin: "center bottom" },
          { yPercent: 0, rotationX: 0, duration: 1.4, stagger: .16 }, 0)
          .from(contact.querySelectorAll(".contact-kicker,.contact-description"), { opacity: 0, duration: .8, stagger: .1 }, .35)
          .from(contact.querySelectorAll(".contact-label,.contact-handle"), { y: 18, opacity: .2, duration: .78, stagger: .08 }, .6)
          .from(contact.querySelector(".contact-primary-cta"), { y: 24, opacity: 0, duration: .8 }, .85)),
      }));
      const footer = root.querySelector<HTMLElement>(".portfolio-closing-footer");
      const footerContent = footer?.querySelector("[data-footer-content]");
      if (footer && footerContent) prepare(footer, () => gsap.fromTo(footerContent,
        { y: 64 }, { y: 0, ease: "none", scrollTrigger: {
          id: "closing-handoff", trigger: footer, start: "clamp(top bottom)",
          end: "clamp(bottom bottom)", scrub: SCENE.scrub, invalidateOnRefresh: true,
        } }));
      return () => releases.forEach(release => release());
    });
    return () => media.revert();
  }, [enabled]);
}
