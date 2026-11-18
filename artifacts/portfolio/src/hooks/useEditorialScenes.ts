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
      const desktop = Boolean(match.conditions.desktop);
      const releases: Array<() => void> = [];
      const prepare = (element: HTMLElement, setup: () => void) => {
        releases.push(prepareNearby(element, setup));
      };
      root.querySelectorAll<HTMLElement>("[data-award-record]").forEach((card, index) => prepare(card, () => {
        const copy = card.querySelector<HTMLElement>("[data-award-copy]");
        const heading = copy?.querySelector("h2");
        const artwork = card.querySelector<HTMLElement>("[data-award-media]");
        const plane = artwork?.querySelector<HTMLElement>("[data-award-plane]");
        if (copy && heading) SplitText.create(heading, {
          type: "lines", autoSplit: true, mask: "lines", linesClass: "award-title-line",
          onSplit: split => afterLineSplit(gsap.timeline({
            defaults: { ease: "power2.out" }, scrollTrigger: {
              id: `award-copy-${index + 1}`, trigger: copy,
              start: "clamp(top 90%)", end: "clamp(top 56%)", scrub: .4,
            },
          }).fromTo(split.lines,
            { yPercent: 105, rotation: index % 2 === 0 ? 1.2 : -1.2 },
            { yPercent: 0, rotation: 0, duration: 1.1, stagger: .13 }, .12)
            .fromTo(copy.querySelectorAll("p"),
              { opacity: .3, x: index % 2 === 0 ? -14 : 14 },
              { opacity: 1, x: 0, duration: .85, stagger: .12 }, 0)),
        });
        if (artwork && plane) {
          const angle = desktop ? 9 : 4.5;
          gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: {
            id: `award-paper-${index + 1}`, trigger: artwork,
            start: desktop ? "clamp(top 82%)" : "clamp(top 92%)",
            end: "clamp(top 46%)", scrub: .42, invalidateOnRefresh: true,
          } }).fromTo(plane,
            { rotationX: angle, rotationY: index % 2 === 0 ? -angle : angle, z: -65, scale: .95 },
            { rotationX: 0, rotationY: 0, z: 0, scale: 1, duration: 1.25 }, 0)
            .fromTo(artwork.querySelectorAll(".section-kicker"),
              { opacity: .4, y: 12 }, { opacity: 1, y: 0, duration: .6 }, .15)
            .fromTo(artwork.querySelectorAll("a:not([data-award-plane])"),
              { opacity: .4, y: 14 }, { opacity: 1, y: 0, stagger: .1, duration: .6 }, .65);
        }
      }));

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
      if (footer?.firstElementChild) prepare(footer, () => gsap.fromTo(footer.firstElementChild!,
        { y: 64 }, { y: 0, ease: "none", scrollTrigger: {
          id: "closing-handoff", trigger: footer, start: "clamp(top bottom)",
          end: "clamp(bottom bottom)", scrub: SCENE.scrub, invalidateOnRefresh: true,
        } }));
      return () => releases.forEach(release => release());
    });
    return () => media.revert();
  }, [enabled]);
}
