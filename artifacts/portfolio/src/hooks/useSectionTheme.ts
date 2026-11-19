import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { getPageScroll } from "../lib/scroll";
// Each boundary has its own wavelength, direction of travel and point of strongest lift.
const waveProfiles = [
  { cycles: .78, travel: .54, focus: .26 },
  { cycles: 1.34, travel: -.46, focus: .72 },
  { cycles: .62, travel: -.68, focus: .38 },
  { cycles: 1.12, travel: .63, focus: .81 },
  { cycles: .91, travel: -.59, focus: .15 },
  { cycles: 1.47, travel: .42, focus: .56 },
];

function mountWave(section: HTMLElement, previous: HTMLElement, index: number) {
  const profile = waveProfiles[index % waveProfiles.length];
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.classList.add("palette-wave-surface");
  svg.setAttribute("viewBox", "0 0 1000 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const layers = [0.14, 0.32, 1].map(opacity => {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("fill-opacity", String(opacity));
    svg.append(path);
    return path;
  });
  const droplets = Array.from({ length: 5 }, (_, i) => {
    const dot = document.createElementNS(ns, "ellipse");
    svg.append(dot);
    return { dot, origin: ((i * .203 + index * .127 + .09) % .9) + .04 };
  });
  svg.setAttribute("fill", getComputedStyle(previous).getPropertyValue("--canvas").trim());
  section.dataset.paletteWave = "";
  section.prepend(svg);

  const size = () => {
    const padding = parseFloat(getComputedStyle(section).paddingTop);
    const height = Math.max(0, Math.min(144, padding - 8));
    svg.style.height = height + "px";
    droplets.forEach(({ dot }, i) => {
      const radius = .8 + (i % 3) * .5;
      dot.setAttribute("rx", String(radius * 1000 / Math.max(1, section.clientWidth)));
      dot.setAttribute("ry", String(radius * 100 / Math.max(1, height)));
    });
  };
  size();
  const state = { progress: 0 };
  const draw = () => {
    const t = state.progress;
    const lift = Math.sin(Math.PI * t) ** .85;
    layers.forEach((path, layer) => {
      const phase = index * 1.71 + layer * .12;
      const surface = (x: number) => {
        const angle = Math.PI * 2 * (x * profile.cycles - t * profile.travel) + phase;
        const crest = Math.exp(-8 * (x - profile.focus - .12 * Math.sin(t * Math.PI)) ** 2);
        return 1 + lift * (39 + (13 + 15 * crest) * Math.sin(angle)
          + 7 * Math.sin(2 * angle + t * 2.4) + (2 - layer) * (4 + 2 * Math.cos(angle)));
      };
      // Cubic Hermite segments share tangents so the crest travels without visible corners.
      const step = 1 / 12;
      const slope = (x: number) => (surface(x + .001) - surface(x - .001)) / .002;
      let d = `M0 0V${surface(0)}`;
      for (let i = 0; i < 12; i++) {
        const x = i * step, end = (i + 1) * step;
        d += `C${(x + step / 3) * 1000} ${surface(x) + slope(x) * step / 3} ${(end - step / 3) * 1000} ${surface(end) - slope(end) * step / 3} ${end * 1000} ${surface(end)}`;
      }
      path.setAttribute("d", d + "V0Z");
      if (layer === 0) droplets.forEach(({ dot, origin }, i) => {
        const flight = Math.max(0, Math.sin(Math.PI * (t * 1.55 - i * .12)));
        const x = origin + profile.travel * .06 * flight;
        dot.setAttribute("cx", String(x * 1000));
        dot.setAttribute("cy", String(surface(x) + lift * flight * (5 + i * 1.45)));
        dot.setAttribute("opacity", String(lift * flight * .57));
      });
    });
  };
  draw();
  gsap.to(state, { progress: 1, ease: "none", onUpdate: draw,
    scrollTrigger: { trigger: section, start: "clamp(top bottom)", end: "clamp(top 8%)",
      scrub: .62, onRefresh: size },
  });
  return () => {
    svg.remove();
    delete section.dataset.paletteWave;
  };
}

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
        const cleanups: Array<() => void> = [];
        sections.slice(1).forEach((section, index) => {
          const previous = sections[index];
          if (getComputedStyle(previous).colorScheme === getComputedStyle(section).colorScheme) return;
          cleanups.push(mountWave(section, previous, cleanups.length));
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
          cleanups.forEach(remove => remove());
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
