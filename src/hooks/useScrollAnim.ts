import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface Options {
  threshold?: number;
  delay?: number;
  once?: boolean;
}

/**
 * Attaches an IntersectionObserver to the returned ref.
 * Adds class "show" once when the element enters the viewport.
 * Keeping the reveal state prevents flicker and repeated animation work.
 */
export function useScrollAnim<T extends HTMLElement = HTMLDivElement>(
  { threshold = 0.2, delay = 0, once = true }: Options = {}
) {
  const ref = useRef<T>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.classList.add("show");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }

        if (entry.isIntersecting) {
          if (once && el.classList.contains("show")) {
            observer.unobserve(el);
            return;
          }
          timer.current = setTimeout(() => {
            el.classList.add("show");
            timer.current = null;
            if (once) observer.unobserve(el);
          }, delay);
        } else {
          if (!once) el.classList.remove("show");
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [delay, once, reducedMotion, threshold]);

  return ref;
}
