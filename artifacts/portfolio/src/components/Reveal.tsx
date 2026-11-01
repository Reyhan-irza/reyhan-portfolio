import { useEffect, useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { m, useReducedMotion } from "framer-motion";

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

const easing = [0.22, 1, 0.36, 1] as const;

export default function Reveal({
  children,
  className,
  delay = 0.1,
  amount = 0.15,
  media = false,
  tall = false,
  as = "div",
  staggerIndex = 0,
  mount = false,
  innerRef,
  ...attributes
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const [phone, setPhone] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const MotionElement = ({ div: m.div, article: m.article, header: m.header, section: m.section, li: m.li })[as] as React.ComponentType<any>;
  const initial = reduceMotion ? false : media ? { opacity: 0, scale: 0.96 } : { opacity: 0, y: phone ? 16 : 28 };
  const visible = reduceMotion ? { opacity: 1, y: 0, scale: 1 } : media ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 };
  const entranceDelay = reduceMotion ? 0 : Math.min(.3, delay + staggerIndex * .07);
  const revealDuration = reduceMotion ? 0 : media ? 1.05 : phone ? .7 : .85;

  return (
    <MotionElement
      className={className}
      ref={innerRef}
      {...attributes}
      initial={initial}
      {...(mount ? { animate: visible } : { whileInView: visible, viewport: { once: true, amount: tall ? 0 : amount } })}
      transition={{
        opacity: { duration: revealDuration, delay: mount || reduceMotion ? 0 : entranceDelay, ease: easing },
        y: { duration: revealDuration, delay: mount || reduceMotion ? 0 : entranceDelay, ease: easing },
        scale: { duration: revealDuration, delay: mount || reduceMotion ? 0 : entranceDelay, ease: easing },
      }}
    >
      {children}
    </MotionElement>
  );
}
