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
