import { createElement, useLayoutEffect, useRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { gsap } from "../lib/motion";

type RevealProps = Omit<HTMLAttributes<HTMLElement>, "children" | "onDrag"> & {
  children?: ReactNode;
  delay?: number;
  amount?: number;
  media?: boolean;
  tall?: boolean;
  as?: "div" | "article" | "header" | "section" | "li";
  staggerIndex?: number;
  mount?: boolean;
  innerRef?: Ref<HTMLDivElement>;
};

export default function Reveal({ children, as = "div", media = false, tall = false,
  mount = false, innerRef, delay = 0, amount = .15, staggerIndex = 0, ...attributes }: RevealProps) {
  const node = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const element = node.current;
    if (!element || mount || tall) return;
    const queries = gsap.matchMedia();
    queries.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const heading = element.querySelector<HTMLElement>("h2");
        if (heading) {
          // Section introductions are one scene: eyebrow, masked title, then
          // supporting copy. The stationary root owns the trigger so animated
          // children never change the geometry used to measure scroll progress.
          const paragraphs = Array.from(element.querySelectorAll<HTMLElement>("p"));
          const eyebrow = paragraphs.find((paragraph) =>
            Boolean(paragraph.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING));
          const copy = paragraphs.filter((paragraph) => paragraph !== eyebrow);
          const lines = heading.querySelectorAll<HTMLElement>("[data-heading-line]");
          const scene = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: element,
              start: "top 94%",
              end: "top 48%",
              scrub: .22,
              invalidateOnRefresh: true,
            },
          });
          if (eyebrow) scene.fromTo(eyebrow, { y: 12, opacity: .35 }, {
            y: 0, opacity: 1, duration: .25,
          }, 0);
          if (lines.length) {
            scene.fromTo(lines, { yPercent: 110 }, {
              yPercent: 0, duration: .5, stagger: .1,
            }, .08);
          } else {
            scene.fromTo(heading, { y: 28, clipPath: "inset(100% 0% 0% 0%)" }, {
              y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: .6,
            }, .08);
          }
          if (copy.length) scene.fromTo(copy, { y: 24, opacity: .3 }, {
            y: 0, opacity: 1, duration: .45, stagger: .08,
          }, .3);
          return;
        }
        // Give the entrance enough travel to read on a phone, then hold still
        // in the reading zone. Never hide text or interpolate the whole page.
        gsap.fromTo(element, media ? { y: 36, scale: .94 } : { y: 48 }, {
          ...(media ? { y: 0, scale: 1 } : { y: 0 }), ease: "none",
          scrollTrigger: { trigger: element, start: "top bottom", end: "top 66%",
            scrub: .22, invalidateOnRefresh: true },
        });
      }, element);
      return () => context.revert();
    });
    return () => queries.revert();
  }, [media, mount, tall]);

  return createElement(as, {
    ...attributes,
    ref: (element: HTMLElement | null) => {
      node.current = element;
      if (typeof innerRef === "function") innerRef(element as HTMLDivElement | null);
      else if (innerRef) innerRef.current = element as HTMLDivElement | null;
    },
  }, children);
}
