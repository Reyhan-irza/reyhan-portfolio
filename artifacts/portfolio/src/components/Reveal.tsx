import { createElement, useLayoutEffect, useRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { gsap, SplitText, SCENE, afterLineSplit } from "../lib/motion";

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
  const completed = useRef(false);
  useLayoutEffect(() => {
    const element = node.current;
    if (!element || mount || tall) return;
    const heading = element.querySelector<HTMLElement>("h2:not(.technology-bands__accessible-title)");
    if (heading) {
      element.removeAttribute("data-reveal");
      element.setAttribute("data-reveal-group", "");
    }
    const mediaQuery = gsap.matchMedia();
    mediaQuery.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (match) => {
      if (match.conditions?.reduced || completed.current) {
        element.dataset.revealed = "true";
        return;
      }
      const context = gsap.context(() => {
        const finish = () => { completed.current = true; element.dataset.revealed = "true"; };
        if (heading) {
          const revealLines = (lines: Element[]) => {
            const scene = gsap.timeline({
              defaults: { ease: SCENE.ease },
              scrollTrigger: { trigger: element, start: "clamp(top 92%)",
                toggleActions: "play none none reverse" },
              onComplete: () => { element.dataset.headingOpen = "true"; },
              onUpdate: function () {
                if (this.progress() < 1 && element.hasAttribute("data-heading-open")) delete element.dataset.headingOpen;
              },
            });
            scene.fromTo(lines, { yPercent: 108, rotation: 1.3, transformOrigin: "0% 100%" },
              { yPercent: 0, rotation: 0, duration: SCENE.title, stagger: SCENE.lineStagger }, 0);
            const copy = element.querySelectorAll("p");
            if (copy.length) scene.fromTo(copy, { y: 16, opacity: .15 },
              { y: 0, opacity: 1, duration: SCENE.detail, stagger: .09 }, .28);
            return scene;
          };
          const authored = Array.from(heading.querySelectorAll("[data-heading-line]"));
          if (authored.length) revealLines(authored);
          else SplitText.create(heading, { type: "lines", mask: "lines", autoSplit: true,
            linesClass: "motion-heading-line", onSplit: split => afterLineSplit(revealLines(split.lines)) });
        }
        else gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: SCENE.detail, ease: SCENE.ease,
          scrollTrigger: { trigger: element, start: "clamp(top 90%)", once: true }, onComplete: finish, clearProps: "opacity" });
      }, element);
      return () => { context.revert(); delete element.dataset.headingOpen; };
    });
    return () => mediaQuery.revert();
  }, [mount, tall]);

  return createElement(as, {
    ...attributes,
    "data-reveal": mount || tall ? undefined : "",
    ref: (element: HTMLElement | null) => {
      node.current = element;
      if (typeof innerRef === "function") innerRef(element as HTMLDivElement | null);
      else if (innerRef) innerRef.current = element as HTMLDivElement | null;
    },
  }, children);
}
