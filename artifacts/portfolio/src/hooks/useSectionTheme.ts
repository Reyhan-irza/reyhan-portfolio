import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { getPageScroll } from "../lib/scroll";
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
        // Curve the seam only when neighboring sections use different palettes.
        sections.slice(1).forEach((section, index) => {
          const previous = sections[index];
          if (getComputedStyle(previous).colorScheme === getComputedStyle(section).colorScheme) return;
          section.dataset.paletteWave = "";
          gsap.fromTo(section, { "--palette-wave-height": "0px" }, {
            "--palette-wave-height": "72px", ease: "sine.inOut", yoyo: true, repeat: 1,
            scrollTrigger: { trigger: section, start: "clamp(top bottom)", end: "clamp(top 35%)", scrub: .35 },
          });
        });
        const apply = (section: HTMLElement) => {
          const css = getComputedStyle(section);
          gsap.to(document.body, {
            backgroundColor: css.getPropertyValue("--canvas").trim(),
            color: css.getPropertyValue("--ink-primary").trim(),
            duration: 0.6, ease: "power2.out", overwrite: true,
          });
        };
        let tops: number[] = [];
        let current: HTMLElement | undefined;
        const update = () => {
          const midpoint = getPageScroll() + innerHeight / 2;
          let index = tops.length - 1;
          while (index >= 0 && tops[index] > midpoint) index--;
          const active = sections[index];
          if (active && active !== current) {
            current = active;
            apply(active);
          }
        };
        const measure = () => {
          const offset = getPageScroll();
          tops = sections.map(section => section.getBoundingClientRect().top + offset);
          update();
        };
        measure();
        ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: measure });
        ScrollTrigger.addEventListener("refresh", measure);
        return () => {
          ScrollTrigger.removeEventListener("refresh", measure);
          sections.forEach((section) => { delete section.dataset.paletteWave; });
        };
      });
      return () => context.revert();
    });
    return () => {
      media.revert();
      sections.forEach((section) => {
        delete section.dataset.sectionTheme;
        delete section.dataset.paletteWave;
      });
    };
  }, []);
}
