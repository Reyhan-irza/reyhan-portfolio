import { useEffect, useRef } from "react";

interface Options {
  threshold?: number;
  delay?: number;
}

/**
 * Attaches an IntersectionObserver to the returned ref.
 * Adds class "show" when the element enters the viewport,
 * removes it when it leaves — so animations replay on every scroll.
 */
export function useScrollAnim<T extends HTMLElement = HTMLDivElement>(
  { threshold = 0.2, delay = 0 }: Options = {}
) {
  const ref = useRef<T>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (timer.current) clearTimeout(timer.current);

        if (entry.isIntersecting) {
          timer.current = setTimeout(
            () => el.classList.add("show"),
            delay
          );
        } else {
          el.classList.remove("show");
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [threshold, delay]);

  return ref;
}
