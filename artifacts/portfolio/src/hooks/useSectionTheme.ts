import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
export function useSectionTheme() {
  useLayoutEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(
      "#home, #technology-bands, #proof, #projects, #about, #journey, #achievement, #roadmap, #github, .portfolio-closing-zone, .portfolio-closing-footer",
    ));
    sections.forEach((section) => {
      section.dataset.sectionTheme = "";
    });
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const apply = (section: HTMLElement) => {
          const css = getComputedStyle(section);
          gsap.to(document.body, {
            backgroundColor: css.getPropertyValue("--canvas").trim(),
            color: css.getPropertyValue("--ink-primary").trim(),
            duration: 0.6, ease: "power2.out", overwrite: true,
          });
        };
        sections.forEach((section) => ScrollTrigger.create({
          trigger: section, start: "top 50%", end: "bottom 50%",
          onEnter: () => apply(section), onEnterBack: () => apply(section),
        }));
        const active = sections.filter((section) => section.getBoundingClientRect().top <= innerHeight / 2).at(-1);
        if (active) apply(active);
      });
      return () => context.revert();
    });
    return () => {
      media.revert();
      sections.forEach((section) => { delete section.dataset.sectionTheme; });
    };
  }, []);
}
