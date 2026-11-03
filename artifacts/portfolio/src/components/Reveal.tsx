import { createElement, useLayoutEffect, useRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { gsap, MOTION } from "../lib/motion";

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
    const group = Boolean(element.querySelector("h2"));
    if (group) {
      element.removeAttribute("data-reveal");
      element.setAttribute("data-reveal-group", "");
    }
    const targets = group ? Array.from(element.children) : [element];
    const mediaQuery = gsap.matchMedia();
    mediaQuery.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (match) => {
      if (match.conditions?.reduced || completed.current) {
        element.dataset.revealed = "true";
        return;
      }
      const context = gsap.context(() => {
        gsap.fromTo(targets, { y: MOTION.y, opacity: 0 }, {
          y: 0, opacity: 1, duration: MOTION.reveal, ease: MOTION.ease,
          stagger: group ? MOTION.stagger : 0,
          scrollTrigger: { trigger: element, start: MOTION.start, once: true },
          onComplete: () => { completed.current = true; element.dataset.revealed = "true"; },
          clearProps: "transform,opacity",
        });
      }, element);
      return () => context.revert();
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
