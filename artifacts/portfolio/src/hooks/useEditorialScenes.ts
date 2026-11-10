import { useLayoutEffect } from "react";
import { gsap, SplitText, SCENE } from "../lib/motion";

export function useEditorialScenes() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".portfolio-shell");
    if (!root) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        root.querySelectorAll<HTMLElement>(".story-note").forEach(row => {
          const heading = row.querySelector("h3"), paragraph = row.querySelector("p");
          if (heading) gsap.fromTo(heading, { x: 30, opacity: .35 }, { x: 0, opacity: 1, ease: "sine.out",
            scrollTrigger: { trigger: row, start: "clamp(top 92%)", end: "clamp(top 62%)", scrub: .26 } });
          if (paragraph) SplitText.create(paragraph, { type: "lines", autoSplit: true, linesClass: "motion-reading-line",
            onSplit: split => gsap.fromTo(split.lines, { opacity: .35 }, { opacity: 1, stagger: .22, ease: "none",
              scrollTrigger: { trigger: row, start: "clamp(top 86%)", end: "clamp(bottom 66%)", scrub: SCENE.scrub, invalidateOnRefresh: true } }),
          });
        });
        const contact = root.querySelector<HTMLElement>("#contact"), heading = contact?.querySelector("h2");
        if (contact && heading) SplitText.create(heading, { type: "lines", mask: "lines", autoSplit: true, linesClass: "motion-heading-line",
          onSplit: split => gsap.timeline({ defaults: { ease: SCENE.ease }, scrollTrigger: {
            trigger: contact, start: "clamp(top 88%)", end: "clamp(top 38%)", scrub: .38,
          } }).from(split.lines, { yPercent: 110, duration: SCENE.title, stagger: SCENE.lineStagger }, 0)
            .from(contact.querySelectorAll(".contact-kicker,.contact-description"), { opacity: 0, duration: .8, stagger: .1 }, .2)
            .from(contact.querySelectorAll(".contact-label,.contact-handle"), { y: 18, opacity: .2, duration: .78, stagger: .055 }, .32)
            .from(contact.querySelector(".contact-primary-cta"), { y: 24, opacity: 0, duration: .8 }, .5),
        });
        const footer = root.querySelector<HTMLElement>(".portfolio-closing-footer");
        if (footer?.firstElementChild) gsap.fromTo(footer.firstElementChild, { y: 64 }, { y: 0, ease: "none",
          scrollTrigger: { id: "closing-handoff", trigger: footer, start: "clamp(top bottom)", end: "clamp(bottom bottom)", scrub: SCENE.scrub, invalidateOnRefresh: true } });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
}
